export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4 = "gpt-4",
  GPT_4_1106_PREVIEW = "gpt-4-1106-preview"
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.GPT_3_5]: {
    id: OpenAIModelID.GPT_3_5,
    name: "Default (GPT-3.5)"
  },
  [OpenAIModelID.GPT_4]: {
    id: OpenAIModelID.GPT_4,
    name: "GPT-4"
  },
  [OpenAIModelID.GPT_4_1106_PREVIEW]: {
    id: OpenAIModelID.GPT_4_1106_PREVIEW,
    name: "GPT-4-1106-PREVIEW"
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
