const pika = require('amqplib'); // Import the pika library

// Connect to RabbitMQ
async function connectToQueue() {
  const connection = await pika.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queues = ["facial_queue", "audio_queue", "eeg_queue", "writing_queue"];
  
  // Declare queues
  for (let queue of queues) {
    await channel.assertQueue(queue, { durable: true });
  }
  return channel;
}

// Function to send task to a RabbitMQ queue
async function sendTaskToQueue(queueName, taskId, inputData) {
  const channel = await connectToQueue();
  const task = {
    task_id: taskId,
    input_data: inputData,
  };

  // Publish the task to the queue
  channel.sendToQueue(queueName, Buffer.from(JSON.stringify(task)), { persistent: true });
  console.log(`Task sent to ${queueName}: ${JSON.stringify(task)}`);

  // Close the channel and connection after the task is sent
  setTimeout(() => {
    channel.close();
  }, 500);
}

module.exports = { sendTaskToQueue };