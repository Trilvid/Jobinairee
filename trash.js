
// links to portfolio projects 
https://github.com/Trilvid/Jobinairee.git
https://github.com/dee-d-dev/E-Wallet-System-Design.git
https://github.com/KingAbesh/e-commerce-backend.git
https://github.com/jamesmogambi/fintech-backend.git
https://github.com/E-wave112/fuse-wallet.git

// userSchema.pre('save', async function ( next ) {
//   const salt = await bcrypt.genSalt();
//   this.password = await bcrypt.hash(this.password, salt);

//   next();
  
// });


// userSchema.virtual('password').set(function(password){
//   this.password =  this.password;
//   this.salt = this.makesalt();
//   this.hash_password = this.encryptPasssword(password);
// })
// .get(function(){
//   return this._password;
// });

// userSchema.methods = {
//   authenticate: function(plainText){
//     return this.encryptPasssword(plainText) === this.hash_password;
//   },

//   encryptPasssword: function(password){
//     if(!password) return '';
//     try{
//       return crypto.createHmac('sha1', this.salt)
//       .update(password)
//       .digest('hex');
//     }
//   catch (err) {
//     return '';
//   }

//   },

// makesalt: function () {
//     return Math.round(new Date().valueOf() * Math.random()) + '';
// }
// }

// for hashing password 1 || 2
// 1)
// userSchema.pre('save', async function(next) {
//     // only run this function if was modified
//     if (!this.isModified('password')) return next();
  
//     //   hash the password with cost of 12
//     this.password = await bcrypt.hash(this.password, 12);
  
//     next();
//   });

// 2)



// loggin 
// userSchema.statics.login = async function (email, password) {
//   const user = this.findOne({ email });

//   if(user) {
//     const auth = await bcrypt.compare(password, user.password);

//     if(auth) {
//       return user;
//     }
//     throw Error('incorrect password');
//   }
//   throw Error('incorrect Email')
// }
  


// exports.login = async (req, res, next) => {
//   const { email, password } = req.body;

//   try {
//     const user = await User.login({ email, password });

//     if (!user) {

//       res.send('empty feilds || invalid data')
//     }
//     else {
//       res.status(200).json({
//         status: "Ok",
//         message: "user logged in thanks "
//       });
//       // throw Error("failed to login user")
//     }
//     console.log(user);
//   } 
//   catch (err) {
//     res.status(400).json({
//       status: "Fail",
//       message: "invalid details"
//     });
//   }

//   if (!email || !password) {
//     return next(new AppError('please Provide email and password!', 400));
//   }

//   const user = await User.findOne({ email }).select('+password');

//   if (!user || !(await user.correctPassword(password, user.password))) {
//     return next(new AppError('incorrect email or password', 401));
//   }

//   createSendToken(user, 200, res);
// };


// // error handler
// const handleErrors = (err) => {
//   console.log(err.message, err.code);
//   let errors = { email: '', password: ''};

//   // duplication  error
//   if (err.code === 11000) {
//     errors.email = 'that email is already registered';
//     return errors;
//   }
//   // validation errors
//   if (err.message.includes('user validation failed')) {
//     Object.values(err.errors).forEach(({properties}) => {
//       errors[properties.path] = properties.message
//     });
//   }
//   return errors;
// }

// // exports.readController = (req, res) => {
// //   const userId = req.params.Id;
// //   User.findById(userId).exec((err, user) => {
// //     if (err || !user) {
// //       return res.status(400).json({error: "User not found"})
// //     }

// //     user.hash_password = undefined;
// //     user.salt = undefined;
// //     res.json(user);
// //   })
// // }


// signUp

    // const maxAge = process.env.JWT_EXPIRES_IN;
    // res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000});

    // const token = createToken(newUser._id);
    // res.status(201).json({
    //   status: 'success',
    //   token,
    //   user: newUser._id
    // });