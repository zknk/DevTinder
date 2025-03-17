const express = require('express');
const connectDB = require('./config/database');
const { errorHandler } = require('./middlewares/errorHandler');
const { admin } = require('./middlewares/auth');
const User = require('./models/user');  // Ensure model name starts with uppercase

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB().then(() => console.log("✅ Database Connected Successfully")).catch(err => console.error("❌ Database Connection Failed:", err));

// Middleware to parse JSON requests
app.use(express.json());

app.post('/signUp', async (req, res) => {
    try {
        console.log("hello");
        // const user = new User({
        //     firstName: "Ankush",
        //     lastName: "Kumar",
        //     emailId:"asb@gmail.com",
        //     password:"Ankush@123",
        // });
        const user=new User(req.body);
        await user.save(); // Use await to ensure it saves before responding
        res.status(201).json({ message: 'User added successfully', user });
    } catch (error) {
        console.error("Error in signup:", error);
        res.status(500).json({ message: "Internal Server Error", error });
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

app.patch('/user',async(req,res)=>{
    const userId=req.body.userId;
    const data=req.body;
    try{
        const user =await User.findByIdAndUpdate(userId,data,{returDocument:"after"});
        console.log(user);
        res.send('user updated successfully');
    }catch(err){
        res.status(400).send('somethign went worng');
    }
}); 


// Start Server
app.listen(port, () => {
    console.log(`🚀 Server is running on http://localhost:${port}`);
});
