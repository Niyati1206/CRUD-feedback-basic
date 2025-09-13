const express = require('express');
const mongoose = require('mongoose');
const User = require('./models/User');
const path = require('path');
const app = express();
const PORT = 3000;

//connect to MongoDB
mongoose.connect('mongodb://localhost:27017/user-crud', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log("Mongo DB connected");
}).catch((err) => {
    console.log("Mongo error", err);
})

//since i am using html , ejs is used to render html
app.set('view engine', 'ejs');
//tells where to search for the ejs files to render
app.set('views', path.join(__dirname, 'views'));

//middleware that helps express toi read form data
app.use(express.urlencoded({ extended: true }));

//deal with static files
app.use(express.static(path.join(__dirname, 'public')));

//routes

//showing all users and form
app.get('/', async (req, res) => {
    try {
        const users = await User.find().sort({ createdAt: -1 }); //-1 is for sorting in descending order based on creation date
        res.render('index', { users }); //upar se jo users data mila wo render karo
    }
    catch (err) {
        console.log(err);
        res.status(500).send("Server Error");
    }
});

//create  a new user
app.post('/users', async (req, res) => {
    try {
        const { name, email, age, feedback } = req.body;
        await User.create({
            name, email,
            //If age was given (not empty), turn it into a number else don’t store it at all (undefined).
            age: age ? Number(age) : undefined,
            feedback
        });
        res.redirect('/'); //once data added check it on home page
    } catch (err) {
        console.log(err);
        res.status(400).send('Could not create user.');
    }
});


//show edit form for a particular user
app.get('/users/:id/edit', async (req, res) => {
    try {
        const user = await User.findById(req.params.id); //search user by id in db
        if (!user) {
            res.status(404).send('User not found');
        }
        res.render('edit', { user }); //render edit form with user data
    } catch (err) {
        console.error(err);
        res.status(500).send('Server error');
    }
});

//update a particular user 
// html forms do not support put and delete method so we use post only
app.post('/users/:id/update', async (req, res) => {
    try {
        const { name, email, age, feedback } = req.body;
        await User.findByIdAndUpdate(req.params.id,
            { name, email, age: age ? Number(age) : undefined, feedback },
            { runValidators: true }); //Tells Mongoose to enforce your schema rules even during updates.
        //Example: if your schema says email must be unique or age must be a number ≥ 0, Mongoose will check that before saving.
        res.redirect('/')//check for updated data
    } catch (err) {
        console.error(err);
        res.status(400).send('Could not update user.');
    }
});

//delete user
app.post('/users/:id/delete', async (req,res)=>{
    try{
        await User.findByIdAndDelete(req.params.id);
        res.redirect('/');
    }catch(err){
        console.log(err);
        res.status(500).send("Could not delete the user");
    }
});
//connect to server
app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
})