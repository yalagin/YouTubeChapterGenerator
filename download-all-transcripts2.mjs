import { getSubtitles, getVideoDetails } from 'youtube-caption-extractor';
import {promisify} from "util";
import fs from "fs";

export const parseSec = (string) =>{
    var sec_num = parseInt(string, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    let answer = `${minutes}:${seconds}`;
    if(hours!=="00"){
        answer = `${hours}:${minutes}:${seconds}`;
    }
    return answer;
}


const writeFileAsync = promisify(fs.writeFile);
async function saveFile(filepath, content) {
    await writeFileAsync(filepath, content, 'utf-8');
}

// Fetching Video Details
const fetchVideoDetails = async (videoID, lang = 'en') => {
    try {
        let videoDetails = await getVideoDetails({ videoID, lang });
        console.log(videoDetails);
        const resultSubs = videoDetails.subtitles.reduce((accumulator,sub)=> `${accumulator}, ${parseSec(sub.start)}: ${sub.text}`,"" ).substring(2)
        saveFile(`videoDetails/${videoDetails.title}.txt`,resultSubs  );
        return resultSubs;
    } catch (error) {
        console.error('Error fetching video details:', error);
    }
};

const videoID = 'xa5dFAPpUBA';
const lang = 'en'; // Optional, default is 'en' (English)

// fetchSubtitles(videoID, lang);
fetchVideoDetails(videoID, lang);