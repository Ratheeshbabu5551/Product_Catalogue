require("dotenv").config();
const path = require("path");
const { MongoClient, ServerApiVersion } = require("mongodb");

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;
const dbName = process.env.DB_NAME;

const countriesJson = require(path.join(
  __dirname,
  "..",
  "data",
  "json",
  "countries.json"
));

const countries = countriesJson.reduce(
  (a, c) => ({ ...a, [c.name]: c.code }),
  {}
);

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.xvjonrm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const homeRouter = (req, res) => {
  res.render("index", { title: "Home" });
};

const productsRouter = async (req, res) => {
  const database = await client.db(dbName);
  const products =
    (await database.collection("Products").find({}).toArray()) || [];

  res.render("products", {
    title: "Products Catalog",
    products,
  });
};

const ordersRouter = async (req, res) => {
  const page = parseInt(req.params.page) || 1;
  const skip = page - 1;
  const limit = 100;

  const database = await client.db(dbName);
  const max = (await database.collection("Orders").countDocuments()) / limit;
  const orders =
    (await database
      .collection("Orders")
      .find({})
      .skip(skip * limit)
      .limit(limit)
      .toArray()) || [];

  const prev = Math.max(page - 1, 1);
  const next = Math.min(page + 1, max);

  res.render("orders", {
    title: "Orders Catalog",
    orders,
    prev: prev == 1 && page <= 1 ? `/` : `/orders/${Math.max(page - 1, 1)}`,
    next: `/orders/${next}`,
  });
};

const customersRouter = async (req, res) => {
  const database = await client.db(dbName);
  const customers =
    (await database.collection("Customers").find({}).toArray()) || [];

  res.render("customers", {
    title: "Customers Catalog",
    customers,
    countries,
  });
};

const customerRouter = async (req, res) => {
  const customerId = req.params.id;

  const database = await client.db(dbName);
  const customer =
    (await database.collection("Customers").findOne({ customerId })) || {};

  res.render("customer", {
    title: "Customer Details",
    customer,
    countries,
  });
};

const productRouter = async (req, res) => {
  const productId = req.params.id;

  const database = await client.db(dbName);
  const product =
    (await database.collection("Products").findOne({ stockCode: productId })) ||
    {};

  res.render("product", {
    title: "Product Details",
    product,
  });
};

module.exports = {
  homeRouter,
  productsRouter,
  productRouter,
  ordersRouter,
  customersRouter,
  customerRouter,
};
