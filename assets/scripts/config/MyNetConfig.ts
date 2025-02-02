import {GameCode} from "db://assets/scripts/gen/code/GameCode";
import {SdkAction} from "db://assets/scripts/gen/code/SdkAction";
import {LoginVerifyMessageSchema, UserMessageSchema} from "db://assets/scripts/gen/common_pb";

import {
    ExternalMessageSchema,
    ioGameLanguage,
    ioGameSetting, LongValueSchema,
    NetExternalMessage, SimpleListenMessageCallback,
    SimpleNetChannel
} from "iohao-sdk";
import {create, toBinary, fromBinary} from "@bufbuild/protobuf";
import {listen} from "db://assets/scripts";

export class MyNetConfig {
    public static currentTimeMillis: bigint = BigInt(Date.now());

    static startNet() {
        // biz code init
        GameCode.init();
        // listen();
        listen()

        // --------- IoGameSetting ---------
        ioGameSetting.enableDevMode = true;
        // China or Us
        ioGameSetting.language = ioGameLanguage.CHINA;
        // message callback. 回调监听
        ioGameSetting.listenMessageCallback = new MySimpleListenMessageCallback();

        // socket
        ioGameSetting.url = "ws://127.0.0.1:10100/websocket";
        ioGameSetting.netChannel = new MyNetChannel();

        ioGameSetting.startNet()
    }
}

class MyNetChannel extends SimpleNetChannel {

    onOpen(event: Event) {
        // login
        const loginVerify = create(LoginVerifyMessageSchema, {jwt: "10000"});
        SdkAction.ofLoginVerify(loginVerify, result => {
            const message = result.getValue(UserMessageSchema);
            result.log(message);
        });

        // MyIdleTimer, heartbeat
        const heartbeatMessage = toBinary(ExternalMessageSchema, create(ExternalMessageSchema, {}));
        setInterval(function () {
            // Send heartbeat to server. 发送心跳给服务器
            ioGameSetting.netChannel.writeAndFlushUint8Array(heartbeatMessage);
        }, 8 * 1000);
    }
}

class MySimpleListenMessageCallback extends SimpleListenMessageCallback {

    onIdleCallback(message: NetExternalMessage) {
        const data = message.data;
        if (data === undefined || data.length === 0) return;

        /*
         * Synchronize the time of each heartbeat with that of the server.
         * 每次心跳与服务器的时间同步
         */
        const longValue = fromBinary(LongValueSchema, data);
        MyNetConfig.currentTimeMillis = longValue.value;
    }
}
