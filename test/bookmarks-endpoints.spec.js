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

    describe('GET /bookmark', () => {
        context('given no bookmarks', () => {
            it('returns status 200 and empty array', () => {
                return supertest(app)
                    .get('/bookmark')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(200, [])
            })
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
    describe('GET /bookmark/:id', () => {
        context('given no bookmarks', () => {
            it("responds 404 not found", () => {
                return supertest(app)
                    .get('/bookmark/1')
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(404, 'not found')                
            })
        })
        context('given there are bookmarks', () => {
            const testBookmarks = fixtures.makeBookmarksArray();

            beforeEach('insert bookmarks', () => {
                return db
                    .into('bookmarks')
                    .insert(testBookmarks)
            })
            it('responds with 200 and a specific bookmark', () => {
                const bookmark_id = 2;
                const expectedBookmark = testBookmarks[bookmark_id - 1]

                return supertest(app)
                    .get(`/bookmark/${bookmark_id}`)
                    .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                    .expect(expectedBookmark)
            })
        })
    })
})