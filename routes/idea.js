const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/vidjot-dev')
.then(() => console.log('MongoDb connected...'))
.catch(err => console.log(err));

const {ensureAuthenticated} = require('../helpers/auth');

require('../models/idea');
const Idea = mongoose.model('ideas');

router.get('/', ensureAuthenticated, (req, res) => {
    Idea.find({}).lean()
    .sort({date: 'desc'})
    .then(ideas => {
        res.render('ideas/index', {ideas: ideas});
    });
    
});

router.get('/add', ensureAuthenticated, (req, res) => {
    res.render('ideas/add');
});

router.get('/edit/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    }).lean()
    .then(idea => {
        res.render('ideas/edit', {idea:idea});
    });
    
});

router.post('/', ensureAuthenticated, (req, res) => {
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
            req.flash('success_msg', 'Video idea added');
            res.redirect('/ideas');
        })
    }
});

router.put('/:id', ensureAuthenticated, (req, res) => {
    Idea.findOne({
        _id: req.params.id
    })
    .then(idea => {
        idea.title = req.body.title;
        idea.details = req.body.details;
        
        idea.save()
        .then(idea => {
            req.flash('success_msg', 'Video idea updated');
            res.redirect('/ideas');
        });
    });
});

router.delete('/:id', ensureAuthenticated, (req, res) => {
    Idea.remove({_id: req.params.id}).
    then(() => {
        req.flash('success_msg', 'Video idea removed');
        res.redirect('/ideas');
    });
});

module.exports = router;