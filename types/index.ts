export interface OpenAIModel {
  id: string;
  name: string;
}

export enum OpenAIModelID {
  GPT_3_5 = "gpt-3.5-turbo",
  GPT_4_TURBO_PREVIEW = "gpt-4-turbo-preview",
  GPT_4_TURBO = "gpt-4-turbo",
  GPT_4_O = "gpt-4o",
  O1_MINI = "o1-mini",
  O1_PREVIEW = "o1-preview",
  CLAUDE_3_5_SONNET = "claude-3-5-sonnet-latest",
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
  },
  [OpenAIModelID.O1_MINI]: {
    id: OpenAIModelID.O1_MINI,
    name: "O1-MINI"
  },
  [OpenAIModelID.O1_PREVIEW]: {
    id: OpenAIModelID.O1_PREVIEW,
    name: "O1-PREVIEW"
  },
  [OpenAIModelID.CLAUDE_3_5_SONNET]: {
    id: OpenAIModelID.CLAUDE_3_5_SONNET,
    name: "CLAUDE-3-5-SONNET-LATEST"
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
