export interface OpenAIModel {
    id: string;
    name: string;
}

export enum OpenAIModelID {
    GPT_3_5 = "gpt-3.5-turbo",
    GPT_4_TURBO = "gpt-4-turbo",
    GPT_4_O = "gpt-4o",
    O1_MINI = "o1-mini",
    O1 = "o1",
    CLAUDE_3_5_SONNET = "claude-3-5-sonnet-latest",
    GEMINI_1_5_PRO = "gemini-1.5-pro",
    GEMINI_1_5_FLASH = "gemini-1.5-flash",
    GEMINI_2_0_FLASH_EXP = "gemini-2.0-flash-exp",
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
    [OpenAIModelID.GPT_3_5]: {
        id: OpenAIModelID.GPT_3_5,
        name: "GPT-3.5-TURBO"
    },
    [OpenAIModelID.GPT_4_TURBO]: {
        id: OpenAIModelID.GPT_4_TURBO,
        name: "GPT-4-TURBO"
    },
    [OpenAIModelID.GPT_4_O]: {
        id: OpenAIModelID.GPT_4_O,
        name: "GPT-4o"
    },
    [OpenAIModelID.O1_MINI]: {
        id: OpenAIModelID.O1_MINI,
        name: "O1-MINI"
    },
    [OpenAIModelID.O1]: {
        id: OpenAIModelID.O1,
        name: "O1"
    },
    [OpenAIModelID.CLAUDE_3_5_SONNET]: {
        id: OpenAIModelID.CLAUDE_3_5_SONNET,
        name: "CLAUDE-3-5-SONNET-LATEST"
    },
    [OpenAIModelID.GEMINI_1_5_PRO]: {
        id: OpenAIModelID.GEMINI_1_5_PRO,
        name: "GEMINI-1-5-PRO"
    },
    [OpenAIModelID.GEMINI_1_5_FLASH]: {
        id: OpenAIModelID.GEMINI_1_5_FLASH,
        name: "GEMINI-1-5-FLASH"
    },
    [OpenAIModelID.GEMINI_2_0_FLASH_EXP]: {
        id: OpenAIModelID.GEMINI_2_0_FLASH_EXP,
        name: "GEMINI-2-0-FLASH-EXP"
    }
};

export interface Message {
    role: Role;
    content: string;
}

export type Role = "assistant" | "user";

export interface ChatFolder {
    id: number;
    name: string;
}

export interface Conversation {
    id: number;
    name: string;
    messages: Message[];
    model: OpenAIModel;
    prompt: string;
    folderId: number;
}

export interface ChatBody {
    model: OpenAIModel;
    messages: Message[];
    key: string;
    prompt: string;
}

export interface KeyValuePair {
    key: string;
    value: any;
}

// keep track of local storage schema
export interface LocalStorage {
    apiKey: string;
    conversationHistory: Conversation[];
    selectedConversation: Conversation;
    theme: "light" | "dark";
    // added folders (3/23/23)
    folders: ChatFolder[];
}
