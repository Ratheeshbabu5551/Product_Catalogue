require("dotenv").config();
const express = require("express");
const path = require("path");
const {
  homeRouter,
  productsRouter,
  ordersRouter,
  customersRouter,
  productRouter,
  customerRouter,
} = require("./router");

const app = express();
const port = process.env.PORT || "8000";

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");
app.use(express.static(path.join(__dirname, "public")));

app.get("/", homeRouter);

app.get("/products", productsRouter);

app.get("/product/:id", productRouter);

app.get("/orders/:page", ordersRouter);

app.get("/orders", ordersRouter);

app.get("/customers", customersRouter);

app.get("/customer/:id", customerRouter);

app.listen(port, () => {
  console.log(`Server accessible on http://localhost:${port}`);
});
