const express = require('express')
const jwt = require('jsonwebtoken')
const path = require('path')
require('dotenv').config()		

const port = process.env.PORT || 3000
const app = express()

const bodyParser = require('body-parser')
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

require('./config/db.js')

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

const User = require('./models/User')

app.listen(port, () => {
    console.log('server running on port' + port)
})

app.get('/', (req, res) => {
    res.status(200)
    res.send('<h1>Hello world!</h1>')
})

app.get('/signup', (req, res) => {
    console.log('GET /signup')
    res.render('login')
})

app.post('/sum', (req, res) => {
    console.log(req.body)
    const n1 = req.body.num1
    const n2 = req.body.num2
})

app.get('/login', async(req, res) => {
    res.render('login')
    console.log('GET /login')
})

app.post('/login', async (req, res) => {
    let user = req.body.username
    let pass = req.body.password
    let query = {username: user}
    console.log(req.body)
    const u = await User.findOne(query)

    if (u == null) {
        res.status(400)
        res.json({
            status: 'FAILED',
            message: 'invalid username or password'
        })
    } else {
        if (pass === u.password) {
            console.log('password is correct')
            res.status(200)
            res.json({
                status: 'SUCCESS',
                message: 'Sign-in successful'
            })

        } else {
            res.status(400)
            res.json({
                status: 'FAILED',
                message: 'Invalid username or password'
            })
        }
    }
})

app.post('/signup', async function(req, res) {
    let {username, password} = req.body
    console.log(req.body)
    console.log(`username = ${username}`)
    console.log(`password = ${password}`)

    if (typeof(username) == 'undefined' || typeof('password') == 'undefined') {
        res.status(400)
        return res.json({
            status: 'FAILED',
            message: 'Empty input field(s)'
        })
    }
    // check if user already exists
    const u = await User.find({username: username})
    if (u) {
        console.log('student exists')
        res.status(400)
        return res.json({
            status: 'FAILED',
            message: 'username already exists'
        })
    }
    const user = new User({
        username: username,
        password: password
    })
    console.log(user)
    user.save(function (err) {
        if (err) {
            console.log('error saving user')
            res.status(500)
            res.json({
                status: 'FAILED',
                message: err.message
            })
        } else {
            console.log('saved user successfully')
            res.status(200)
            res.json({
                status: 'SUCCESS',
                message: 'Sign-up successful'
            })
        }
    })
})

app.get('/profile', (req, res) => {
    console.log('GET /profile')
    // verify token from header
    if (typeof(req.headers.authorization) == 'undefined') {
        console.log('no token received')
        res.status(403)
        return res.json({
            status: 'FAILED',
            message: 'Token not specified'
        })
    }
    const token = req.headers.authorization.split(" ")[1];
    // get username from token
    const decoded = verifyToken(token)
    if (decoded == null) {
        res.status(400)
        res.json({
            status: 'FAILED',
            message: 'Invalid token'
        })
    }
    // TODO: render home page using username ('Welcome ${username}')
})

function verifyToken(token) {
    try {
        console.log(`token = ${token}`)
        decoded = jwt.verify(token, process.env.JWT_SECRET_KEY)
        console.log('verified')
        console.log(decoded)
        return decoded
    } catch (ex) {
        console.log(`error verifying token ${ex.message}`)
        return null
    }
}
