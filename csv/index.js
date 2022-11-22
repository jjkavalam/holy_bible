const fs = require("fs");
const { Parser } = require('json2csv');
const books = require("../holy_bible.json");

const rows = [];

for (const book of books) {
    for (const chapter of book.chapters) {
        let verseNo = 0;
        for (const verse of chapter.verses) {
            rows.push({
                bookId: book.bookId,
                chapterId: chapter.chapterId,
                verse,
                verseNo: ++verseNo,
            });
        }
    }
}


const json2csvParser = new Parser();
const csv = json2csvParser.parse(rows);

fs.writeFileSync("verses.csv", csv);

console.log("wrote", rows.length, "rows");