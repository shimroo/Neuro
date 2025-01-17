import pika
import json
import random

connection = pika.BlockingConnection(pika.ConnectionParameters('localhost'))
channel = connection.channel()

queues = ["facial_queue", "audio_queue", "eeg_queue", "writing_queue"]
for queue in queues:
    channel.queue_declare(queue=queue, durable=True)

def send_task_to_queue(queue_name, task_id, input_data):
    task = {
        "task_id": task_id,
        "input_data": input_data
    }

    # Publish the task to the appropriate queue
    channel.basic_publish(
        exchange='',
        routing_key=queue_name,
        body=json.dumps(task)
    )
    print(f"Task sent to {queue_name}: {task}")

# Generate tasks and route them to different queues
for i in range(20):
    task_id = 101 + i
    j = random.randint(0, 3)
    # Assign tasks to queues (example logic)
    if j == 0:
        send_task_to_queue("facial_queue", task_id, {"data": "facial_data"})
    elif j == 1:
        send_task_to_queue("audio_queue", task_id, {"data": "audio_data"})
    elif j == 2:
        send_task_to_queue("eeg_queue", task_id, {"data": "eeg_data"})
    else:
        send_task_to_queue("writing_queue", task_id, {"data": "writing_data"})

connection.close()
