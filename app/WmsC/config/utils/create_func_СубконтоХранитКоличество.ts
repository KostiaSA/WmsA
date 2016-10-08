import {getIsExistsWmsFunc, executeWmsSql} from "../../core/MsSqlDb";
import {consoleOk, consoleError} from "../../core/console";
//import {SubcontoList, ISubcontoType} from "../../common/registerSubcontoType";

export function create_func_СубконтоХранитКоличество(): Promise<void> {
    let create = "CREATE";

    return getIsExistsWmsFunc("СубконтоХранитКоличество")
        .then((isExists: boolean)=> {
            if (isExists === true)
                create = "ALTER";

            let sql = `
${create} FUNCTION СубконтоХранитКоличество(
  @SubcontoType VARCHAR(3),
  @SubcontoId INT
) 
RETURNS MONEY
AS
BEGIN
    IF (@SubcontoType='' OR @SubcontoType='Нет' OR @SubcontoId=0)
      RETURN 0;
    
    RETURN (SELECT SUM(Количество) FROM Остаток WHERE МестоТип=@SubcontoType AND Место=@SubcontoId)
END
           `;
            return executeWmsSql(sql);
        })
        .then(()=> {
            consoleOk("create_func_СубконтоХранитКоличество");
        })
        .catch((err: any)=> {
            consoleError("create_func_СубконтоХранитКоличество", err);
        });

}
