import {getDb} from "../core/getDb";
import {BuhtaTaskSceneState} from "../scenes/BuhtaTaskScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {ISubconto} from "../interfaces/ISubconto";
import {replaceAll} from "../core/replaceAll";
import {stringAsSql} from "../core/SqlCore";

export function executeGenProcedure(taskState:BuhtaTaskSceneState, spec:ITaskSpecConfig, subconto:ISubconto):Promise<string>{

/*
 ALTER PROCEDURE [dbo].[Генерация_Приемка_товара___Взять_паллету_в_задание](
 @задание int,
 @сотрудник int,
 @договорТип VARCHAR(3) = 'Нет',
 @договор int = 0,
 @откудаТип VARCHAR(3) = 'Нет',
 @откуда int = 0,
 @кудаТип VARCHAR(3) = 'Нет',
 @куда int = 0,
 @объектТип VARCHAR(3) = 'Нет',
 @объект int = 0,

 ["Задание", taskState.props.taskId],
 ["Сотрудник", taskState.props.userId],
 ["Время", "dbo.ДатаБезВремени(@date)"],


 */
    let task=taskState.props.taskConfig;

    let proc_name = "Генерация_" + replaceAll(task.taskName, " ", "_") + "___" + replaceAll(spec.taskSpecName, " ", "_");

    let sql=`
EXEC ${proc_name}
  @задание=${taskState.props.taskId},
  @сотрудник=${taskState.props.userId},
  @договорТип='Нет',
  @договор=0,
  @откудаТип=${stringAsSql(taskState.getActiveSourcePlace().type)},
  @откуда=${taskState.getActiveSourcePlace().id},
  @кудаТип=${stringAsSql(taskState.getActiveTargetPlace().type)},
  @куда=${taskState.getActiveTargetPlace().id},
  @объектТип=${stringAsSql(subconto.type)},
  @объект=${subconto.id}
`;

    return getDb().selectToString(sql);
}