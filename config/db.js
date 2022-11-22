require('dotenv').config()
const mongoose = require('mongoose')

// place MONGODB_URI in your .env file
// eg: MONGODB_URI = URI_FOR_MONGODB
// Always add .env to your .gitignore since it can contain sensitive information
mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("DB Connected")
}).catch((err) => console.log(err))
