const router = require('express').Router();
const userController = require('../controllers/userController');
const librarianController = require('../controllers/librarianController');

router.get('/librarian', librarianController.listOverdue);
router.post('/librarian', librarianController.addBooks);
router.delete('/librarian', librarianController.deleteBooks);

module.exports = router;