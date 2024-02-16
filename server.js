const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3400;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(__dirname));

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('Error connecting to MongoDB:', err));

// Define MongoDB schema and model
const userSchema = new mongoose.Schema({
    username: String,
    email: String,
    password: String
});

const User = mongoose.model('User', userSchema);

// Register route
app.post('/register', (req, res) => {
    const { username, email, password } = req.body;
    const newUser = new User({ username, email, password });
    newUser.save()
        .then(() => {
            res.redirect('/login.html');
        })
        .catch(err => {
            console.error('Error registering user:', err);
            res.status(500).send('Internal Server Error');
        });
});

// Login route
// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    User.findOne({ username, password })
        .then(user => {
            if (user) {
                res.redirect('/index2.html');
            } else {
                res.status(401).send('Unauthorized');
            }
        })
        .catch(err => {
            console.error('Error logging in:', err);
            res.status(500).send('Internal Server Error');
        });
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
