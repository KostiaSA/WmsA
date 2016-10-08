import {getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";

export function init_table_ЗаданиеСпец(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("ЗаданиеСпец")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW ЗаданиеСпец AS
                SELECT
                   Ключ, 
                   Дата,
                   Вид as ДокспецВид, 
                   Документ as Задание,
                   _wms_Сотрудник as Сотрудник,
                   _wms_Время as Время,
                   
                   Счет КрСчет,
                   [Тип субконто 1] КрМестоТип,
                   [Субконто 1] КрМесто,
                   [Тип субконто 2] КрОбъектТип,
                   [Субконто 2] КрОбъект,
                   [Тип субконто 3] КрДоговорПриходаТип,
                   [Субконто 3] КрДоговорПрихода,
                   [Тип субконто 4] КрЗаданиеТип,
                   [Субконто 4] КрЗадание,
                   [Тип субконто 5] КрСотрудникТип,
                   [Субконто 5] КрСотрудник,
                   Количество КрКоличество,
                   
                   [Корр.Счет] ДбСчет,
                   [Корр.Тип субконто 1] ДбМестоТип,
                   [Корр.Субконто 1] ДбМесто,
                   [Корр.Тип субконто 2] ДбОбъектТип,
                   [Корр.Субконто 2] ДбОбъект,
                   [Корр.Тип субконто 3] ДбДоговорПриходаТип,
                   [Корр.Субконто 3] ДбДоговорПрихода,
                   [Корр.Тип субконто 4] ДбЗаданиеТип,
                   [Корр.Субконто 4] ДбЗадание,
                   [Корр.Тип субконто 5] ДбСотрудникТип,
                   [Корр.Субконто 5] ДбСотрудник,
                   [Количество 2] ДбКоличество,
                   
                   0 as fake
                FROM [${BuhtaDatabase}].dbo.Докспец
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_ЗаданиеСпец");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
