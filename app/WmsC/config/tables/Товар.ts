import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
//import {registerSubconto} from "../../common/registerSubcontoType";



export function init_table_Товар(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Товар")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Товар AS
                SELECT
                  'ТМЦ' ТипСубконто,
                  Ключ,
                  Номер,
                  Название,
                  '['+Номер+']  '+Название as НомерНазвание,
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.ТМЦ
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Товар");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
