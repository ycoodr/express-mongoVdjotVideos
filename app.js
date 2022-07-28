const express = require('express');
const exphbs = require('express-handlebars');
const app = express();
const port = 5000;

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