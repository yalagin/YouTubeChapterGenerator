import {promisify} from "util";
import fs from "fs";

const writeFileAsync = promisify(fs.writeFile);
export async function saveFile(filepath, content) {
    await writeFileAsync(filepath, content, 'utf-8');
}