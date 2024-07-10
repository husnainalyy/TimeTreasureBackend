import mongoose, { Schema } from "mongoose";
import bcrypt from "bcrypt"


const userSchema = new Schema(
    {
        firstName: {
            type: String,
            require: true,
            trim: true,
            index: true,
            lowercase: true,

        },
        lastName: {
            type: String,
            require: true,
            lowercase: true,
            index: true,
            trim: true,
        },
        email: {
            type: String,
            unique: true,
            require: true,
            trim: true,
            lowercase: true,
            index: true
        },
        phoneNumber: {
            type: Number,
            unique: true,
            require: true,
            trim: true,
            lowercase: true,
            index: true
        },
        password: {
            type: String,
            unique: true,
            require: true,
            trim: true,
            lowercase: true,
            index: true
        },
        refreshToken: {
            type: String,
        },
    },
    {
        timestamps: true,
    },

)

userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();

    this.password =await  bcrypt.hash(this.password, 10)
    next()
})


userSchema.methods.isPasswordCorrect = async function (password) {
    return await bcrypt.compare(password, this.password) 
}

userSchema.methods.generateRefreshToken = function () {
    return jwt.sign(    
        {
            _id:this._id
        },
        process.env.REFRESH_TOKEN_SECRET,
        {
            expiresIn: process.env.REFRESH_TOKEN_EXPIRY
        }
    )
}



export const User = mongoose.model("User",userSchema)