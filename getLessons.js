const dc = require('./db.js')
const { GetItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
module.exports.handler = async (event) => {

    const response = {statusCode: 200}

    try{
        const params = {
            TableName: process.env.Lessons_Table,
            Key: marshall({lessonID: event.pathParameters.lessonID})
        }
        const {Item} = await dc.send(new GetItemCommand(params));
        response.body = JSON.stringify({
            message: "Lesson successfully retrieved",
            lesson: (Item) ? unmarshall(Item) : {},

        });
    }
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
  