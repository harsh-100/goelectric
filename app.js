//jshint esversion:6
const { query } = require("express");
const express = require("express");
var _ = require("lodash");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const fs = require('fs')
const homeStartingContent = "Lacus vel facilisis volutpat est velit egestas dui id ornare. Semper auctor neque vitae tempus quam. Sit amet cursus sit amet dictum sit amet justo. Viverra tellus in hac habitasse. Imperdiet proin fermentum leo vel orci porta. Donec ultrices tincidunt arcu non sodales neque sodales ut. Mattis molestie a iaculis at erat pellentesque adipiscing. Magnis dis parturient montes nascetur ridiculus mus mauris vitae ultricies. Adipiscing elit ut aliquam purus sit amet luctus venenatis lectus. Ultrices vitae auctor eu augue ut lectus arcu bibendum at. Odio euismod lacinia at quis risus sed vulputate odio ut. Cursus mattis molestie a iaculis at erat pellentesque adipiscing.";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();

let user_login  = 0 ; 

let posts = [];

const content = fs.readFileSync("data.json").toString()
if(content && content.length){
  const data = JSON.parse(content).data 
  posts.push(...data)
}

function writeData(){
  let saveData = {}
  saveData.data = posts
  saveData = JSON.stringify(saveData)

  fs.writeFileSync('data.json', saveData)
}

app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));
app.get("/",function(req,res)
{
  if(user_login ==0)
  {res.render('login')


}
  
  else {
      user_login =0;
      res.render('home', {
      startingContent:homeStartingContent,
      posts:posts
     })
  }

   
});

//Going to about page
app.get("/about",function(req,res){
  res.render('about',{aboutContent})
});

//Going to contact page
app.get("/contact",function(req,res){
  res.render("contact",{contactContent})
  
});

//Going to login page
app.get("/login",function(req,res){
  res.render("login")
});

//login request 
  app.post("/login",function(req,res){
    // const loginForm = document.getElementById("login-form");
    // const loginButton = document.getElementById("login-form-submit");
    // const loginErrorMsg = document.getElementById("login-error-msg");
  
  // loginButton.addEventListener("click", (e) => {
  //     e.preventDefault();
      const username = req.body.username;
      const password = req.body.password;
  
      if (username === "user" && password === "user") {
          console.log("succesfully loged in ")
          user_login = 1;
          res.redirect("/");
         
      } 
      else{
        user_login = 0 ;
        console.log("Not succesfully loged in ")
      }
  
  
  });




//Compose page
app.get("/compose",function(req,res){
  var inputText
  res.render('compose')
});

app.post("/compose",function(req,res){
   var post={
     name : req.body.inputName,
     address : req.body.inputAddress,
     phone : req.body.inputPhone,
     message : req.body.inputMessage
   } 
   posts.push(post);
   writeData()

  res.redirect("/")

})

app.get("/post/:postName",function(req,res){
  posts.forEach(function(post){
    const givenTitle = _.lowerCase(post.name)
    const searchTitle = _.lowerCase(req.params.postName)
    if(searchTitle===givenTitle)
    {
      
      res.render('post',{post})
       
    }
    
   
  })

 
})











app.listen(3000, function() {
  console.log("Server started on port 3000");
});
