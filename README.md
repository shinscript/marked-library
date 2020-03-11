# marked-library
Library CRUD Application

## What do I need to do to Download?
These steps should only be done once!
- [ ] Open a terminal session and navigate to the directory.
- [ ] Type `git clone <paste github URL>`.
- [ ] Then `cd <folder name>`.

## What do I need to do to Run?
- [ ] run `npm i` to install all dependencies.
- [ ] run `npm start` on your terminal under the `rookie-cookie` Directory.
- [ ] Recommend using postman to play around with this App.

## API Documentation:
# Librarian Endpoints:
- [ ] GET request to `<URL>/librarian` gives you a list of all overdue books from users.
- [ ] POST request to `<URL>/librarian` allows admins to add Books by taking ISBN# + # of copies via the Request Body.
- [ ] DELETE request to `<URL>/librarian` allows admins to remove Books by taking ISBN# + # of copies via the Request Body.

# User Endpoints:
- [ ] POST request to `<URL>/users` gives you a list of all checked out books + statuses & due dates FOR the user.
- [ ] POST request to `<URL>/users/checkout` allows users to checkout a book by bookId + userId(for simple verification) via the Request Body & edits all stock & iterative values.
- [ ] POST request to `<URL>/users/return` allows users to return a book by the same way, it edits all stock & iterative values as well.

## Final Thoughts
- The Database is missing all auth information for both users & admins because of my time contraint. You should really never use an ID from verification purposes.
- Books should have names, authors, publishers & more. Just didn't implement because it wasn't necessary for THIS assignment.
- Wanted to implement micro services to handle requests for Librarians & Users seperately.
- Wanted to implement a reader of the database to constantly update the status for overdue books (something like a tracker);

