# bible

This repository contains `holy_bible.json` which contains the entire text of the Malayalam Holy Bible in Unicode.

```json
[
    {
        "bookId": "1",
        "name": "ഉല്‍‍പത്തി",
        "chapters": [
            {
                "chapterId": "1",
                "titles": [
                    {
                        "after": -1,
                        "text": "അദ്ധ്യായം 3"
                    },
                    ...
                ],
                "verses": [
                    "ആദിയില്‍ ദൈവം ആകാശവും ഭൂമിയും സൃഷ്ടിച്ചു.",
                    ...
                ]
            },
            ...
        ]
    },
    ...
]
```

Size is ~14 MB (2 MB gzipped).

## Scraping

The contents have been scraped from: https://thiruvachanam.in/

