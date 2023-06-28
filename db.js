const { DynamoDBClient }  = require("@aws-sdk/client-dynamodb");
const client  = new DynamoDBClient({});

module.exports = client;     // export the client for use in other modules
