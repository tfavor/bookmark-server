const BookmarksServices = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks')
    },

}

module.exports = BookmarksServices;