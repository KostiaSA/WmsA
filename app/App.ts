import {NavigatorView} from "onsenui";
import {BuhtaCoreScene, IBuhtaCoreSceneProps} from "./scenes/BuhtaCoreScene";

export var navigatorView: NavigatorView;

export function setNavigator(_navigator: NavigatorView) {
    navigatorView = _navigator;
    (window as any).navigatorView = _navigator;
}

export let topScene: BuhtaCoreScene<IBuhtaCoreSceneProps,any>;
export function setTopScene(scene: BuhtaCoreScene<IBuhtaCoreSceneProps,any>) {
    topScene = scene;
}
