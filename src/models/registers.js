const mongoose = require('mongoose');
const bcrypt=require('bcryptjs');
const jwt=require("jsonwebtoken");


//Schema

const Employees = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  telephone: {
    type: Number,
    required: true,
  },
  userAge: {
    type: Number,
    required: true,
  },
  gender: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cPassword: {
    type: String,
    required: true,
  },
  tokens:[{
    token:{
      type: String,
      required: true,
    }
  }]
});

//generate token
Employees.methods.generateAuthtoken = async function(){
  try{
      const token=await jwt.sign({_id:this._id.toString()},process.env.SECRET_KEY)
      this.tokens=this.tokens.concat({token:token})
      await this.save()
      return token;

  }
  catch(err){
        res.send("the error is "+ err)
        console.log(err)
  }

}


Employees.pre("save",async function(next){
  if(this.isModified("password")){
    this.password= await bcrypt.hash(this.password,10) //10 rounds of salt
    this.cPassword=await bcrypt.hash(this.password,10);
  }
  next();
})


// Models
const Register = mongoose.model('Register', Employees);

// export module in another File

module.exports = Register;
