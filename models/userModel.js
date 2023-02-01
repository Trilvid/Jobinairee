const mongoose = require('mongoose');
const validate = require('validator');
const bcrypt = require('bcrypt');
const crypto = require('crypto');

const userSchema = new mongoose.Schema(
  {
    name: {
        type: String,
        required: [true, 'this User must have a Name'],
        trim: true,
        maxlength: [40, 'This user must have less or equal then 40 characters'],
        minlength: [10, 'This user must have more or equal then 10 characters']

    },
    userName: {
      type: String,
      required: [true, 'this user should have a username'],
      unique: true,
      // validate: [validate.isUnique, 'this username already exist']
    },
    email: {
      type: String,
      required: [true, 'A user must have an email'],
      unique: true,
      lowercase: true,
      trim: true,
      validate: [validate.isEmail, 'please provide a valid email']
    },
    photo: String,
    password: {
        type: String,
        required: [true, 'please provide a password'],
        minLength: [8, 'minimum password lenght is 8 '],
        select: false
    },
    role: {
      type: String,
      default: 'user',
      enum: ['user', 'employer', 'admin']
    },
    salt: String,
    resetPasswordLink: {
      data: String,
      default: '',
    },
    proffession: {
      type: String
    },
    mobile_number: {
      type: Number
    },
    gender: {
      type: String
    },
    DOB: {
      type: String
    },
    location: {
      type: String
    },
    nationality: {
      type: String
    },
    qualification: {
      type: String
    },
    current_job: {
      type: String
    },
    skills: {
      type: String
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
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
    state: String,
    city: String,
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
    timestamps: true
  }
);

userSchema.methods.correctPassword = async function(
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};


userSchema.pre('save', async function(next) {
    // only run this function if was modified
    if (!this.isModified('password')) return next();
  
    //   hash the password with cost of 12
    this.password = await bcrypt.hash(this.password, 12);
  
  //   delete the passwsord confirm field
  this.passwordConfirm = undefined;
    next();
  });

userSchema.pre('save', function(next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passswordChangedAt = Date().now - 1000;
  next();
});

userSchema.pre(/^find/, function(next) {
  // this points to the current query
  this.find({ active: { $ne: false } });
  next();
});

  userSchema.methods.changedPasswordAfter = function(JWTTimestamp) {
    if (this.passwordChangedAt) {
      const changedTimestamp = parseInt(
        this.passwordChangedAt.getTime() / 1000,
        10
      );
  
      return changedTimestamp < JWTTimestamp; 
    }
  
    return false;
  };

  userSchema.methods.createPasswordResetToken = function() {
    const resetToken = crypto.randomBytes(32).toString('hex');

    this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');

    console.log({resetToken}, this.passwordResetToken);

    this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

    return resetToken;
  };


const User = mongoose.model('user', userSchema);
module.exports = User;