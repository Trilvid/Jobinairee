const User = require('./../models/userModel');
const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');
const sendEmail = require('./../utils/email');
const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const crypto = require('crypto');
const Employer = require('./../models/employerModel');

const catchError = (err, statusCode, res) => {
    res.status(statusCode).json({
        status: 'failed',
        message: err.message
      });
}

const createToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn:  process.env.JWT_EXPIRES_IN
  })
}

const success = ( statusCode, res, user) => {
  const token = createToken(user.id);
  res.status(statusCode).json({
      status: 'success',
      token
    });
}


exports.signUp_get = (req, res) => {
  res.render('signup')
}

exports.login_get = (req, res) => {
  res.render('login')
}


exports.signUp = (req, res) => {
  res.render('createAcct')
}

// exports.signUp = async (req, res) => {
//   try{
//     const newUser = await User.create({
//       name: req.body.name,
//       userName: req.body.userName,
//       email: req.body.email,
//       password: req.body.password,
//       role: req.body.role
//     });
        
//     success ( 201, res, newUser)

//   }
//     catch (err) {
//         catchError(err, 500, res)
//     }
// }

// looking for a job 
exports.LFJ = async (req, res) => {
  try{
    const lfj = await User.create({
      name: req.body.name,
      userName: req.body.userName,
      email: req.body.email,
      password: req.body.password,
      role: req.body.role
    });   
    success ( 201, res, lfj)
  }
    catch (err) {
        catchError(err, 500, res)
    }
}

// looking for an employee
exports.LFE = async (req, res) => {
  try{
    const lfe = await Employer.create({
      company: req.body.company,
      location: req.body.location,
      email: req.body.email,
      password: req.body.password
    });
    success ( 201, res, lfe)
  }
    catch (err) {
        catchError(err, 500, res)
    }
}

// location
exports.location = async (req, res) => {
  try{
    const lfe = await Employer || User;
    
    lfe.findByIdAndUpdate({
      state: req.body.state,
      city: req.body.city
    });

    res.status(200).json({
      status: "Ok",
      message: lfe
    })
  }
    catch (err) {
        catchError(err, 500, res)
    }
}

exports.preference = catchAsync(async (req, res, next) => {

  const lfe = await Employer.findByIdAndUpdate(req.user.id,{
    title: req.body.title
  });

  const lfj = await User.findByIdAndUpdate({
    title: req.body.title
  })

    res.status(200).json({
      status: "Ok",
      message: [lfj, lfe]
    })
})

exports.review = catchAsync(async (req, res, next) => {
  const review = await User.findById(req.user.id)||Employer.findById(req.Employer.id);

  res.status(200).json({
    status:  "Ok",
    message: review
  })
})


exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new AppError('please provide email and password! ', 400))
  }
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
      return next( new AppError('incorrect email or password', 401));
  }

  success( 200, res, user)

})


exports.protect = catchAsync(async (req, res, next) => {
    // 1) Getting token and checking if it is there
    let token;
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith('Bearer')
    ) {
      token = req.headers.authorization.split(' ')[1];
    }
  
    if (!token) {
      return next(
        new AppError(
          'You are not logged in! please log in to get access',
          401
        )
      );
    }
  
    // 2) verifing the token
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

    // 3) checks if user still exists
    const currentUser = await User.findById(decoded.id);
    // const currentEmployer = await Employer.findById(decoded.id)
    if (!currentUser) {
      return next(
        new AppError('The User belonging to this token does not exists', 401)
      );
    }
  
    // 4) checking if user changed password after the token was issused
    if (currentUser.changedPasswordAfter(decoded.iat)) {
      return next(
        new AppError('User recently changed password! please login again', 401)
      );
    }
  
    // Grant access to protected route
    req.user = currentUser;
    next();
})

exports.restrictTo = (...roles) => {
  return (req, res, next)  => { 

    if (!roles.includes(req.user.role)) {
      return next(new AppError('you do not have permission to perform this action , 403'))
    }
    
  next();
  }
}

exports.forgotPassword = catchAsync (async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('invalid user', 404));
    // const err = "invalid user";
    // return catchError(err, 404, res);
  }

  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false});


  const resetURL = `${req.protocol}://${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\n if you did'nt forget your password, please ignore this email!`;


  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (token valid for 10 minutes)',
      message
    });

    res.status(200).json({
      status: 'success',
      message: 'Token sent to email'
    });
  } 
  catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      // new AppError('There was an error sending the email try again later', 500)
      res.status(500).json({
        status: "Ok",
        message: "There was an error sending the email try again later"
      })
    );
  }

})


exports.resetPassword = catchAsync (async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: {$gt: Date.now() }
    });

    if (!user) {
      return next(
        res.status(400).json({
          status: "Fail",
          message: "Token is invalid or has expired"
        }
        )
      )
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    success( 200, res, user)
}) 


exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get the user from collection
  const user = await User.findById(req.user.id).select('+password');

  
  // 2) Check if posted current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('your current password is wrong.', 401));
  }
  // console.log(user);

  // 3) if so update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) log user in and send jwt
  success( 200, res, user)

})
  