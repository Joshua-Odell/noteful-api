const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersService = require('./service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeFolder = folder => ({
    id: folder.id,
    name: xss(folder.name),
})

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        FoldersService.getAllFolders(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeFolder))
            })
        .catch(next)
    })
    // Error: insert into "noteful_folders" ("0", "1", "2", "3", "4", "5", "6", "7", "8") values ($1, $2, $3, $4, $5, $6, $7, $8, $9) returning * - column "0" of relation "noteful_folders" does not exist
    // Information Sent name: "test"
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newFolderName = name

        FoldersService.insertFolder(req.app.get('db'), newFolderName)
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeFser(folder))
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    //No notes are assigned to any folders
    .get((req, res, next) => {
        FoldersService.getById( req.app.get('db'), req.params.id)
            .catch(next)
    })
    //Not an option in this app
    .delete((req, res, next) => {
        FoldersService.deleteFolder(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


    
module.exports = foldersRouter