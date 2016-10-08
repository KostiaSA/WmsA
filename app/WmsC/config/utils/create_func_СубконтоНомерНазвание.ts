import {getIsExistsWmsFunc, executeWmsSql} from "../../core/MsSqlDb";
import {consoleOk, consoleError} from "../../core/console";
import {ISubcontoType, SubcontoList} from "../../../common/registerSubcontoType";
//import {SubcontoList, ISubcontoType} from "../../common/registerSubcontoType";

export function create_func_СубконтоНомерНазвание(fieldName: string): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsFunc("Субконто" + fieldName)
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let subcontoSql: string[] = [];
            subcontoSql = SubcontoList.map((sub: ISubcontoType)=> {
                return `    IF @SubcontoType = '${sub.type}' SET @RETURN = (SELECT [${fieldName}] FROM [${sub.tableName}] WHERE Ключ=@SubcontoId) ELSE`;
            });


            let sql = `
${create} FUNCTION Субконто${fieldName}(
  @SubcontoType VARCHAR(3),
  @SubcontoId INT
) 
RETURNS VARCHAR(MAX)
AS
BEGIN
    IF (@SubcontoType='' OR @SubcontoType='Нет' OR @SubcontoId=0)
      RETURN ''
    DECLARE @RETURN VARCHAR(MAX)
${subcontoSql.join("\n")}
    SET @RETURN = 'Неизвестный тип субконто "'+@SubcontoType+'"'
    RETURN @RETURN
END
           `;
            return executeWmsSql(sql);
        })
        .then(()=> {
            consoleOk("create_func_Субконто" + fieldName);
        })
        .catch((err: any)=> {
            consoleError(err);
        });

}
