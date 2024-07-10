import {asyncHandler} from "../utils/AsyncHandler.js"
import { ApiError } from "../utils/ApiError.js";
import { User } from "../models/users.model.js";
import { ApiResponse } from "../utils/ApiResponse.js";


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
     console.log(password)
    const excitedUser = await User.findOne({
        $or: [{ email },{phoneNumber}]
    })
    
    if (excitedUser) {
        throw new ApiError(400,"User already register with this email or password")
    }
    
    const user = User.create({
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

export default userRegistration 