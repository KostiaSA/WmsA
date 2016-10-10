import * as _ from "lodash";
import * as React from "react";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {getDb} from "../core/getDb";
import {DataTable, DataRow} from "../core/SqlDb";
import {pushSpeak} from "../core/speak";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН,
    СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ,
    СООБЩЕНИЕ_ОШИБКА
} from "../constants/messages";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
import {throwError} from "../core/Error";
import {ICommand, getBestMatchCommand} from "../commander/commander";
import {ITaskConfig, ITaskSpecConfig} from "../config/Tasks";
import {getInstantPromise} from "../core/getInstantPromise";
import {stringAsSql} from "../core/SqlCore";
import {Button, ListItem, Ripple} from "react-onsenui";
import {IBuhtaTaskContextMenuSceneProps, BuhtaTaskContextMenuScene} from "./BuhtaTaskContextMenuScene";
import {IRoute} from "../interfaces/IRoute";
import {navigatorView, forcePopToTaskScene, forceUpdateAll} from "../App";
import {ISubcontoType} from "../common/registerSubcontoType";
import {ISubconto} from "../interfaces/ISubconto";
import {BuhtaTaskContextBarcoderScene} from "./BuhtaTaskContextBarcoderScene";
import {Регистр_ЗаданиеНаПриемку, Регистр_ПаллетаКудаВЗадании} from "../registers/Регистр_ЗаданиеНаПриемку";
import {executeGenProcedure} from "../wms/executeGenProcedure";

export interface IBuhtaTaskSceneProps extends IBuhtaCoreSceneProps {
    taskConfig: ITaskConfig;
    taskId: number;
    userId: number;
}

export interface ITaskSourceTargetPlaceState {
    type: string;
    id: number;
    name: string;
    kol: number;
}

export class BuhtaTaskSceneState extends BuhtaCoreSceneState<IBuhtaTaskSceneProps> {
    dogId: number;
    percent: number;
    sourcePlaces: ITaskSourceTargetPlaceState[] = [];
    targetPlaces: ITaskSourceTargetPlaceState[] = [];
    activeSourceId: string | undefined;
    activeTargetId: string | undefined;

    steps: TaskStep[] = [];


    isSourcePlacesStateOk(): boolean {
        if (this.props.taskConfig.sourcePlacesConfig === undefined)
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "none")
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "single" && this.sourcePlaces.length === 1)
            return true;
        if (this.props.taskConfig.sourcePlacesConfig.allowedCount === "multi" && this.sourcePlaces.length >= 1)
            return true;
        return false;
    }

    isTargetPlacesStateOk(): boolean {
        if (this.props.taskConfig.targetPlacesConfig === undefined)
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "none")
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "single" && this.targetPlaces.length === 1)
            return true;
        if (this.props.taskConfig.targetPlacesConfig.allowedCount === "multi" && this.targetPlaces.length >= 1)
            return true;
        return false;
    }

    handleContextMenu() {
        let sceneProps: IBuhtaTaskContextMenuSceneProps = {
            taskSceneState: this
        }

        let route: IRoute = {
            component: BuhtaTaskContextMenuScene,
            componentProps: sceneProps

        };
        console.log("navigatorView.pushPage");
        navigatorView.pushPage(route, {animation: "slide"});

    }

    handleVoiceText(voiceText: string) {

        let commandList: ICommand[] = [];

        commandList.push({
            words: "информация o паллетe",
            number: "REQ"
        })

        commandList.push({
            words: "информация o коробке",
            number: "REQ"
        })

        commandList.push({
            words: "информация o товаре",
            number: "REQ"
        })

        commandList.push({
            words: "информация по штрих коду",
            number: "REQ"
        })

        commandList.push({
            words: "новая палета",
            number: "NONREQ"
        })


        commandList.push({
            words: "палета",
            number: "REQ"
        })

        commandList.push({
            words: "товар",
            number: "REQ"
        })

        commandList.push({
            words: "коробка",
            number: "REQ"
        })

        getBestMatchCommand(commandList, voiceText);
    }

    getBarcoderAllowedSubcontoTypes(): string[] {
        let ret: string[] = [];

        if (this.props.taskConfig.sourcePlacesConfig !== undefined)
            ret = ret.concat(this.props.taskConfig.sourcePlacesConfig.allowedSubcontos.map((item: ISubcontoType)=>item.type));

        if (this.props.taskConfig.targetPlacesConfig !== undefined)
            ret = ret.concat(this.props.taskConfig.targetPlacesConfig.allowedSubcontos.map((item: ISubcontoType)=>item.type));

        ret = ret.concat(this.props.taskConfig.specConfig.map((item: ITaskSpecConfig)=>item.objectSubcontoType.type));
        return _.uniq(ret);
    }

    handleBarcodeScan(barcode: string): Promise<void> {

        return getSubcontoFromFullBarcode(barcode, this.getBarcoderAllowedSubcontoTypes())
            .then((subconto: ISubconto[])=> {
                if (subconto.length === 0) {
                    runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
                    return
                }
                else
                    return this.handleSubcontoScan(subconto);
            }).catch((error: any)=> {
                alert(error);
                runMessage(СООБЩЕНИЕ_ОШИБКА);
            });
    }


    handleSubcontoScan(subcontos: ISubconto[]): Promise<void> {

        for (let i = 0; i < subcontos.length; i++) {
            let subconto = subcontos[i];
            for (let j = 0; j < this.props.taskConfig.specConfig.length; j++) {
                let spec = this.props.taskConfig.specConfig[j];
                if (spec.autoByBarcoder === true && spec.objectSubcontoType.type === subconto.type) {
                    // нашли нужное действие, проверяем его на выполнимость (check) и выполняем (run)
                    return executeGenProcedure(this, spec, subconto)
                        .then((result: string)=> {

                            if (result === "Ok") {
                                runMessage(spec.genOkMessage);
                                //forcePopToTaskScene();
                                forceUpdateAll();
                            }
                            else {
                                runMessage({
                                    sound: "error.mp3",
                                    voice: result,
                                    toast: result
                                });
                            }
                        })
                        .catch((err)=> {
                            alert(err);
                            runMessage(СООБЩЕНИЕ_ОШИБКА);
                        });
                }
            }
        }

        // не нашли нужное действие
        runMessage({
            sound: "error.mp3",
            voice: "Штрих код не подходит",
            toast: "Штрих код не подходит"
        });
        return getInstantPromise<void>();

    }


    getEmptyPlaceState(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = {
            type: "Нет",
            id: 0,
            name: "",
            kol: 0
        };
        return ret;
    }

    getActiveSourcePlace(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = this.sourcePlaces.filter((item: ITaskSourceTargetPlaceState)=>item.type + item.id.toString() === this.activeSourceId)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    getActiveTargetPlace(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = this.targetPlaces.filter((item: ITaskSourceTargetPlaceState)=>item.type + item.id.toString() === this.activeTargetId)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    checkActiveTargetPlace() {
        if (this.targetPlaces.length > 0) {
            if (this.getActiveTargetPlace().type === "Нет") {
                this.activeTargetId = this.targetPlaces[0].type + this.targetPlaces[0].id;
            }
        }
        else
            this.activeTargetId = undefined;
    }

    handleTargetPlaceClick(placeIndex: number) {
        this.activeTargetId = this.targetPlaces[placeIndex].type + this.targetPlaces[placeIndex].id;
        this.scene.forceUpdate();
        pushSpeak("выбрана палета 5" + placeIndex + ".");
    }

    isStepsLoaded: boolean;


    loadAllInfoFromSql() {

        let sql = `
-- набор 0 шапка        
SELECT 
   Номер,
   Договор,
   ISNULL(
   (SELECT SUM(КрКоличество)*100.00 FROM ЗаданиеСпец WHERE Задание=${this.props.taskId} AND КрСчет=${stringAsSql(Регистр_ЗаданиеНаПриемку.Счет)})/
   (SELECT SUM(ДбКоличество)+0.00001 FROM ЗаданиеСпец WHERE Задание=${this.props.taskId} AND ДбСчет=${stringAsSql(Регистр_ЗаданиеНаПриемку.Счет)}),0) Процент     
FROM Задание 
WHERE Ключ=${this.props.taskId}    
        
-- набор 1 состав задания       
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
   dbo.СубконтоНазвание(МестоТип,Место) МестоНазвание,
   dbo.СубконтоНазвание(ОбъектТип,Объект) ОбъектНазвание
FROM Остаток
WHERE 
   Счет=${stringAsSql(Регистр_ЗаданиеНаПриемку.Счет)} AND
   ЗаданиеТип='Док' AND Задание=${this.props.taskId} AND
   ((СотрудникТип='Чел' AND Сотрудник=${this.props.userId}) OR (СотрудникТип='Нет') )
     
-- набор 2 targets        
SELECT 
   ОбъектТип,
   Объект,
   dbo.СубконтоНазвание(ОбъектТип,Объект) ОбъектНазвание,
   dbo.СубконтоХранитКоличество(ОбъектТип,Объект) Количество
FROM Остаток
WHERE 
   Счет=${stringAsSql(Регистр_ПаллетаКудаВЗадании.Счет)} AND
   ЗаданиеТип='Док' AND Задание=${this.props.taskId}
ORDER BY Порядок         
    `;

        getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {

                if (tables[0].rows.length === 0) //  не найдено
                    throwError("не найдено задание с ключом " + this.props.taskId);

                // набор 0 шапка
                let taskRow = tables[0].rows[0];
                this.dogId = taskRow.value("Договор");
                this.percent = taskRow.value("Процент");

                // набор 1 состав задания
                this.steps = [];
                tables[1].rows.forEach((row: DataRow)=> {
                    let step = new TaskStep_Приемка();
                    step.objectName = row.value("ОбъектНазвание");
                    step.kol = row.value("Количество");
                    this.steps.push(step);
                }, this);

                // набор 2 - targetPlaces
                this.targetPlaces = [];
                tables[2].rows.forEach((row: DataRow, index: number)=> {
                    let target: ITaskSourceTargetPlaceState = {
                        type: row.value("ОбъектТип"),
                        id: row.value("Объект"),
                        name: row.value("ОбъектНазвание"),
                        kol: row.value("Количество")
                    };
                    this.targetPlaces.push(target);
                }, this);
                this.checkActiveTargetPlace();

                this.isStepsLoaded = true;
                if (this.isMounted)
                    this.scene.forceUpdate();
            })
            .catch((err: any)=> {
                alert(err);
                runMessage(СООБЩЕНИЕ_ОШИБКА);
            });
    }
}

export class TaskStep {
    isCompleted: boolean;
    objectType: string;
    objectId: number;
    objectName: string;
    fromPlaceType: string;
    fromPlaceId: number;
    fromPlaceName: number;
    intoPlaceType: string;
    intoPlaceId: number;
    intoPlaceName: number;
    kol: number;

    renderIncompleteStep(): JSX.Element {
        return <div> ошибка render </div>;
    }
}

export class TaskStep_Приемка extends TaskStep {


    renderIncompleteStep(): JSX.Element {
        return (
            <table className="task-step" style={{borderBottom:"1px solid silver"}}>
                <tbody>
                <tr>
                    <td>
                        <span className="task-step-caption">опер.</span>
                    </td>
                    <td>
                        <span className="task-step-value" style={{color: "coral"}}>приемка товара</span>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="task-step-caption">товар</span>
                    </td>
                    <td onClick={()=>{navigator.vibrate(100);}}>
                        <span className="task-step-value" style={{ color:"slategray"}}>{this.objectName}</span>
                        <Ripple background="lightgray"/>
                    </td>
                </tr>
                <tr>
                    <td>
                        <span className="task-step-caption">кол.</span>
                    </td>
                    <td>
                        <span className="task-step-value" style={{ color:"royalblue"}}>{this.kol} шт.</span>
                    </td>
                </tr>
                </tbody>
            </table>
        );
    }

}

export class BuhtaTaskScene extends BuhtaCoreScene<IBuhtaTaskSceneProps, BuhtaTaskSceneState> {


    constructor(props: IBuhtaTaskSceneProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaTaskSceneState(props, this);
    }

    reloadScene() {
        this.state.loadAllInfoFromSql();
        super.reloadScene();
    }

    componentDidMount() {
        super.componentDidMount();
        this.state.loadAllInfoFromSql();
    };


    renderTaskHeader(): JSX.Element {
        if (!this.state.isStepsLoaded)
            return <div>загрузка...</div>
        else
            return (
                <div>
                    <table>
                        <tbody>
                        <tr>
                            <td>
                                задание N
                            </td>
                            <td>
                                {this.props.taskId}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                тип
                            </td>
                            <td>
                                {this.props.taskConfig.taskName}
                            </td>
                        </tr>
                        <tr>
                            <td>
                                выполнено
                            </td>
                            <td>
                                {this.state.percent.toFixed(0)}%
                            </td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            )
    }

    renderIncompleteSteps(): JSX.Element {

        let steps = this.state.steps.map((step: TaskStep, index: number)=> {
            return (
                <div key={index}>
                    {step.renderIncompleteStep()}
                </div>

            )
        });

        let stepsCount =<span> (пусто)</span>;
        if (this.state.steps.length > 0)
            stepsCount =<span> ({this.state.steps.length} поз.)</span>;

        if (this.state.isStepsLoaded)
            return (
                <div>
                    <div className="task-steps-title">
                        <span>{this.props.taskConfig.stepsTitle.toUpperCase()}{stepsCount}</span>
                    </div>
                    {steps}
                </div>
            );
        else
            return (
                <div>
                    <div className="task-steps-title">
                        <span>{this.props.taskConfig.stepsTitle.toUpperCase()}{stepsCount}</span>
                    </div>
                    <span> загрузка... </span>
                </div>
            );

    }

    handlePressContext = (spec: ITaskSpecConfig)=> {

        let sceneProps = {
            title: spec.contextMenuSceneTitle,
            taskState: this.state,
            taskSpecConfig: spec
        }

        let route: IRoute = {
            component: BuhtaTaskContextBarcoderScene,
            componentProps: sceneProps,
        };
        navigatorView.pushPage(route);
    }


    renderTargets = (): JSX.Element | null => {
        //return <div>renderTargets</div>;
        let ret: JSX.Element[] = [];

        if (!this.state.isStepsLoaded)
            return (
                <tr>
                    <td>
                        <span>загрузка...</span>
                    </td>
                </tr>
            );

        if (this.state.targetPlaces.length === 0) {
            if (this.props.taskConfig.targetPlacesConfig === undefined || this.props.taskConfig.targetPlacesConfig.allowedCount === "none") {
                return null;
            }
            else {

                let buttons: JSX.Element[] = [];

                this.props.taskConfig.targetPlacesConfig.placesNotReadyTaskSpecs.forEach((taskSpec: ITaskSpecConfig, index: number)=> {
                    buttons.push(
                        <Button
                            key={index}
                            style={{marginTop: 5}}
                            onClick={()=>{navigator.vibrate(100); this.handlePressContext(taskSpec)}}
                        >
                            {taskSpec.taskSpecName}
                        </Button>
                    );
                }, this);

                ret.push(
                    <tr key="0">
                        <td>
                            <div style={{textAlign: "center"}}>
                                <div
                                    className="target-places-not-ready-text"
                                >{this.props.taskConfig.targetPlacesConfig.placesNotReadyText}
                                </div>
                                {buttons}
                            </div>
                        </td>
                    </tr>
                );
            }
        }
        else {
            this.state.targetPlaces.forEach((target: ITaskSourceTargetPlaceState, index: number)=> {

                // let iconColor = "transparent";
                // if (target.isActive === true)
                //     iconColor = "green";

                let targetKolStr = "  (пустая)";
                if (target.kol > 0)
                    targetKolStr = "  (" + target.kol + " мест.)";

                let active =<img src="img/tick.png" height="20" width="20"/>;
                if (target.type + target.id.toString() !== this.state.activeTargetId)
                    active = <div></div>;

                ret.push(
                    <tr key={index}
                        onTouchEnd={()=>{this.state.handleTargetPlaceClick(index); navigator.vibrate(100);}}>
                        <td> {active}</td>
                        <td><img src="img/pallete.png"/></td>
                        <td style={{paddingLeft: 5}}>{target.name}{targetKolStr}</td>
                    </tr>

                    // ret.push(
                    //     <div iconRight key={index} button onPress={()=>{this.state.handleTargetPlaceClick(index)}}>
                    //         <span>
                    //             <img src="img/pallete.png" />  {target.name}{targetKolStr}
                    //         </span>
                    //         {active}
                    //     </div>

                );
            }, this);
        }

        return (
            <div>
                <div className="task-steps-title">
                    <span>{this.props.taskConfig.targetPlacesConfig!.title.toUpperCase()}</span>
                </div>
                <table className="task-targets">
                    <tbody>{ret}</tbody>
                </table>
            </div>
        );
    }

    onShake() {
        this.coreScene.handleShake();
    }

    onHardBarcode(barcode: string, type: string) {
        this.coreScene.handleHardBarcode(barcode, type);
    }

    coreScene: BuhtaCoreScene<any,any>;

    render() {
        console.log("render TaskScene");
        return (
            <BuhtaCoreScene
                ref={(e:any)=>{this.coreScene=e;}}
                title={"Задание "+this.props.taskId}
                onGetBarcode={(barcode: string, type: string)=>{ this.state.handleBarcodeScan(barcode);}}
                onGetVoiceText={( text: string)=>{ this.state.handleVoiceText(text); }}
                onContextMenu={()=>{ this.state.handleContextMenu(); }}
            >
                {this.renderTaskHeader()}
                {this.renderTargets()}
                {this.renderIncompleteSteps()}
            </BuhtaCoreScene>);
    }
}
