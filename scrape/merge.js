import fs from "fs";
import path from "path";

const files = fs.readdirSync("out");

const collator = new Intl.Collator(undefined, {numeric: true, sensitivity: 'base'});
files.sort(collator.compare)

const books = JSON.parse(fs.readFileSync("merged.json", { encoding: "utf-8" }));

for (const file of files) {
    const p = path.join("out", file);
    console.log("reading", p);

    const thisBooks = JSON.parse(fs.readFileSync(p, { encoding: "utf-8" }));

    const thisBook = thisBooks[0];
    const thisChapter = thisBook.chapters[0];

    const foundBook = books.filter(book => thisBook.bookId === book.bookId)[0];

    if (foundBook) {
        const foundChapter = foundBook.chapters.filter(chapter => thisChapter.chapterId === chapter.chapterId)[0];

        if (foundChapter) {
            console.log("replaced chapter", thisChapter.chapterId);
            foundChapter.titles = thisChapter.titles;
            foundChapter.verses = thisChapter.verses;
        }
        else {
            console.log("added chapter", thisChapter.chapterId);
            foundBook.chapters.push(thisChapter);
        }
    }
    else {
        console.log("added book", thisBook.bookId);
        books.push(thisBook);
    }
}

fs.writeFileSync("merged.json", JSON.stringify(books, null, 2));
console.log("wrote merged.json");