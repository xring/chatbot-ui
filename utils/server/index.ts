import { Message, OpenAIModel } from "@/types";
import { createParser, ParsedEvent, ReconnectInterval } from "eventsource-parser";

export const OpenAIStream = async (model: OpenAIModel, systemPrompt: string, key: string, messages: Message[]) => {
  key = "";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: model.id,
      messages: [
        {
          role: "system",
          content: systemPrompt
        },
        ...messages
      ],
      max_tokens: 1000,
      temperature: 0.0,
      stream: true
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText; 
    throw new Error(`OpenAI API returned an error: ${statusText}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};

export const OpenAIO1Stream = async (model: OpenAIModel, systemPrompt: string, key: string, messages: Message[]) => {
  key = "";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: model.id,
      messages: messages,
      max_completion_tokens: 3000,
      stream: false
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    throw new Error(`OpenAI O1 API returned an error: ${statusText}`);
  }

  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream({
    async start(controller) {
      const onParse = (event: ParsedEvent | ReconnectInterval) => {
        if (event.type === "event") {
          const data = event.data;

          if (data === "[DONE]") {
            controller.close();
            return;
          }

          try {
            const json = JSON.parse(data);
            const text = json.choices[0].delta.content;
            const queue = encoder.encode(text);
            controller.enqueue(queue);
          } catch (e) {
            controller.error(e);
          }
        }
      };

      const parser = createParser(onParse);

      for await (const chunk of res.body as any) {
        parser.feed(decoder.decode(chunk));
      }
    }
  });

  return stream;
};

export const OpenAIO1 = async (model: OpenAIModel, systemPrompt: string, key: string, messages: Message[]) => {
  key = "";
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
    },
    method: "POST",
    body: JSON.stringify({
      model: model.id,
      messages: messages,
      max_completion_tokens: 3000,
      stream: false
    })
  });

  if (res.status !== 200) {
    const statusText = res.statusText;
    throw new Error(`OpenAI O1 API returned an error: ${statusText}`);
  }

  const data = await res.json();

  if (!data.choices || data.choices.length === 0) {
    throw new Error("No choices returned from OpenAI API");
  }

  return data.choices[0].message.content;
};