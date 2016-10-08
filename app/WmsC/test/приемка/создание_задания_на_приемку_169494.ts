
import {consoleOk, consoleError} from "../../core/console";
import {executeBuhtaSql, executeWmsSql} from "../../core/MsSqlDb";

export function создание_задания_на_приемку_169494(): Promise<void> {

    let sql = `
EXEC СоздатьЗаданиеНаПриемку 169494 
            `;

    return executeWmsSql(sql)
        .then(()=> {
            consoleOk("создание_задания_на_приемку_169494");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
