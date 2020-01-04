const mongoose = require('mongoose');
const bcrypt = require('bcrypt-nodejs');
const table = require('../table');

const NUM_TAG_LIMIT = 5;

// schema
let userSchema = mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required!'],
        match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
        trim: true,
        unique: true,
    },
    password: {
        type: String,
        required: [true, 'Password is required!'],
        select: false
    },
    name: {
        type: String,
        required: [true, 'Name is required!'],
        match: [/^.{4,12}$/, 'Should be 4-12 characters!'],
        trim: true,
    },
    email: {
        type: String,
        match: [/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'Should be a vaild email address!'],
        trim: true,
        unique: true,
    },
    profile: {
        type: Buffer,
    },
    exp: {
        type: Number,
        default: 0,
    },
    tags: {
        type: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'tag'
        }],
        validate: [tagLimit, 'Tag should be <= 5']
    }
}, {
    toObject: {
        virtuals: true,
    },
    toJSON: {virtuals: true}
});

// virtuals
userSchema.virtual('passwordConfirmation')
    .get(function () {
        return this._passwordConfirmation;
    })
    .set(function (value) {
        this._passwordConfirmation = value;
    });

userSchema.virtual('originalPassword')
    .get(function () {
        return this._originalPassword;
    })
    .set(function (value) {
        this._originalPassword = value;
    });

userSchema.virtual('currentPassword')
    .get(function () {
        return this._currentPassword;
    })
    .set(function (value) {
        this._currentPassword = value;
    });

userSchema.virtual('newPassword')
    .get(function () {
        return this._newPassword;
    })
    .set(function (value) {
        this._newPassword = value;
    });

userSchema.virtual('level')
    .get(function () {
        let expTable = table.expTable;
        for (let level in expTable) {
            if (this.exp < expTable[level]) {
                return level - 1;
            }
        }
    })

// password validation
const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,16}$/;
const passwordRegexErrorMessage = 'Should be minimum 8 characters of alphabet and number combination!';
userSchema.path('password').validate(function (v) {
    let user = this;

    // create user
    if (user.isNew) {
        if (!user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation is required!');
        }
        if (!passwordRegex.test(user.password)) {
            user.invalidate('password', passwordRegexErrorMessage);
        } else if (user.password !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
    }

    // update user
    if (!user.isNew) {
        if (!user.currentPassword) {
            user.invalidate('currentPassword', 'Current Password is required!');
        }
        if (user.currentPassword && !bcrypt.compareSync(user.currentPassword, user.originalPassword)) {
            user.invalidate('currentPassword', 'Current Password is invalid!');
        }
        if (user.newPassword && !passwordRegex.test(user.newPassword)) {
            user.invalidate('newPassword', passwordRegexErrorMessage);
        } else if (user.newPassword !== user.passwordConfirmation) {
            user.invalidate('passwordConfirmation', 'Password Confirmation does not matched!');
        }
    }
});

// hash password
userSchema.pre('save', function (next) {
    let user = this;
    while (user.tags.length > NUM_TAG_LIMIT) {
        user.tags.shift();
    }
    if (!user.isModified('password')) {
        return next();
    } else {
        user.password = bcrypt.hashSync(user.password);
        return next();
    }
});

// model methods
userSchema.methods.authenticate = function (password) {
    let user = this;
    return bcrypt.compareSync(password, user.password);
};

// model & export
let User = mongoose.model('user', userSchema);
module.exports = User;


function tagLimit(val) {
    return val.length <= NUM_TAG_LIMIT;
}