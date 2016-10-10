import {
    getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView, getIsExistsBuhtaProc,
    getIsExistsWmsProc
} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
//import {registerSubconto} from "../../common/registerSubcontoType";
import {emitFieldList} from "../../core/emit";
import {
    ВидДокумента_НовыеПаллеты, ВидДокспец_НоваяПаллета, Бухта_ЮрЛицо,
    Субконто_Паллета
} from "../../../common/Buhta";
import {stringAsSql} from "../../../core/SqlCore";
//import {Бухта_ЮрЛицо, ВидДокумента_НовыеПаллеты, ВидДокспец_НоваяПаллета} from "../../common/Buhta";


export function init_table_Паллета(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Паллета")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Паллета AS
                SELECT
                  ${stringAsSql(Субконто_Паллета.type)} ТипСубконто,
                  Ключ,
                  Ключ as Номер,
                  'Паллета '+LTRIM(STR(Ключ)) as Название,
                  'Паллета '+LTRIM(STR(Ключ)) as НомерНазвание,
                  Глубина,
                  Ширина,
                  Высота,                 
                  
                  0 as fake 
                FROM [${BuhtaDatabase}].dbo.скл_Паллета
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Паллета");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}

export function create_proc_Перевод_свободных_паллет_в_новые(): Promise<void> {
    let create = "CREATE";


    return getIsExistsWmsProc("Перевод_свободных_паллет_в_новые")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let zadFields = [
                ["ДокументВид", ВидДокумента_НовыеПаллеты],
                ["Дата", "@дата"],
                ["[Кто создал]", "'node'"],
                ["[Когда создал]", "@время"],
                ["ЮрЛицо", Бухта_ЮрЛицо],
            ];

            let specFields = [
                ["ДокспецВид", ВидДокумента_НовыеПаллеты*1000+ВидДокспец_НоваяПаллета],
                ["Дата", "@дата"],
                ["Время", "@время"],
                ["Задание", "@новоеЗадание"],
                ["ДбСчет", "'НовыеПал'"],
                ["ДбОбъектТип", "'PAL'"],
                ["ДбОбъект", "Паллета.Ключ"],
                ["ДбКоличество", 1],
            ];

            let sql = `
${create} PROCEDURE Перевод_свободных_паллет_в_новые
AS
BEGIN
    BEGIN TRAN
    
    DECLARE @время DATETIME=GETDATE()
    DECLARE @дата DATE=dbo.ДатаБезВремени(@время)

    INSERT Задание (${ emitFieldList(zadFields, "target")}) 
    SELECT ${ emitFieldList(zadFields, "source")}
    
    DECLARE @новоеЗадание INT=SCOPE_IDENTITY()

    INSERT ЗаданиеСпец (${ emitFieldList(specFields, "target")}) 
    SELECT ${ emitFieldList(specFields, "source")}
    FROM Паллета 
    WHERE Паллета.Ключ NOT IN
      (SELECT Объект FROM Остаток WHERE ОбъектТип='PAL')

    COMMIT
END   
            `;
            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("create_proc_Перевод_свободных_паллет_в_новые");
        })
        .catch((err: any)=> {
            consoleError("create_proc_Перевод_свободных_паллет_в_новые", err);
        });

}
