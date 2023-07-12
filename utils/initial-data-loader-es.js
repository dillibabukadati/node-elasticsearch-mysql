const client = require("./es-client");
const Products = require("../models/products-model");
const { ES_PRODUCTS_INDEX } = require("./constants");
// Function to search the index
async function searchIndex(query) {
  try {
    const { body } = await client.search({
      index: ES_PRODUCTS_INDEX,
      body: {
        query: {
          multi_match: {
            query,
            fields: ["name^3", "main_category", "sub_category"],
          },
        },
      },
    });

    const results = body.hits.hits.map((hit) => hit._source);
    return results;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

const isIndexExists = async () => {
  const { body } = await client.indices.exists({ index: ES_PRODUCTS_INDEX });
  return body;
};

// Function to split records into smaller batches for bulk indexing
function splitIntoBatches(records, batchSize) {
  const batches = [];
  for (let i = 0; i < records.length; i += batchSize) {
    batches.push(records.slice(i, i + batchSize));
  }
  return batches;
}

const indexProductsData = async () => {
  const products = await Products.findAll();
  console.log("fetched total Products: " + products.length);
  const batches = splitIntoBatches(products, 1000);

  for (const batch of batches) {
    const body = batch.flatMap((doc) => [
      { index: { _index: ES_PRODUCTS_INDEX } },
      doc,
    ]);
    console.log(body);
    await client.bulk({ refresh: true, body });
  }
  console.log("products added to ES successfully.");
};

const createIndex = async () => {
  await client.indices.create({
    index: ES_PRODUCTS_INDEX,
    body: {
      mappings: {
        properties: {
          name: {
            type: "search_as_you_type",
            analyzer: "standard",
            search_analyzer: "standard",
          },
          main_category: { type: "keyword" },
          sub_category: { type: "keyword" },
          image: { type: "keyword" },
          link: { type: "keyword" },
          ratings: { type: "float" },
          no_of_ratings: { type: "integer" },
          discount_price: { type: "keyword" },
          actual_price: { type: "keyword" },
          mysql_id: { type: "integer" },
        },
      },
    },
  });
};

const initializeEsData = async () => {
  if (!(await isIndexExists())) {
    console.log("Index not exists creating it...");
    createIndex();
    indexProductsData();
  }
};

module.exports = initializeEsData;
