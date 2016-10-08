import {
    getIsExistsBuhtaView, executeWmsSql, getIsExistsWmsView, getIsExistsBuhtaTable,
    executeBuhtaSql, getIsExistsWmsTrigger, getIsExistsBuhtaTrigger, getIsExistsBuhtaProc, getIsExistsWmsProc
} from "../../core/MsSqlDb";
import {consoleError, consoleOk, consoleLog} from "../../core/console";
import {BuhtaDatabase} from "../SqlConnections";
import {emitFieldList, emitFieldList_forWhereSql} from "../../core/emit";


export function create_table_Остаток(): Promise<void> {

    return getIsExistsBuhtaTable("_wms_Остаток")
        .then((isExists: boolean)=> {
            if (isExists !== true) {

                let sql = `
CREATE TABLE _wms_Остаток ( 
   Счет VARCHAR(10) DEFAULT(''),
   МестоТип VARCHAR(3) DEFAULT(''),
   Место INT DEFAULT(0),
   ОбъектТип VARCHAR(3) DEFAULT(''),
   Объект INT DEFAULT(0),
   ДоговорПриходаТип VARCHAR(3) DEFAULT(''),
   ДоговорПрихода INT DEFAULT(0),
   ЗаданиеТип VARCHAR(3) DEFAULT(''),
   Задание INT DEFAULT(0),
   СотрудникТип VARCHAR(3) DEFAULT(''),
   Сотрудник INT DEFAULT(0),
   Количество MONEY DEFAULT(0),
   Порядок INT IDENTITY(1,1) NOT NULL
)
                
CREATE UNIQUE CLUSTERED INDEX [_wms_Остаток_PRIMARY_KEY] ON [dbo].[_wms_Остаток](
	[ОбъектТип] ASC,
	[Объект] ASC,
	[МестоТип] ASC,
	[Место] ASC,
	[Счет] ASC,
	[ЗаданиеТип] ASC,
	[Задание] ASC,
	[СотрудникТип] ASC,
	[Сотрудник] ASC,
	[ДоговорПриходаТип] ASC,
	[ДоговорПрихода] ASC
)

CREATE NONCLUSTERED INDEX [_wms_Остаток_Задание_Объект] ON [dbo].[_wms_Остаток](
	[ЗаданиеТип] ASC,
	[Задание] ASC,
	[ОбъектТип] ASC,
	[Объект] ASC
)
INCLUDE (
    [Счет],
	[МестоТип],
	[Место],
	[ДоговорПриходаТип],
	[ДоговорПрихода],
	[СотрудникТип],
	[Сотрудник],
	[Количество],
	[Порядок]
)
	
CREATE NONCLUSTERED INDEX [_wms_Остаток_Место_Объект_и_тд] ON [dbo].[_wms_Остаток](
	[МестоТип] ASC,
	[Место] ASC,
	[ОбъектТип] ASC,
	[Объект] ASC
)
INCLUDE ( 	
    [Счет],
	[ДоговорПриходаТип],
	[ДоговорПрихода],
	[ЗаданиеТип],
	[Задание],
	[СотрудникТип],
	[Сотрудник],
	[Количество],
	[Порядок]
) 
                
            `;

                return executeBuhtaSql(sql);
            }
            else {
                consoleLog("create_table_wms_Остаток: таблица " + BuhtaDatabase + ".._wms_Остаток уже существует");
                return;
            }

        })
        .then(()=> {
            consoleOk("create_table_wms_Остаток");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}

export function init_table_Остаток(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsView("Остаток")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
                ${create} VIEW Остаток AS
                SELECT
                   Счет,
                   МестоТип,
                   Место,
                   ОбъектТип,
                   Объект,
                   ДоговорПриходаТип,
                   ДоговорПрихода,
                   ЗаданиеТип,
                   Задание,
                   СотрудникТип,
                   Сотрудник,
                   Количество,
                   Порядок
                FROM [${BuhtaDatabase}].dbo._wms_Остаток
            `;

            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("init_table_Остаток");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}

export function create_trigger_Докспец_wms_Остаток(): Promise<void> {
    let create = "CREATE";

    return getIsExistsBuhtaTrigger("_Докспец_wms_Остаток")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let dbFields = [
                ["@счет", "[Корр.Счет]"],
                ["@местоТип", "[Корр.Тип субконто 1]"],
                ["@место", "[Корр.Субконто 1]"],
                ["@объектТип", "[Корр.Тип субконто 2]"],
                ["@объект", "[Корр.Субконто 2]"],
                ["@договорПриходаТип", "[Корр.Тип субконто 3]"],
                ["@договорПрихода", "[Корр.Субконто 3]"],
                ["@заданиеТип", "[Корр.Тип субконто 4]"],
                ["@задание", "[Корр.Субконто 4]"],
                ["@сотрудникТип", "[Корр.Тип субконто 5]"],
                ["@сотрудник", "[Корр.Субконто 5]"],
                ["@количество", "[Количество 2]"],
            ];

            let krFields = [
                ["@счет", "[Счет]"],
                ["@местоТип", "[Тип субконто 1]"],
                ["@место", "[Субконто 1]"],
                ["@объектТип", "[Тип субконто 2]"],
                ["@объект", "[Субконто 2]"],
                ["@договорПриходаТип", "[Тип субконто 3]"],
                ["@договорПрихода", "[Субконто 3]"],
                ["@заданиеТип", "[Тип субконто 4]"],
                ["@задание", "[Субконто 4]"],
                ["@сотрудникТип", "[Тип субконто 5]"],
                ["@сотрудник", "[Субконто 5]"],
                ["@количество", "[Количество]"],
            ];

            let ostatokFields = [
                ["@счет", "Счет"],
                ["@местоТип", "МестоТип"],
                ["@место", "Место"],
                ["@объектТип", "ОбъектТип"],
                ["@объект", "Объект"],
                ["@договорПриходаТип", "ДоговорПриходаТип"],
                ["@договорПрихода", "ДоговорПрихода"],
                ["@заданиеТип", "ЗаданиеТип"],
                ["@задание", "Задание"],
                ["@сотрудникТип", "СотрудникТип"],
                ["@сотрудник", "Сотрудник"],
            ];


            let checkNegativeKolSql=`
    SELECT @kol_for_check=Количество FROM _wms_Остаток WHERE ${ emitFieldList_forWhereSql(ostatokFields)}
    IF @kol_for_check=0
      DELETE FROM _wms_Остаток WHERE ${ emitFieldList_forWhereSql(ostatokFields)}
      
    IF @kol_for_check<0
    BEGIN
      ROLLBACK TRANSACTION
      SET @msg = 'WMS: отрицательное количество'+CHAR(13)
      SET @msg = @msg+'  объект: '+dbo.[Субконто.Тип Номер и название](@объектТип,@объект,'')
      SET @msg = @msg+'  место : '+dbo.[Субконто.Тип Номер и название](@местоТип,@место,'')
      RAISERROR(@msg, 16, 1)
      RETURN
    END
            `


            let sql = `
${create} TRIGGER _Докспец_wms_Остаток ON Докспец
FOR INSERT,UPDATE,DELETE
AS
BEGIN
  DECLARE @msg VARCHAR(MAX)
  
  IF EXISTS(SELECT '*' FROM DELETED WHERE _wms_Время>0)
  BEGIN
    ROLLBACK TRANSACTION
    SET @msg = 'запрещено удаление и изменение Докспец с WMS-заданиями'
    RAISERROR(@msg, 16, 1)
    RETURN
  END

  DECLARE @счет VARCHAR(10)
  DECLARE @местоТип VARCHAR(3)
  DECLARE @место INT
  DECLARE @объектТип VARCHAR(3)
  DECLARE @объект INT
  DECLARE @договорПриходаТип VARCHAR(3)
  DECLARE @договорПрихода INT
  DECLARE @заданиеТип VARCHAR(3)
  DECLARE @задание INT
  DECLARE @сотрудникТип VARCHAR(3)
  DECLARE @сотрудник INT
  DECLARE @количество MONEY
  
  DECLARE @kol_for_check MONEY
  
  DECLARE dbCurs CURSOR LOCAL STATIC FOR
  SELECT ${ emitFieldList(dbFields, "source")} FROM INSERTED WHERE _wms_Время>0 
  OPEN DbCurs
  FETCH NEXT FROM DbCurs INTO ${ emitFieldList(dbFields, "target")}
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF EXISTS(SELECT '*' FROM _wms_Остаток WHERE ${ emitFieldList_forWhereSql(ostatokFields)})
      UPDATE _wms_Остаток SET Количество=Количество+@количество WHERE ${ emitFieldList_forWhereSql(ostatokFields)}
    ELSE
      INSERT _wms_Остаток(${ emitFieldList(ostatokFields, "source")},количество) VALUES(${ emitFieldList(dbFields, "target")})
  
    ${checkNegativeKolSql}
  
    FETCH NEXT FROM DbCurs INTO ${ emitFieldList(dbFields, "target")}
  END
  
  DECLARE krCurs CURSOR LOCAL STATIC FOR
  SELECT ${ emitFieldList(krFields, "source")} FROM INSERTED WHERE _wms_Время>0 
  OPEN KrCurs
  FETCH NEXT FROM KrCurs INTO ${ emitFieldList(krFields, "target")}
  WHILE @@FETCH_STATUS = 0
  BEGIN
    IF EXISTS(SELECT '*' FROM _wms_Остаток WHERE ${ emitFieldList_forWhereSql(ostatokFields)})
      UPDATE _wms_Остаток SET Количество=Количество-@количество WHERE ${ emitFieldList_forWhereSql(ostatokFields)}
    ELSE
      INSERT _wms_Остаток(${ emitFieldList(ostatokFields, "source")},количество) VALUES(${ emitFieldList(krFields.filter((field:string[])=>field[0]!=="@количество"), "target")},-@количество)
  
    ${checkNegativeKolSql}
  
    FETCH NEXT FROM KrCurs INTO ${ emitFieldList(krFields, "target")}
  END
  
END
            `;

            return executeBuhtaSql(sql);

        })
        .then(()=> {
            consoleOk("create_trigger_Докспец_wms_Остаток");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}

export function create_proc_Пересоставить_Остаток(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsProc("Пересоставить_Остаток")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let dbFields = [
                ["счет", "ДбСчет"],
                ["местоТип", "ДбМестоТип"],
                ["место", "ДбМесто"],
                ["объектТип", "ДбОбъектТип"],
                ["объект", "ДбОбъект"],
                ["договорПриходаТип", "ДбДоговорПриходаТип"],
                ["договорПрихода", "ДбДоговорПрихода"],
                ["заданиеТип", "ДбЗаданиеТип"],
                ["задание", "ДбЗадание"],
                ["сотрудникТип", "ДбСотрудникТип"],
                ["сотрудник", "ДбСотрудник"],
                //["@количество", "[Количество 2]"],
            ];

            let krFields = [
                ["счет", "КрСчет"],
                ["местоТип", "КрМестоТип"],
                ["место", "КрМесто"],
                ["объектТип", "КрОбъектТип"],
                ["объект", "КрОбъект"],
                ["договорПриходаТип", "КрДоговорПриходаТип"],
                ["договорПрихода", "КрДоговорПрихода"],
                ["заданиеТип", "КрЗаданиеТип"],
                ["задание", "КрЗадание"],
                ["сотрудникТип", "КрСотрудникТип"],
                ["сотрудник", "КрСотрудник"],
                //["@количество", "[Количество]"],
            ];

            let sql = `
${create} PROCEDURE Пересоставить_Остаток
AS
BEGIN
  BEGIN TRAN
  
  DELETE FROM Остаток
  
  INSERT Остаток(${ emitFieldList(dbFields, "target")},количество)
  SELECT ${ emitFieldList(dbFields, "source")}, SUM(ДбКоличество) FROM (
    SELECT ${ emitFieldList(dbFields, "source")},ДбКоличество FROM ЗаданиеСпец WHERE Время>0  
    UNION ALL SELECT ${ emitFieldList(dbFields, "source")},-КрКоличество FROM ЗаданиеСпец WHERE Время>0
  ) E 
  GROUP BY ${ emitFieldList(dbFields, "source")}
  HAVING SUM(ДбКоличество)<>0
  
  COMMIT
END   
            `;
            return executeWmsSql(sql);

        })
        .then(()=> {
            consoleOk("create_proc_Пересоставить_Остаток");
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
