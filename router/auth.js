const jwt = require('jsonwebtoken')
const express = require('express')
const bcrypt = require('bcryptjs')
const router = express.Router()
const app = express();

require("../db/conn");
const User = require('../model/userschema');
const cookieParser = require('cookie-parser');

app.use(cookieParser())

router.get('/',(req,res)=>{
    res.send(`Hello World from the server router js`);   
   });

//promisse-------------------------------------------
//    router.post('/register', (req, res)=>{
//     const {name,email,phone,work,password,cpassword}=req.body
//    //get field data 
//     // console.log(name);
//     // console.log(email);

//     // // res.json({message:req.body});
//     if(!name || !email || !phone|| !password || !cpassword){
//         return res.status(422).json({error:"Sahi se bharo"});
//     }
//     User.findOne({email:email})
//     .then((userExist) =>{
//         if(userExist){
//             return res.status(422).json({error:"Email alredy"});
//         }

//         const user = new User({ name, email, phone,password,cpassword});

//         user.save().then(() => {
//         res.status(201).json({message:"Ho vgaya re baba"})
//         }).catch((err) => res.status(500).json({error:"Database lull hai"}));
//     }).catch(err =>{console.log(err); });
 
// })
//Async await

router.post('/signup', async (req, res)=>{
    const {name,email,phone,work,password,cpassword}=req.body
    
    if(!name || !email || !phone|| !work|| !password || !cpassword){
        return res.status(422).json({error:"Sahi se bharo"});
    }
try{
   const userExist = await User.findOne({email:email});
  
   if(userExist){
    return res.status(422).json({error:"Email alredy"});
    }
    else if(password != cpassword ){
        return res.status(422).json({error:"password nai sahi hai"});

    }
    else{
        const user = new User({ name, email, phone, work,password,cpassword});
        //data encryption
        
        
           await user.save();
        
            res.status(201).json({message:"Ho vgaya re baba"})
        
        
    }
}
catch(err){
    console.log(err);

}
})

//login code

router.post('/signin', async (req,res) =>{
  
    try{
        let token;
const {email,password} = req.body;
if( !email || !password){
    
    return res.status(400).json({error : "Incomplete hai re baba field"})
}
const userLogin = await User.findOne({email:email});
if (userLogin){
    const isMatch = await bcrypt.compare(password, userLogin.password);
    token = await userLogin.generateAuthToken();
    res.cookie("jwwt",token,{
        expires:new Date(Date.now() + 25892000000),
        httpOnly:true
    });
    if(!isMatch){
        res.status(400).json({error:"Invalid credential pass"})
    }
    else{
        res.json({message:"User login successfully"})
    }
}
else{
    res.status(400).json({error:"Invalid credential"})
}
}catch(err){
console.log(err)
    }
});


module.exports = router;