import * as React from "react";
import * as ReactDOM from "react-dom";
import {Button, Navigator, Page} from "react-onsenui";
import {NavigatorView} from "onsenui";
import {TestLogin} from "./test/TestLogin";
import {navigatorView, setNavigator} from "./App";
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
        renderPage={(route:any, _navigator:NavigatorView) =>{
        setNavigator(_navigator);
        return (
           <route.component
             {...route.componentProps}
             title={route.title}
             onPop={() => navigatorView.popPage()}
           />
           )}
    }
        initialRoute={{
        component: BuhtaLoginScene,
        title: 'Бухта WMS'
    }}/>,
    document.body
);


