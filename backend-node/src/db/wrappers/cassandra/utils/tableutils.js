class TableUtils {

    tableColumns = []

    getColumnNames() {
        return this.tableColumns
    }
    
    //returns a string defining the columns
    getColumnsString(values) {
        let str = ""
        for (let i = 0; i < values.length - 1; i++) {
            str = str + values[i] + ", "
        }
        str = str + values[values.length - 1] + ")"
        return str
    }

    //returns a string containing the question marks
    getQuestionMarks(values) {
        //console.log('get question marks - values: ', values)
        let str = ""
        for (let i = 0; i < values.length - 1; i++) {
            str = str + "?, "
        }
        str = str + "?)"
        return str
    }

}

class LogsRelTableUtils extends TableUtils {

    tableColumns = [
        "logID",
        "ts", 
        "name", "version",
        "satisfaction", "generations"
    ]
}

class LogsSpecTableUtils extends TableUtils {

    tableColumns = [
        "logID", 
        "user", 
        "tokens", "wli",
        "p_penalty", "f_penalty", "top_p", "temp"
    ]
}

class SpecialRequestTableUtils extends TableUtils {

    tableColumns = [
    "timestamp", "tokens", "messages", "time", "input_tokens"
    ]
}

class AttachmentTableUtils extends TableUtils {

    tableColumns = [
    "timestamp", "d"
    ]
}




module.exports = {
    TableUtils,
    LogsRelTableUtils,
    LogsSpecTableUtils,
    SpecialRequestTableUtils,
    AttachmentTableUtils
}