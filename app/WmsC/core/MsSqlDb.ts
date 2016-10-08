import * as sql from "mssql"
import {
    sqlServerAddress, sqlServerPort, sqlLogin, sqlPassword, BuhtaDatabase,
    sqlServerInstance, WmsDatabase
} from "../config/SqlConnections";

export function executeBuhtaSql(sqlBatch: string): Promise<any> {
    return executeSql(sqlBatch, BuhtaDatabase);
}

export function executeWmsSql(sqlBatch: string): Promise<any> {
    return executeSql(sqlBatch, WmsDatabase);
}

export function getValueFromBuhtaSql(sqlBatch: string, columnName: string): Promise<any> {
    return executeBuhtaSql(sqlBatch).then((rows)=> {
        return rows[0][0][columnName];
    });
}


export function getIsExistsWmsView(viewName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + viewName + "', 'V') AS Result";

    return getValueFromWmsSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsBuhtaTable(tableName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + tableName + "', 'U') AS Result";

    return getValueFromBuhtaSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsWmsTable(tableName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + tableName + "', 'U') AS Result";

    return getValueFromWmsSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsBuhtaView(viewName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + viewName + "', 'V') AS Result";

    return getValueFromBuhtaSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsBuhtaProc(procName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + procName + "', 'P') AS Result";

    return getValueFromBuhtaSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsWmsProc(procName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + procName + "', 'P') AS Result";

    return getValueFromWmsSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsBuhtaFunc(funcName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + funcName + "', 'FN') AS Result";

    return getValueFromBuhtaSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsWmsFunc(funcName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + funcName + "', 'FN') AS Result";

    return getValueFromWmsSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsWmsTrigger(triggerName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + triggerName + "', 'TR') AS Result";

    return getValueFromWmsSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getIsExistsBuhtaTrigger(triggerName: string): Promise<boolean> {
    let sql = "SELECT OBJECT_ID('" + triggerName + "', 'TR') AS Result";

    return getValueFromBuhtaSql(sql, "Result")
        .then((result: any)=> {
            return result !== null
        });
}

export function getValueFromWmsSql(sqlBatch: string, columnName: string): Promise<any> {
    return executeWmsSql(sqlBatch).then((rows)=> {
        return rows[0][0][columnName];
    });
}

function executeSql(sqlBatch: string, database: string): Promise<any> {
    let options = {instanceName: sqlServerInstance} as any;

    let config: sql.config = {
      //  driver: "msnodesqlv8",
        pool: {
            min: 1,
            max: 1,
            idleTimeoutMillis: 5000 /// не работает
        },
        server: sqlServerAddress,
        port: sqlServerPort,
        user: sqlLogin,
        database: database,
        password: sqlPassword,
        options: options
    }

    let connection = new sql.Connection(config);

    return connection
        .connect()
        .then(()=> {
            let req = new sql.Request(connection);
            req.multiple = true;
            return req.batch(sqlBatch);
        })
        .then((rowsSet: any)=> {
            //console.dir(rowsSet);
            return rowsSet;
        });

}