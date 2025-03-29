import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    name: String,
    image: String
})

const UserSchema = mongoose.model('fine', UserSchema);
module.exports = UserSchema;