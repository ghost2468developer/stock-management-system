const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const authRoutes = require('./routes/auth')
const stockRoutes = require('./routes/stock')

const app = express()
app.use(cors())
app.use(bodyParser.json())

app.use('/api/auth', authRoutes)
app.use('/api/stock', stockRoutes)

module.exports = app