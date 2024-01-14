import { OpenAIModel, OpenAIModelID, OpenAIModels } from "@/types";

export const config = {
  runtime: "edge"
};

const handler = async (req: Request): Promise<Response> => {
  try {
    let { key } = (await req.json()) as {
      key: string;
    };
    console.log(key);

    const responseGitee = await fetch("https://gitee.yjzf.com/api/v5/user/enterprises?page=1&per_page=5&admin=false&access_token=" + key, {});

    if (responseGitee.status !== 200) {
      console.log(responseGitee.status);
      return new Response("Gitee Token Error: Error Response From Gitee", { status: 500 });
    }

    const giteeText = await responseGitee.text();

    if (giteeText.includes("ujuz") && giteeText.includes("优居优住")) {

    } else {
      return new Response("Gitee Token Error: Invalid User", { status: 500 });
    }

    key = "";

    const response = await fetch("https://api.openai.com/v1/models", {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${key ? key : process.env.OPENAI_API_KEY}`
      }
    });

    if (response.status !== 200) {
      throw new Error("OpenAI API returned an error");
    }

    const json = await response.json();

    const models: OpenAIModel[] = json.data
      .map((model: any) => {
        for (const [key, value] of Object.entries(OpenAIModelID)) {
          if (value === model.id) {
            return {
              id: model.id,
              name: OpenAIModels[value].name
            };
          }
        }
      })
      .filter(Boolean);

    return new Response(JSON.stringify(models), { status: 200 });
  } catch (error) {
    console.error(error);
    return new Response("Error: " + error, { status: 500 });
  }
};

export default handler;
