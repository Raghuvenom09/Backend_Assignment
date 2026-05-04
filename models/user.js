const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    // username and password are automatically added by passport-local-mongoose
    favoriteAuthor: {
        type: String,
        required: true
    },
    membershipDate: {
        type: Date,
        default: Date.now
    }
});

// Plugin to add username, hash and salt fields 
UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User', UserSchema);