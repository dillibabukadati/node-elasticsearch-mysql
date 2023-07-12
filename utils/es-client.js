
const { Client } = require("@elastic/elasticsearch");
const client = new Client({
  node: process.env.ES_CLOUD_ID,
  auth: {
    apiKey: process.env.ES_API_KEY,
  },
});

module.exports=client;
