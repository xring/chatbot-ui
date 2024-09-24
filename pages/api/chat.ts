import {ChatBody, Message, OpenAIModelID} from "@/types";
import {DEFAULT_SYSTEM_PROMPT} from "@/utils/app/const";
import {OpenAIO1Stream, OpenAIStream} from "@/utils/server";
import tiktokenModel from "@dqbd/tiktoken/encoders/cl100k_base.json";
import {init, Tiktoken} from "@dqbd/tiktoken/lite/init";
// @ts-expect-error
import wasm from "../../node_modules/@dqbd/tiktoken/lite/tiktoken_bg.wasm?module";

export const config = {
    runtime: "edge",
};

const globalData = require('../../globalData');

function getCurrentDateInYYYYMMDD(): string {
    const date = new Date();
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);

    return `${year}${month}${day}`;
}

function getCurrentTimestampIn3HourWindow(): string {
    const now = new Date();
    const oneHour = 60 * 60 * 1000; // 一小时的毫秒数
    const threeHours = 3 * oneHour; // 三小时的毫秒数

    // 获取当前时间的时间戳
    const currentTimestamp = now.getTime();

    // 计算最近的3小时时间窗的开始时间戳
    const tmp = currentTimestamp - (currentTimestamp % threeHours);

    // 将结果转换为字符串并返回
    return `${tmp}`;
}

const handler = async (req: Request): Promise<Response> => {
    try {
        const {model, messages, key, prompt} = (await req.json()) as ChatBody;

        if (model.id === OpenAIModelID.GPT_4_TURBO || model.id === OpenAIModelID.GPT_4_TURBO_PREVIEW || model.id === OpenAIModelID.GPT_4_O || model.id === OpenAIModelID.O1_PREVIEW || model.id === OpenAIModelID.O1_MINI) {
            const currentDateInYYYYMMDD = getCurrentDateInYYYYMMDD();
            const userKey = currentDateInYYYYMMDD + "_" + key;
            //const currentTimestampIn3HourWindow = getCurrentTimestampIn3HourWindow();
            //const userKey = currentTimestampIn3HourWindow + "_" + key;
            let dailyLimit = 500;
            if (process.env.GITEE_ADMIN_TOKEN && process.env.GITEE_ADMIN_TOKEN.includes(key)) {
                dailyLimit = 5000;
            }
            if (globalData.data[userKey]) {
                if (globalData.data[userKey] >= dailyLimit) {
                    return new Response("Error: reached the daily request limit for 500 times per day", {status: 500});
                } else {
                    globalData.data[userKey]++;
                }
            } else {
                globalData.data[userKey] = 1;
            }
        }

        await init((imports) => WebAssembly.instantiate(wasm, imports));
        const encoding = new Tiktoken(
            tiktokenModel.bpe_ranks,
            tiktokenModel.special_tokens,
            tiktokenModel.pat_str
        );

        //const tokenLimit = model.id === OpenAIModelID.GPT_4 ? 6000 : 3000;
        let tokenLimit = model.id === OpenAIModelID.GPT_3_5 ? 10000 : 70000;

        let promptToSend = prompt;
        if (!promptToSend) {
            promptToSend = DEFAULT_SYSTEM_PROMPT;
        }

        const prompt_tokens = encoding.encode(promptToSend);

        let tokenCount = prompt_tokens.length;
        let messagesToSend: Message[] = [];

        for (let i = messages.length - 1; i >= 0; i--) {
            const message = messages[i];
            const tokens = encoding.encode(message.content);

            if (tokenCount + tokens.length > tokenLimit) {
                break;
            }
            tokenCount += tokens.length;
            messagesToSend = [message, ...messagesToSend];
        }

        encoding.free();

        if (model.id === OpenAIModelID.O1_MINI || model.id === OpenAIModelID.O1_PREVIEW) {
            const stream = await OpenAIO1Stream(model, promptToSend, key, messagesToSend);
            return new Response(stream);
        } else {
            const stream = await OpenAIStream(model, promptToSend, key, messagesToSend);
            return new Response(stream);
        }

    } catch (error) {
        console.error(error);
        return new Response("Error: " + error, {status: 500});
    }
};

export default handler;
