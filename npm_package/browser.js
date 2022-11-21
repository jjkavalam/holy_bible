const binFile = require('./file.bin');

function decompressBlob(blob) {
    const ds = new DecompressionStream('gzip');
    const decompressionStream = blob.stream().pipeThrough(ds);
    return new Response(decompressionStream).blob();
}

function fetchBinFile() {
    return fetch(binFile).then(resp => resp.blob());
}

function readAsText(blob) {
    return new Promise(resolve => {
        const reader = new FileReader();
        reader.onload = function() {
            resolve(reader.result);
        }
        reader.readAsText(blob);
    });
}

async function getHolyBible() {
    const blob = await fetchBinFile();
    const decompressed = await decompressBlob(blob);
    const text = await readAsText(decompressed);
    return JSON.parse(text);
}

module.exports = getHolyBible;