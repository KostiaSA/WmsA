import * as React from "react";
//import {Container, Button, Icon, Header, Title, Content} from "native-base";

import {stringAsSql} from "../core/SqlCore";
import {getDb} from "../core/getDb";
import {DataTable} from "../core/SqlDb";
import {Button, Page, BackButton, Toolbar, ToolbarButton, Dialog, Icon} from "react-onsenui";
//import BarcodeScannerView from "react-native-barcodescanner";
//import {getNavigatorNoTransition} from "../core/getNavigatorNoTransition";

//import Voice from 'react-native-voice';
import {throwError} from "../core/Error";
import {ITaskConfig} from "../config/Tasks";
import {NavigatorView} from "onsenui";
import {navigatorView} from "../App";
import {getInstantPromise} from "../core/getInstantPromise";
import {speechRecognition} from "../core/speechRecognition";
import {showToast} from "../core/toast";
import {getDevice} from "../core/device";
import {getDeveloperMode, developerModeBarcodes, IDeveloperModeBarcode} from "../core/developerMode";

//let voice = Voice as any;

export interface IBuhtaCoreSceneProps extends React.ClassAttributes<any> {
    title?: string;
    backIcon?: string;
    onGetBarcode?: (barcode: string, type: string)=>void;
    onGetVoiceText?: (text: string)=>void;
    onContextMenu?: ()=>void;
    modifier?: any;
}

export class BuhtaCoreSceneState<TProps extends IBuhtaCoreSceneProps> {
    constructor(props: TProps, scene: any) {
        this.props = props;
        this.scene = scene;
        this.barcodeButtonVisible = _.isFunction(props.onGetBarcode) && getDevice().barcode === "camera";
        this.voiceButtonVisible = _.isFunction(props.onGetVoiceText) && getDevice().voice;
        this.contextMenuButtonVisible = _.isFunction(props.onContextMenu);
    }

    isMounted: boolean;
    scene: any;
    props: TProps;
    barcodeButtonVisible: boolean;
    voiceButtonVisible: boolean;
    contextMenuButtonVisible: boolean;

    isVoiceDialogShown: boolean;
    voiceDialogTitle: string | undefined;

    isDeveloperDialogShown: boolean;

    scannedBarcode: string;
    scannedBarcodeType: string;
    scannedSubcontoType: string;
    scannedSubcontoId: number;

    scannedVoiceText: string;

    findSubcontoByBarcode(): Promise<void> {
        let sql = `EXEC ПолучитьСубконтоПоШтрихКоду ${stringAsSql(this.scannedBarcode)}`;
        return getDb().executeSQL(sql)
            .then((tables: DataTable[])=> {
                let row = tables[0].rows[0];
                this.scannedSubcontoType = row["СубконтоТип"];
                this.scannedSubcontoId = row["Субконто"];
                return;
            });
    }

    clearScannedBarcode() {
        this.scannedBarcode = "";
        this.scannedSubcontoType = "Нет";
        this.scannedSubcontoId = 0;
    }

}

export class BuhtaCoreScene<TProps extends IBuhtaCoreSceneProps,TState extends BuhtaCoreSceneState<any>> extends React.Component<TProps,TState> { //implements Route{
    constructor(props: TProps, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
        this.state = new BuhtaCoreSceneState<any>(props, this) as any;
    }

    handleBarcodeButtonPress = () => {
        navigator.vibrate(100);
        this.openCameraScanner()
            .then((result: {barcode: string,type: string})=> {
                if (this.props.onGetBarcode !== undefined)
                    this.props.onGetBarcode(result.barcode, result.type);
            });
    }

    handleDeveloperButtonPress = () => {
        navigator.vibrate(100);
        this.openDeveloperScanner()
            .then((result: {barcode: string,type: string})=> {
                if (this.props.onGetBarcode !== undefined)
                    this.props.onGetBarcode(result.barcode, result.type);
            });
    }

    handleVoiceButtonPress = () => {
        navigator.vibrate(100);
        this.openVoiceScanner()
            .then((text: string) => {
                if (this.props.onGetVoiceText !== undefined)
                    this.props.onGetVoiceText(text);
            });
    }

    handleContextMenuButtonPress = () => {
        navigator.vibrate(100);
        if (this.props.onContextMenu !== undefined)
            this.props.onContextMenu();
    }

    onShake() {
        // не удалять
    }

    handleShake() {
        if (_.isFunction(this.props.onGetVoiceText)) {
            navigator.vibrate(100);
            this.handleVoiceButtonPress();
        }
    }

    developerScannerResolve: (obj?: {barcode: string,type: string}) => void;
    developerScannerReject: (error: string) => void;

    openDeveloperScanner(): Promise<{barcode: string,type: string}> {
        return new Promise<{barcode: string,type: string}>(
            (resolve: (obj?: {barcode: string,type: string}) => void, reject: (error: string) => void) => {
                this.developerScannerResolve = resolve;
                this.developerScannerReject = reject;
                this.state.isDeveloperDialogShown = true;
                this.forceUpdate();
            });
    }

    openCameraScanner(): Promise<{barcode: string,type: string}> {
        return new Promise<{barcode: string,type: string}>(
            (resolve: (obj?: {barcode: string,type: string}) => void, reject: (error: string) => void) => {

                (cordova.plugins as any).barcodeScanner.scan(
                    (result: {text: string,format: string,cancelled: any})=> {
                        resolve({barcode: result.text, type: result.format})
                    },
                    (error: any) => {
                        reject(error.toString());
                    },
                    {
                        // "preferFrontCamera" : true, // iOS and Android
                        //  "showFlipCameraButton" : true, // iOS and Android
                        "prompt": "Отсканируйте штрих-код",
                        // "formats" : "QR_CODE,PDF_417", // default: all but PDF_417 and RSS_EXPANDED
                        "orientation": "portrait" // Android only (portrait|landscape), default unset so it rotates with the device
                    });
            });
    }

    openVoiceScanner(title?: string): Promise<string> {
        this.state.voiceDialogTitle = title;
        this.state.isVoiceDialogShown = true;
        this.forceUpdate();
        return speechRecognition()
            .then((text: string)=> {
                this.state.isVoiceDialogShown = false;
                this.forceUpdate();
                showToast(text);
                return text;
            })
            .catch((err: string)=> {
                this.state.isVoiceDialogShown = false;
                this.forceUpdate();
            });

    }

    renderBarcodeButton(): JSX.Element | null {
        if (this.state.barcodeButtonVisible)
            return (
                <ToolbarButton onClick={this.handleBarcodeButtonPress}>
                    <i className="fa fa-camera"></i>
                </ToolbarButton>
            );
        //     return (
        //         <Button transparent onPress={this.handleBarcodeButtonPress}>
        //             <Icon style={{fontSize: 18, color: "white"}} name="barcode"/>
        //         </Button>
        //     );
        else
            return null;
    }

    renderDeveloperButton(): JSX.Element | null {
        if (this.state.barcodeButtonVisible)
            return (
                <ToolbarButton onClick={this.handleDeveloperButtonPress}>
                    <i className="fa fa-bug"></i>
                </ToolbarButton>
            );
        //     return (
        //         <Button transparent onPress={this.handleBarcodeButtonPress}>
        //             <Icon style={{fontSize: 18, color: "white"}} name="barcode"/>
        //         </Button>
        //     );
        else
            return null;
    }

    renderVoiceButton(): JSX.Element | null {
        if (this.state.voiceButtonVisible) {

            return (
                <ToolbarButton onClick={this.handleVoiceButtonPress}>
                    <i className="fa fa-microphone"></i>
                </ToolbarButton>
            );
        }
        //     return (
        //         <Button transparent onPress={this.handleVoiceButtonPress}>
        //             <Icon style={{fontSize: 18, color: "white"}} name="microphone"/>
        //         </Button>
        //     );
        else
            return null;
    }

    renderContextMenuButton(): JSX.Element | null {
        if (this.state.contextMenuButtonVisible)
            return (
                <ToolbarButton onClick={this.handleContextMenuButtonPress}>
                    <i className="fa fa-bars"></i>
                </ToolbarButton>
            );
        else
            return null;
    }

    navigatorAnimationIsDone: boolean;

    componentDidMount() {
        this.state.isMounted = true;
        // InteractionManager.runAfterInteractions(() => {
        //     this.navigatorAnimationIsDone = true;
        //     this.forceUpdate();
        // });
    }

    // renderContent(): JSX.Element {
    //     return <div>**content**</div>;
    //     // if (this.navigatorAnimationIsDone === true) {
    //     //     return (
    //     //         <Content>
    //     //             {this.props.children}
    //     //         </Content>
    //     //     );
    //     // }
    //     // else
    //     //     return (
    //     //         <Content>
    //     //         </Content>
    //     //     );
    // }


    renderToolbar = (): JSX.Element => {
        return (
            <Toolbar modifier={this.props.modifier}>
                <div className="left">
                    <BackButton modifier={this.props.modifier}>Back</BackButton>
                </div>
                <div className="center">{this.props.title}</div>
                <div className="right">
                    {this.renderDeveloperButton()}
                    {this.renderBarcodeButton()}
                    {this.renderVoiceButton()}
                    {this.renderContextMenuButton()}
                </div>
            </Toolbar>
        );
    }

    renderDeveloperDialog(): JSX.Element | null {

        let renderBarcodes = (): JSX.Element[]=> {
            return developerModeBarcodes.map((barcode: IDeveloperModeBarcode, index: number)=> {
                return (
                    <Button key={index} modifier="outline" onClick={()=>{
                        this.state.isDeveloperDialogShown=false;
                        this.forceUpdate();
                        this.developerScannerResolve({barcode: barcode.barcode,type: barcode.type.type});
                  }}>
                        {barcode.type.type}: {barcode.barcode}
                    </Button>
                );
            }, this);
        }

        if (!getDeveloperMode())
            return null;
        else {
            return (
                <Dialog
                    isOpen={this.state.isDeveloperDialogShown===true}
                    isCancelable={true}
                    onCancel={()=>{
                        this.state.isDeveloperDialogShown=false;
                        this.forceUpdate();
                        this.developerScannerReject("");
                      }}>
                    <div style={{textAlign: 'center', margin: '20px'}}>
                        {renderBarcodes()}
                    </div>
                </Dialog>
            );
        }
    }


    render(): JSX.Element {
        return (
            <Page renderToolbar={this.renderToolbar}>
                {this.props.children}

                <Dialog
                    isOpen={this.state.isVoiceDialogShown===true}
                    isCancelable={true}
                    onCancel={()=>{this.state.isVoiceDialogShown=false}}>
                    <div style={{textAlign: 'center', margin: '20px'}}>
                        <Icon icon="microphone" size={40}> </Icon>
                        <p>{this.state.voiceDialogTitle || "Произнесите команду"}</p>
                        <p>
                            <Button onClick={()=>{this.state.isVoiceDialogShown=false;this.forceUpdate()}}>
                                отмена
                            </Button>
                        </p>
                    </div>
                </Dialog>

                {this.renderDeveloperDialog()}
            </Page>
        );
    }

    // render(): JSX.Element {
    //     return <div>**core scene**</div>;
    //     // return (
    //     //     <Container theme={themeBuhtaMain}>
    //     //         <Header>
    //     //             <Button transparent
    //     //                     onPress={() => {this.navigatorAnimationIsDone = false; this.props.navigator.pop()}}>
    //     //                 <Icon style={{fontSize: 18, color: "white"}} name={this.props.backIcon || "chevron-left"}/>
    //     //             </Button>
    //     //
    //     //             <Title>{this.props.title}</Title>
    //     //
    //     //             {this.renderBarcodeButton()}
    //     //             {this.renderVoiceButton()}
    //     //             {this.renderContextMenuButton()}
    //     //
    //     //         </Header>
    //     //         {this.renderContent()}
    //     //     </Container>
    //     // );
    // }

// <View style={{flex: 1, flexDirection: 'column'}}>
// <Header>
//     <Button transparent onPress={() => this.props.navigator.pop()}>
//         <Icon name='ios-power'/>
//     </Button>
//
//     <Title>
//         <Text>
//             {this.props.title}
//         </Text>
//     </Title>
//
//     <Button transparent onPress={()=>{}}>
//         <Icon name='ios-menu'/>
//     </Button>
// </Header> <Text style={{ fontSize: 20 }}>
// </Text>
// {this.props.children}
// </View>

}

// export interface IBuhtaBarcodeScannerSceneProps extends IBuhtaCoreSceneProps {
//     onBarcodeScanned: (barcode: string, type: string)=>void;
// }
//
// export class IBuhtaBarcodeScannerSceneState extends BuhtaCoreSceneState<IBuhtaBarcodeScannerSceneProps> {
//
// }
//
// export class BuhtaBarcodeScannerScene extends BuhtaCoreScene<IBuhtaBarcodeScannerSceneProps, IBuhtaBarcodeScannerSceneState> {
//
//     closingState: boolean;
//
//     handleBarcodeReceived = (e: any) => {
//         if (!this.closingState) {
//             this.props.onBarcodeScanned(e.data, e.type);
//             //this.props.navigator.pop();
//             navigatorView.popPage();
//             this.closingState = true;  // BarcodeScanner выдает несколько раз подряд одно и тоже значение, обрубаем
//         }
//     }
//
//     render() {
//         return <div>**BuhtaBarcodeScannerScene**</div>;
//         // let BarcodeScanner = BarcodeScannerView as any;
//         // return (
//         //     <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
//         //         <BarcodeScanner
//         //             onBarCodeRead={this.handleBarcodeReceived}
//         //             showViewFinder={true}
//         //             viewFinderShowLoadingIndicator={false}
//         //             style={{ height:400 }}
//         //             torchMode={'off'}
//         //             cameraType={'back'}
//         //         />
//         //     </BuhtaCoreScene>);
//     }
// }

// export interface IBuhtaVoiceScannerSceneProps extends IBuhtaCoreSceneProps {
//     onVoiceScanned: (text: string)=>void;
// }
//
// export class IBuhtaVoiceScannerSceneState extends BuhtaCoreSceneState<IBuhtaVoiceScannerSceneProps> {
//
// }
//
// export class BuhtaVoiceScannerScene extends BuhtaCoreScene<IBuhtaVoiceScannerSceneProps, IBuhtaVoiceScannerSceneState> {
//
//
//     componentDidMount() {
//         super.componentDidMount();
//
//         // voice.onSpeechError = (e: any)=> {
//         //     console.log(e);
//         //     throw e;
//         // };
//         //
//         // voice.onSpeechResults = (e: any)=> {
//         //     console.log(e);
//         //     let text = e.value[0];
//         //     if (!this.closingState) {
//         //         this.props.onVoiceScanned(e.value[0]);
//         //         this.props.navigator.pop();
//         //         this.closingState = true;
//         //     }
//         // };
//         //
//         // voice.onSpeechPartialResults = (e: any)=> {
//         //     console.log(e);
//         //     let text = e.value[0];
//         //     if (text.toString().length > 0) {
//         //         this.partialText = text;
//         //         this.forceUpdate();
//         //     }
//         // };
//         //
//         // const error = voice.start('ru');
//         // if (error) {
//         //     throw error;
//         // }
//
//     };
//
//     partialText: string = "Говорите...";
//
//     closingState: boolean;
//
//     render() {
//         return <div>**BuhtaVoiceScannerScene**</div>;
//         // return (
//         //     <BuhtaCoreScene navigator={this.props.navigator} title="Чтение штрих-кода">
//         //         <Text>{this.partialText}</Text>
//         //     </BuhtaCoreScene>);
//     }
// }
