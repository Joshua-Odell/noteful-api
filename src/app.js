require('dotenv').config()
const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const helmet = require('helmet')
const { NODE_ENV } = require('./config')
const notesRouter = require('./notes/router')
const foldersRouter = require('./folders/router')


const app = express()

const urlencodedParser = bodyParser.urlencoded({extended: false})

const morganOption = ( NODE_ENV === 'production')
    ? 'tiny'
    : 'common' ;

app.use(morgan(morganOption))
app.use(helmet())
app.use(cors())
//app.use('/notes', notesRouter)
app.use('/folders', foldersRouter)



module.exports = app
