const mongoose = require('mongoose')

const postSchema = new mongoose.Schema({
    tweetBody : {
        type : String,
        required : true
    },
    userId : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'user'
    }
},
{timestamps: true})

module.exports = mongoose.model('post',postSchema)