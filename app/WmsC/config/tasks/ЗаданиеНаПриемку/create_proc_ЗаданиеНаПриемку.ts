import {getIsExistsWmsProc, executeWmsSql} from "../../../core/MsSqlDb";
import {BuhtaDatabase} from "../../SqlConnections";
import {consoleOk, consoleError} from "../../../core/console";
import {emitFieldList} from "../../../core/emit";
import {ВидДокумента_ЗаданиеНаПриемку, Бухта_ЮрЛицо, ВидДокспец_ЗаданиеНаПриемТовара} from "../../../../common/Buhta";
import {stringAsSql} from "../../../../core/SqlCore";
import {Регистр_ЗаданиеНаПриемку} from "../../../../registers/Регистр_ЗаданиеНаПриемку";
//import {Бухта_ЮрЛицо, ВидДокумента_ЗаданиеНаПриемку, ВидДокспец_ЗаданиеНаПриемТовара} from "../../../common/Buhta";


// todo переделать с использованием процедуры генерации
export function create_proc_СоздатьЗаданиеНаПриемку(): Promise<void> {


    let create = "CREATE";

    return getIsExistsWmsProc("СоздатьЗаданиеНаПриемку")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let zadFields = [
                ["ДокументВид", ВидДокумента_ЗаданиеНаПриемку],
                //["Номер", "ЗаявкаНаПриход.Номер"],
                ["Дата", "@дата"],
                ["[Когда создал]", "@время"],
                ["ЮрЛицо", Бухта_ЮрЛицо],
                ["Договор", "@заявкаНаПриход"],
            ];

            let specFields = [
                ["ДокспецВид", ВидДокумента_ЗаданиеНаПриемку*1000+ВидДокспец_ЗаданиеНаПриемТовара],
                ["Дата", "@дата"],
                ["Время", "@время"],
                ["Задание", "@новоеЗадание"],
                ["ДбСчет", stringAsSql(Регистр_ЗаданиеНаПриемку.Счет)],
                ["ДбОбъектТип", "ЗаявкаНаПриходСпец.ТоварТип"],
                ["ДбОбъект", "ЗаявкаНаПриходСпец.Товар"],
                ["ДбДоговорПриходаТип", "'Нет'"],
                ["ДбДоговорПрихода", "0"],
                ["ДбЗаданиеТип", "'Док'"],
                ["ДбЗадание", "@новоеЗадание"],
                ["ДбКоличество", "ЗаявкаНаПриходСпец.Количество"],
            ];

            let sql = `
${create} PROCEDURE СоздатьЗаданиеНаПриемку(
  @заявкаНаПриход int
) AS
BEGIN
    DECLARE @время DATETIME=GETDATE()
    DECLARE @дата DATE=dbo.ДатаБезВремени(@время)

    INSERT Задание (${ emitFieldList(zadFields, "target")}) 
    SELECT ${ emitFieldList(zadFields, "source")}
    FROM ЗаявкаНаПриход 
    WHERE ЗаявкаНаПриход.Ключ=@заявкаНаПриход
    
    DECLARE @новоеЗадание INT=SCOPE_IDENTITY()

    INSERT ЗаданиеСпец (${ emitFieldList(specFields, "target")}) 
    SELECT ${ emitFieldList(specFields, "source")}
    FROM ЗаявкаНаПриходСпец 
    WHERE ЗаявкаНаПриходСпец.ЗаявкаНаПриход=@заявкаНаПриход
    
END
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("create_proc_СоздатьЗаданиеНаПриемку");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
