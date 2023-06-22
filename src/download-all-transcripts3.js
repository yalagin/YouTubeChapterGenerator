import {Configuration, OpenAIApi} from "openai";
import {config} from "dotenv";
import {promisify} from "util";
import fs from "fs";

config();

const writeFileAsync = promisify(fs.writeFile);
export async function saveFile(filepath, content) {
    await writeFileAsync(filepath, content, 'utf-8');
}

async function main() {


    const configuration = new Configuration({
        apiKey: process.env.OPENAI_API_KEY,
    });
    const openai = new OpenAIApi(configuration);
    const response = await openai.listModels();

    console.log(await response.data);

    const filenamejson = `list_gpt3.json`;
    await saveFile(`gpt3_logs/${filenamejson}`, JSON.stringify(response.data));
}
main().catch((error) => console.error(error));