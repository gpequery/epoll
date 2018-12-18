const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const electionRouter = require('./routes/election');

let app = express();

// var electionClass = require('./Contracts/ElectionContract');
// var electionContract = new electionClass();


// electionContract.getElection(0)
// .then( election => {
//     console.log('GET ELECTION : ' + election);
// }).catch( error => {
//     console.log(error);
// });

// electionContract.getElectionsSize()
// .then( size => {
//     console.log('ELECTION SIZE : ' + size);
// }).catch( error => {
//     console.log(error);
// });

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/election', electionRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error');
});

module.exports = app;
