const amqplib = require('amqplib');
const cache = require('./cache');

const queueName = 'products';

const getChannel = async (retryCount = 0) => {
    try {
        const connection = await amqplib.connect(process.env.EVENT_BUS_URL);
        console.log(`Connected to event bus...`);
        return connection.createChannel();
    } catch(error) {
        const retryTime = Math.floor(Math.exp(retryCount));
        console.log(`Connection to event bus failed. Retrying in ${retryTime} seconds...`);
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                getChannel(retryCount + 1).then(resolve).catch(reject);
            }, retryTime*1000);
        });
    }
};

module.exports = async () => {
    const channel = await getChannel();
    await channel.assertQueue(queueName);
    channel.consume(queueName, message => {
        if (message == null) return;

        const product = JSON.parse(message.content.toString());
        cache.set(product._id, JSON.stringify(product));
        channel.ack(message);
        console.log(`Consumed product ${product._id}...`)
    });
};
