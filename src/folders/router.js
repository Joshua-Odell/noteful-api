const path = require('path')
const express = require('express')
const xss = require('xss')
const FoldersService = require('./service')

const foldersRouter = express.Router()
const jsonParser = express.json()

const serializeUser = folder => ({
    id: user.id,
    name: xss(folder.name),
})

foldersRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        console.log(knexInstance)
        FoldersService.getAllFolders(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeUser))
            })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newFolderName = name

        FoldersService.insertFolder(req.app.get('db'), newFolderName)
            .then(folder => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${folder.id}`))
                    .json(serializeUser(folder))
            })
            .catch(next)
    })

foldersRouter
    .route('/:folder_id')
    .get((req, res, next) => {
        FoldersService.getById( req.app.get('db'), req.params.id)
            .catch(next)
    })
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