import * as React from "react";
import {IBuhtaCoreSceneProps, BuhtaCoreSceneState, BuhtaCoreScene} from "./BuhtaCoreScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {BuhtaTaskSceneState} from "./BuhtaTaskScene";

import {Text} from "react-native";
import {getSubcontoFromFullBarcode} from "../wms/getSubcontoFromFullBarcode";
import {ISubconto} from "../interfaces/ISubconto";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН, СООБЩЕНИЕ_ОШИБКА,
    СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ
} from "../constants/messages";
import {IMessage} from "../interfaces/IMessage";
import {getInstantPromise} from "../core/getInstantPromise";
import Alert = __React.Alert;
import {navigatorView} from "../App";
import {Button, ListItem, Ripple} from "react-onsenui";

export interface IBuhtaTaskContextBarcoderSceneProps extends IBuhtaCoreSceneProps {
    taskState: BuhtaTaskSceneState;
    taskSpecConfig: ITaskSpecConfig;
    title: string;
}

export class BuhtaTaskContextBarcoderSceneState extends BuhtaCoreSceneState<IBuhtaTaskContextBarcoderSceneProps> {

}

export class BuhtaTaskContextBarcoderScene extends BuhtaCoreScene<IBuhtaTaskContextBarcoderSceneProps, BuhtaTaskContextBarcoderSceneState> {

    closingState: boolean;

    handleBarcodeReceived = (e: any) => {
        if (!this.closingState) {

            getSubcontoFromFullBarcode(e.data, [this.props.taskSpecConfig.objectSubcontoType.type])
                .then((subconto: ISubconto[])=> {
                    if (subconto.length === 0) {
                        runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
                        navigatorView.popPage();
                        return
                    }
                    else if (subconto.length > 1) {
                        runMessage(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ);
                        navigatorView.popPage();
                        return
                    }
                    else {

                        this.props.taskSpecConfig.generateTaskSpecAlgorithm("check", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                            .then((resultMessage: IMessage)=> {
                                if (resultMessage.isError === true) {
                                    runMessage(resultMessage);
                                    navigatorView.popPage();
                                    return;
                                }
                                else {
                                    this.props.taskSpecConfig.generateTaskSpecAlgorithm("run", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                                        .then((resultMessage: IMessage)=> {
                                            runMessage(resultMessage);
                                            navigatorView.popPage();
                                            return;
                                        })
                                        .catch((err)=> {
                                            alert(err);
                                            runMessage(СООБЩЕНИЕ_ОШИБКА);
                                        });
                                }
                            })
                            .catch((err)=> {
                                alert(err);
                                runMessage(СООБЩЕНИЕ_ОШИБКА);
                            });
                    }

                })
                .catch((error: any)=> {
                    alert(error);
                    runMessage(СООБЩЕНИЕ_ОШИБКА);
                });

            navigatorView.popPage();
            this.closingState = true;  // BarcodeScanner выдает несколько раз подряд одно и тоже значение, обрубаем
        }
    }

    handleVoiceButton = () => {
        navigator.vibrate(100);
        this.coreScene.openVoiceScanner(this.props.taskSpecConfig.contextMenuSceneVoiceTitle)
            .then((text: string) => {
                alert(text);
                // if (this.props.onGetVoiceText !== undefined)
                //     this.props.onGetVoiceText(text);
            });
    }

    handleInputButton = () => {
        navigator.vibrate(100);

    }

    onShake() {
        this.handleVoiceButton();
    }

    coreScene: BuhtaCoreScene<any,any>;

    render() {
        return (
            <BuhtaCoreScene
                ref={(e:any)=>{this.coreScene=e;}}
                title="Чтение штрих-кода"
            >
                <div style={{textAling:"center"}}>
                    <div>{this.props.title}</div>
                    <span>отсканируйте штрих-код</span>
                    <Button
                        style={{marginTop: 15}}
                        onClick={this.handleInputButton}
                    >
                        ввести номер
                    </Button>
                    <Button
                        style={{marginTop: 15}}
                        onClick={this.handleVoiceButton}
                    >
                        прочитать
                    </Button>
                </div>
            </BuhtaCoreScene>);
    }
}
