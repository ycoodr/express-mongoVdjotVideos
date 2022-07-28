const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
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


app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', { title: title });
    // res.send('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});

app.get('/ideas/add', (req, res) => {
    res.render('ideas/add');
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
        res.send('passed');
    }
});



app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});