var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

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

startApp();
//getParticipant(0);
/*J'arrive pas à appeler les function du contrat !!*/
createParticipant("Greg", 23);

  /*********DEFINE FUNCTION**********/
function startApp() {
    const pollFactory = require('../Truffle/build/contracts/PollFactory.json');
    //const pollFactoryAddress = "0x358cfd70c36732bac99599b62e53a48e2f1742ed";
    const pollFactoryAddress = "0x43a53ccae1dc4bc8c7b19c9112cd217520f38f72";

    pollFactoryContract = new web3.eth.Contract(pollFactory['abi'], pollFactoryAddress);
}

function getParticipant(id) {
    var participants = pollFactoryContract.methods.participants(id).call();
    console.log(participants);
}

async function createParticipant(name, age) {
  var message = pollFactoryContract.methods.getMessage().call();


  //var newId = pollFactoryContract.methods.createparticipant(name, age).call();

  //let deployedContract = await pollFactoryContract.deployed()
  //let newId = await deployedContract.createparticipant(name, age)

  console.log(message);
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
