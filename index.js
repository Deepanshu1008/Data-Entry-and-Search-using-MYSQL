//Predefined Lib from npm
const mysql = require("mysql2");
const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const encoder = bodyParser.urlencoded({extended:true});


// MYSQL
app.use(express.static("public"));
const connection = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "******",
//     Enter your mysql password
    database: "db1"
    // My database name is db1 here
});

// connect to the database
connection.connect(function(error){
    if (error) throw error
    else console.log("connected to the database successfully!")
});

//Home Route
app.get("/",function(req,res){
    res.sendFile(__dirname + "/login.html");
})


app.get("/login",function(req,res){
    res.sendFile(__dirname + "/login.html");
})
app.get("/table",function(req,res){
  connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM enteruser", function (err, result, fields) {
    if (err) throw err;
    res.render("table",{users:result});
    console.log(result);
  });
});
});


app.set('view engine', 'ejs');
app.post("/login",encoder, function(req,res){
  var fname = req.body.fname;
  var lname = req.body.lname;
  var email = req.body.emailinfo;
  var address = req.body.addinfo;
  var contact = req.body.continfo;

    connection.connect(function(err) {
        console.log("Connected!");
        var sql = "INSERT INTO enteruser (fname,lname,email,address,contact) VALUES (?,?,?,?,?);";
        connection.query(sql, [fname,lname,email,address,contact],function (err, result) {
            if(err)
            console.log(err);
            else{
          console.log("1 record inserted");
          res.redirect("/table");}
        });
      });

})
app.post("/search",encoder,function(req,res){
  var search = req.body.search;
  connection.connect(function(err) {
  if (err) throw err;
  connection.query("SELECT * FROM enteruser where fname LIKE '"+search+"%' OR lname LIKE '"+search+"%' OR email LIKE '"+search+"%' OR address LIKE '"+search+"%' OR contact LIKE '"+search+"%'"  , function (err, result, fields) {
    if (err) throw err;
    res.render("search-result",{users:result});
    console.log(result);
  });
});
})
// when login is success
app.get("/welcome",function(req,res){
    res.send("success");
})


// set app port
app.listen(4000);
