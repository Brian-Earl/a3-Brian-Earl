const http = require( 'http' ),
      fs   = require( 'fs' ),
      // IMPORTANT: you must run `npm install` in the directory for this assignment
      // to install the mime library used in the following line of code
      mime = require( 'mime' ),
      dir  = 'public/',
      port = 3000,
      Express = require('express'),
      express = Express(),
      bodyParser = require('body-parser'),
      serveStatic = require('serve-static'),
      serveFavicon = require('serve-favicon'),
      Sequelize = require('sequelize'),
      passport = require('passport'),
      Strategy = require('passport-local').Strategy,
      morgan = require('morgan'),
      cookieParser = require('cookie-parser'),
      session = require('express-session'),
      db = require('./public/db'),
      dbFile = require('./object.json'),
      path = require('path'),
      bcrypt = require('bcrypt'),
      saltRounds = 10

var dbSeq;
var users;

express.use(bodyParser.urlencoded());
express.use(bodyParser.json());
express.use(session({
    secret: 'eggnog',
    resave: true,
    saveUninitialized: true
}));
express.use(passport.initialize());
express.use(passport.session());
express.use(morgan('dev')); 
express.use(cookieParser());
express.use(serveStatic(path.join(__dirname, 'public')))
express.use(serveFavicon(path.join(__dirname, 'public', 'favicon.ico')))


db.users.loadUser((dbFile))


passport.use(new Strategy(function(username, password,cb) {
   db.users.findByUsername(username, function(err, user) {
      if (err) { return cb(err); }
      if (!user) { return cb(null, false, { message: 'Incorrect username.' }); }
     bcrypt.compare(password, user.password, function(err, res) {
       if(res == true)
         return cb(null, user);
       return cb(null, false, { message: 'Incorrect password.' }); 
      });
    });  
}))

passport.use('local-signup', new Strategy(function(username,password,cb){
  db.users.findByUsername(username, function(err, user) {
    console.log(username)
    if (err) { return cb(err); }
    if (user) { return cb(null, false, { message: 'Username already taken' }); }
    let newUser
    bcrypt.hash(password, saltRounds, function(err, hash) {
    newUser = db.users.addUser(username,hash)
    console.log("new user = " + newUser)
    saveUsers()
    return cb(null, newUser);
    });
  }
)}))

passport.serializeUser(function(user, cb) {
  console.log("serialized "+ user.username)
  cb(null, user.id);
});

passport.deserializeUser(function(id, cb) {
  db.users.findById(id, function (err, user) {
    if (err) { return cb(err); }
    console.log("deserialized "+ user.username)
    cb(null, user);
  });
});


express.get("/", function (request, response) {
   sendFile( response, '/index.html' )
});

express.get("/crew", function (request, response) {
   response.redirect('/crew.html');
});

express.get("/crewdata", function(req,res){
  
   console.log("getting crew")
    console.log(req.user.crew)
    res.send(req.user.crew)
})

express.get("/userData",function(req,res){
  res.send(req.user)
})

express.post('/addcrewmem', function(req,res) {
  let newData = req.body
  var age = (2019 - parseInt(newData.year))
  var ageString = age + " Year(s) Old"
  req.user.crew.push({rank: newData.rank, name: newData.name, year: newData.year, age: ageString, rankID: parseInt(newData.rankID)});
  let add = db.users.changeUser(req.user.crew)
  saveUsers()
  res.send()
})

express.post('/modcrewmem', function(req,res) {
  let newData = req.body
  var age = (2019 - parseInt(newData.year))
  var ageString = age + " Year(s) Old"
  newData.age = ageString
  for(let i = 0; i < req.user.crew.length; i++) {
    let mem = req.user.crew[i]
    if(mem.name == newData.name) 
      req.user.crew[i] = newData
  }
  res.send()
})

express.post('/delcrewmem', function(req,res) {
  let newData = req.body
  for(let i = 0; i < req.user.crew.length; i++) {
    let mem = req.user.crew[i]
    if(mem.name == newData.name) {
      console.log("NOT "+ newData.name+ '!')
        req.user.crew.splice(i,1)
    }
  }
  res.send()
})

express.post('/login', passport.authenticate('local', { failureRedirect: '/' }), function(req, res) {
  console.log("You logged in")
  console.log("As "+ req.user.username)
    res.redirect('/crew');
  });

express.post('/signup', passport.authenticate('local-signup', { failureRedirect: '/' }), function(req, res) {
  console.log("You Signed up")
  console.log("As "+ req.user.username)
    res.redirect('/crew');
  });


const sendFile = function( response, filename ) {
   const type = mime.getType( filename ) 

   fs.readFile( filename, function( err, content ) {

     // if the error = null, then we've loaded the file successfully
     if( err === null ) {

       // status code: https://httpstatuses.com
       response.writeHeader( 200, { 'Content-Type': type })
       response.end( content )

     }else{

       // file not found, error code 404
       response.writeHeader( 404 )
       response.end( '404 Error: File Not Found' )

     }
   })
}

function saveUsers(){
  var json = JSON.stringify(db.users.getUsers());
  console.log(json)
  
  fs.writeFile("./object.json", json, (err) => {
    if (err) {
        console.error(err);
        return;
    };
    console.log("File has been created");
});
}


var listener = express.listen(process.env.PORT, function () {
  console.log('Listening to port ' + listener.address().port);
});

