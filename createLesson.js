	
const AWS = require('aws-sdk')
const dc = require('./db.js')
const {PutItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
//method to create a lesson
module.exports.handler = async (event) => {

    const response = {statusCode: 200}

    try{
        //parses data from the request body of the event
        const body = JSON.parse(event.body);
        const params = {
            TableName: process.env.Lessons_Table,
            Item: marshall(body)
        }
        //tries to create a new lesson in the Lessons_Table using the PutItemCommand
        const createResult = await dc.send(new PutItemCommand(params));
        //if successful, returns a message saying so
        response.body = JSON.stringify({
            message: "Lesson successfully created",
            createResult: createResult,


        });
    }
    //if unsuccessful, returns an error message
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




  