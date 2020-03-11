const router = require('express').Router();
const userController = require('../controllers/userController');
const librarianController = require('../controllers/librarianController');

router.get('/librarian', librarianController.listOverdue);
router.post('/librarian', librarianController.addBooks);
router.delete('/librarian', librarianController.deleteBooks);

router.post('/users', userController.listCheckedOut);
router.post('/users/checkout', userController.checkout);
router.post('/users/return', userController.returnBooks);

module.exports = router;