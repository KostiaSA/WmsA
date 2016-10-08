import {
    getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView, getIsExistsBuhtaProc,
    getIsExistsWmsProc
} from "../../core/MsSqlDb";
import {consoleError, consoleOk} from "../../core/console";

//import {registerSubconto} from "../../common/registerSubcontoType";
import {emitFieldList} from "../../core/emit";
import {ВидДокумента_НовыеПаллеты, Бухта_ЮрЛицо, ВидДокспец_НоваяПаллета} from "../../../common/Buhta";
//import {Бухта_ЮрЛицо, ВидДокумента_НовыеПаллеты, ВидДокспец_НоваяПаллета} from "../../common/Buhta";


export function перевод_паллет_в_новые_42150_42185(): Promise<void> {
    let create = "CREATE";


    let zadFields = [
        ["ДокументВид", ВидДокумента_НовыеПаллеты],
        ["Дата", "@дата"],
        ["[Кто создал]", "'node'"],
        ["[Когда создал]", "@время"],
        ["ЮрЛицо", Бухта_ЮрЛицо],
    ];

    let specFields = [
        ["ДокспецВид", ВидДокумента_НовыеПаллеты * 1000 + ВидДокспец_НоваяПаллета],
        ["Дата", "@дата"],
        ["Время", "@время"],
        ["Задание", "@новоеЗадание"],
        ["ДбСчет", "'НовыеПал'"],
        ["ДбОбъектТип", "'PAL'"],
        ["ДбОбъект", "Паллета.Ключ"],
        ["ДбКоличество", 1],
    ];

    let sql = `
    BEGIN TRAN
    
    DECLARE @время DATETIME=GETDATE()
    DECLARE @дата DATE=dbo.ДатаБезВремени(@время)

    INSERT Задание (${ emitFieldList(zadFields, "target")}) 
    SELECT ${ emitFieldList(zadFields, "source")}
    
    DECLARE @новоеЗадание INT=SCOPE_IDENTITY()

    INSERT ЗаданиеСпец (${ emitFieldList(specFields, "target")}) 
    SELECT ${ emitFieldList(specFields, "source")}
    FROM Паллета 
    WHERE 
      Паллета.Ключ BETWEEN 42150 AND 42185 AND 
      Паллета.Ключ NOT IN (SELECT Объект FROM Остаток WHERE ОбъектТип='PAL')

    COMMIT
            `;
    return executeWmsSql(sql)
        .then(()=> {
            consoleOk("перевод_паллет_в_новые_42150_42185");
        })
        .catch((err: any)=> {
            consoleError("перевод_паллет_в_новые_42150_42185", err);
        });

}
