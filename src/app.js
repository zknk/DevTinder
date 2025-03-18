const express = require('express');
const connectDB = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { admin } = require('./middlewares/auth');
const User = require('./models/user');  // Ensure model name starts with uppercase
const validator=require('validator');
const {validateSignUpData}=require('validateSignUpData');
const bcrypt=require('bcrypt');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB().then(() => console.log("✅ Database Connected Successfully")).catch(err => console.error("❌ Database Connection Failed:", err));

// Middleware to parse JSON requests
app.use(express.json());

app.post('/signUp', async (req, res) => {
    try {
        // console.log("hello");
        validateSignUpData(req);
        const {firstName,lastName,emailId,password}=req.body;
        const saltRound=10;
        const passwordHash= await bcrypt.hash(password,saltRound);
    
        const email =req.body.emailId;
        if(!validator.isEmail(email))
            throw new Error('email is not correct'); 
        
        const user=new User({
            firstName,
            lastName,
            emailId,
            passwordHash
        });

        user.password=passwordHash;

        await user.save(); // Use await to ensure it saves before responding
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error("Error in signup:", error);
        // res.status(500).json({ message: "Internal Server Error" +error });
        res.status(500).send(error.message);
    }
});

app.post('/login',async(req,res)=>{
    try{
        validateLoginData(req);
        const{emailId,password}=req.body;

        const user=await User.findOne({emailId});
        if(!user)
            throw new Error('email is not registered');
        const isPasswordCorrect=await bcrypt.compare(password,user.password);
        
        if(!isPasswordCorrect)
            throw new Error('Invalid credential');
        else res.status(200).send('login successfull')
    }catch(err){
        res.status(400).send(err.message);
    }
});

app.get('/user',async(req,res)=>{
    const userEmail=req.body.emailId;

    try{
       const user= await User.findOne({emailId:userEmail});
       if(!user){
            res.status(404).send("user NOt found");
       }
        res.json(user);
    }
    catch(err){
        res.status(400).send("something went wrong");
    }
});

app.get('/feed',async(req,res)=>{
    try{
        const users=await User.find({});
        res.send(users);
    }
    catch(err){
        res.status(500).send('something  wnet wrong');
    }
});


app.delete('/user',async(req,res)=>{
    const userId=req.body.userId;
    try{
        //both works
        // const  user=await User.findOneAndDelete({_id:userId});
        const  user=await User.findByIdAndDelete(userId);
        res.send('user delted successfully')
    }
    catch(err){
        res.status(400).send('something went wrong');
    }
})

app.patch('/user/:userId',async(req,res)=>{
    // const userId=req.body.userId;
    const userId=req.params?.userId;
    const data=req.body;

    try{
        // const Allowed_updates=['photoUrl','about','gender','age','skills'];
        // const isUpdateAllowed=Object.keys(data).every((k)=>Allowed_updates.includes(k));
        // if(!isUpdateAllowed){
        //     throw new Error('update not allowed');
        // }
        const Allowed_updates = ['photoUrl', 'about', 'gender', 'age', 'skills'];

        const unallowedUpdates = Object.keys(data).filter((k) => !Allowed_updates.includes(k));

        if (unallowedUpdates.length > 0) {
            throw new Error(`The following updates are not allowed: ${unallowedUpdates.join(', ')}`);
        }

        if(data.skils.length()>100){
            throw new Error('skills have too large data');
        }

        // // If the code reaches here, all updates are allowed
        // console.log('All updates are allowed');

        const user =await User.findByIdAndUpdate(userId,data,{returDocument:"after",runValidators:true});
        console.log(user);
        res.send('user updated successfully');
    }catch(err){
        res.status(400).send('Update failed'+err.message);
    }
}); 


// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
