import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";

export function init_table_ЗаявкаНаПриходСпец(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("ЗаявкаНаПриходСпец")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW ЗаявкаНаПриходСпец AS
                SELECT
                  Ключ,
                  Договор ЗаявкаНаПриход,
                  [Тип субконто 1] ТоварТип,
                  [Субконто 1] Товар,
                  Количество,
                  
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.Догспец
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_ЗаявкаНаПриходСпец");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
