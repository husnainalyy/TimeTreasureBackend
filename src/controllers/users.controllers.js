import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


const generateRefreshAndAccessToken = async (userId)=>{
    try {
        const user = await User.findById(userId);
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()
        await user.save({validateBeforeSave:false})
        
        return {accessToken,refreshToken}
        
    } catch (error) {
        throw new ApiError(500,"Something went wrong while generating the tokens")
    }

}


const userRegistration = asyncHandler(async (req, res) => {

    // fields empty or not
    // confirm password or password same or not
    // check email or phone number registered or not


    const { firstName, lastName, email, phoneNumber, password, confirmPassword } = req.body;

    if (
        [firstName, lastName, email, phoneNumber, password, confirmPassword].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400,"all fields are required");
    }
    
    if (!(password === confirmPassword)) {
        throw new ApiError(400,"Password and confirm password not match")
    }
    
    const excitedUser = await User.findOne({
        $or: [{ email },{phoneNumber}]
    })
    
    if (excitedUser) {
        throw new ApiError(400,"User already register with this email or phoneNumber")
    }
    
    const user =await User.create({
        firstName, 
        lastName,
        email,
        phoneNumber,
        password
    })
    
    const createdUser = await User.findOne(user._id).select("-password -refreshToken")
    
    if (!createdUser) {
        throw new ApiError(500, "something went wrong while registering user")
    }
    
    return res.status(201).json(
        new ApiResponse(200,createdUser,"user registered successfully")
    )
})

const loginUser = asyncHandler(async (req, res, next) => {
    const { email, password } = req.body;
    
    if (!email && !password) {
        throw new ApiError(400,"All fields are required")
    }
    
    const user = await User.findOne({email:email})

    if (!user) {
        throw new ApiError(400,"User is not registered")
    }
    
    const checkPassword = await user.isPasswordCorrect(password);
    
    if (!checkPassword) {
        throw new ApiError(400,"The Password not correct")
    }
    
    const { accessToken, refreshToken } = await generateRefreshAndAccessToken(user._id)
    
    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")
    
    const option = {
        httpOnly: true,
        secure: true,
    }
    
    return res
        .status(200)
        .cookie("accessToken",accessToken,option)
        .cookie("refreshToken",refreshToken,option)
        .json(
            new ApiResponse(200,loggedInUser,"User login Successfully") 
        )
    
})




export  { userRegistration, loginUser } 