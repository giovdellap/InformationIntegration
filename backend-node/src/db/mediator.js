const { CassandraWrapper } = require("../db/wrappers/cassandra/cassandrawrapper")
const { InfluxWrapper } = require("../db/wrappers/influx/influxwrapper")
const {getCassandra, cassandraToGlobal, getInflux, influxToGlobal } = require('./transformer')
const cassandra = require('cassandra-driver');

class Mediator {
    async sessionQuery(field1, field2) {
        let result = []
        let cassandraWrapper = new CassandraWrapper()
        let influxWrapper = new InfluxWrapper() 

        // CASSANDRA
        let cassandraResponse = await cassandraWrapper.sessionQueryRelevation(getCassandra(field1))
        for(let i = 0; i < cassandraResponse.length; i++) {
            if (field2 === 'temperature') {
                if(cassandraResponse[i].temp === 0 || isNaN(cassandraResponse[i].temp)) {
                cassandraResponse.splice(i, 1)
                }
            }
            if (field2 === 'presence_penalty') {
                if(cassandraResponse[i].p_penalty === 0 || isNaN(cassandraResponse[i].p_penalty)) {
                    cassandraResponse.splice(i, 1)
                }
            }
        }
        for(let i = 0; i < cassandraResponse.length; i++) {

            let spec = await cassandraWrapper.getSessionSpecificationbyLogID(cassandraResponse[i].logid, getCassandra(field2))
            let res = {}
            res[field1] = cassandraResponse[i][getCassandra(field1)]
            res[field2] = spec.rows[0][getCassandra(field2)]
            result.push(res)
        }

        //INFLUX
        let influxResponse = await influxWrapper.sessionQuery(getInflux(field1), getInflux(field2))
        for(let i = 0; i < influxResponse.length; i++) {
            let res = {}
            res[field1]=influxResponse[i][getInflux(field1)]
            res[field2]=influxResponse[i][getInflux(field2)]
            result.push(res)
        }
        //console.log(influxResponse)
        return result
    }

    async requestQuery(field) {
        let result = []
        let cassandraWrapper = new CassandraWrapper()
        let influxWrapper = new InfluxWrapper() 

        // CASSANDRA

        let cassandraResponse
        if(field !== "input_dimension") {
            cassandraResponse = await cassandraWrapper.requestQuery(getCassandra(field))
        } else {
            cassandraResponse = await cassandraWrapper.requestQuery("rid")
        }
        //console.log('CASSANDRARESPONSE LENGTH: ', cassandraResponse.length)
        for (let request of cassandraResponse) {
            if(field !== "input_dimension") {
                let obj = {}
                obj["loading_time"] = request[getCassandra("loading_time")]
                //console.log(field)
                //console.log(request)
                obj[field] = request[getCassandra(field)]
                result.push(obj)
            } else {
                //console.log('REQUEST: ', request)
                let dim = await cassandraWrapper.getRequestDimensionByRID(request.rid)
                result.push({
                    loading_time: request[getCassandra("loading_time")],
                    input_dimension: dim.rows[0][getCassandra(field)]
                })
            }
        }

        //INFLUX
        let influxResponse = await influxWrapper.requestQuery(getInflux(field))
        //console.log('INFLUXRESPONSE LENGTH: ', influxResponse.length)
        for(let i = 0; i < influxResponse.length; i++) {
            let res = {}
            res["loading_time"]=influxResponse[i][getInflux("loading_time")]
            res[field]=influxResponse[i][getInflux(field)]
            result.push(res)
        }
        //console.log(influxResponse)
        return result
    }
}

module.exports = {
    Mediator
}