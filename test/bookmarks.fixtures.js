function makeBookmarksArray() {
    return [
        {
            id: 1,
            title: "one",
            url: "url1",
            description: "description1",
            rating: 1
        },
        {
            id: 2,
            title: "two",
            url: "url2",
            description: "description2",
            rating: 2
        },
        {
            id: 13,
            title: "three",
            url: "url3",
            description: "description3",
            rating: 3
        },
    ]
}

module.exports = {
    makeBookmarksArray,
}