const mongoose = require('mongoose');
const DB = 'mongodb+srv://Atif:Atifmoin@cluster0.q4ooxjm.mongodb.net/Merndatauser?retryWrites=true&w=majority';


mongoose.connect(DB).then(()=>{
    console.log(`Connection successfull`);
}).catch((err) => console.log(err));


