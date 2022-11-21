import fetch from 'node-fetch';
import cheerio from 'cheerio';
import fs from "fs";
import path from "path";
import { start } from 'repl';

function getPage0(b, t) {
    const url = `https://thiruvachanam.in/ShowChaptersOfBook.do?b=${b}&t=${t}`;
    console.log("download", url);
    return getPageByUrl(url);
}

function getPage(c, b, t) {
    const url = `https://thiruvachanam.in/ShowStatementsOfChapter.do?c=${c}&b=${b}&t=${t}`;
    console.log("download", url);
    return getPageByUrl(url);
}

function getPageByUrl(url) {
    return fetch(url).then(resp => resp.text());
}

async function parseAmukham(page) {
    const $ = cheerio.load(page);
    const text = $("#statementList").text();
    return {
        titles: [],
        verses: [],
        specialText: text
    };
}

async function parsePage(page) {
    const $ = cheerio.load(page);
    const text = $("#statementList").text();

    const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    let verseCount = 0;

    const verses = [];
    const titles = [];

    lines.forEach((line) => {
        const pos = line.indexOf(":");
        if (pos === -1 || pos > 3) {

            titles.push({
                before: verseCount - 1,
                text: line
            });

            return;
        }
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
    });

    const chapter = {
        titles,
        verses
    }

    return chapter;

}

async function getChapterList(page) {
    const $ = cheerio.load(page);
    const links = [];
    const seenHrefs = new Set();
    $(".chapterList a").map((_, elem) => {
        const $elem = $(elem);
        const href = `https://thiruvachanam.in/${$elem.attr('href')}`;
        if (seenHrefs.has(href)) return;
        seenHrefs.add(href);
        const item = {
            href,
            text: $elem.text().trim()
        }
        links.push(item);
    });
    return links;
}

async function mainList(bookId, testamentId) {
    console.log("start list", bookId, testamentId);
    const page = await getPage0(bookId, testamentId);
    const links = await getChapterList(page);
    const data = {
        bookId,
        testamentId,
        links
    };
    const filePath = path.join("lists", `${bookId}.json`);
    fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
    console.log(`wrote ${filePath}`);
}

async function mainGetChapter(listFile, startIdx) {
    console.log("start get", listFile, startIdx);
    const list = JSON.parse(fs.readFileSync(listFile, { encoding: "utf-8" }));

    const { bookId, testamentId, links } = list;

    for (const link of links.slice(startIdx)) {
        const chapters = [];
        const books = [
            {
                bookId,
                testamentId,
                chapters
            }
        ]
    
        console.log("processing link", link);
        const chapterId = link.text;
        const contents = await getPageByUrl(link.href);
        let parsed;
        if (chapterId === "ആമുഖം") {
            parsed = await parseAmukham(contents);
        }
        else {
            parsed = await parsePage(contents);
        }

        chapters.push({
            chapterId,
            ...parsed,
        });
        const filePath = path.join("out", `${bookId}_${chapterId}.json`);
        fs.writeFileSync(filePath, JSON.stringify(books, null, 2));
        console.log("wrote", filePath);
    }
}

async function main() {
    const cmd = process.argv[2];
    if (cmd === "list") {
        const bookId = process.argv[3];
        const testamentId = process.argv[4];
        await mainList(bookId, testamentId);
    }
    else if (cmd === "get") {
        const listFile = process.argv[3];
        const startIdx = parseInt(process.argv[4]);
        await mainGetChapter(listFile, startIdx);
    }
    else {
        console.error("unknown command", cmd);
    }
}
main().catch(console.error);