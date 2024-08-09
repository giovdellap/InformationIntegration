const {Point} = require('@influxdata/influxdb-client')

function LogItemToPoint(item) {
    //console.log(item)

    let point = new Point("logItem")
    .tag("UserID", item.customer)
    .tag("name", item.model.name)
    .tag("version", item.model.version)
    .tag("presence_penalty", item.parameters.presence_penalty)
    .tag("frequency_penalty", item.parameters.frequency_penalty)
    .tag("top_p", item.parameters.top_p)
    .tag("temperature", item.parameters.temperature)
    .tag("tokens", item.relevations.tokens)
    .tag("wli", item.relevations.wli)
    .intField("Gen", item.relevations.generations)
    .intField("Sat", item.relevations.satisfaction)
    .timestamp(item.timestamp)
    
    return point
}

function RequestToPoint(item) {
    let point = new Point("request")
    .tag("input_t", item.input_tokens)
    .tag("tokens", item.total_tokens)
    .tag("messages", item.stream_messages)
    .intField("l_time", item.loading_time)
    .tag("input_d", item.input_dimension)
    .timestamp(item.timestamp)
    return point
}

module.exports = {
    LogItemToPoint,
    RequestToPoint
}
