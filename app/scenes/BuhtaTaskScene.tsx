import * as _ from "lodash";

import * as React from "react";


import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {getDb} from "../core/getDb";
import {DataTable, DataRow} from "../core/SqlDb";


import {pushSpeak} from "../core/speak";
import {ISubconto} from "../interfaces/ISubconto";

import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР,
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР,
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН,
    СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ,
    СООБЩЕНИЕ_ОШИБКА
} from "../constants/messages";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
//import {IGenerateTaskSpecContext, GenerateTaskSpecCheckResult} from "../interfaces/IGenerateTaskSpecContext";
import {throwError} from "../core/Error";
import {ICommand, getBestMatchCommand} from "../commander/commander";
import {ITaskConfig, ITaskSpecConfig} from "../config/Tasks";
//import {BuhtaTaskContextMenuScene, IBuhtaTaskContextMenuSceneProps} from "./BuhtaTaskContextMenuScene";

import {getInstantPromise} from "../core/getInstantPromise";
import {IMessage} from "../interfaces/IMessage";
import {stringAsSql} from "../core/SqlCore";
import {РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ, РЕГИСТР_ЗАДАНИЕ_НА_ПРИЕМКУ} from "../constants/registers";
import {List, ListItem} from "react-onsenui";


//let Text = Text_ as any;

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
    isActive: boolean;
}

export class BuhtaTaskSceneState extends BuhtaCoreSceneState<IBuhtaTaskSceneProps> {
    // scene: BuhtaTaskScene;
    // props: IBuhtaTaskSceneProps;
    dogId: number;
    sourcePlaces: ITaskSourceTargetPlaceState[] = [];
    targetPlaces: ITaskSourceTargetPlaceState[] = [];

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
        // let sceneProps: IBuhtaTaskContextMenuSceneProps = {
        //     navigator: this.props.navigator,
        //     taskSceneState: this
        // }
        //
        // let route: Route = {
        //     component: BuhtaTaskContextMenuScene,
        //     passProps: sceneProps,
        //     sceneConfig: getNavigatorNoTransition(),
        //
        // };//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        // this.props.navigator.push(route);

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
            ret = ret.concat(this.props.taskConfig.sourcePlacesConfig.allowedSubcontos);

        if (this.props.taskConfig.targetPlacesConfig !== undefined)
            ret = ret.concat(this.props.taskConfig.targetPlacesConfig.allowedSubcontos);

        ret = ret.concat(this.props.taskConfig.specConfig.map((item: ITaskSpecConfig)=>item.objectSubcontoType));
        //alert(ret.join("+"));
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
                if (spec.autoByBarcoder === true && spec.objectSubcontoType === subconto.type) {
                    // нашли нужное действие, проверяем его на выполнимость (check) и выполняем (run)
                    return spec.generateTaskSpecAlgorithm("check", this, spec, subconto)
                        .then((resultMessage: IMessage)=> {
                            if (resultMessage.isError === true) {
                                runMessage(resultMessage);
                                return getInstantPromise<void>();
                            }
                            else {
                                return spec.generateTaskSpecAlgorithm("run", this, spec, subconto)
                                    .then((resultMessage: IMessage)=> {
                                        runMessage(resultMessage);
                                        return;
                                    });

                            }
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

    // handleSubcontoScan_old(subconto: ISubconto[]): Promise<void> {
    //     return new Promise<void>(
    //         (resolve: () => void, reject: (error: string) => void) => {
    //
    //             if (!this.isSourcePlacesStateOk()) {
    //                 runMessage(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР);
    //                 reject(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_ОТКУДА_БРАТЬ_ТОВАР.toast!);
    //             }
    //             if (!this.isTargetPlacesStateOk()) {
    //                 runMessage(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР);
    //                 reject(СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР.toast!);
    //             }
    //
    //             // если source отсутствует (приемка), то требуется полное совпадение штрих-кода
    //             if (this.props.taskConfig.sourcePlacesConfig === undefined || this.props.taskConfig.sourcePlacesConfig.allowedCount === "none") {
    //                 if (subconto.length > 1) {
    //                     runMessage(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ);
    //                     reject(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ.toast!);
    //                 }
    //             }
    //
    //
    //             let context: IGenerateTaskSpecContext = {
    //                 runMode: "проверка",
    //                 taskId: this.props.taskId,
    //                 userId: this.props.userId,
    //                 sourceType: this.getActiveSourcePlace().type,
    //                 sourceId: this.getActiveSourcePlace().id,
    //                 targetType: this.getActiveTargetPlace().type,
    //                 targetId: this.getActiveTargetPlace().id,
    //                 objectType: subconto[0].type,
    //                 objectId: subconto[0].id,
    //                 prihodDogId: this.dogId
    //             }
    //
    //             // проверяем на корректность
    //             // this.props.taskConfig.generateTaskSpecAlgorithm(context)
    //             //     .then((checkResult: GenerateTaskSpecCheckResult)=> {
    //             //         if (checkResult === "ok") {
    //             //             context.runMode = "проведение";
    //             //             this.props.taskConfig.generateTaskSpecAlgorithm(context).then((checkResult: GenerateTaskSpecCheckResult) => {
    //             //                 if (checkResult === "ok")
    //             //                     resolve();
    //             //                 else
    //             //                     throw checkResult;
    //             //
    //             //             });
    //             //         }
    //             //         else {
    //             //             runMessage({
    //             //                 sound: "error.mp3",
    //             //                 voice: checkResult,
    //             //                 toast: checkResult,
    //             //             });
    //             //             resolve();
    //             //         }
    //             //     })
    //             //     .catch((error: any)=> {
    //             //         reject(error);
    //             //     });
    //
    //
    //         });
    //
    //
    // }

    getEmptyPlaceState(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = {
            type: "Нет",
            id: 0,
            name: "",
            kol: 0,
            isActive: true
        };
        return ret;
    }

    getActiveSourcePlace(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = this.sourcePlaces.filter((item: ITaskSourceTargetPlaceState)=>item.isActive)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    getActiveTargetPlace(): ITaskSourceTargetPlaceState {
        let ret: ITaskSourceTargetPlaceState = this.targetPlaces.filter((item: ITaskSourceTargetPlaceState)=>item.isActive)[0];
        if (ret === undefined)
            return this.getEmptyPlaceState();
        else
            return ret;
    }

    handleTargetPlaceClick(placeIndex: number) {
        pushSpeak("выбрана палета 12" + placeIndex + ".");
        //alert(placeIndex);
    }

    isStepsLoaded: boolean;


    loadAllInfoFromSql() {

        let sql = `
-- набор 0 шапка        
SELECT 
   Номер,
   Договор     
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
   Счет=${stringAsSql(РЕГИСТР_ЗАДАНИЕ_НА_ПРИЕМКУ)} AND
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
   Счет=${stringAsSql(РЕГИСТР_ПАЛЛЕТА_В_ЗАДАНИИ)} AND
   ЗаданиеТип='Док' AND Задание=${this.props.taskId}      
    `;

        getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {

                if (tables[0].rows.length === 0) //  не найдено
                    throwError("не найдено задание с ключом " + this.props.taskId);

                // набор 0 шапка
                let taskRow = tables[0].rows[0];
                this.dogId = taskRow.value("Договор");

                // набор 1 состав задания
                this.steps = [];
                tables[1].rows.forEach((row: DataRow)=> {
                    let step = new TaskStep_Приемка();
                    step.objectName = row.value("ОбъектНазвание");
                    step.kol = row.value("Количество");
                    this.steps.push(step);
                }, this);

                // набор 2 targets
                let old_active = this.targetPlaces.filter((item: ITaskSourceTargetPlaceState)=>item.isActive)[0];
                let old_active_id = -1;
                if (old_active !== undefined)
                    old_active_id = old_active.id;

                this.targetPlaces = [];
                tables[2].rows.forEach((row: DataRow, index: number)=> {
                    let target: ITaskSourceTargetPlaceState = {
                        type: row.value("ОбъектТип"),
                        id: row.value("Объект"),
                        name: row.value("ОбъектНазвание"),
                        kol: row.value("Количество"),
                        isActive: (old_active_id === -1 && index === 0) || (old_active_id === index)
                    };
                    this.targetPlaces.push(target);
                }, this);

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
                    <td>
                        <span className="task-step-value" style={{ color:"slategray"}}>{this.objectName}</span>
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
            </table>
        );
        //return <div>TaskStep_Приемка </div>;
        // return (
        //     <View>
        //         <View>
        //             <Grid>
        //                 <Col style={firstColStyle}>
        //                     <Text style={captionStyle}>опер.</Text>
        //                 </Col>
        //                 <Col>
        //                     <Text style={actionStyle}>приемка товара</Text>
        //                 </Col>
        //             </Grid>
        //         </View>
        //         <View>
        //             <Grid>
        //                 <Col style={firstColStyle}>
        //                     <TouchableNativeFeedback onPress={(()=>{pushSpeak(this.objectName)}).bind(this)}>
        //                         <View>
        //                             <Text style={captionStyle}>товар</Text>
        //                         </View>
        //                     </TouchableNativeFeedback>
        //                 </Col>
        //                 <Col>
        //                     <Text style={{ color:"slategray", lineHeight:16}}>{this.objectName}</Text>
        //                 </Col>
        //             </Grid>
        //         </View>
        //         <View>
        //             <Grid>
        //                 <Col style={firstColStyle}>
        //                     <Text style={captionStyle}>кол-во</Text>
        //                 </Col>
        //                 <Col>
        //                     <Text style={{ color:"royalblue"}}>{this.kol} шт.</Text>
        //                 </Col>
        //             </Grid>
        //         </View>
        //     </View>
        //);
    }

}

export class BuhtaTaskScene extends BuhtaCoreScene<IBuhtaTaskSceneProps, BuhtaTaskSceneState> {


    constructor(props: IBuhtaTaskSceneProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaTaskSceneState(props, this);

        // this.state.targetPlaces[0] = {
        //     type: "PAL",
        //     id: 101,
        //     name: "Паллета 00101",
        //     isActive: true
        // };

    }

    componentDidMount() {
        super.componentDidMount();
        this.state.loadAllInfoFromSql();
    };


    renderTaskHeader(): JSX.Element {
        return (
            <div> Шапка задания {this.props.taskId} </div>
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



    renderTargets = (): JSX.Element | null => {
        //return <div>renderTargets</div>;
        let ret: JSX.Element[] = [];

        if (!this.state.isStepsLoaded)
            return (
                <div iconRight button onPress={()=>{this.state.handleTargetPlaceClick(0)}}>
                    <span>загрузка...</span>
                </div>
            );

        if (this.state.targetPlaces.length === 0) {
            if (this.props.taskConfig.targetPlacesConfig === undefined || this.props.taskConfig.targetPlacesConfig.allowedCount === "none") {
                return null;
            }
            else {
                ret.push(
                    <div iconRight button onPress={()=>{this.state.handleTargetPlaceClick(0)}}>
                        <span>{this.props.taskConfig.targetPlacesConfig.placesNotReadyText}</span>
                        <img name="bullseye" style={{fontSize: 20, color: "red"}}/>
                    </div>
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

                let active=<img src="img/tick.png" height="20" width="20"/>;
                if (target.isActive !== true)
                    active = <div></div>;

                ret.push(
                    <div iconRight key={index} button onPress={()=>{this.state.handleTargetPlaceClick(index)}}>
                        <span>
                            <img src="img/pallete.png" />  {target.name}{targetKolStr}
                        </span>
                        {active}
                    </div>

                );
            }, this);
        }

        return (
            <div>
                <div className="task-steps-title">
                    <span>{this.props.taskConfig.targetPlacesConfig!.title.toUpperCase()}</span>
                </div>
                {ret}
            </div>
        );
    }

    render() {
        console.log("render TaskScene");
        return (
            <BuhtaCoreScene
                navigator={this.props.navigator}
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
