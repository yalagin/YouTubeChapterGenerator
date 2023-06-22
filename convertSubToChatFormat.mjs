import fs from "fs";

function openFile(filepath) {
    return fs.readFileSync(filepath, 'utf-8');
}

async function main() {
    const transcriptFiles = fs.readdirSync('subtitles');
    for (const file of transcriptFiles) {
        const clarifiedFilePath = `clarified/${file}`;
        if (fs.existsSync(clarifiedFilePath)) {
            console.log('Skipping:', file);
            continue;
        }
        const transcript = openFile(`subtitles/${file}`);
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