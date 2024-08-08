const { DataFactory } = require("../../factories/datafactory.js")

async function generateandInsertOneDay(date, wrapper, db) {
  const dataFactory = new DataFactory()
  dataFactory.generateOneDay(date, db)

  // DB INSERTION 
  //console.log("DB INSERTION - INITIALIZATION")
  await wrapper.insertMultipleItems("LOGS", dataFactory.logSet)
  //console.log("DB INSERTION - LOGSET OK")
  await wrapper.insertMultipleItems("REQUESTS", dataFactory.requestSet)
  //console.log("DB INSERTION - REQUESTSET OK")
  return dataFactory.logSet.length
}



module.exports = {
    generateandInsertOneDay
}