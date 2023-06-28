const dc = require('./db.js')
const AWS = require('aws-sdk')
const {UpdateItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
//method to create a lesson
module.exports.handler = async (event) => {

    const response = {statusCode: 200}

    try {
        //parses data from the request body of the event
        const body = JSON.parse(event.body);
        const objKeys = Object.keys(body);
        //creates the parameters for the UpdateItemCommand
        //iterates through the keys of the body object and creates the UpdateExpression, ExpressionAttributeNames, and ExpressionAttributeValues
        const params = {
            TableName: process.env.Lessons_Table,
            Key: marshall({ postId: event.pathParameters.lessonID }),
            UpdateExpression: `SET ${objKeys.map((_, index) => `#key${index} = :value${index}`).join(", ")}`,
            ExpressionAttributeNames: objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`#key${index}`]: key,
            }), {}),
            ExpressionAttributeValues: marshall(objKeys.reduce((acc, key, index) => ({
                ...acc,
                [`:value${index}`]: body[key],
            }), {})),
        };
        //tries to update the lesson with the given lessonID from the Lessons_Table using the UpdateItemCommand
        const updateResult = await db.send(new UpdateItemCommand(params));
        //if successful, returns a message saying so
        response.body = JSON.stringify({
            message: "Successfully updated post.",
            updateResult,
        });
    } 
    //if unsuccessful, returns an error message
    catch (e) {
        console.error(e);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Failed to update post.",
            errorMsg: e.message,
            errorStack: e.stack,
        });
    }
    return response;
  };