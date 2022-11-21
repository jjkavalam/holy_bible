This package makes the Malayalam Holy Bible available for use in the browser as well as node.

Note that for node, it is provided in ESM format.

The contents of the Bible is provided in a structured format as shown below.

```js
import getHolyBible from '@jjkavalam/holy-bible-ml'

getHolyBible().then(books => {
    console.log(books);
})
```

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

The library weights about 2 MB, predominantly the contents gzipped.

The original contents are obtained from https://thiruvachanam.in/

