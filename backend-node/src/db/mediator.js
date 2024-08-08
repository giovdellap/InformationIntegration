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
        //console.log(cassandraResponse)
        for(let i = 0; i < cassandraResponse.length; i++) {
            if (field2 === 'temp') {
                if(cassandraResponse[i].temp === 0 || isNaN(cassandraResponse[i].temp)) {
                cassandraResponse.splice(i, 1)
                }
            }
            if (field2 === 'p_penalty') {
                if(cassandraResponse[i].p_penalty === 0 || isNaN(cassandraResponse[i].p_penalty)) {
                    cassandraResponse.splice(i, 1)
                }
            }
            //console.log('AO 1')
            //console.log(cassandraResponse[i])
            //console.log('AO 2')
            let spec = await cassandraWrapper.getSessionSpecificationbyLogID(cassandraResponse[i]['logid'], field2)
            //console.log(spec)
            let res = {}
            res[field1] = cassandraResponse[i][getCassandra(field1)]
            res[field2] = spec[getCassandra(field2)]
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
        console.log(influxResponse)
        return result
    }
}

module.exports = {
    Mediator
}