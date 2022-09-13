const tweeetModel = require('../model/postModel')
const validator = require('../util/validation')
const userModel = require('../model/usermodel')

//fore creating tweet
const postTweet = async (req, res) => {
    try {
        let dataFromBody = req.body
        if (!validator.isValidRequestBody(dataFromBody)) {
            return res.status(400).send({ status: false, message: "Content body can't be empty" })
        }

        if (!validator.isValid(dataFromBody.tweetBody)) {
            return res.status(400).send({ status: false, message: "Please Enter Something" })
        }

        if (!validator.isValidObjectId(dataFromBody.userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }
        const findUser = await userModel.findById(dataFromBody.userId)

        if (!findUser) {
            return res.status(404).send({ status: false, message: "User Not Found!!" })
        }
        const creatTweet = await tweeetModel.create(dataFromBody)

        return res.status(201).send({ status: true, message: "Your Tweet was sent", tweet: creatTweet })

    } catch (error) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

const getNewsFeeds = async (req, res) => {
    try {
        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "Content body can't be empty" })
        }
        
        const userId = req.body.userId
        
        if (!validator.isValidObjectId(userId)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        const findUser = await userModel.findById(userId)

        if (!findUser) {
            return res.status(404).send({ status: false, message: "User Not Found!!" })
        }

        const getFollowings = findUser.following
        let tweets = []
        for (let i = 0; i <= getFollowings.length; i++) {
            let tweet = await tweeetModel.find({userId : getFollowings[i]}).select({tweetBody:0}).sort({createdAt:1})
            tweets.push(tweet)
        }

        if(!getFollowings.length){
           let tweets =  await tweeetModel.find({userId:userId}).select({tweetBody:0}).sort({createdAt:1}).limit(10)
           if(!tweets) return res.status(404).send({ status: false, message: "WelCome To twitter, Let's Explore!!" })
           return res.status(200).send({ status: true, tweets : tweets })
        }else {
            let finTweets = tweets.flat()
            let finalTweets = finTweets.sort((a,b)=> { return new Date(a.createdAt)- new Date(b.createdAt)} )
            return res.status(200).send({ status: true, tweets : finalTweets })
        }

    } catch (error) {
        return res.status(500).send({ status: false, error: err.message })
    }

}

module.exports = {postTweet,getNewsFeeds}