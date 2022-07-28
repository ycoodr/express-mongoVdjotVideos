const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const app = express();
const port = 5000;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDb connected...'))
.catch(err => console.log(err));

app.engine('handlebars', exphbs.engine({ defaultLayout: 'main'}));
app.set('view engine', 'handlebars');


app.get('/', (req, res) => {
    const title = 'Welcome1';
    res.render('index', { title: title });
    // res.send('index');
});

app.get('/about', (req, res) => {
    res.render('about');
});


app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});