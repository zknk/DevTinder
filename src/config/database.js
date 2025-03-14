const mongoose =require('mongoose');
// require('d');

const connectDB=async()=>{
    try{
        await mongoose.connect('mongodb+srv://ak4907922:112004@cluster0.doqfenh.mongodb.net/DevTinder');
        console.log('databse connected ');
    }
    catch(error){
        console.log('error in databse connection');
    }
}

module.exports=connectDB


