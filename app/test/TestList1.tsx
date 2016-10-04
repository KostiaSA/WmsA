import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Navigator, Page, BackButton, Toolbar} from "react-onsenui";


export class TestList1 extends React.Component<any,any> {
    constructor(props: any, context: any) {
        super(props, context);
        this.props = props;
        this.context = context;
    }


    handleVoiceButtonPress = () => {
        alert("111");
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


    renderList() : JSX.Element[] {
        let ret:JSX.Element[]=[];

        for (let i=0; i<50;i++){
            ret.push(<div>XX строка {i} маленькая {i}  жопа {i} </div>);
        }

        return ret;
    }

    render(): JSX.Element {
        return (
            <Page renderToolbar={this.renderToolbar}>
                <Button onClick={this.handleVoiceButtonPress}>
                    Привет!
                </Button>
                {this.renderList()}
            </Page>
        );
    }
}