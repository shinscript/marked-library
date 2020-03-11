const pool = require('../database/db');

const userController = {};

const formatDate = (today) => {
  let timestamp = new Date(today).getTime() + (13 * 24 * 60 * 60 * 1000);
  let date = new Date(timestamp),
      month = '' + (date.getMonth() + 1),
      day = '' + date.getDate(),
      year = date.getFullYear();

  if (month.length < 2) month = '0' + month;
  if (day.length < 2) day = '0' + day;

  return [year, month, day].join('-');
}

const validateUser = async (userId, res) => {
  const dbStr = 'SELECT books_checked_out, books_overdue FROM users WHERE id = $1';
  const values = [userId];
  try {
    const result = await pool.query(dbStr, values);
    
    if(result.rows[0].books_checked_out === 3) {
      res
        .status(200)
        .send('Sorry, you have too many books that are currently checked out');
    } else if (result.rows[0].books_overdue > 0) {
      res
        .status(200)
        .send('Sorry, you have an overdue book. Please return it.');
    } else return true;

  } catch (error) {
    error ? console.error(error) : null;
  }
}

const updateTables = async (bookId, userId, action, status) => {
  let dbStr, values = [bookId];
  console.log(bookId, userId, action, status);
  try {
    if(action === 'return') {
      dbStr = 'UPDATE books SET stock = stock + 1 WHERE id = $1';
      await pool.query(dbStr, values);

      values = [userId];
      if(status === 'overdue') dbStr = 'UPDATE users SET books_overdue = books_overdue - 1 WHERE id = $1';
      else dbStr = 'UPDATE users SET books_checked_out = books_checked_out - 1 WHERE id = $1';
    
      await pool.query(dbStr, values);

      dbStr = 'UPDATE loans SET status = $3 WHERE user_id = $1 AND book_id = $2';
      values = [userId, bookId, 'returned'];

      await pool.query(dbStr, values);

      return true;
    } else {
      dbStr = 'UPDATE books SET stock = stock - 1 WHERE id = $1';
      await pool.query(dbStr, values);

      dbStr = 'UPDATE users SET books_checked_out = books_checked_out + 1 WHERE id = $1';
      values = [userId];

      await pool.query(dbStr, values);

      return true;
    }
  } catch (error) {
    error ? false : null;
  }
}

userController.listCheckedOut = async (req, res) => {
  const { userId } = req.body;

  try {
    const dbStr = `SELECT DISTINCT book_id, isbn, status, loan_due_date FROM loans JOIN books ON loans.book_id = books.id WHERE loans.user_id = $1`;
    const values = [userId];

    const result = await pool.query(dbStr, values);
    if(result.rows.length > 0) {
      res
        .status(200)
        .send(result.rows);
    } else {
      res
        .status(400)
        .send('User does not exist');
    }
    
  } catch (error) {
    error ? console.error(error) : null;
  }
};

userController.checkout = async (req, res) => {
  const { bookId, userId } = req.body;
  const dueDate = formatDate(Date.now());

  try {
    const validated = await validateUser(userId, res);

    if(validated) {
      await updateTables(bookId, userId);
      const dbStr = 'INSERT INTO loans(book_id, user_id, loan_start_date, loan_due_date, status) VALUES ($1,$2,$3,$4,$5)';
      const values = [bookId, userId, 'today', dueDate, 'in progress'];
      await pool.query(dbStr, values);

      res
        .status(200)
        .send('Successfully Checked out Book');
    } else {
      res
        .status(400)
        .send('User CANNOT check out book');
    }

  } catch (error) {
    error ? console.error(error) : null;
  }
};

userController.returnBooks = async (req, res) => {
  const { bookId, userId } = req.body;
  let dbStr, values = [userId, bookId];
  try {
    dbStr = 'SELECT status FROM loans WHERE user_id = $1 AND book_id = $2';
    const result = await pool.query(dbStr, values);
    const updatedTables = await updateTables(bookId, userId, 'return', result.rows[0].status);
    console.log(updatedTables)
    if(updatedTables) {
      res 
        .status(200)
        .send('Successfully Returned Book');
    } else {
      res
        .status(400)
        .send('Could NOT return book');
    }

  } catch (error) {
    error ? console.error(error) : null;
  }
}


module.exports = userController;