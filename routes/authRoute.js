const express = require('express');
const authController = require('./../controllers/authController');
// const userController = require('./../controllers/userController');

const router = express.Router();

// GET REQUEST
router.get('/signup', authController.signUp_get);
router.get('/login', authController.login_get);
router.get('/review', authController.protect, authController.review);


// POST REQUEST
router.post('/signUp', authController.signUp);
router.post('/LFJ', authController.LFJ);
router.post('/LFE', authController.LFE);
router.patch('/location', authController.protect, authController.location);
router.patch('/preference', authController.protect, authController.preference);


router.post('/login', authController.login);

router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);


module.exports = router;