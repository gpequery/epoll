var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var contract = require('truffle-contract')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

var app = express();

/*******MY CODE START********/
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  var web3 = new Web3(web3.currentProvider)
} else {
  var web3 = new Web3(new Web3.providers.HttpProvider('http://localhost:8545'))
}

var pollFactoryContract;
const pollFactory = require('../Truffle/build/contracts/PollFactory.json');

pollFactoryContract = contract(pollFactory);

pollFactoryContract.setProvider(web3.currentProvider);
if (typeof pollFactoryContract.currentProvider.sendAsync !== "function") {
  pollFactoryContract.currentProvider.sendAsync = function() {
    return pollFactoryContract.currentProvider.send.apply(pollFactoryContract.currentProvider, arguments);
  };
}

startApp();
/*J'arrive pas à appeler les function du contrat !!*/
createParticipant("Greg", 23);

  /*********DEFINE FUNCTION**********/
function startApp() {
}

async function createParticipant(name, age) {
  let deployedContract = await pollFactoryContract.deployed() ;
  console.log(await deployedContract.getMessage())
//  var message = pollFactoryContract.getMessage().call();


  //var newId = pollFactoryContract.methods.createparticipant(name, age).call();

  //let deployedContract = await pollFactoryContract.deployed()
  //let newId = await deployedContract.createparticipant(name, age)

  //console.log(message);
}

/*******MY CODE END********/

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'twig');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);

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
