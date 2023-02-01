const User = require('./../models/userModel');
const Employer = require('./../models/employerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('./../utils/appError');

// error handle
const catchError = (err, statusCode, res) => {

  res.status(statusCode).json({
      status: 'failed',
      message: err.message
    });
}

// filter body role and email

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};


exports.getAllUser = async (req, res) => {
    try{
      const users = await User.find();
    
      // SEND RESPONSE
      res.status(200).json({
        status: 'success',
        total: users.length,
        users
      });
    }
    catch (err) {
      catchError(err, 500, res);
    }
    };

    exports.dashboard = async (req, res) => {
      try{
        console.log(req.header);

        // SEND RESPONSE
        res.status(200).json({
          status: 'Ok',
          message: "route is working"
        });
      }
      catch (err) {
        catchError(err, 500, res);
      }
    }

  exports.updateMe = catchAsync(async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'this route is not for password update. please use /updateMyPassword.',
        400
      )
    );
  }
    
  const filteredBody = filterObj(req.body, 'name');

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
        new: true,
        runValidators: true
  });

      if (!updatedUser) {
        res.send({
          status: "failed",
          message: "no user with that ID found"
        });
      }

      res.status(201).json({
        status: "success",
        updatedUser
      });
      
  })



  exports.deleteMe = catchAsync( async (req, res) => {

    await User.findByIdAndUpdate(req.user.id, {active: false});

  
    res.status(204).json({
      status: 'success',
      data: null
    });

  });

  exports.allEmployers = async (req, res) => {
    try{
      const employer = await Employer.find();
  
      res.status(200).json({
        status: "Ok",
        total_jobs: employer.length,
        data: {
          employer
        }
      })
    }
    catch(err) {
      catchError(err, 500, res);
    }
  }


exports.jobSeeker = async (req, res) => {
  try {
    const userx = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true
    });

    res.send(userx);
    
  }
   catch (err) {
    catchError (err, 500, res)
  }
}

exports.createEmployer = async (req, res) => {
  try{
  const emp = await Employer.create({
    fullname: req.body.fullname,
    email: req.body.email,
    position: req.body.position,
    nationality: req.body.nationality,
    location: req.body.location,
    number: req.body.number
  })

  res.send(emp);

  }

  catch(err) {
    catchError(err, 500, res)
  }
}

exports.employerCompanyInfo = async (req, res) => {
  try{
    const companyInfo = await Employer.findByIdAndUpdate(req.params.id, {
      company: req.body.company,
      industry: req.body.industry,
      no_of_employees: req.body.no_of_employees,
      type_of_employee: req.body.type_of_employee,
      company_website: req.body.company_website,
      company_phoneNumber: req.body.company_phoneNumber
    }, {
      new: true,
      runValidators: true
    })
    
    res.send(companyInfo);

  }

  catch (err) {
    catchError(err, 500, res)
  }
}