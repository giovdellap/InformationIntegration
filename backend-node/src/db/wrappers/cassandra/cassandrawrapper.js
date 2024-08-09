const { Wrapper } = require('../../wrapper')
const async = require('async');
const cassandra = require('cassandra-driver');
const { AttachmentQueryFactory, LogQueryFactory, RequestQueryFactory, LogRelevationFactory, LogSpecificationFactory } = require("./utils/queryfactory");
const { insertItem, insertItemOnly, createTable, createSecondaryIndex, deleteTable, executeQuery } = require("./utils/cassandra_utils") 
const { once } = require('events');

class CassandraWrapper extends Wrapper{
    
  DB_USERNAME = "admin"
  DB_PASSWORD = "admin"
  DB_CONN_STR = "cassandra"
  DB_KEYSPACE = "ai_company"
  LOGS_REL_TABLE = "relevation"
  LOGS_SPEC_TABLE = "specification"
  REQUEST_TABLE = "requests"
  ATTACHMENT_TABLE = "attachment"

  constructor() {
    super()
    this.client = new cassandra.Client({ 
      contactPoints: [this.DB_CONN_STR], 
      localDataCenter: 'datacenter1'
      //credentials: { username: this.DB_USERNAME, password: this.DB_PASSWORD }
    });
  }

  async initialize() {
    const logRelFactory = new LogRelevationFactory(this.DB_KEYSPACE, this.LOGS_REL_TABLE)
    const logSpecFactory = new LogSpecificationFactory(this.DB_KEYSPACE, this.LOGS_SPEC_TABLE)
    const requestFactory = new RequestQueryFactory(this.DB_KEYSPACE, this.REQUEST_TABLE)
    const attachmentFactory = new AttachmentQueryFactory(this.DB_KEYSPACE, this.ATTACHMENT_TABLE)


    // LOG RELEVATION TABLE
    await deleteTable(this.client, logRelFactory)
    await createTable(this.client, logRelFactory)
    await createSecondaryIndex(this.client, logRelFactory, "satisfaction")
    await createSecondaryIndex(this.client, logRelFactory, "generations")

    // LOG SPECIFICATION TABLE
    await deleteTable(this.client, logSpecFactory)
    await createTable(this.client, logSpecFactory)
    await createSecondaryIndex(this.client, logSpecFactory, "tokens")
    await createSecondaryIndex(this.client, logSpecFactory, "wli")

    //REQUEST TABLE
    await deleteTable(this.client, requestFactory)
    await createTable(this.client, requestFactory)

    //ATTACHMENT TABLE
    await deleteTable(this.client, attachmentFactory)
    await createTable(this.client, attachmentFactory)
  }

  async insertMultipleItems(type, items) {

    if(type === "LOGS") {
      let relFactory = new LogRelevationFactory(this.DB_KEYSPACE, this.LOGS_REL_TABLE)
      let specFactory = new LogSpecificationFactory(this.DB_KEYSPACE, this.LOGS_SPEC_TABLE)

      for (let i = 0; i < items.length; i++) {
        await insertItemOnly(this.client, relFactory, items[i], i+1)
        await insertItemOnly(this.client, specFactory, items[i], i+1)
      }
    } else {
      let requestFactory = new RequestQueryFactory(this.DB_KEYSPACE, this.REQUEST_TABLE)
      let attachmentFactory = new AttachmentQueryFactory(this.DB_KEYSPACE, this.ATTACHMENT_TABLE)

      for (let i = 0; i < items.length; i++) {
        await insertItemOnly(this.client, requestFactory, items[i], i)
        await insertItemOnly(this.client, attachmentFactory, items[i], i)
      }
    }
  }

  async insertLogItem(item) {
    const factory = new LogQueryFactory(this.DB_KEYSPACE, this.LOGS_TABLE)
    await insertItem(this.client, factory, item)
  }

  async insertRequestItem(item) {
    const factory = new RequestQueryFactory(this.DB_KEYSPACE, this.REQUEST_TABLE)
    await insertItem(this.client, factory, item)
  }

  async sessionQueryRelevation(field1) {
    const factory = new LogRelevationFactory(this.DB_KEYSPACE, this.LOGS_REL_TABLE)
    let query = factory.sessionQuery(field1)
    //console.log('QUERY: ', query)
    let result = []
    
    let stream = this.client.stream(query)
    .on('readable', function () {
      // 'readable' is emitted as soon a row is received and parsed
      let row;
      while (row = this.read()) {
        result.push(row)
      }
    })
    .on('end', function () {
      // Stream ended, there aren't any more rows
    })
    .on('error', function (err) {
      // Something went wrong: err is a response error from Cassandra
    });

    await once(stream, 'end')
    //console.log()
    return result
  }
  

  async getSessionSpecificationbyLogID(lid, field) {
    let factory = new LogSpecificationFactory(this.DB_KEYSPACE, this.LOGS_SPEC_TABLE)
    let res = await executeQuery(this.client, factory.sessionQuery(lid, field))
    return res
  }

  async requestQuery(field) {
    const factory = new RequestQueryFactory(this.DB_KEYSPACE, this.REQUEST_TABLE)
    console.log('FIELD WRAPPER: ', field)
    let query 
    if(field === "d") {
      query = factory.requestDimensionQuery()
    } else query = factory.requestQuery(field)
    console.log('CASSANDRA QUERY: ', query)
    let result = []
    
    let stream = this.client.stream(query)
    .on('readable', function () {
      // 'readable' is emitted as soon a row is received and parsed
      let row;
      while (row = this.read()) {
        if (field === "timestamp") {
          //console.log(row)
          result.push({
            loading_time: row.time,
            timestamp: row["system.dateof(timestamp)"]
          })
        } else result.push(row)
      }
    })
    .on('end', function () {
      // Stream ended, there aren't any more rows
    })
    .on('error', function (err) {
      // Something went wrong: err is a response error from Cassandra
    });
    
    await once(stream, 'end')
    //console.log()
    return result
  }

  async getRequestDimensionByRID(rid) {
    let factory = new AttachmentQueryFactory (this.DB_KEYSPACE, this.ATTACHMENT_TABLE)
    let res = await executeQuery(this.client, factory.requestDimensionQuery(rid))
    return res
  }

}




module.exports = {
  CassandraWrapper
}