import {BuhtaCoreScene, IBuhtaCoreSceneProps} from "../scenes/BuhtaCoreScene";
export interface IRoute {
    component: Function;//React.ComponentClass<React.ViewProperties>,
    componentProps?: IBuhtaCoreSceneProps
}
