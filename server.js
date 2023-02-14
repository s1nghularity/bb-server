const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const bodyParser = require('body-parser');
const path = require('path');

require('dotenv').config();
const PORT = process.env.PORT || 5000;
const URI = process.env.URI || 'mongodb://localhost:27017/badbank';

const findUserMiddleware = (req, res, next) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      return res.status(500).send(err);
    }
    req.user = user;
    next();
  });
};



//SETS UP EXPRESS APP MIDDLEWARE TO USE JSON+CORS+URL ENCODING AND SERVE STATIC FILES FROM BUILD FOLDER OF REACT APP
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'build')));

//CONNECTS TO DATABASE WITH 'UserInfo' AS COLLECTION NAME FROM userDetails.js
require('./userModels.js');
const User = mongoose.model('UserInfo');

//CONNECTS TO MONGODB DATABASE USING MONGOOSE NOW ALL ROUTE HANDLERS BELOW CAN ACCESS DATABASE
mongoose
  .connect(URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Succesfully connected to MongoDB database!');
  })
  .catch((err) => console.log('Unable to connect to MongoDB database.', err));


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization'
  );
  res.setHeader(
    'Access-Control-Allow-Methods',
    'GET, POST, PUT, DELETE, PATCH, OPTIONS',
  );
  next();
});

//HANDLES DISPLAY OF USER DATA ON ALLDATA PAGE
app.get('/alldata', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({ status: 'success', data: users });
  } catch (error) {
    res.status(500).send({ error: 'Error fetching users.' });
  }
});

//HANDLES CREATION OF NEW USER ON SIGNUP
app.post('/register', async (req, res) => {
  const { id, name, email, password, balance } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);

  try {
    const oldUser = await User.findOne({ email });
    if (oldUser) {
      return res.json({
        error:
          'Sorry, a user with this email is already registered. Please login or use a different email address.',
      });
    }

    const newUser = await User.create([{
      id,
      name,
      email,
      password: encryptedPassword,
      balance,
      transactionHistory: [],
    }]);
    res.json.send({ status: 'User succesfully created!', data: newUser });
  } catch (error) {
    res.send({ status: 'Error creating user.' });
  }
});

//HANDLES LOGIN OF EXISTING USER
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const JWT_SECRET = process.env.JWT_SECRET;

  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ error: 'User not found...' });
  }
  if (await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '24h',
    });

    if (res.status(201)) {
      return res.json({ status: 'ok', data: token });
    } else {
      return res.json({ error: 'error' });
    }
  }
  res.json({ status: 'error', error: 'Invalid Password' });
});

//HANDLES VERIFICATION OF TOKEN
app.post('/userData', async (req, res) => {
  const { token } = req.body;
  try {
    const user = jwt.verify(token, process.env.JWT_SECRET);
    const userEmail = user.email;
    User.findOne({ email: userEmail })
      .then((data) => {
        res.send({ status: 'ok', data: data });
      })
      .catch((error) => {
        res.send({ status: 'error', data: error });
      });
  } catch (error) {}
});




//HANDLES DEPOSIT UPDATE OF USER BALANCE
app.put('/deposit/:id', findUserMiddleware, (req, res) => {
  console.log('User ID:', req.params.id);
  const depositAmount = req.body.userData.depositAmount;
  const newBalance = req.user.balance + depositAmount;
  const newTransactionHistory = [
    {
      type: 'Deposit',
      amount: depositAmount,
      date: new Date().toLocaleDateString(),
    }
  ].concat(req.user.transactionHistory);

  User.findByIdAndUpdate(
    req.params.id,
    { balance: newBalance, transactionHistory: newTransactionHistory },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(user);
    }
  );
});

//HANDLES WITHDRAW UPDATE OF USER BALANCE
app.put('/withdraw/:id', findUserMiddleware, (req, res) => {
  console.log('User ID:', req.params.id);
  const withdrawAmount = req.body.userData.withdrawAmount;
  const newBalance = req.user.balance - withdrawAmount;
  const newTransactionHistory = [
    {
      type: 'Withdrawal',
      amount: withdrawAmount,
      date: new Date().toLocaleDateString(),
    },
  ].concat(req.user.transactionHistory);

  User.findByIdAndUpdate(
    req.params.id,
    { balance: newBalance, transactionHistory: newTransactionHistory },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(user);
    }
  );
});

//HANDLES UPDATE OF COMPONENT WHEN USER BALANCE CHANGES
app.put('/updateBalance/:id', findUserMiddleware, (req, res) => {
  const newBalance = req.body.userData.balance;
  User.findByIdAndUpdate(
    req.params.id,
    { balance: newBalance },
    { new: true },
    (err, user) => {
      if (err) {
        console.log(err);
        return res.status(500).send(err);
      }
      return res.send(user);
    }
  );
});







//SERVES BADBANK REACT APP WITH ABOVE MIDDLEWARE
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, 'build'));
});

app.listen(PORT, () => {
  console.log(`Server successfully started on port ${PORT}`);
});






// // free endpoint
// app.get("/free-endpoint", (req, res) => {
//   res.json({ message: "You are free to access me anytime" });
// });

// // authentication endpoint
// app.get("/auth-endpoint", (req, res) => {
//   res.json({ message: "You are authorized to access me" });
// });