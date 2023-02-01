const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();

// GET Requests
router.get('/dashboard', userController.dashboard);

// PATCH Request
router.patch('/jobSeeker/:id', userController.jobSeeker);
router.patch('/updateMyPassword',
authController.protect, 
authController.updatePassword
);

router.patch('/updateMe', authController.protect, userController.updateMe);
router.delete('/deleteMe', authController.protect, userController.deleteMe);

// POST Requests
router.post('/jobSeeker', userController.jobSeeker);

// GET/POST Request
router
  .route('/')
  .get(
    authController.protect,
    authController.restrictTo('employer','admin'),
    userController.getAllUser);

// router
//   .route('/:id')
//   // .get(taskController.gettask)
//   .patch(userController.updateMe)
//   .delete(userController.deleteME);




module.exports = router;
