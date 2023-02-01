const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const employerSchema = new mongoose.Schema({
    company: {
        type: String,
        required: [true, "this company should have a name"],
        trim: true,
    },
    email: {
        type: String,
        required: [true, 'A company must have an email'],
        unique: [true, "this email already exists"],
        lowercase: true,
        validate: [validate.isEmail, 'please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: [8, 'minimum password lenght is 8 '],
        select: false
    },
    passwordConfirm: {
      type: String,
      validate: {
        validator: function(el) {
          return el === this.password;
        },
        message: 'password are not the same'
      }
    },
    position: {
        type: String,
        // required: [true]
    },
    nationality: {
        type: String,
        // required: [true, "this user should have a nationality"]
    },
    location: {
        type: String,
        required: [true, "must have a location"]
    },
    number: {
        type: Number,
        // required: [true, "please enter your mobile number"]
    },
    industry:{
        type: String
    },
    no_of_employees: {
        type: Number
    },
    type_of_employee:{
        type: String
    },
    company_website:{
        type: String
    },
    company_phoneNumber: {
        type: Number
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date, 
    state: String,
    city: String,
},
{
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  timestamps: true
}
);
  

employerSchema.methods.correctPassword = async function(
    candidatePassword,
    userPassword
  ) {
    return await bcrypt.compare(candidatePassword, userPassword);
  };
  
  
  employerSchema.pre('save', async function(next) {
      // only run this function if was modified
      if (!this.isModified('password')) return next();
    
      //   hash the password with cost of 12
      this.password = await bcrypt.hash(this.password, 12);
    
    //   delete the passwsord confirm field
    this.passwordConfirm = undefined;
      next();
    });
  
  employerSchema.pre('save', function(next) {
    if (!this.isModified('password') || this.isNew) return next();
  
    this.passswordChangedAt = Date().now - 1000;
    next();
  });
  
    employerSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
      if (this.passwordChangedAt) {
        const changedTimestamp = parseInt(
          this.passwordChangedAt.getTime() / 1000,
          10
        );
    
        return changedTimestamp < JWTTimestamp; 
      }
    
      return false;
    };
  
    employerSchema.methods.createPasswordResetToken = function() {
      const resetToken = crypto.randomBytes(32).toString('hex');
  
      this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  
      console.log({resetToken}, this.passwordResetToken);
  
      this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  
      return resetToken;
    };
  
const Employer = mongoose.model('employer', employerSchema);

module.exports = Employer;