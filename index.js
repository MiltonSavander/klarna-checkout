import { getProducts, getProduct } from "./services/api.js";
import { createOrder, retrieveOrder } from "./services/klarna.js";
import express from "express";
import { config } from 'dotenv';
const app = express();
config();

app.get('/', (req, res) => {
  const markup = `<a style="display: block; color: black; border: solid black 1px; margin: 10px;" href="store">store</a>`
  res.send(markup);
});

app.get('/store', async (req, res) => {
  const products = await getProducts();
  const markup = products.map((p) => `<a style="display: block; color: black; border: solid black 1px; margin: 10px;" href="/products/${p.id}">${p.title} - ${p.price} kr</a>`).join(" ");
  res.send(markup);
});

app.get('/products/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const product = await getProduct(id);
    const KlarnaResponse = await createOrder(product);
    const { html_snippet } = KlarnaResponse;
    res.send(html_snippet);
  } catch (error) {
    res.send(error.message);
  }

});

app.get('/confirmation', async (req, res) => {
  const { order_id } = req.query;
  const KlarnaResponse = await retrieveOrder(order_id)
  const { html_snippet } = KlarnaResponse;
  res.send(html_snippet);

});

app.listen(process.env.PORT)












