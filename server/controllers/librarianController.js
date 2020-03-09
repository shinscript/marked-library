const pool = require('../database/db');

const librarianController = {};

const check = async (isbn) => {
  const query = {
    name: 'checkBook',
    text: `SELECT * FROM books WHERE isbn = $1`,
    values: [isbn]
  };

  try {
    const result = await pool.query(query);
    return !result.rows.length ? false : result.rows[0].stock;
  } catch (error) {
    error ? console.error(error) : null;
  }
}

librarianController.addBooks = async (req, res) => {
  const { isbn, copies } = req.body;
  let dbStr, values = [isbn, copies];

  try {
    const bookExists = await check(isbn);

    if(bookExists) {
      dbStr = 'INSERT INTO books(isbn, stock) VALUES ($1,$2)';
      values = [isbn, bookExists + copies];
      await pool.query(dbStr, values);
    } else {
      dbStr = 'INSERT INTO books(isbn, stock) VALUES ($1,$2)';
      await pool.query(dbStr, values);
    }

    res
      .status(200)
      .send('Successfully Saved Book(s) into Database');
    
  } catch (error) {
    error ? console.error(error) : null;
  }

};

librarianController.deleteBooks = async (req, res) => {
  const { isbn, copies } = req.body;
  let dbStr, values = [isbn, copies];

  try {
    const bookExists = await check(isbn);
    console.log('Book Exists:', bookExists)
    if( !bookExists ) {
      res
        .status(400)
        .send(`Cannot delete a book that doesn't exist in the database`);
    } else if ( bookExists && ( bookExists - copies ) < 0 ) {
      res
        .status(400)
        .send(`There are only ${bookExists} of ${isbn} in the database`);
    } else if ( bookExists && ( bookExists - copies ) > 0 ) {
      console.log('GREATER THAN ZERO')
      dbStr = `UPDATE books SET stock = $2  WHERE isbn = $1`;
      values = [isbn, (bookExists - copies)];
      await pool.query(dbStr, values);
      res
        .status(200)
        .send(`Successfuly updated database where ${isbn} has ${bookExists} copies`);
    } else {
      console.log('ZERO')
      dbStr = `DELETE FROM books WHERE isbn = $1`
      values = [isbn]
      await pool.query(dbStr, values);
      res
        .status(200)
        .send(`Successfuly delete database ${isbn}`);
    }
  } catch (error) {
    error ? console.error(error) : null;
  }

};

librarianController.listOverdue = async (req, res) => {
  try {
    const queries = {
      name: 'Get All Overdue Books',
      text: 'SELECT * FROM loans WHERE status = $1',
      values: ['overdue']
    }
    const result = await pool.query(queries);
    res
      .status(200)
      .send(result.rows);

  } catch (error) {
    error ? console.error(error) : null;
  }
};

module.exports = librarianController;