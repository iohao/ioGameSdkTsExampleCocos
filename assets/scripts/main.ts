import {_decorator, Component, Node, find, Button} from 'cc';
import {
    onBoolValue,
    onIntValue, onListBool,
    onListInt,
    onListLong, onListString, onListValue,
    onLongValue,
    onStringValue, onTestError, onTriggerBroadcast,
    onValueObject
} from "db://assets/scripts/index";
import {MyNetConfig} from "db://assets/scripts/config/MyNetConfig";

const {ccclass, property} = _decorator;

@ccclass('main')
export class main extends Component {
    start() {

        MyNetConfig.startNet();

        this.btnOnClick("onIntValue", onIntValue);
        this.btnOnClick("onLongValue", onLongValue);
        this.btnOnClick("onBoolValue", onBoolValue);
        this.btnOnClick("onStringValue", onStringValue);
        this.btnOnClick("onValueObject", onValueObject);

        this.btnOnClick("onListInt", onListInt);
        this.btnOnClick("onListLong", onListLong);
        this.btnOnClick("onListBool", onListBool);
        this.btnOnClick("onListString", onListString);
        this.btnOnClick("onListValue", onListValue);

        this.btnOnClick("onTestError", onTestError);
        this.btnOnClick("onTriggerBroadcast", onTriggerBroadcast);
    }

    // type __types_globals__AnyFunction = Function;
    update(deltaTime: number) {

    }

    btnOnClick(btnName: string, callback: Function) {
        const path = "Canvas/Layout/" + btnName;
        const button = find(path)?.getComponent(Button);
        if (button) {
            button.node.on(Button.EventType.CLICK, callback, this);
        }
    }
}

