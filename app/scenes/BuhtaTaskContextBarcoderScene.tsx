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
import {navigatorView, forceUpdateAll, forcePopToTaskScene} from "../App";
import {Button, Icon, ListItem, Ripple} from "react-onsenui";
import {getDevice} from "../core/device";
import {getDeveloperMode} from "../core/developerMode";

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
                        //navigatorView.popPage();
                        //return
                    }
                    else if (subconto.length > 1) {
                        runMessage(СООБЩЕНИЕ_НАЙДЕНО_НЕСКОЛЬКО_ШТРИХ_КОДОВ);
                        //navigatorView.popPage();
                        //return
                    }
                    else {

                        this.props.taskSpecConfig.generateTaskSpecAlgorithm("check", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                            .then((resultMessage: IMessage)=> {
                                if (resultMessage.isError === true) {
                                    runMessage(resultMessage);
                                    //navigatorView.popPage();
                                    //return;
                                }
                                else {
                                    this.props.taskSpecConfig.generateTaskSpecAlgorithm("run", this.props.taskState, this.props.taskSpecConfig, subconto[0])
                                        .then((resultMessage: IMessage)=> {
                                            runMessage(resultMessage);
                                            forcePopToTaskScene();
                                            forceUpdateAll();
                                            //navigatorView.popPage();
                                            //return;
                                        })
                                        .catch((err)=> {
                                            alert(err);
                                            runMessage(СООБЩЕНИЕ_ОШИБКА);
                                            //navigatorView.popPage();
                                            //return;
                                        });
                                }
                            })
                            .catch((err)=> {
                                alert(err);
                                runMessage(СООБЩЕНИЕ_ОШИБКА);
                                //navigatorView.popPage();
                                //return;
                            });
                    }

                })
                .catch((error: any)=> {
                    alert(error);
                    //runMessage(СООБЩЕНИЕ_ОШИБКА);
                    //return;
                });

            //navigatorView.popPage();
            this.closingState = true;  // BarcodeScanner выдает несколько раз подряд одно и тоже значение, обрубаем
            navigatorView.popPage();
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

    handleDeveloperButton = () => {
        navigator.vibrate(100);
        this.coreScene.openDeveloperScanner()
            .then((result: {barcode: string,type: string}) => {
                this.handleBarcodeReceived({data:result.barcode})
            });
    }

    handleCameraButton = () => {
        navigator.vibrate(100);
        (cordova.plugins as any).barcodeScanner.scan(
            (result: {text: string,format: string,cancelled: any})=> {
                this.handleBarcodeReceived({data:result.text})
            },
            (error: any) => {
                //reject(error.toString());
            },
            {
                // "preferFrontCamera" : true, // iOS and Android
                //  "showFlipCameraButton" : true, // iOS and Android
                "prompt": "Отсканируйте штрих-код",
                // "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                "orientation": "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
            });
    }

    handleInputButton = () => {
        navigator.vibrate(100);

    }

    onShake() {
        this.handleVoiceButton();
    }

    coreScene: BuhtaCoreScene<any,any>;

    renderCameraButton(): JSX.Element | null {
        if (getDevice().barcode==="camera")
            return (
                <div>
                    <Button
                        style={{marginTop: 15}}
                        onClick={this.handleCameraButton}
                    >
                        <i className="fa fa-camera" style={{fontSize: 20}}></i>
                        <span style={{marginLeft: 15}}>сканировать с камеры</span>
                    </Button>
                </div>
            )
        else
            return null;
    }

    renderDeveloperButton(): JSX.Element | null {
        if (getDeveloperMode())
            return (
                <div>
                    <Button
                        style={{marginTop: 25}}
                        onClick={this.handleDeveloperButton}
                    >
                        <i className="fa fa-bug" style={{fontSize: 20}}></i>
                        <span style={{marginLeft: 15}}>список кодов</span>
                    </Button>
                </div>
            )
        else
            return null;
    }

    renderVoiceButton(): JSX.Element | null {
        if (getDevice().voice)
            return (
                <div>
                    <Button
                        style={{marginTop: 25}}
                        onClick={this.handleVoiceButton}
                    >
                        <i className="fa fa-microphone" style={{fontSize: 20}}></i>
                        <span style={{marginLeft: 15}}>продиктовать</span>
                    </Button>
                </div>
            )
        else
            return null;
    }

    renderTitle(): JSX.Element | null {
        if (getDevice().barcode !== "camera")
            return (
                <div style={{marginTop: 25, fontSize:20, fontWeight:"bold"}}>отсканируйте штрих-код</div>
            )
        else
            return null;
    }

    render() {
        return (
            <BuhtaCoreScene
                ref={(e:any)=>{this.coreScene=e;}}
                title="Чтение штрих-кода"
            >
                {this.renderTitle()}

                <div style={{textAlign:"center"}}>
                    {this.renderCameraButton()}
                    <div>
                        <Button
                            style={{marginTop: 25}}
                            onClick={this.handleInputButton}
                        >
                            <i className="fa fa-keyboard-o" style={{fontSize: 22}}></i>
                            <span style={{marginLeft: 15}}>ввести с клавиатуры</span>

                        </Button>
                    </div>
                    {this.renderVoiceButton()}
                    {this.renderDeveloperButton()}
                </div>
            </BuhtaCoreScene>);
    }
}
