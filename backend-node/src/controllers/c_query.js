const { countItems, roundFloats, roundToInt, groupBy, calculateMean } = require("./utils/queryUtils")
const PCA = require ("pca-js")

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


  let mediator = new Mediator()
  result = await mediator.sessionQuery(field1, field2)
  //console.log("RESPONSE LENGTH: ", result.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  //response = countItems(arr, field1, field2) 
  
  res.json(result)
})




const requestQuery = ( async (req, res) => {

  const field = req.body.field

  let response = []

  let mediator = new Mediator()
  result = await mediator.requestQuery(field)

  console.log("RESPONSE LENGTH: ", result.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  response = countItems(result, field, "loading_time") 
  
  res.json(response)
})

const requestQueryNoCount = ( async (req, res) => {

  const field = req.body.field

  let mediator = new Mediator()
  result = await mediator.requestQuery(field)

  //console.log("RESPONSE LENGTH: ", result.length)
  //let arr = roundFloats(dbResponse, [field1, field2])
  //response = countItems(dbResponse, field, "loading_time") 
  
  res.json(result)
})

const pcaRequestQuery = ( async (req, res) => {

  const field = req.body.field

  let mediator = new Mediator()
  result = await mediator.requestQuery(field)
  //console.log("RESPONSE LENGTH: ", result.length)

  // transorm items to numbers arrays
  let onlyNumbers = []
  for (let i = 0; i < result.length; i++) {
    //let item = [dbResponse[i]['loading_time'], dbResponse [i][field]]
    let item = [result[i][field], result[i]['loading_time']]

    onlyNumbers.push(item)
  }
  let vectors = PCA.getEigenVectors(onlyNumbers)
  //var first = PCA.computePercentageExplained(vectors,vectors[0])
  //var topTwo = PCA.computePercentageExplained(vectors,vectors[0],vectors[1])
  
  var adData = PCA.computeAdjustedData(onlyNumbers,vectors[0])
  let results = []
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


  
module.exports = {
  sessionQuery,
  sessionQueryNoCount,
  requestQuery,
  requestQueryNoCount,
  pcaRequestQuery,
}
  