const express = require('express');
const { bookmarks } = require('../store')
const uuid = require('uuid/v4')
const logger = require('../logger')
const BookmarksServices = require('../Bookmarks-services')

const bookmarkRouter = express.Router()
const bodyParser = express.json()

const serializeBookmark = bookmark => ({
    id: bookmark.id,
    title: bookmark.title,
    url: bookmark.url,
    description: bookmark.description,
    rating: Number(bookmark.rating),
  })

bookmarkRouter
    .route('/bookmark')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        BookmarksServices.getAllBookmarks(knexInstance)
            .then(bookmarks => {
                res.json(bookmarks.map(serializeBookmark))
            })
            .catch(next)
    })
    .post(express.json(), (req, res) => {
        const { title, url, desc } = req.body;

        if(!title) {
            logger.error('title required');
            return res
            .status(400)
            .send('title invalid data');
        }
        if(!url) {
            logger.error('url required');
            return res
            .status(400)
            .send('url invalid data');
        }
        if(!desc) {
            logger.error('desc required');
            return res
            .status(400)
            .send('desc invalid data');
        }

        const id = uuid();

        const bookmark = {
            id,
            title,
            url,
            desc
        };

        bookmarks.push(bookmark)

        logger.info(`card with id ${id} created`)

        res
        .status(201)
        .location(`http://localhost:8000/bookmark/${id}`)
        .json(bookmark)
    })

bookmarkRouter
    .route('/bookmark/:bookmark_id')
    .get((req, res, next) => {
        const { bookmark_id } = req.params;
        BookmarksServices.getBookmarkWithId(req.app.get('db'), bookmark_id)
            .then(bookmark => {
                if(!bookmark) {
                    logger.error(`bookmark with id ${bookmark_id} not found`);
                    return res
                    .status(404)
                    .send('not found')
                }
                res.json(serializeBookmark(bookmark))
            })
            .catch(next)
    })
    .delete((req, res) => {
        const { id } = req.params;
        const bookmarkIndex = bookmarks.findIndex(b => b.id == id);

        if(bookmarkIndex === -1) {
            logger.error(`bookmark withg id ${id} not found`);
            return res
            .status(404)
            .send('not found')
        }

        bookmarks.splice(bookmarkIndex, 1);

        logger.info(`bookmark with id ${id} deletd`);

        res.status(204).end()
    })

module.exports = bookmarkRouter    