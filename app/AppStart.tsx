import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Navigator, Page} from "react-onsenui";
import {NavigatorView} from "onsenui";
import {TestLogin} from "./test/TestLogin";
import {navigatorView, setNavigator, setTopScene, topScene} from "./App";
import {BuhtaLoginScene} from "./scenes/BuhtaLoginScene";
import {getDevice} from "./core/device";
import isUndefined = require("lodash/isUndefined");

ReactDOM.render(
    <Navigator
        onPostPush={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref);}}
        onPostPop={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref);}}
        renderPage={(route:any, _navigator:NavigatorView) =>{
        setNavigator(_navigator);
        return (
           <route.component
             {...route.componentProps}
             title={route.title}
             ref={(e:any)=>{
               route.ref=e;
               if (topScene===undefined){
                  setTopScene(e);
                  appInit();
               }
             }}
           />
           )}
    }
        initialRoute={{
        component: BuhtaLoginScene,
        title: 'Бухта WMS'
    }}/>,
    document.body
);


function appInit() {
    document.addEventListener("deviceready", onDeviceReady, false);
}

function initShakeEvent() {
    // with a shake sensitivity of 40 (optional, default 30)
    (window as any).shake.startWatch(onShake, 30 /*, onError */);
}

function onShake() {

    if (topScene !== undefined && topScene.onShake !== undefined) {
        topScene.onShake();
    }
}


function onDeviceReady() {
    if (getDevice()===undefined)
        (navigator as any).app.exitApp();

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("volumedownbutton", onVolumedownbutton, false);
    document.addEventListener("volumedownbutton", onVolumeupbutton, false);

    initShakeEvent();
}

function onPause() {

}

function onResume() {

}

function onMenuKeyDown() {

}

function onVolumedownbutton() {

}

function onVolumeupbutton() {

}
