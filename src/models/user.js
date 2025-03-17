const mongoose=require('mongoose');
const validator=require('validator');

const userSchema=new mongoose.Schema({
    firstName:{
        type:String,
        required:true,
        minLength:3,
        maxLength:255,
    },
    lastName:{
        type:String,
    },
    password:{
        type:String,
        required:true,
        validate(value){
            if(!validator.isStrongPassword(value))
                throw new Error('password is not strong');
        }
    },
    emailId:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true,
    },
    age:{
        type:Number,
        min:18,
    },
    gender:{
        type:String,
        validate(value){
            if(!['male','female','others'].includes(value)){
                throw Error("gender data is not valid");
            }
        }
    },
    photoUrl:{
        type:String,
        default:'',
        validate(value){
            if(!validator.isURL(value))
                throw Error('url is not correct')
        }
    },
    about:{
        type:String,
        default:"This is default description"
    },
    skills:{
        type:[String],
    }
},{
    timestamps:true,
});
const User=mongoose.model('User',userSchema);
module.exports=User;