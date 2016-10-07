import {NavigatorView} from "onsenui";
import {BuhtaCoreScene, IBuhtaCoreSceneProps} from "./scenes/BuhtaCoreScene";
import {IRoute} from "./interfaces/IRoute";
import {BuhtaTaskScene} from "./scenes/BuhtaTaskScene";

export var navigatorView: NavigatorView;

export function setNavigator(_navigator: NavigatorView) {
    navigatorView = _navigator;
    (window as any).navigatorView = _navigator;
}

export let topScene: BuhtaCoreScene<IBuhtaCoreSceneProps,any>;
export function setTopScene(scene: BuhtaCoreScene<IBuhtaCoreSceneProps,any>) {
    topScene = scene;
}

export function forceUpdateAll() {
    (navigatorView as any).routes.forEach((item: any, index: number)=> {
        (item.ref as BuhtaCoreScene<IBuhtaCoreSceneProps,any>).reloadScene();
        console.log("item.ref.forceUpdate:" + index);
    });
}

export function forcePopToTaskScene() {
    for (let i = (navigatorView as any).routes.length - 1; i > 0; i--) {
        let route = (navigatorView as any).routes[i] as IRoute;
        if (route.component !== BuhtaTaskScene) {
            console.log("navigatorView.popPage:" + i);
            navigatorView.popPage();
        }
        else
            return;

    }
}
