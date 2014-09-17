var express = require('express');
var app = express();
var logger = require('morgan');
var busboy = require('connect-busboy');
var path = require('path');
var fs = require('fs-extra');
var mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/angualr-todo');

app.use(express.static(__dirname + '/public'));
app.use("/lib", express.static(__dirname + '/public/lib'));
app.use(logger('dev'));
app.use(busboy());

// Definition Model
var Todo = mongoose.model('todo', {
    text: String
});

// app.get('/api/todos', function(req, res) {
//     Todo.find(function(err, todos) {
//         if (err) {
//             res.sed(err);
//         }
//         res.json(todos);
//     });
// });

// app.post('/api/todos', function(req, res) {
//     Todo.create({
//         text: req.body.text,
//         done: false
//     }, function(err, todo) {
//         if (err) {
//             res.send(err);
//         }
//         Todo.find(function(err, todos) {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(todos);
//         });
//     });
// });

// app.delete('/api/todos/:todo', function(req, res) {
//     Todo.remove({
//         _id: req.params.todo
//     }, function(err, todo) {
//         if (err) {
//             res.send(err);
//         }
//         Todo.find(function(err, todos) {
//             if (err) {
//                 res.send(err);
//             }
//             res.json(todos);
//         });
//     })
// });

app.get('/', function(req, res) {
    res.sendfile('index.html');
});


app.post('/', function(req, res) {
    var fstream;
    req.pipe(req.busboy);
    req.busboy.on('file', function(fieldname, file, filename) {
        console.log("Uploading: " + filename);

        //Path where image will be uploaded
        fstream = fs.createWriteStream(__dirname + '/img/' + filename);
        file.pipe(fstream);
        fstream.on('close', function() {
            console.log("Upload Finished of " + filename);
            res.redirect('back'); //where to go next
        });
    });
});
app.listen(8080, function() {
    console.log('App listening on port 8080')
});
