const express = require ('express'),
app = express(),
path = require('path')
mongoose = require('mongoose'),
cors = require('cors'),
env = require('dotenv');

const { Recipe, UserDet }= require('./models/recipe')

app.use("/images" ,(req, res) => {
  const targetFile = "/public/img"+req.path;
  console.log(targetFile);
  res.sendFile(path.join(__dirname+targetFile));
})

env.config();



const PORT = process.env.PORT || 5501

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
}) 

app.use(express.json())

// Define the development database
const mongoURI = 'mongodb://localhost/recipe'

// connecting to mongodb from your application
mongoose.connect(mongoURI, { useNewUrlParser: true }, (err) => {
   if(err) return console.log(`${err}`)
   console.log("connected to mongodb")
 })

app.use("/", (req, res, next) => {
  console.log(req.url)
 if(req.url === "/login" || req.url === "/register") {
   next()
 }
 else {
   const token = req.header('token');
   console.log(token);
   if(token === "letmein") {
     next()
   } else {
     res.status(403).send("Unauthorized user")
   }
 }
})

app.get('/', (req, res) => {
 res.send("Hello World")
})

app.post('/recipe', (req,res) => {
  const { id, name, cuisine, price } = req.body

  const  recipe = new Recipe({ id, name, cuisine, price });
  recipe.save()
  .then( newRecipe => {
    res.json(newRecipe)
  })
  .catch( err => res.json(err))
})


app.post('/register', (req,res) => {
  const { username, password } = req.body

  const  user = new UserDet({ "username": username, "password": password });
  user.save()
  .then( newUser => {
    res.json(newUser)
  })
  .catch( err => res.json(err))
})


