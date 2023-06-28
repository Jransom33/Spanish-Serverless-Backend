const dc = require('./db.js')
const { DeleteItemCommand } = require("@aws-sdk/client-dynamodb");
const {marshall, unmarshall} = require("@aws-sdk/util-dynamodb");
module.exports.handler = async (event) => {

    const response = {statusCode: 200}
    //tries to delete the lesson with the given lessonID from the Lessons_Table using the DeleteItemCommand
    //if successful, returns a message saying so
    //if unsuccessful, returns an error message
    try{
        const params = {
            TableName: process.env.Lessons_Table,
            Key: marshall({lessonID: event.pathParameters.lessonID})
        }
        const deleteResult = await dc.send(new DeleteItemCommand(params));
        response.body = JSON.stringify({
            message: "Lesson successfully deleted",
            deleteResult: deleteResult,

        });
    }
    catch(err){
        console.error(err);
        response.statusCode = 500;
        response.body = JSON.stringify({
            message: "Error deleting lesson",
            error: err.message,
            errorStack: err.stack,
        });
    }
    return response;
  };