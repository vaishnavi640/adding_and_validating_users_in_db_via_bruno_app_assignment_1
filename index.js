const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const User = require('./schema');
const app = express();
require('dotenv').config(); 
app.use(express.json());
const port = 3010;

mongoose.connect(process.env.MONGO_URL)
.then(() => console.log('MongoDB connected'))
.catch((err) => console.log(err));

app.post('/register', async (req, res) => {
  const { username, email, password } = req.body;


  if (!username || !email || !password) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  try {
   
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = new User({
      username,
      email,
      password: hashedPassword, 
    });

    await newUser.save();
    
    res.status(201).json({ message: 'User registered successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log(`server live at http://localhost:${port}`);
});
