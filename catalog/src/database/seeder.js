const connect = require('./connect');
const products = require('./products.json');

connect().then(async (db) => {
  const collection = db.collection('products');
  await collection.deleteMany();
  await collection.insertMany(products);
  process.exit();
});
