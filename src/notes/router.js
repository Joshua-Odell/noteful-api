const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./service')

const NotesRouter = express.Router()
const jsonParser = express.json()

const serializeUser = note => ({
    id: note.id,
    name: xss(note.name),
    modified: xss(note.modified),
    content: xss(note.content)
})

NotesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        console.log(knexInstance)
        NotesService.getAllNotes(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeUser))
            })
        .catch(next)
    })
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newNote = { name } 
        console.log(newNote);

        NotesService.insertNotes(req.app.get('db'), newNote)
            .then(notes => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${notes.id}`))
                    .json(serializeUser(notes))
            })
            .catch(next)
    })

NotesRouter
    .route('/:note_id')
    .get((req, res, next) => {
        NotesService.getById( req.app.get('db'), req.params.id)
            .catch(next)
    })
    .delete((req, res, next) => {
        NotesService.deleteNotes(
            req.app.get('db'),
            req.params.id
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })


    
module.exports = NotesRouter