const fs = require("fs");
const { parse } = require("csv-parse");
const { readFileSync } = require("fs");
const path = require("path");

let count = 1;

const total = 541910;

const customers = {};
const products = {};
const orders = {};

const names = JSON.parse(
  readFileSync(path.join(__dirname, "..", "data", "json", "names.json"))
);

const uniqueNames = {};

console.log("Generating cartesian product of names...");

names.map((name) => {
  const [firstName, lastName] = name.split(" ");
  uniqueNames[firstName] = 1;
  uniqueNames[lastName] = 1;
});

const uniqueNamesArray = Object.keys(uniqueNames);

uniqueNamesArray.forEach((firstName) => {
  uniqueNamesArray.forEach((lastName) => {
    if (firstName === lastName) return;
    const name = `${firstName} ${lastName}`;
    if (uniqueNames[name]) {
      return;
    }
    uniqueNames[name] = 1;
  });
});

const cartesianProductOfNames = Object.keys(uniqueNames);

console.log("\nDONE!\n");

let i = 0;

fs.createReadStream("./data/csv/invoices.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", function (row) {
    const [
      invoiceNo,
      stockCode,
      productName,
      productQuantity,
      invoiceDate,
      unitPrice,
      customerId,
      country,
    ] = row;

    if (orders[invoiceNo]) {
      orders[invoiceNo].products.push({
        stockCode,
        productName,
        productQuantity,
        unitPrice,
      });
    } else {
      orders[invoiceNo] = {
        orderId: invoiceNo,
        purchaseDate: invoiceDate,
        customerId,
        products: [
          {
            stockCode,
            productName,
            productQuantity,
            unitPrice,
          },
        ],
      };
    }

    customers[customerId] = {
      customerId,
      country,
      name: cartesianProductOfNames[i],
    };

    i++;

    products[stockCode] = {
      stockCode,
      productName,
      unitPrice,
    };

    count = count + 1;
    process.stdout.write(
      `\b\b\b\b\b\b\b\b\b\b\b\b\b\b\b\bProgress: ${Math.floor(
        (count / total) * 100
      )}%`
    );
  })
  .on("end", function () {
    console.log(
      `\nOrders: ${Object.keys(orders).length}\nCustomers: ${
        Object.keys(customers).length
      }\nProducts: ${Object.keys(products).length}\nNames: ${
        uniqueNamesArray.length
      }\nCaretsian Product: ${cartesianProductOfNames.length}`
    );
    fs.writeFileSync(
      path.join(__dirname, "..", "data", "json", "orders.json"),
      JSON.stringify(orders, null, 2)
    );
    fs.writeFileSync(
      path.join(__dirname, "..", "data", "json", "customers.json"),
      JSON.stringify(customers, null, 2)
    );
    fs.writeFileSync(
      path.join(__dirname, "..", "data", "json", "products.json"),
      JSON.stringify(products, null, 2)
    );
    console.log("\n");
  })
  .on("error", function (error) {
    console.log("Error: ", error.message);
  });
