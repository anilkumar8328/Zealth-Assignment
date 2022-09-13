const userModel = require('../model/usermodel')
const validator = require('../util/validation')

const createUser = async function (req, res) {

    try {


        let userDetails = req.body

        if (!validator.isValidRequestBody(userDetails)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }

        if (!validator.isValid(userDetails.name)) {
            return res.status(400).send({ status: false, message: "name is required" })
        }

        if (!validator.isValid(userDetails.email)) {
            return res.status(400).send({ status: false, message: "Email-ID is required" })
        }

        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(userDetails.email))
            return res.status(400).send({ status: false, message: "Invalid Email id." })

        const checkEmailFromDb = await userModel.findOne({ email: userDetails.email })

        if (checkEmailFromDb) {
            return res.status(400).send({ status: false, message: `emailId is Exists. Please try another email Id.` })
        }

        if (!validator.isValid(userDetails.password)) {
            return res.status(400).send({ status: false, message: "password is required" })
        }

        if (userDetails.password.length < 8 || userDetails.password.length > 15) {
            return res.status(400).send({ status: false, message: "Password must be of 8-15 letters." })
        }

        const saveUserInDb = await userModel.create(userDetails);

        return res.status(201).send({ status: true, message: "user created successfully!!", data: saveUserInDb });

    } catch (err) {

        return res.status(500).send({ status: false, error: err.message })

    }

}

const followeUser = async function (req,res){
    try {

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }
    
        const followee = req.body.followee
        const follower = req.body.follower

        if(follower == followee) return res.status(400).send({ status: false, message: "You Can't Follow YourSelf" })


        if (!validator.isValidObjectId(follower) && !validator.isValidObjectId(followee)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        const findFollower = await userModel.findById(follower)
        const findFollowee = await userModel.findById(followee)


        if (!findFollower && !findFollowee) {
            return res.status(404).send({ status: false, message: "User Not Found!!" })
        }

        await userModel.findOneAndUpdate({_id:followee},{$push:{following:followee}})
        await userModel.findOneAndUpdate({_id:follower},{$push:{followers:follower}})

        return res.status(201).send({ status: true, message: `${follower} started folllowing ${followee}`});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}

const unfolloweUser = async function (req,res){
    try {

        if (!validator.isValidRequestBody(req.body)) {
            return res.status(400).send({ status: false, message: "please provide valid user Details" })
        }
    
        const followee = req.body.followee
        const follower = req.body.follower

        if(follower == followee) return res.status(400).send({ status: false, message: "You Can't unfollow YourSelf" })


        if (!validator.isValidObjectId(follower) && !validator.isValidObjectId(followee)) {
            return res.status(400).send({ status: false, message: "Invalid userId" })
        }

        const findFollower = await userModel.findById(follower)
        const findFollowee = await userModel.findById(followee)


        if (!findFollower && !findFollowee) {
            return res.status(404).send({ status: false, message: "User Not Found!!" })
        }

        await userModel.findOneAndUpdate({_id:followee},{$pull:{following:followee}})
        await userModel.findOneAndUpdate({_id:follower},{$pull:{followers:follower}})

        return res.status(201).send({ status: true, message: `${follower} unfollowed ${followee}`});

    } catch (err) {
        return res.status(500).send({ status: false, error: err.message })
    }
}


module.exports = {createUser,followeUser,unfolloweUser}