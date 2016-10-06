import {BuhtaCoreScene, IBuhtaCoreSceneProps} from "../scenes/BuhtaCoreScene";
export interface IRoute {
    component: React.ComponentClass<React.ViewProperties>,
    componentProps?: IBuhtaCoreSceneProps
}
