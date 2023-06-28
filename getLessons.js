const dc = require('./db.js')
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
module.exports.handler = async (event) => {

    const response = {statusCode: 200}

    try{
        //parses data from the request body of the event
        const params = {
            TableName: process.env.Lessons_Table,
            Key: marshall({lessonID: event.pathParameters.lessonID})
        }
        //tries to retrieve the lesson with the given lessonID from the Lessons_Table using the GetItemCommand
        const {Item} = await dc.send(new GetItemCommand(params));
        //if successful, returns a message saying so
        response.body = JSON.stringify({
            message: "Lesson successfully retrieved",
            lesson: (Item) ? unmarshall(Item) : {},

        });
    }
    //if unsuccessful, returns an error message
    catch(err){
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Error retrieving lesson",
            error: err.message,
            errorStack: err.stack,
        });
    }
    return response;
  };
  