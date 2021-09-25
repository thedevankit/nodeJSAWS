const express = require('express')
const jwt = require('jsonwebtoken')
const app = express()
const port = 3000
const TOKEN_SECRET =   "10ecfc08a679a880b23251e5a4d4171ed511473ae41706d384a73f88d235e5bc08155c4314f94bd5d9eda2e8beb36f23f703f68aff62fccde91980b5357ef453"
const privateUser = [
  {
    username: 'sunilvaria',
    passwordToGenerateToken: 'myApp@ios4pp'
  },
  {
    username: 'thedevankit',
    passwordToGenerateToken: 'myApp@web4pp'
  }
]


var bodyParser = require('body-parser')
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended : true
  }));

var mysql = require('mysql');
var con = mysql.createConnection({
  host: "XXXXSADFXXXXDSAF",
  user: "XXXXXDSAFDSAXXXASDFSADF",
  password: "XXXXSADFFSDXXXXSDAFFDAS",
  database: "mySubzi"
});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/api/mysubzi/', authenticateToken,(req, res) => {
  con.connect(function(err) {
  con.query("SELECT * FROM inventoryList", function (err, result, fields) {
      if (err) {res.send('ERROR QUERYING DATABASE TABLE')};

       var dict = new Object();
       dict["productList"] = result;
        res.send(dict);
    });
  });
});

app.get('/api/mysubzi/:barCodeId', authenticateToken,(req, res) => {
  let barCodeId = req.params.barCodeId
  con.connect(function(err) {
  con.query("SELECT * FROM inventoryList WHERE barCodeId=?",barCodeId, function (err, result, fields) {
     if (err) {res.send('ERROR QUERYING DATABASE TABLE')};
       res.send(result);
   });
  });
});

app.post('/api/mysubzi/addmysubzi/', authenticateToken,(req, res) => {
  let productDesc = req.body.productDesc;
  let barCodeId = req.body.barCodeId
  con.connect(function(err) {
     con.query('INSERT INTO inventoryList  (productDesc,barCodeId) VALUES (?,?)',[productDesc,barCodeId], function (err, result, fields) {
             if (err) {
                 res.send(err)
                 res.send(500)
              }else{
                res.status(200);
                res.send('product desc:' + productDesc);
             }
     });
}); 
}); 

// Authenticate User and generate token for use.
app.post('/generateToken', (req, res) => {
  let username = req.body.username;
  let password = req.body.password;
  let newUser = {
    "username":username,
    "password":password
  };

  var authenticatedUser = privateUser.filter(user => user.username === newUser.username && user.passwordToGenerateToken == newUser.password);

  if(authenticatedUser[0]){
    const accessToken = generateAccessToken(authenticatedUser[0]);
    res.json({ 
      success: true,
      accessToken: accessToken, 
      message:"Your token is generated for 180 days. It will be delete in a case of misuse."
    })
  }else{
    res.json({ 
      success: false,
      error:"You are not authorize to access data."
    })
  }
})


app.get('/authTestData', authenticateToken, (req, res) => {
  res.json("Auth successful");
})

function generateAccessToken(user) {
  return jwt.sign(user, TOKEN_SECRET, { expiresIn: '180d' })
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]
  if (token == null) return res.sendStatus(401)

  jwt.verify(token, TOKEN_SECRET, (err, user) => {
    console.log(err)
    if (err) return res.sendStatus(403)
    req.user = user
    next()
  })
}

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})