const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.json());

// MongoDB Connection
mongoose.connect('mongodb://localhost:27017/crud');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});

// Define a schema
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: Date,
});

const Expense = mongoose.model('Expense', expenseSchema);

// Routes
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.post('/expenses', async (req, res) => {
  const newExpense = new Expense(req.body);
  try {
    const savedExpense = await newExpense.save();
    res.status(201).send(savedExpense);
  } catch (err) {
    res.status(400).send(err);
  }
});

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.status(200).send(expenses);
  } catch (err) {
    res.status(500).send(err);
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
