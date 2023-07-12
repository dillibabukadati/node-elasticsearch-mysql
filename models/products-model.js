const Sequelize = require("sequelize");
const sequelize = require("../utils/database");

const Products = sequelize.define("products", {
  id: {
    type:Sequelize.INTEGER,
    primaryKey: true,
    allowNull: false,
    autoIncrement: true,
  },
  name: Sequelize.STRING,
  main_category: Sequelize.STRING,
  sub_category: Sequelize.STRING,
  image: Sequelize.TEXT,
  link: Sequelize.TEXT,
  ratings: Sequelize.STRING,
  no_of_ratings: Sequelize.STRING,
  discount_price: Sequelize.STRING,
  actual_price: Sequelize.STRING,
});

module.exports = Products;
