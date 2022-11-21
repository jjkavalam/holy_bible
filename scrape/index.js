import fetch from 'node-fetch';
import cheerio from 'cheerio';

function getPage(c, b, t) {
    return getPageByUrl(`https://thiruvachanam.in/ShowStatementsOfChapter.do?c=${c}&b=${b}&t=${t}`);
}

function getPageByUrl(url) {
    return fetch(url).then(resp => resp.text());
}

async function parsePage(page) {
    const $ = cheerio.load(page);
    const text = $("#statementList").text();

    const lines = text.split("\n").map(line => line.trim()).filter(line => line.length > 0);

    const verseLines = lines[1].startsWith("1 :") ? lines.slice(1) : lines.slice(2);

    const verses = verseLines.map((line, i) => {
        const pos = line.indexOf(":");
        const num = line.substring(0, pos);
        const text = line.substring(pos + 1);

        // verify
        if (parseInt(num) !== i + 1) {
            console.error(verseLines, num, i);
            throw new Error("something is wrong, verse doesn't match line number: " + line);
        }

        return text.trim();
    });

    const chapter = {
        title: lines[1],
        verses
    }

    return chapter;

}

async function getChatperList(page) {
    const $ = cheerio.load(page);
    const links = [];
    $(".chapterList a").map((i, elem) => {
        const $elem = $(elem);
        const item = {
            href: `https://thiruvachanam.in/${$elem.attr('href')}`,
            text: $elem.text().trim()
        }
        links.push(item);
    });
    return links;
}

async function main() {
    const bible = {};

    const book = 1;
    const testament = 1;

    const page = await getPage(1, book, testament);
    const links = await getChatperList(page);
    for (const link of links.slice(0, 3)) {
        console.log(link);
        const contents = await getPageByUrl(link.href);
        const parsed = await parsePage(contents);
        bible[`${testament}:${book}:${link.text}`] = parsed;
    }

    console.log(bible);

}
main().catch(console.error);