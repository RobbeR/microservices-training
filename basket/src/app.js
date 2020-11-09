const express = require('express');
const consumer = require('./consumer');
const hydrator = require('./hydrator');

const app = express();
const port = 80;
app.use(express.json());

consumer();

let basket = {};

app.route('/').get((req, res) => res.json({ service: 'basket' }));

app.route('/set-item').patch((req, res) => {
  basket[req.body.productId] = req.body.count;
  res.json(basket);
});

app.route('/show').get(async (req, res) => {
  const hydratedBasket = await hydrator(basket);
  res.json(hydratedBasket);
});

app.route('/clear').delete((req, res) => {
  basket = {};
  res.json(basket);
});

app.listen(port, () => {
  console.log('Server started on port: ' + port);
});
