CREATE TABLE IF NOT EXISTS librarian (
	id SERIAL PRIMARY KEY
);

CREATE TABLE IF NOT EXISTS users (
	id SERIAL PRIMARY KEY,
	books_checked_out INT,
	books_overdue INT
);

CREATE TABLE IF NOT EXISTS books (
	id SERIAL PRIMARY KEY,
	isbn varchar(255),
  stock INT
);

CREATE TABLE IF NOT EXISTS loans (
	id INT,
	user_id INT,
  book_id INT,
  PRIMARY KEY (id, user_id, book_id),
  FOREIGN KEY (user_id) REFERENCES users(id) ON UPDATE CASCADE,
  FOREIGN KEY (book_id) REFERENCES books(id) ON UPDATE CASCADE,
  loan_start_date DATE,
  loan_due_date DATE,
  status varchar(255)
);