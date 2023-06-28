	
const AWS = require('aws-sdk')
const dc = require('./db.js')
const {PutItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
//method to create a lesson
module.exports.handler = async (event) => {

    const response = {statusCode: 200}

    try{
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.Lessons_Table,
            Item: marshall(body)
        }
        const createResult = await dc.send(new PutItemCommand(params));
        response.body = JSON.stringify({
            message: "Lesson successfully created",
            createResult: createResult,


        });
    }
    catch(err){
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to create lesson",
            error: err.message,
            errorStack: err.stack,
        });
    }
    return response;
  };




  