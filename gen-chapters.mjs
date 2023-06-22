import fs from "fs";
import {v4 as uuidv4} from "uuid";
import OpenAI from "openai-api";
import {config} from "dotenv";

config();


async function openFile(filepath) {
    return await fs.promises.readFile(filepath, 'utf-8');
}

async function saveFile(filepath, content) {
    await fs.promises.writeFile(filepath, content, 'utf-8');
}

async function gpt3Completion(prompt, engine = 'gpt-3.5-turbo', temp = 0.0, top_p = 1.0, tokens = 500, freq_pen = 0.0, pres_pen = 0.0, stop = ['asdfasdf', 'asdasdf']) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const maxRetry = 1;
    let retry = 0;
    const asciiPrompt = prompt.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters
    while (true) {
        try {
            const response = await openai.complete({
                engine,
                prompt: asciiPrompt,
                temperature: temp,
                max_tokens: tokens,
                top_p: top_p,
                frequency_penalty: freq_pen,
                presence_penalty: pres_pen,
                stop: stop
            });
            const uuidv = uuidv4();
            const filenamejson = `${uuidv}_gpt3.json`;
            saveFile(`gpt3_logs/${filenamejson}`, JSON.stringify(response.data));
            let text = response.data.choices[0].text.trim();
            text = text.replace(/\s+/g, ' ');
            const filename = `${uuidv}_gpt3.txt`;
            saveFile(`gpt3_logs/${filename}`, `${prompt}\n\n==========\n\n${text}`);

            return text;
        } catch (error) {
            retry += 1;
            if (retry >= maxRetry) {
                return `GPT3 error: ${error}`;
            }
            console.log('Error communicating with OpenAI:', error);
            await new Promise((resolve) => setTimeout(resolve, 1000)); // Wait for 1 second before retrying
        }
    }
}

async function main() {
    const transcript = (await openFile('videoDetails/I tried 6 Tech Toys, here are the best… and the worst.txt'));
    const chunkSize = 20;
    const chunks = [transcript];
    // for (let i = 0; i < transcript.length; i += chunkSize) {
    //     chunks.push(transcript.slice(i, i + chunkSize));
    // }
    const results = await Promise.all(
        chunks.map(async (chunk) => {
            const chunkText = chunk/*.join('\n')*/;
            const prompt = (await openFile('prompt.txt')).replace('<<TRANSCRIPT>>', chunkText);
            const response = await gpt3Completion(prompt);
            console.log('\n\n', response);
            return response;
        })
    );
    const output = results.join('\n');
    console.log('\n\nFinal Output:\n', output);
    await saveFile('chapters.txt', output);
    console.log('all done');
}

main().catch((error) => console.error(error));