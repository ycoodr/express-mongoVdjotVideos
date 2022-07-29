const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const app = express();
const port = 5000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDb connected...'))
.catch(err => console.log(err));

require('./models/idea');
const Idea = mongoose.model('ideas');

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(methodOverride('_method'));


app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', { title: title });
    // res.send('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/ideas', (req, res) => {
    Idea.find({}).lean()
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {ideas: ideas});
    });
    
});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
});

app.get('/ideas/edit/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).lean()
    .then(idea => {
        res.render('ideas/edit', {idea:idea});
    });
    
});

app.post('/ideas', (req, res) => {
    // console.log(req.body);
    // res.send('ok');
    let errors = [];

    if(!req.body.title){
        errors.push({ text: 'Please add a title'});
    }

    if(!req.body.details){
        errors.push({ text: 'Please add some details'});
    }

    if(errors.length > 0){
        res.render('ideas/add', {
            errors: errors,
            title: req.body.title,
            details: req.body.details

        });
    } else {
        // res.send('passed');
        const newUser = {
            title: req.body.title,
            details: req.body.details
        }
        new Idea(newUser).save()
        .then(idea => {
            res.redirect('/ideas');
        })
    }
});

app.put('/ideas/:id', (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save()
        .then(idea => {
            res.redirect('/ideas');
        });
    });
});

app.delete('/ideas/:id', (req, res) => {
    Idea.remove({_id: req.params.id}).
    then(() => {
        res.redirect('/ideas');
    });
});

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});