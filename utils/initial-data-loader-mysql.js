const fs = require("fs");
const csv = require("csv-parser");
const Products = require("../models/products-model");

const records = [];

const initialMysqlDataLoader = () => {
  const csvFilePath="./data/products.csv"
  // Read the CSV file and insert data into the database
  fs.createReadStream(csvFilePath)
    .pipe(csv())
    .on("data", (row) => {
      records.push({
        ...row,
      });
    })
    .on("end", async () => {
      const existingProducts =await Products.findAll();
      if (!existingProducts.length) {
        await Products.bulkCreate(records);
      }
      console.log("Data loading completed!");
    });
};
module.exports = initialMysqlDataLoader;
