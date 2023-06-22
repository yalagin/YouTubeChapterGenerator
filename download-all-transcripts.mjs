import fs from "fs";
import ytch from 'yt-channel-info';
import {YoutubeTranscript} from "youtube-transcript";
import {promisify} from "util";

const writeFileAsync = promisify(fs.writeFile);

function cleanTitle(title) {
    const contraband = [':', '/', '\\', '?', '"'];
    for (const c of contraband) {
        title = title.replace(new RegExp(c, 'g'), '');
    }
    return title;
}

async function saveFile(filepath, content) {
    await writeFileAsync(filepath, content, 'utf-8');
}

async function main() {
    const channel_id = 'UC76jcY_Q2uY-XlgvcfWDw_Q';
    // const videos = await ytch.getChannelVideos({channelId: channel_id});
    // console.log(videos);
    const videos={};
     videos["items"]= [{videoId:"BOKuCEE7JGk",title:"lifeAsoke 2"}]

    for (const video of videos.items) {
        try {
            const transcript = await YoutubeTranscript.fetchTranscript(video.videoId);
            const text = transcript.map((i) => i.text);
            const block = text.join(' ');
            const title = (video.title);
            console.log(title);
            await saveFile(`transcripts/${title}.txt`, block);
        } catch (error) {
            console.log(video.title, error);
        }
    }
}

main().catch((error) => console.error(error));