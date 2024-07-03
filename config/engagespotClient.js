const { EngagespotClient } =require("@engagespot/node");

const client = EngagespotClient({
  apiKey: process.env.ENGAGESPOT_API_KEY,
  apiSecret: process.env.ENGAGESPOT_API_SECRET
});

module.exports= client;
