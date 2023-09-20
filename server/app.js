const express = require('express');
const app = express();
const port = 4000;
const users = [];
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Middleware for parsing JSON bodies
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello, Euphoria!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});

app.post('/signup', async (req, res) => {
  const { username, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  users.push({ username, password: hashedPassword });
  res.status(201).json({ message: 'User created' });
});

app.post('/signin', async (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (user && await bcrypt.compare(password, user.password)) {
    const token = jwt.sign({ username: user.username }, 'your-secret-key', { expiresIn: '1h' });
    res.status(200).json({ token });
  } else {
    res.status(401).json({ message: 'Invalid username or password' });
  }
});
