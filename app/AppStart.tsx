import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Navigator, Page} from "react-onsenui";
//import {NavigatorView} from "onsenui";
import {TestLogin} from "./test/TestLogin";
import {navigatorView, setNavigator, setTopScene, topScene} from "./App";
import {BuhtaLoginScene} from "./scenes/BuhtaLoginScene";
import {getDevice} from "./core/device";
import isUndefined = require("lodash/isUndefined");
import {normalizeHardBarcode} from "./core/normalizeHardBarcode";

console.log("AppStart");

ReactDOM.render(
    <Navigator
        onPostPush={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref);}}
        onPostPop={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref);}}
        renderPage={(route:any, _navigator:any/*NavigatorView*/) =>{
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
        }}
    />,
    document.body
);


// export class XXX extends React.Component<any,any> { //implements Route{
//     render(): any {
//         <div>пиздец</div>
//     }
// }

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

function initHardBarcode() {
    if (getDevice().barcode === "CipherRS30") {
        (cordova.plugins as any).CipherlabRS30CordovaPlugin.initialise(()=> {
            //alert("init-ok");
            (cordova.plugins as any).CipherlabRS30CordovaPlugin.setReceiveScanCallback(function (data: any) {
                //удаляем все символы с кодом меньше 32
                onHardBarcode(normalizeHardBarcode(data), "");
                // alert("scan received: " + data);
            });

        });
    }
}

function onHardBarcode(barcode: string, type: string) {
    if (topScene !== undefined && topScene.onHardBarcode !== undefined) {
        topScene.onHardBarcode(barcode, type);
    }
}


function onDeviceReady() {
     if (getDevice() === undefined)
         (navigator as any).app.exitApp();

    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("volumedownbutton", onVolumedownbutton, false);
    document.addEventListener("volumedownbutton", onVolumeupbutton, false);

    initShakeEvent();
    initHardBarcode();
    console.log("DeviceReady");
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
