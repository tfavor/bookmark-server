const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const fixtures = require('./bookmarks.fixtures')
const store = require('../src/store')

describe.only(`Bookmarks endpoints`, function() {
    let bookmarksCopy, db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DB_URL,
        })
        app.set('db', db)
      })
  
    after('disconnect from db', () => db.destroy())
  
    before('cleanup the table', () => db('bookmarks').truncate())

    afterEach('cleanup', () => db('bookmarks').truncate())

    beforeEach('copy the bookmarks', () => {
        bookmarksCopy = store.bookmarks.slice()
    })

    afterEach('restore bookmarks', () => {
        store.bookmarks = bookmarksCopy
    })

    context(`given there are bookmarks`, () => {
        const testBookmarks = fixtures.makeBookmarksArray();
        beforeEach('insert bookmarks', () => {
                   return db
                     .into('bookmarks')
                     .insert(testBookmarks)
                 })
        it(`responds with 200 and all the bookmarks`, () => {
            return supertest(app)
                .get('/bookmark')
                .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(testBookmarks)
        })
    })
})