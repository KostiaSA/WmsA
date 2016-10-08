import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
//import {registerSubconto} from "../../common/registerSubcontoType";


export function init_table_Задание(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Задание")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Задание AS
                SELECT
                  Ключ,
                  Вид as ДокументВид, 
                  Договор, 
                  LTRIM(STR(Ключ)) as Номер,
                  'Задание '+LTRIM(STR(Ключ)) as Название,
                  'Задание '+LTRIM(STR(Ключ)) as НомерНазвание,
                  Дата,
                  [Кто создал],
                  [Когда создал],
                  [Юр.лицо] ЮрЛицо,
                  Ответственный,
                  Текст,
                  
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.Документ
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Задание");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
