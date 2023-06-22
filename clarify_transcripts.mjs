import fs from "fs";

import {v4 as uuidv4} from "uuid";
import OpenAI from "openai-api";


function openFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}

function saveFile(filepath, content) {
    fs.writeFileSync(filepath, content, 'utf-8');
}

async function gpt3Completion(prompt, engine = 'text-davinci-003', temp = 0.7, top_p = 1.0, tokens = 2000, freq_pen = 0.0, pres_pen = 0.0, stop = ['asdfasdf', 'asdasdf']) {
    const openai = new OpenAI(process.env.OPENAI_API_KEY);
    const maxRetry = 5;
    let retry = 0;
    const asciiPrompt = prompt.replace(/[^\x00-\x7F]/g, ''); // Remove non-ASCII characters

    while (true) {
        try {
            const response = await openai.complete({
                engine,
                prompt: asciiPrompt,
                temperature: temp,
                maxTokens: tokens,
                topP: top_p,
                frequencyPenalty: freq_pen,
                presencePenalty: pres_pen,
                stop: stop
            });
            const uuidv = uuidv4();
            const filenamejson = `${uuidv}_gpt3.json`;
            saveFile(`gpt3_logs/${filenamejson}`, JSON.stringify(response.data));
            let text = response.data.choices[0].text.trim();
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
    process.env.OPENAI_API_KEY =  openFile('openaiapikey.txt');

    const transcriptFiles = fs.readdirSync('transcripts');
    for (const file of transcriptFiles) {
        const clarifiedFilePath = `clarified/${file}`;
        if (fs.existsSync(clarifiedFilePath)) {
            console.log('Skipping:', file);
            continue;
        }
        const transcript = openFile(`transcripts/${file}`);
        const chunks = transcript.match(/.{1,6000}/g);
        // const chunks = transcript.match(/.{1,6000}/g);
        const output = [];
        for (const chunk of chunks) {
            const prompt = openFile('prompt_clarify_transcript.txt').replace('<<TRANSCRIPT>>', chunk);
            const essay = gpt3Completion(prompt);
            output.push(essay);
        }
        const essays = await Promise.all(output);
        const result = essays.join('\n\n');
        saveFile(clarifiedFilePath, result);
        console.log('\n\n================================================\n\n', result);
    }
}

main().catch((error) => console.error(error));
