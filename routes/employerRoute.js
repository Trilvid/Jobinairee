const express = require('express');
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

const router = express.Router();


router.post('/Employer/step-1', userController.createEmployer);
router.get(
    '/all-Employers',
     authController.protect,
     authController.restrictTo('admin'),
     userController.allEmployers
      );

router
    .route('/Employer/step-2/:id')
    .patch(userController.employerCompanyInfo);

// router
//   .route('/')
//   .get(userController.getAllUser);
// //   .post(authController.createUser);

// router
//   .route('/:id')
//   // .get(taskController.gettask)
//   .patch(userController.updateUser)
//   .delete(userController.deleteUser);


module.exports = router;
