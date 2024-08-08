// 0 is cassandra, 1 is global
const cassandraFields = [
    ["f_penalty", "frequence_penalty"],
    ["p_penalty", "presence_penalty"],
    ["temp", "temperature"],
]

const influxFields = [
    ["Gen", "generations"],
    ["Sat", "satisfaction"]
]

function getCassandra(string) {
    for (item of cassandraFields) {
        if(item[1] === string) return item[0]
    }
    return string
}

function cassandraToGlobal(string) {
    for (item of cassandraFields) {
        if(item[0] === string) return item[1]
    }
    return string
}

function getInflux(string) {
    for (item of influxFields) {
        if(item[1] === string) return item[0]
    }
    return string
}

function influxToGlobal(string) {
    for (item of influxFields) {
        if(item[0] === string) return item[1]
    }
    return string
    
}

module.exports = {
    getCassandra,
    cassandraToGlobal,
    getInflux,
    influxToGlobal
}