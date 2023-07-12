const client = require("../utils/es-client");
const { ES_PRODUCTS_INDEX } = require("../utils/constants");
const Products = require("../models/products-model");
const { Op } = require("sequelize");

// Function to search the index
async function searchIndex(query) {
  const { body } = await client.search({
    index: ES_PRODUCTS_INDEX,
    body: {
      _source: ["name", "id"],
      query: {
        multi_match: {
          query,
          type: "bool_prefix",
          fields: [
            "name",
            "name._2gram",
            "name._3gram",
            "main_category",
            "sub_category",
          ],
        },
      },
    },
  });

  return body.hits.hits.map((hit) => hit._source);
}

exports.getProductsFromEs = async (req, res) => {
  try {
    const { search } = req.query || "";
    const results = await searchIndex(search);
    return res.json(results);
  } catch (error) {
    console.error("Search Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for products." });
  }
};

const searchProducts = async (search) => {
  const products = await Products.findAll({
    where: {
      [Op.or]: {
        name: { [Op.like]: `%${search}%` },
        main_category: { [Op.like]: `%${search}%` },
        sub_category: { [Op.like]: `%${search}%` },
      },
    },
  });
};

exports.getProductsFromSql = async (req, res) => {
  try {
    const { search } = req.query || "";
    const products = await searchProducts(search);
    res.json(products);
  } catch (error) {
    console.error("Search Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for products." });
  }
};

exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Products.findByPk(id);
    res.json(product);
  } catch (error) {
    console.error("Search Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while searching for products." });
  }
};
