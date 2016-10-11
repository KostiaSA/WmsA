import * as React from "react";
import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaMainMenuScene} from "./BuhtaMainMenuScene";
import {BuhtaTaskScene, IBuhtaTaskSceneProps} from "./BuhtaTaskScene";
import * as CryptoJS from "crypto-js";
import {pushSpeak} from "../core/speak";
import {runMessage} from "../core/runMessage";
import {
    СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН, СООБЩЕНИЕ_НЕВЕРНЫЙ_ПАРОЛЬ,
    СООБЩЕНИЕ_НЕ_ВЫБРАНА_ПАЛЛЕТА_КУДА_ПРИНИМАТЬ_ТОВАР
} from "../constants/messages";

import {Button, Page, BackButton, Toolbar} from "react-onsenui";
import {getDb} from "../core/getDb";
import {navigatorView} from "../App";
import {IRoute} from "../interfaces/IRoute";
import {playAudio} from "../core/playAudio";
import {Задание_ПриемкаТовара} from "../tasks/Задание_ПриемкаТовара";

export interface IBuhtaLoginSceneProps extends IBuhtaCoreSceneProps {

}

export class BuhtaLoginSceneState extends BuhtaCoreSceneState<IBuhtaLoginSceneProps> {

}

export class BuhtaLoginScene extends BuhtaCoreScene<IBuhtaLoginSceneProps, BuhtaLoginSceneState> {

    constructor(props: IBuhtaLoginSceneProps, context: any) {
        super(props, context);
        this.state = new BuhtaLoginSceneState(props, this);
    }

    // createState(): BuhtaLoginSceneState {
    //     console.log("createState()-login");
    //     return new BuhtaLoginSceneState();
    // }

    handleOkButtonPress = ()=> {
        // let mainMenuRoute: Route = {component: BuhtaMainMenuScene};//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
        // this.props.navigator.push(mainMenuRoute);
    }

    handleTestTaskButtonPress = ()=> {
        navigator.vibrate(100);
        getDb().selectToNumber("SELECT Ключ FROM Задание where Договор=169494").then((docId:number)=>{
            let sceneProps: IBuhtaTaskSceneProps = {
                taskId: docId,
                userId: 1,
                taskConfig: Задание_ПриемкаТовара
            }


            let mainMenuRoute: IRoute = {
                component: BuhtaTaskScene,
                componentProps: sceneProps
            };//, sceneConfig:Navigator.SceneConfigs.FadeAndroid};
            navigatorView.pushPage(mainMenuRoute, {animation: "slide"});

        });

    }

    handleTestEncrypt = ()=> {
        // let str = crypto.AES.encrypt("жопа17Не выбрана палета, куда принимать товар", "0987654321").toString();
        // console.log(str);
        // let str1 = crypto.AES.decrypt(str, "0987654321=").toString(crypto.enc.Utf8);
        // ;
        // console.log(str1);
    }

    handleTestSound = ()=> {
        console.log("/android_asset/www/sound/ok.mp3");
        playAudio("/android_asset/www/sound/ok.mp3");

        //runMessage(СООБЩЕНИЕ_ШТРИХ_КОД_НЕ_НАЙДЕН);
       // runMessage(СООБЩЕНИЕ_НЕВЕРНЫЙ_ПАРОЛЬ);
        //
        // var Sound = require('react-native-sound') as any;
        //
        // var whoosh = new Sound('error.mp3', Sound.MAIN_BUNDLE, (error: any) => {
        //     if (error) {
        //         console.log('failed to load the sound', error);
        //     } else { // loaded successfully
        //         whoosh.play();
        //         setTimeout(()=> {
        //             pushSpeak("ошибка. штрих код не найден.");
        //         }, 800);
        //         //console.log('duration in seconds: ' + whoosh.getDuration() +
        //         //  'number of channels: ' + whoosh.getNumberOfChannels());
        //     }
        // });
        //
        // // whoosh.setVolume(1);
        // //
        // // whoosh.play((success: boolean) => {
        // //     if (success) {
        // //         console.log('successfully finished playing');
        // //     } else {
        // //         console.log('playback failed due to audio decoding errors');
        // //     }
        // // });
    }

    handleTestHttp = ()=> {
//        console.log("handleTestHttp");
        alert("handleTestHttp");
        let cordovaHTTP = (window as any)["cordovaHTTP"];
        cordovaHTTP.post(
            "http://google.com/",
            {
                id: 12,
                message: "test"
            },
            {Authorization: "OAuth2: token"},
            (response: any) => {
                // prints 200
                console.log(response.status);
                try {
                    response.data = JSON.parse(response.data);
                    alert(response.data);
                    // prints test
                    console.log(response.data.message);
                } catch (e) {
                    console.error("JSON parsing error");
                }
            },
            (response: any)=> {
                // prints 403
                console.log(response.status);

                //prints Permission denied
                console.log(response.error);
                alert(response.error);
            });

        // let str = crypto.AES.encrypt("жопа17Не выбрана палета, куда принимать товар", "0987654321").toString();
        // console.log(str);
        // let str1 = crypto.AES.decrypt(str, "0987654321=").toString(crypto.enc.Utf8);
        // ;
        // console.log(str1);
    }


    handleTestSQL = ()=> {
        getDb().executeSQL("select 12345")
            .then((res)=> {
                console.log(res);
            })
            .catch((err)=> {
                console.log(err);
            });
    }

    render() {
        console.log("render BuhtaScene");
        return (
            <BuhtaCoreScene title="БУХта WMS" backIcon="sign-in">
                <div style={{ fontSize: 20 }}>
                    Войдите в систему!!
                </div>
                <Button onClick={this.handleOkButtonPress}>Войти</Button>
                <Button onClick={this.handleTestTaskButtonPress}>Тест task-task-task</Button>
                <Button onClick={this.handleTestEncrypt}>Тест encrypt</Button>
                <Button onClick={this.handleTestSound}>Тест sound</Button>
                <br/>
                <Button onClick={this.handleTestHttp}>Тест http</Button>
                <Button onClick={this.handleTestSQL}>Тест SQL1345</Button>

            </BuhtaCoreScene>);
    }
}
