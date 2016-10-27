import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
import {stringAsSql} from "../../../core/SqlCore";
import {Субконто_Сотрудник} from "../../../common/Buhta";

export function init_table_Сотрудник(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Сотрудник")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Сотрудник AS
                SELECT
                  ${stringAsSql(Субконто_Сотрудник.type)} ТипСубконто,
                  Ключ,
                  Номер,
                  Название,
                  '['+Номер+']  '+Название as НомерНазвание,
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.[Сотрудник view]
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Сотрудник");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
