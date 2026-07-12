let express = require('express')
let cookieParser = require('cookie-parser')
let cors = require('cors')
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

/* Using Routes */
app.use('/api/auth', AuthRoute)
app.use('/api/chat', usreChat)



module.exports = app;