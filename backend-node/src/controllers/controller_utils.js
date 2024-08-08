const { CassandraWrapper } = require("../db/wrappers/cassandra/cassandrawrapper.js")
const { InfluxWrapper } = require("../db/wrappers/influx/influxwrapper.js")

function getWrapper(db) {
    if (db === "cassandra") {
      return new CassandraWrapper()
    } else {
      return new InfluxWrapper()
    }
}

module.exports = {
    getWrapper
}