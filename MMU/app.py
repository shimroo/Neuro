import pika
import json
import threading
import signal
import sys
from models import facial, audio, eeg, writing

RABBITMQ_HOST = 'rabbitmq'
QUEUES = {
    "facial_queue": facial.process,
    "audio_queue": audio.process,
    "eeg_queue": eeg.process,
    "writing_queue": writing.process,
}

def process_message(channel, method, properties, body, model_function):
    try:
        data = json.loads(body)
        print(f"Message: {data}")
        jobId = data.get("jobId")

        result = model_function(jobId ,data["input_data"])
        print(f"Result: {result}")

        channel.basic_ack(delivery_tag=method.delivery_tag)
        # print("Message acknowledged.")
        
    except json.JSONDecodeError as e:
        print(f"Error decoding JSON: {e}")
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)
    except Exception as e:
        print(f"Error processing message: {e}")
        channel.basic_nack(delivery_tag=method.delivery_tag, requeue=False)

def start_consumer(queue_name, model_function):
    try:
        connection = pika.BlockingConnection(pika.ConnectionParameters(host=RABBITMQ_HOST, heartbeat=60))
        channel = connection.channel()
        channel.queue_declare(queue=queue_name, durable=True)

        print(f"Waiting for messages in {queue_name}...")
        channel.basic_consume(
            queue=queue_name,
            on_message_callback=lambda ch, method, props, body: process_message(ch, method, props, body, model_function),
        )

        channel.start_consuming()
    except KeyboardInterrupt:
        print(f"Stopping consumer for {queue_name}...")
    except pika.exceptions.ConnectionClosedByBroker as e:
        print(f"Connection closed by broker for {queue_name}: {e}")
    except Exception as e:
        print(f"Error in consumer for {queue_name}: {e}")
    finally:
        try:
            channel.close()
            connection.close()
        except Exception as e:
            print(f"Error closing connection for {queue_name}: {e}")

if __name__ == "__main__":
    print("Starting MMU service...")

    threads = []

    def shutdown(signal, frame):
        print("Shutting down gracefully...")
        for thread in threads:
            thread.join(timeout=2)
        sys.exit(0)

    signal.signal(signal.SIGINT, shutdown)

    for queue_name, model_function in QUEUES.items():
        print(f"Starting thread for {queue_name}...")
        thread = threading.Thread(target=start_consumer, args=(queue_name, model_function), daemon=True)
        thread.start()
        threads.append(thread)

    signal.pause()


# logic to store response in the database
