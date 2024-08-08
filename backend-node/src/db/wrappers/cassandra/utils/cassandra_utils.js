async function insertItem(client, factory, item) {
    await client.connect()
    await client.execute(factory.createKeyspaceQuery())
    //console.log('TABLE QUERY: ', factory.createTableQuery())
    await client.execute(factory.createTableQuery())
    
    const query = factory.insertItemQuery(item)
    const values = factory.insertItemValues(item)
    await client.execute(query, values, {prepare: true})
}

async function createTable(client, factory) {
    await client.connect()
    await client.execute(factory.createKeyspaceQuery())
    //console.log('TABLE QUERY: ', factory.createTableQuery())
    await client.execute(factory.createTableQuery())
}

async function insertItemOnly(client, factory, item, logID) {
    const query = factory.insertItemQuery(item)
    const values = factory.insertItemValues(item, logID)
    await client.execute(query, values, {prepare: true})
}

async function deleteTable(client, factory) {
    await client.connect()
    await client.execute(factory.deleteTable())
    //console.log('TABLE QUERY: ', factory.createTableQuery())
}

async function createSecondaryIndex(client, factory, column_name) {
    await client.execute(factory.createSecondaryIndex(column_name))
}

async function executeQuery(client, query) {
    await client.connect()
    let res = await client.execute(query)
    return res
}

module.exports = {
    insertItem,
    insertItemOnly, 
    createTable,
    createSecondaryIndex,
    deleteTable,
    executeQuery
}