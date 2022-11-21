/**
 * Create GZIP compressed binary from ../holy_bible.json
 */
import zlib from 'zlib';
import fs from 'fs';
import url from 'url';
import path from 'path';
const __dirname = url.fileURLToPath(new URL('.', import.meta.url));
const file = path.join(__dirname, "../holy_bible.json");
const buf = fs.readFileSync(file);
const outBuf = zlib.gzipSync(buf);
fs.writeFileSync("file.bin", outBuf);
console.log("wrote", outBuf.length, "bytes");