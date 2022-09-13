const express = require('express')
const router = express.Router()

//importing modules
const userComtroller = require('../controller/UserController')
const postController = require('../controller/creatTweet')

//create user (this is an extra and core API through which we create user and tweet ) 

router.post('/createUser',userComtroller.createUser)

//EndPoint 1
router.post("/postTweet", postController.postTweet)

//EndPoint 2
router.post('/follow', userComtroller.followeUser)

//EndPoint 3
router.post('/unfollow',userComtroller.unfolloweUser)

//Endpoint 4
router.post('/getNewsFeed',postController.getNewsFeeds)
module.exports = router