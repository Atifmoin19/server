const dotenv = require("dotenv")
const express =  require ('express');
const app = express();
app.use(express.json())
const jwt = require('jsonwebtoken')
app.use(require('../server/router/auth'))
dotenv.config({path:'./config.env'})
require("./db/conn");
const cookieParser = require('cookie-parser');

app.use(cookieParser())


const PORT = process.env.PORT;

const User = require('./model/userschema')

//middleware 


app.get('/',(req,res)=>{
 res.send(`Hello World from the server app.js`);   
});


app.get('/signin',(req,res)=>{
    res.send(`Hello World from the login`);   
   });

app.get('/signup',(req,res)=>{
    res.send(`Hello World from the reg`);   
   });

   const Authenticate = async (req,res,next) => {
  
      try{
              const newtoken = req.cookies.jwwt;
           
              const verifytkn = jwt.verify(newtoken, process.env.SECRET_KEY);
         
              const rootUser = await User.findOne({_id:verifytkn._id})
             
   
              if(!rootUser){throw new Error('User not found')}
   
                  req.newtoken = newtoken;
                  req.rootUser = rootUser;
                  req.userId = rootUser._id;
   
                  next();
   
      }catch(err){
          res.status(401).send('UNAUTHORIZED: no token provided');
          console.log(err);
      }
   }
   
  
   
  app.get('/about',Authenticate,(req,res)=>{
      res.send(req.rootUser); 
      
     });



     app.get('/getdata',Authenticate,(req,res)=>{
      res.send(req.rootUser); 
      
     });
   
     app.post('/contact',Authenticate ,async(req,res)=>{
      try
      {
         const {name,email,message,phone}=req.body

         if(!name || !email || !message || !phone ){
            console.log("Error contact form");
            return res.json({error:"pls fill all fields"});
         }

         const userContact = await User.findOne({_id: req.userId})
         if(userContact){
            const userMessage = await userContact.addMessage(name,email,phone,message);
            await userContact.save()
            res.status(201).json({message:"user Contact successfully"})
         }
      }catch(err){
         console.log(err);
      }
   });


app.listen(PORT,()=>{
   console.log(`Server is running at ${PORT}`);
})