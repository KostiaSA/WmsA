import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
//import {registerSubconto} from "../../common/registerSubcontoType";



export function init_table_Ячейка(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Ячейка")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Ячейка AS
                SELECT
                  'CEL' ТипСубконто,
                  Ключ,
                  Номер,
                  Название,
                  'ячейка '+ Номер+' '+Название as НомерНазвание,
                  [Штрих-код],
                  --[Ярус]
                  Высота,
                  Ширина,
                  Глубина,
                  
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.скл_Ячейка
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Ячейка");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
