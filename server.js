var express = require('express')
var app = express()
var logger = require('morgan')
var bodyParser = require('body-parser')
var methodOverride = require('method-override')

var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/angualr-todo');

app.use(express.static(__dirname + '/public'));
app.use("/lib", express.static(__dirname + '/public/lib'));
app.use(logger('dev'));
app.use(bodyParser());
app.use(methodOverride('X-HTTP-Method-Override'));

app.listen(8080, function() {
    console.log('App listening on port 8080')
});

// Definition Model
var Todo = mongoose.model('todo', {
    text: String
});

app.get('/api/todos', function(req, res) {
    Todo.find(function(err, todos) {
        if (err) {
            res.sed(err);
        }
        res.json(todos);
    });
});

app.post('/api/todos', function(req, res) {
    Todo.create({
        text: req.body.text,
        done: false
    }, function(err, todo) {
        if (err) {
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    });
});

app.delete('/api/todos/:todo', function(req, res) {
    Todo.remove({
        _id: req.params.todo
    }, function(err, todo) {
        if (err) {
            res.send(err);
        }
        Todo.find(function(err, todos) {
            if (err) {
                res.send(err);
            }
            res.json(todos);
        });
    })
});

app.get('*', function(req, res) {
    res.sendfile('index.html');
});
