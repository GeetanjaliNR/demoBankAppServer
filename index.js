// importing express
const express = require('express');
const jwt = require('jsonwebtoken');
const cors = require('cors');

//importing data services
const dataService = require('./services/data.service');

//creat server app using express-- create an object of express
const app = express();

//use cors
app.use(
  cors({
    origin: 'http://localhost:4200',
  })
);
//to parse json
app.use(express.json());

// resolving API call
//GET- to read dtat
app.get('/', (req, res) => {
  res.send('GET request processed');
});

//PUT- to update/modify data
app.put('/', (req, res) => {
  res.send('PUT Request');
});

//PATCH- to partially update the data
app.patch('/', (req, res) => {
  res.send('PATCH Request');
});

//DELETE- to delete the data
app.delete('/', (req, res) => {
  res.send('DELETE Request');
});

const jwtMiddleWare = (req, res, next) => {
  try {
    const token = req.headers['x-access-token'];
    const data = jwt.verify(token, 'supersecret123456789');
    req.currentAcno = data.currentAcno;
    next();
  } catch {
    res.status(401).json({
      status: false,
      message: 'Please log in !',
    });
  }
};

//Register
app.post('/register', (req, res) => {
  dataService
    .register(req.body.uname, req.body.acno, req.body.password)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//login
app.post('/login', (req, res) => {
  dataService.login(req.body.acno, req.body.pswd).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//deposit
app.post('/deposit', jwtMiddleWare, (req, res) => {
  dataService
    .deposit(req.body.acno, req.body.pswd, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//withdraw
app.post('/withdraw', jwtMiddleWare, (req, res) => {
  dataService
    .withdraw(req, req.body.acno, req.body.pswd, req.body.amt)
    .then((result) => {
      res.status(result.statusCode).json(result);
    });
});

//transaction
app.post('/transaction', jwtMiddleWare, (req, res) => {
  dataService.transaction(req.body.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//onDelete
app.delete('/onDelete/:acno', jwtMiddleWare, (req, res) => {
  dataService.deleteAcc(req.params.acno).then((result) => {
    res.status(result.statusCode).json(result);
  });
});

//setting port number
app.listen(3000, () => {
  console.log('server started at 3000');
});
