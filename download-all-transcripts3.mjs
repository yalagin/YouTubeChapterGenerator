import {Configuration, OpenAIApi} from "openai";
import {config} from "dotenv";
import {saveFile} from "./utils";

config();

async function main() {


    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listModels();

    console.log(await response.data);

    const filenamejson = `${uuidv}_gpt3.json`;
    saveFile(`gpt3_logs/${filenamejson}`, JSON.stringify(response.data));
}
main().catch((error) => console.error(error));