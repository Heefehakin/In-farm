const express = require('express');
const session = require('express-session');
const passport = require('./config/passport.setup');
const { connectDB } = require('./config/database');
const User = require('./models/user.model');
const Farm = require('./models/farm.model');
const Investment = require('./models/investment.model');
require('dotenv').config();

User.hasMany(Investment);
Investment.belongsTo(User);
Farm.hasMany(Investment);
Investment.belongsTo(Farm);

const app = express();

connectDB();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));


app.use(passport.initialize());
app.use(passport.session());


app.use('/auth', require('./routes/auth.routes'));
app.use('/api/users', require('./routes/user.routes'));
app.use('/api/farms', require('./routes/farm.routes'));
app.use('/api/investments', require('./routes/investment.routes'));




const PORT = process.env.PORT || 5050
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});









