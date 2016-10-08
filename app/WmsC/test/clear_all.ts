import {emitFieldList} from "../core/emit";
import {consoleOk, consoleError} from "../core/console";
import {executeWmsSql, executeBuhtaSql} from "../core/MsSqlDb";

export function test_clear_all(): Promise<void> {

    let sql = `

TRUNCATE TABLE Документ 
TRUNCATE TABLE Докспец
TRUNCATE TABLE _wms_Остаток

DELETE FROM Догспец WHERE Договор IN (SELECT Ключ FROM Договор WHERE Дата>='20161001')
DELETE FROM Договор WHERE Дата>='20161001'


            `;

    return executeBuhtaSql(sql)
        .then(()=> {
            consoleOk("test_clear_all");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
