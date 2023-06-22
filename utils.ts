import {promisify} from "util";
import fs from "fs";

export const parseSec = (string: string): string => {
    const sec_num = parseInt(string, 10);
    let hours: string | number = Math.floor(sec_num / 3600);
    let minutes: string | number = Math.floor((sec_num - (hours * 3600)) / 60);
    let seconds: string | number = sec_num - (hours * 3600) - (minutes * 60);

    if (hours < 10) { hours = "0" + hours.toString(); }
    if (minutes < 10) { minutes = "0" + minutes.toString(); }
    if (seconds < 10) { seconds = "0" + seconds.toString(); }

    return hours.toString() + ':' + minutes.toString() + ':' + seconds.toString();
};

const writeFileAsync = promisify(fs.writeFile);
export async function saveFile(filepath:string, content:string) {
    await writeFileAsync(filepath, content, 'utf-8');
}