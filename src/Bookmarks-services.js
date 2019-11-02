const BookmarksServices = {
    getAllBookmarks(knex) {
        return knex.select('*').from('bookmarks')
    },
    getBookmarkWithId(knex, id) {
        return knex.from('bookmarks').select('*').where('id', id).first()
    },

}

module.exports = BookmarksServices;