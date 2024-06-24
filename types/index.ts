export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_O = "gpt-4o"
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: "GPT-3.5-TURBO"
  },
  [OpenAIModelID.GPT_4_TURBO_PREVIEW]: {
    id: OpenAIModelID.GPT_4_TURBO_PREVIEW,
    name: "GPT-4-TURBO-PREVIEW"
  },
  [OpenAIModelID.GPT_4_TURBO]: {
    id: OpenAIModelID.GPT_4_TURBO,
    name: "GPT-4-TURBO"
  },
  [OpenAIModelID.GPT_4_O]: {
    id: OpenAIModelID.GPT_4_O,
    name: "GPT-4o"
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
