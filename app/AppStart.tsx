import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Navigator, Page} from "react-onsenui";
import {NavigatorView} from "onsenui";
import {TestLogin} from "./test/TestLogin";
import {navigatorView, setNavigator, setTopScene, topScene} from "./App";
import {BuhtaLoginScene} from "./scenes/BuhtaLoginScene";

//import {AppDesigner} from "../buhta-app-designer/AppDesigner/AppDesigner";

//import {buhtaHost} from "../buhta-core/BuhtaHost";  // не удалять
//let fakeBuhtaHost = buhtaHost; // не удалять

// ReactDOM.render(
//     <Hello compiler="TypeScript" framework="React" />,
//     document.getElementById("example")
// );

// ReactDOM.render(
//     <App/>,
//     document.body
// );

//let ons1=ons.createDialog();

// ReactDOM.render(
//     <div>Привет уроды!
//         <Button onClick={ () =>{ alert("Ok");}}>Tap me!</Button>
//     </div>,
//     document.body
// );


ReactDOM.render(
    <Navigator
        onPostPush={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref); console.log(topScene);}}
        onPostPop={(obj:any)=>{ setTopScene(obj.routes.routes[obj.routes.routes.length-1].ref);console.log(topScene);}}
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
    //console.log("appInit");
}

function initShakeEvent() {
    // with a shake sensitivity of 40 (optional, default 30)
    (window as any).shake.startWatch(onShake, 30 /*, onError */);
    //console.log("initShakeEvent");
}

function onShake() {

    if (topScene !== undefined && topScene.onShake !== undefined) {
        topScene.onShake();
    }
}


function onDeviceReady() {
    document.addEventListener("pause", onPause, false);
    document.addEventListener("resume", onResume, false);
    document.addEventListener("menubutton", onMenuKeyDown, false);
    document.addEventListener("volumedownbutton", onVolumedownbutton, false);
    document.addEventListener("volumedownbutton", onVolumeupbutton, false);

    initShakeEvent();
    // Add similar listeners for other events
}

function onPause() {
    // Handle the pause event
}

function onResume() {
    // Handle the resume event
}

function onMenuKeyDown() {
    // Handle the menubutton event
}

function onVolumedownbutton() {
    // Handle the menubutton event
}

function onVolumeupbutton() {
    // Handle the menubutton event
}
