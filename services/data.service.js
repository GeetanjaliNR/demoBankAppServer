//importing JWT
const jwt = require('jsonwebtoken');
const db = require('./db');

//database
database = {
  1000: {
    acno: 1000,
    uname: 'Neer',
    password: 1000,
    balance: 5000,
    transaction: [],
  },
  1001: {
    acno: 1001,
    uname: 'Laisha',
    password: 1001,
    balance: 3000,
    transaction: [],
  },
  1002: {
    acno: 1002,
    uname: 'Vyom',
    password: 1002,
    balance: 4000,
    transaction: [],
  },
};

// register -index.js will provide uname,acno,password--
const register = (uname, acno, password) => {
  //converted to asyncronus as call goes to a different port hence promise is to be used
  return db.User.findOne({ acno }).then((user) => {
    console.log(user);

    if (user) {
      //user already exists
      return {
        statusCode: 401,
        status: false,
        message: 'Account number already exists..',
      };
    } else {
      //creating new user using the mongoose model
      const newUser = new db.User({
        acno,
        uname,
        password,
        balance: 0,
        transaction: [],
      });
      newUser.save();

      return {
        statusCode: 200,
        status: true,
        message: 'Successfully registered...Please login!',
      };
    }
  });
};

// login
const login = (acno, pswd) => {
  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (user) {
      currentUser = user.uname;
      currentAcno = acno;
      const token = jwt.sign(
        {
          currentAcno: acno,
        },
        'supersecret123456789'
      );
      return {
        statusCode: 200,
        status: true,
        message: 'Login successful!!',
        currentAcno,
        currentUser,
        token,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Credentials!!',
      };
    }
  });
};

// deposit
const deposit = (acno, pswd, amt) => {
  var amount = parseInt(amt);

  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (user) {
      user.balance += amount;
      user.transaction.push({
        type: 'Credit',
        amount: amount,
      });
      user.save();
      // console.log(database);

      return {
        statusCode: 200,
        status: true,
        message:
          amount +
          ' successfully debited.' +
          'Current balance is ' +
          user.balance,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Credentials!!',
      };
    }
  });
};

// withdraw
const withdraw = (req, acno, pswd, amt) => {
  var amount = parseInt(amt);

  return db.User.findOne({ acno, password: pswd }).then((user) => {
    if (req.currentAcno != acno) {
      return {
        statusCode: 422,
        status: false,
        message: 'operation denied! please enter correct acc number!',
      };
    }

    if (user) {
      if (user.balance > amount) {
        user.balance -= amount;
        user.transaction.push({
          type: 'Debit',
          amount: amount,
        });
        user.save();
        return {
          statusCode: 200,
          status: true,
          message:
            amount +
            ' successfully withdrawn.' +
            'Current balance is ' +
            user.balance,
        };
      } else {
        return {
          statusCode: 422,
          status: false,
          message: 'Insufficient balance!!',
        };
      }
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'Incorrect Credentials!!',
      };
    }
  });
};

//transaction
const transaction = (acno) => {
  return db.User.findOne({ acno }).then((user) => {
    if (user) {
      return {
        statusCode: 200,
        status: true,
        message: user.transaction,
      };
    } else {
      return {
        statusCode: 401,
        status: false,
        message: 'Account number does not exist!',
      };
    }
  });
};

//deleteAcc
const deleteAcc = (acno) => {
  return db.User.deleteOne({ acno }).then((user) => {
    if (!user) {
      return {
        statusCode: 401,
        status: false,
        message: 'Operation Failed!',
      };
    } else {
      return {
        statusCode: 200,
        status: true,
        message: 'Account number' + acno + 'deleted successfully..!',
      };
    }
  });
};

module.exports = {
  register,
  login,
  deposit,
  withdraw,
  transaction,
  deleteAcc,
};
