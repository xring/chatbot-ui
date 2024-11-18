import {ChatBody, Message, OpenAIModelID} from "@/types";
import {DEFAULT_SYSTEM_PROMPT} from "@/utils/app/const";
import {OpenAIO1, OpenAIO1Stream, OpenAIStream} from "@/utils/server";
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

        await init((imports) => WebAssembly.instantiate(wasm, imports));
        const encoding = new Tiktoken(
            tiktokenModel.bpe_ranks,
            tiktokenModel.special_tokens,
            tiktokenModel.pat_str
        );

        //const tokenLimit = model.id === OpenAIModelID.GPT_4 ? 6000 : 3000;
        let tokenLimit = 6000;

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

        const stream = await OpenAIStream(model, promptToSend, key, messagesToSend);
        return new Response(stream);

    } catch (error) {
        console.error(error);
        return new Response("Error: " + error, {status: 500});
    }
};

export default handler;
