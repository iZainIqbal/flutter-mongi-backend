const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

mongoose.connect('mongodb://localhost:27017/crud');

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB Atlas');
});
const expenseSchema = new mongoose.Schema({
  title: String,
  amount: Number,
  category: String,
  date: Date
});

const Expense = mongoose.model('Expense', expenseSchema);

app.get('/expenses', async (req, res) => {
  try {
    const expenses = await Expense.find();
    res.json(expenses);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post('/expenses', async (req, res) => {
  const expense = new Expense({
    title: req.body.title,
    amount: req.body.amount,
    category: req.body.category,
    date: req.body.date
  });

  try {
    const newExpense = await expense.save();
    res.status(201).json(newExpense);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.delete('/expenses/:id', async (req, res) => {
  try {
    await Expense.findByIdAndDelete(req.params.id);
    res.json({ message: 'Expense deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});

