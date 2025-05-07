const express = require('express')
const app = require('./app')
const PORT = 3000

app.listen(PORT, () => {
    console.log('Server running at http://locahost:${PORT}')
})