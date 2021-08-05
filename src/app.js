require('dotenv').config()
const express = require('express');
const app = express();
const bcrypt=require('bcryptjs')
const jwt=require("jsonwebtoken")


const path = require('path');
const hbs = require('hbs');

require('./db/conn.js');

// importing models
const Register = require('./models/registers');
const port = process.env.PORT || 8000;

//setting paths
const staticPath = path.join(__dirname, '../public');
const template_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(express.static(staticPath));

app.set('view engine', 'hbs');
app.set('views', template_path);
hbs.registerPartials(partials_path);

app.get('/', (req, res) => {
  res.render('index');
});
app.get('/register', (req, res) => {
  res.render('register');
});

app.get('/login', (req, res) => {
  res.render('login')
});

// creating a new user in database
app.post('/register', async (req, res) => {
  try {
    const password = req.body.password;
    const cPassword = req.body.cPassword;

    if (password === cPassword) {
      const EmployeeRegister = new Register({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        telephone: req.body.telephone,
        userAge: req.body.userAge,
        gender: req.body.gender,
        email: req.body.email,
        password: password,
        cPassword: cPassword,
      });

        const token=await EmployeeRegister.generateAuthtoken() //call method

      const registries = await EmployeeRegister.save();

      res.status(201).render('index');
    } else {
      res.send('password is wrong');
    }
  } catch (err) {
    res.status(400).send(err);
  }
});

//login validation

app.post('/login',async(req,res)=>{
  try{
      const email=req.body.email;
      const password=req.body.password;
    const verifiedEmail= await Register.findOne({email:email})
    const isMatch=await bcrypt.compare(password,verifiedEmail.password )
    const token=await verifiedEmail.generateAuthtoken()


        if(isMatch){
          res.status(201).render('index')
        }
        else{
          res.send('user not found')
        }

  }
  catch(err){
    res.status(400).send('Invalid credentials')
  }
})




 



app.listen(port, () => {
  console.log('listening on port 8000');
});
