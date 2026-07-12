let express = require('express')
let cookieParser = require('cookie-parser')
let cors = require('cors')
let path = require('path')
/*  Routes */
let AuthRoute = require('./routes/auth.routes')
let usreChat = require('./routes/chat.routes')
let app = express()

app.use(cors({
    origin:'http://localhost:5173',
    credentials:true
}))


app.use(express.json())
app.use(cookieParser())
app.use(express.static(path.join(__dirname, '../public')))
/* Using Routes */
app.use('/api/auth', AuthRoute)
app.use('/api/chat', usreChat)


app.get("*name", (req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'))
})



module.exports = app;