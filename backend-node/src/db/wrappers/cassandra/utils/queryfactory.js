const { SpecialRequest } = require("../../../../model/m_request");
const { SpecialRequestTableUtils, LogsRelTableUtils, LogsSpecTableUtils, AttachmentTableUtils } = require("./tableutils")
const cassandra = require('cassandra-driver');


class QueryFactory {

    keyspace
    table_name

    constructor(keyspace, table_name) {
        this.keyspace = keyspace
        this.table_name = table_name
    }

    createKeyspaceQuery() {
        const start = "CREATE KEYSPACE IF NOT EXISTS "
        const end =  " WITH replication = {'class': 'SimpleStrategy', 'replication_factor': '3' }"
        const query = start + this.keyspace + end
        return query
    }

    createTableQuery() {}
    insertItemQuery() {}
    insertItemValues(item, logID) {}
    createSecondaryIndex(column) {
        return "CREATE INDEX ON " + this.keyspace + "." + this.table_name + " (" + column + ")"
    }

    deleteTable() {
        return "DROP TABLE IF EXISTS " + this.keyspace + "." + this.table_name
    }
}

class LogRelevationFactory extends QueryFactory{

    createTableQuery() {
        //console.log('cassandra handler - log item table')
        let start = "CREATE TABLE IF NOT EXISTS " + this.keyspace + "." + this.table_name
        let logID_columns = " (logID int, "
        let ts_columns = "ts timestamp, "
        let model_columns = "name text, version int, "
        let relevation_columns = "satisfaction int, generations int, "
        let primary_key = "PRIMARY KEY(logID))"
        const query = start + logID_columns + ts_columns + model_columns + relevation_columns + primary_key
        return query
    }

    insertItemQuery() {
        //console.log("cassandra handler - insert log item")
        const utils = new LogsRelTableUtils()

        let columns_names = utils.getColumnNames()

        let start = "INSERT INTO " + this.keyspace + "." + this.table_name + " ("
        let columns = utils.getColumnsString(columns_names)
        let mid_query = " VALUES ("
        let end = utils.getQuestionMarks(columns_names)
        const query = start + columns + mid_query + end
        //console.log('query: ', query)

        return query
    }

    insertItemValues(item, logID) {
        let values = [
            logID,
            item.timestamp,
            item.model.name, item.model.version,
            item.relevations.satisfaction, item.relevations.generations,
        ]

        return values
    }

    sessionQuery(field1, field2) {
        let basicQuery = "SELECT logid, " + field1 + " FROM " + this.keyspace + "." + this.table_name
        let whereSection = ""
        if (field2 === "temperature" || field2 === "presence_penalty") {
            whereSection = "WHERE " + field2 + " > 0.001 ALLOW FILTERING"
        }
        return basicQuery + whereSection
    }

}

class LogSpecificationFactory extends QueryFactory{

    createTableQuery() {
        //console.log('cassandra handler - log item table')
        let start = "CREATE TABLE IF NOT EXISTS " + this.keyspace + "." + this.table_name
        let logID_columns = " (logID int, "
        let user_columns = "user text, "
        let relevation_columns = "tokens int, wli int, "
        let parameters_columns = "p_penalty float, f_penalty float, top_p float, temp float, "
        let primary_key = "PRIMARY KEY(logID))"
        const query = start + logID_columns + user_columns + relevation_columns + parameters_columns + primary_key
        return query
    }

    insertItemQuery(item) {
        //console.log("cassandra handler - insert log item")
        const utils = new LogsSpecTableUtils()

        let columns_names = utils.getColumnNames()

        let start = "INSERT INTO " + this.keyspace + "." + this.table_name + " ("
        let columns = utils.getColumnsString(columns_names)
        let mid_query = " VALUES ("
        let end = utils.getQuestionMarks(columns_names)
        const query = start + columns + mid_query + end
        //console.log('query: ', query)

        return query
    }

    insertItemValues(item, logID) {
        let values = [
            logID,
            item.customer,
            item.relevations.tokens, item.relevations.wli,
            item.parameters.presence_penalty, item.parameters.frequency_penalty, 
            item.parameters.top_p, item.parameters.temperature
        ]
        return values
    }

    sessionQuery(lid, field) {
        let basicQuery = "SELECT " + field + " FROM " + this.keyspace + "." + this.table_name
        let whereSection = " WHERE logid = " + lid
        let whereClauses = []
        if (field === "temperature" || field === "presence_penalty") {
            whereClauses.push(field2 + " > 0.001")
        }

        if (whereClauses.length === 2) {
            whereSection = whereSection + " AND " + whereClauses[1]
        }
        if (whereSection !== "") {
            whereSection = whereSection + " ALLOW FILTERING"
        }
        return basicQuery + whereSection
    }

    basicquery(field1, field2, model) {
        let basicQuery = "SELECT " + field1 + ", " +  field2 + " FROM " + this.keyspace + "." + this.table_name
        let whereSection = ""

        let whereClauses = []
        if (field2 === "temperature" || field2 === "presence_penalty") {
            whereClauses.push(field2 + " > 0.001")
        }
        if (model !== "all") {
            whereClauses.push("name = '" + model + "'")
        }
        if (whereClauses.length > 0) {
            whereSection = " WHERE " + whereClauses[0]
        }
        if (whereClauses.length === 2) {
            whereSection = whereSection + " AND " + whereClauses[1]
        }
        if (whereSection !== "") {
            whereSection = whereSection + " ALLOW FILTERING"
        }
        return basicQuery + whereSection
    }
}
    
class RequestQueryFactory extends QueryFactory {
    createTableQuery() {
        //console.log('cassandra handler - log item table')
        let start = "CREATE TABLE IF NOT EXISTS " + this.keyspace + "." + this.table_name
        let ts_columns = " (rid int, timestamp timeuuid, "
        let request_columns = "tokens int, messages int, time int, input_tokens int,  "
        let primary_key = "PRIMARY KEY(rid))"
        const query = start + ts_columns + request_columns + primary_key
        return query
    }

    insertItemQuery() {
        //console.log("cassandra handler - insert request item: ", item)
        
        let utils = new SpecialRequestTableUtils()
        
        let columns_names = utils.getColumnNames()
        //console.log("cassandra handler - insert request columns_names: ", columns_names)

        let start = "INSERT INTO " + this.keyspace + "." + this.table_name + " ("
        let columns = utils.getColumnsString(columns_names)
        let mid_query = " VALUES ("
        let end = utils.getQuestionMarks(columns_names)
        const query = start + columns + mid_query + end
        //console.log('query: ', query)
        //console.log('time: ', ts)
        return query
    }

    insertItemValues(item, logID) {
        let values = [
            logID,
            cassandra.types.TimeUuid.fromDate(item.timestamp),
            item.total_tokens,
            item.stream_messages,
            item.loading_time,
            item.input_tokens,
        ]
        return values
    }

    requestQuery(field) {
        let basicQuery = ""
        //console.log(field)
        if (field !== "timestamp") {
            basicQuery = "SELECT time, " +  field + " FROM " + this.keyspace + "." + this.table_name
        } else basicQuery = "SELECT time, DateOf(timestamp) FROM " + this.keyspace + "." + this.table_name
        return basicQuery
    }

    requestDimensionQuery(rid) {
        return "SELECT d FROM " + this.keyspace + "." + this.table_name + " WHERE rid = " + rid + " ALLOW FILTERING"
    }
}

class AttachmentQueryFactory extends QueryFactory {
    createTableQuery() {
        //console.log('cassandra handler - log item table')
        let start = "CREATE TABLE IF NOT EXISTS " + this.keyspace + "." + this.table_name
        let ts_columns = " (rid int, d int, "
        let primary_key = "PRIMARY KEY(rid))"
        const query = start + ts_columns + primary_key
        return query
    }

    insertItemQuery() {
        //console.log("cassandra handler - insert request item: ", item)
        let utils = new AttachmentTableUtils()
        let columns_names = ["rid", "d"]
        //console.log("cassandra handler - insert request columns_names: ", columns_names)

        let start = "INSERT INTO " + this.keyspace + "." + this.table_name + " ("
        let columns = utils.getColumnsString(columns_names)
        let mid_query = " VALUES ("
        let end = utils.getQuestionMarks(columns_names)
        const query = start + columns + mid_query + end
        //console.log('query: ', query)
        //console.log('time: ', ts)
        return query

    }

    insertItemValues(item, logID) {
        let values = [
            logID,
            item.input_dimension
        ]
        //console.log('CASSANDRA ATTACHMENT VALUES', values[0])
        return values
    }

    requestDimensionQuery(rid) {
        return "SELECT d FROM " + this.keyspace + "." + this.table_name + " WHERE rid = " + rid + " ALLOW FILTERING"
    }
}



module.exports = {
    QueryFactory,
    RequestQueryFactory,
    LogRelevationFactory,
    LogSpecificationFactory,
    AttachmentQueryFactory
}