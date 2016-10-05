import * as React from "react";

import {BuhtaCoreScene, IBuhtaCoreSceneProps, BuhtaCoreSceneState} from "./BuhtaCoreScene";
import {BuhtaTaskSceneState} from "./BuhtaTaskScene";
import {ITaskSpecConfig} from "../config/Tasks";
import {IRoute} from "../interfaces/IRoute";
import {Button, ListItem, List} from "react-onsenui";
import {navigatorView} from "../App";

export interface IBuhtaTaskContextMenuSceneProps extends IBuhtaCoreSceneProps {
    taskSceneState: BuhtaTaskSceneState;
}

export class IBuhtaTaskContextMenuSceneState extends BuhtaCoreSceneState<IBuhtaTaskContextMenuSceneProps> {

}

export class BuhtaTaskContextMenuScene extends BuhtaCoreScene<IBuhtaTaskContextMenuSceneProps, IBuhtaTaskContextMenuSceneState> {

    handlePress = (spec: ITaskSpecConfig)=> {

        if (spec.contextMenuScene!==undefined) {

            let sceneProps = {
                title: spec.contextMenuSceneTitle,
                taskState: this.props.taskSceneState,
                taskSpecConfig: spec
            }

            let route: IRoute = {
                component: spec.contextMenuScene,
                componentProps: sceneProps,
            };
            navigatorView.pushPage(route, {animation: "slide"});
        }
    }

    renderRow = (spec: ITaskSpecConfig, index: number): JSX.Element => {
        return (
            <ListItem key={index} button onClick={()=>{ this.handlePress(spec)}}>
                <span>{spec.taskSpecName}</span>
            </ListItem>
        );
    }

    render() {

        return (
            <BuhtaCoreScene title="действия">
                <List
                    dataSource={this.props.taskSceneState.props.taskConfig.specConfig}
                    renderRow={this.renderRow}
                >
                </List>
            </BuhtaCoreScene>);
    }
}
