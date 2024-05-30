require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const { readFileSync } = require("fs");
const path = require("path");

const dbUser = process.env.DB_USER;
const dbPass = process.env.DB_PASS;

const uri = `mongodb+srv://${dbUser}:${dbPass}@cluster0.xvjonrm.mongodb.net/?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

const customers = Object.values(
  JSON.parse(
    readFileSync(path.join(__dirname, "..", "data", "json", "customers.json"))
  )
);
const orders = Object.values(
  JSON.parse(
    readFileSync(path.join(__dirname, "..", "data", "json", "orders.json"))
  )
);
const products = Object.values(
  JSON.parse(
    readFileSync(path.join(__dirname, "..", "data", "json", "products.json"))
  )
);

const dbName = process.env.DB_NAME;
const collections = ["Customers", "Orders", "Products"];

async function run() {
  try {
    await client.connect();
    await client.db(dbName).command({ ping: 1 });
    console.log("Successfully connected to MongoDB Atlas!");

    // Create database if it doesn't exist
    const database = await client.db(dbName);
    const dbCollections = await database.listCollections().toArray();
    const collectionNames = dbCollections.map((c) => c.name);

    // Create collections if they don't exist
    await Promise.all(
      collections.map(async (collection) => {
        if (!collectionNames.includes(collection)) {
          return database.createCollection(collection);
        }
        return new Promise((resolve) => resolve(1));
      })
    );

    const customerOne = await database.collection(collections[0]).findOne();

    if (customerOne === null) {
      console.log("Inserting customers");
      await database.collection("Customers").insertMany(customers);
      console.log("Inserted customers");
    } else {
      console.log("Customers data already exist");
    }

    const orderOne = await database.collection(collections[1]).findOne();

    if (orderOne === null) {
      console.log("Inserting orders");
      await database.collection("Orders").insertMany(orders);
      console.log("Inserted orders");
    } else {
      console.log("Orders data already exist");
    }

    const productOne = await database.collection(collections[2]).findOne();

    if (productOne === null) {
      console.log("Inserting products");
      await database.collection("Products").insertMany(products);
      console.log("Inserted products");
    } else {
      console.log("Products data already exist");
    }

    console.log("Closing connection");
    await client.close();
    console.log("Connection closed");
  } catch (e) {
    console.log("Error: ", e);
  }
  {
    console.log("Ending process...");
    process.exit(0);
  }
}

run().catch(console.dir);
