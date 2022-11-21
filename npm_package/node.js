import zlib from 'zlib';
import fs from 'fs';
import Stream, { pipeline } from 'stream';
import url from 'url';
import path from 'path';

const __dirname = url.fileURLToPath(new URL('.', import.meta.url));

export default function getHolyBible() {
    return new Promise((resolve, reject) => {

        const chunks = [];

        const output = new Stream();
        output.writable = true;
        output.write = function(buf) {
            chunks.push(buf);
        }
        output.end = function(buf) {
            if(arguments.length) output.write(buf);
            output.writable = false;
    
            const bytes = Buffer.concat(chunks);
            const text = bytes.toString("utf8");
            resolve(JSON.parse(text));
        };
    
        const onError = (err) => {
            if (err) {
                reject(err);
            }
        };
    
        const file = path.join(__dirname, "file.bin");
        const input = fs.createReadStream(file);
        pipeline(input, zlib.createGunzip(), output, onError);
    });
}
