import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Page, BackButton, Toolbar} from "react-onsenui";

import {TestList1} from "./TestList1";
import {navigatorView} from "../App";

export class TestLogin extends React.Component<any,any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }


    handleVoiceButtonPress = () => {
        navigatorView.pushPage({title:<div>жопа 222</div>, component: TestList1}, {animation: "slide"})

        //alert("111");
        //
        // this.openVoiceScanner(this.props.navigator)
        //     .then((text: string) => {
        //         if (this.props.onGetVoiceText !== undefined)
        //             this.props.onGetVoiceText(text);
        //     });
    }

    renderToolbar = (): JSX.Element => {
        return (
            <Toolbar modifier={this.props.modifier}>
                <div className="left"><BackButton modifier={this.props.modifier}>Back</BackButton></div>
                <div className="center">{this.props.title}</div>
            </Toolbar>
        );
    }


    render(): JSX.Element {
        return (
            <Page renderToolbar={this.renderToolbar}>
                <Button onClick={this.handleVoiceButtonPress}>
                    Привет!
                </Button>
                <Button onClick={()=>{navigator.vibrate([100])}}>
                    Vibro
                </Button>
                <Button onClick={()=>{
                   (cordova.plugins as any).CipherlabRS30CordovaPlugin.initialise(()=>{
                    alert("init-ok");
                    (cordova.plugins as any).CipherlabRS30CordovaPlugin.setReceiveScanCallback(function (data:any) {
                        alert("scan received: " + data);
                    });

                   });

                }}>
                    scan
                </Button>
                <div>122</div>
            </Page>
        );
    }
}