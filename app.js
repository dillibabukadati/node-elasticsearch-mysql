require("dotenv").config();
const express = require("express");
const morgan = require("morgan");
// const { APP_PORT } = require("./utils/config");
const sequelize = require("./utils/database");
const client = require("./utils/es-client");
const cors = require("cors");
const fs = require("fs");
const initialMysqlDataLoader = require("./utils/initial-data-loader-mysql");
const initializeEsData = require("./utils/initial-data-loader-es");
// Importing models to sequelize create tables
const Products = require("./models/products-model");

// routes
const baseRoutes = require("./routes/base-route");
const productRoutes = require("./routes/products-routes");
const path = require("path");
const app = express();

// create a write stream (in append mode)
var accessLogStream = fs.createWriteStream(
  process.env.LOG_BASE_PATH + "/access.log",
  {
    flags: "a",
  }
);

app.use(express.json());
app.use(morgan("combined", { stream: accessLogStream }));
app.use(express.static(path.join(__dirname,"ui-build")));
// Handle requests to the base path
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'ui-build', 'index.html'));
});

app.use(
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
app.options(
  "*",
  cors({
    origin: true,
    optionsSuccessStatus: 200,
    credentials: true,
  })
);
// app.use(baseRoutes);
app.use("/products", productRoutes);
sequelize
  .sync({ alter: true })
  .then((res) => {
    initialMysqlDataLoader();
    initializeEsData();
    app.listen(process.env.APP_PORT ? process.env.APP_PORT : 3000);

    client
      .info()
      .then((response) => {
        console.log("Connected to elastic search successfully.");
      })
      .catch((error) => {
        console.error("Failed to connect to elastic search");
        console.error(error);
      });
  })
  .catch((err) => {
    console.error(err);
  });
