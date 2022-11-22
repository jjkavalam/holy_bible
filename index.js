const fs = require("fs");
const books = require("./holy_bible.json");
const chapter = books[22].chapters[118];

const verses = chapter.verses;
let verseCount = 99;

for (const title of chapter.titles.slice(2)) {
    const line = title.text;
    const pos = line.indexOf(":");
    verseCount++;
    const num = line.substring(0, pos);
    const text = line.substring(pos + 1);

    // verify
    if (parseInt(num) !== verseCount) {
        console.error(lines, num, verseIdx);
        throw new Error("something is wrong, verse doesn't match line number: " + line);
    }

    const verse = text.trim();
    verses.push(verse);
}

chapter.titles.splice(2, 77);
console.log(chapter.titles);

fs.writeFileSync("holy_bible.json", JSON.stringify(books, null, 2));