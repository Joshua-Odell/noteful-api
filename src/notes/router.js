const path = require('path')
const express = require('express')
const xss = require('xss')
const NotesService = require('./service')

const NotesRouter = express.Router()
const jsonParser = express.json()

const serializeNote = note => ({
    id: note.id,
    name: xss(note.name),
    modified: xss(note.modified),
    content: xss(note.content)
})

NotesRouter
    .route('/')
    .get((req, res, next) => {
        const knexInstance = req.app.get('db')
        NotesService.getAllNotes(knexInstance)
            .then(folder => {
                res.json(folder.map(serializeNote))
            })
        .catch(next)
    })
    //error occuring "insert into "noteful_notes" ("name") values ($1) returning * - null value in column "content" violates not-null constraint"
    // Information sent content: "testest" folderId: "2" name: "test"
    .post(jsonParser, (req, res, next) => {
        const { name } = req.body
        const newNote = { name } 

        NotesService.insertNotes(req.app.get('db'), newNote)
            .then(notes => {
                res
                    .status(201)
                    .location(path.posix.join(req.originalUrl, `/${notes.id}`))
                    .json(serializeNote(notes))
            })
            .catch(next)
    })

NotesRouter
    .route('/:note_id')
    //Content is not displayed No get request is made
    .get((req, res, next) => {
        NotesService.getById( req.app.get('db'), req.params.id)
            .catch(next)
    })
    //A error is occuring because a delete request does not send the id
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