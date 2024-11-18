export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  YJZF_LLM_1118 = "yjzf-llm-1118"
}

export const OpenAIModels: Record<OpenAIModelID, OpenAIModel> = {
  [OpenAIModelID.YJZF_LLM_1118]: {
    id: OpenAIModelID.YJZF_LLM_1118,
    name: "yjzf-llm-1118"
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
