const { MongoClient } = require('mongodb');

module.exports = async () => new Promise(async (resolve, reject) => {
  try {
    const connection = await MongoClient.connect(
      process.env.DB_URL,
      { useNewUrlParser: true, useUnifiedTopology: true }
    );
    resolve(connection.db());
  } catch (error) {
    reject(error);
  }
});
