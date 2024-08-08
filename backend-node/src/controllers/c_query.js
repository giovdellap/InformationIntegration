const { countItems, roundFloats, roundToInt, groupBy, calculateMean } = require("./utils/queryUtils")
const PCA = require ("pca-js")
const { CassandraWrapper } = require("../db/wrappers/cassandra/cassandrawrapper")
const { InfluxWrapper } = require("../db/wrappers/influx/influxwrapper")
const { Mediator } = require("../db/mediator")

const sessionQuery = ( async (req, res) => {

  const field1 = req.body.field1
  const field2 = req.body.field2
  
  let mediator = new Mediator()
  result = await mediator.sessionQuery(field1, field2)

  let arr = roundFloats(result, [field1, field2])
  response = countItems(arr, field1, field2) 
  
  res.json(response)
})

const sessionQueryNoCount = ( async (req, res) => {

  const field1 = req.body.field1
  const field2 = req.body.field2

  //let response = []
  let dbHandler = getHandler(req.body.db)

  let mediator = new Mediator()
  result = await mediator.sessionQuery(field1, field2)
  console.log("RESPONSE LENGTH: ", result.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  //response = countItems(arr, field1, field2) 
  
  res.json(dbResponse)
})

const linechartQuery = ( async (req, res) => {

  const field1 = req.body.field1
  const field2 = req.body.field2
  const model_filter = req.body.model_filter

  //let response = []
  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.basicQuery(field1, field2, model_filter)
  console.log("RESPONSE LENGTH: ", dbResponse)
  let response = calculateMean(dbResponse, field1, field2)
  console.log('LINECHART RESPONSE', response)

  //let arr = roundFloats(dbResponse, [field1, field2])
  //response = countItems(arr, field1, field2) 
  
  res.json(response)
})


const wliBoxplotQuery = ( async (req, res) => {

  const field = req.body.field
  const model_filter = req.body.model_filter

  let response = []
  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.basicQuery('wli', field, model_filter)
  //console.log(dbResponse)
  console.log("RESPONSE LENGTH: ", dbResponse.length)
  //let arr = roundToInt(dbResponse, [field, 'wli'])
  response = groupBy(dbResponse, 'wli', field) 
  
  res.json(response)
})

const basicRequestQuery = ( async (req, res) => {

  const field = req.body.field

  let response = []
  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.basicRequestQuery(field)
  console.log("RESPONSE LENGTH: ", dbResponse.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  response = countItems(dbResponse, field, "loading_time") 
  
  res.json(response)
})

const basicRequestNoCountQuery = ( async (req, res) => {

  const field = req.body.field

  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.basicRequestQuery(field)
  console.log("RESPONSE LENGTH: ", dbResponse.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  //response = countItems(dbResponse, field, "loading_time") 
  
  res.json(dbResponse)
})

const pcaRequestQuery = ( async (req, res) => {

  const field = req.body.field

  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.basicRequestQuery(field)
  console.log("RESPONSE LENGTH: ", dbResponse.length)

  // transorm items to numbers arrays
  let onlyNumbers = []
  for (let i = 0; i < dbResponse.length; i++) {
    //let item = [dbResponse[i]['loading_time'], dbResponse [i][field]]
    let item = [dbResponse [i][field], dbResponse[i]['loading_time']]

    onlyNumbers.push(item)
  }
  console.log('ONLYNUMBERS: ',onlyNumbers)
  let vectors = PCA.getEigenVectors(onlyNumbers)
  //var first = PCA.computePercentageExplained(vectors,vectors[0])
  //var topTwo = PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
  
  var adData = PCA.computeAdjustedData(onlyNumbers,vectors[0])
  let results = []
  console.log('FORMATTEDDATA: ', adData.formattedAdjustedData)
  for (let i = 0; i < adData.formattedAdjustedData[0].length; i++) {
    let result = {}
    result['loading_time'] = 0
    result[field] = adData.formattedAdjustedData[0][i]
    results.push(result)
  }
  response = countItems(results, field, "loading_time") 


  //console.log(adData)
  res.json(response)
})

const test = ( async (req, res) => {

  const test = ( async (req, res) => {

    let dbHandler = getHandler(req.body.db)
  
    let dbResponse = await dbHandler.test()
    console.log("dbResponse: ", dbResponse)
    //console.log("RESPONSE LENGTH: ", dbResponse.length)
    //let arr = roundFloats(dbResponse, [field1, field2])
    res.json(dbResponse)
  
  })

  let dbHandler = getHandler(req.body.db)

  let dbResponse = await dbHandler.test()
  console.log("dbResponse: ", dbResponse)
  //console.log("RESPONSE LENGTH: ", dbResponse.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  res.json(dbResponse)

})

  
module.exports = {
  sessionQuery,
  sessionQueryNoCount,
  wliBoxplotQuery,
  basicRequestQuery,
  basicRequestNoCountQuery,
  pcaRequestQuery,
  test,
  linechartQuery
}
  