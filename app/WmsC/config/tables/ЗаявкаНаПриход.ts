import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";

export function init_table_ЗаявкаНаПриход(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("ЗаявкаНаПриход")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW ЗаявкаНаПриход AS
                SELECT
                  'Дог' ТипСубконто,
                  Ключ,
                  Номер,
                  Дата,
                  Грузоотправитель Поставщик,
                  Грузополучатель ВладелецТовара,
                  
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.Договор WHERE Вид=1
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_ЗаявкаНаПриход");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
