// 0 is cassandra, 1 is global
const cassandraFields = [
    ["f_penalty", "frequence_penalty"],
    ["p_penalty", "presence_penalty"],
    ["temp", "temperature"],
    ["time", "loading_time"],
    ["d", "input_dimension"],
    ["tokens", "total_tokens"],
    ["messages", "stream_messages"],
    ["timestamp", "time"]
]

const influxFields = [
    ["Gen", "generations"],
    ["Sat", "satisfaction"],
    ["input_t", "input_tokens"],
    ["input_d", "input_dimension"],
    ["messages", "stream_messages"],
    ["l_time", "loading_time"],
    ["tokens", "total_tokens"],

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