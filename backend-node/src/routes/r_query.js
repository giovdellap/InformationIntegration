var express = require('express');
const queryController = require("../controllers/c_query")

const queryRouter = express.Router();
queryRouter.post('/sessionQuery', queryController.sessionQuery)
queryRouter.post('/sessionQueryNoCount', queryController.sessionQueryNoCount)
queryRouter.post('/requestQuery', queryController.requestQuery)
queryRouter.post('/requestQueryNoCount', queryController.requestQueryNoCount)
queryRouter.post('/pcaquery', queryController.pcaRequestQuery)


module.exports = queryRouter;