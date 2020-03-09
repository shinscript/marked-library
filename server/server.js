const express = require('express');
const app = express();
const cors = require('cors');
const PORT = 3000;

const localRouter = require('./routes/localRouter');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());

app.use('/', localRouter);

app.use('*', (req, res) => {
  res
    .status(404)
    .send('404 Error: Page Not Found');
});

app.listen(PORT, () => {
  console.log(`Listening on Port : ${PORT}`);
});