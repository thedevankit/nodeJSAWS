const express = require('express')
const app = express()
const port = 3000

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

app.get('/api/mysubzi/', (req, res) => {
   con.connect(function(err) {
   con.query("SELECT * FROM inventoryList", function (err, result, fields) {
      if (err) {res.send('ERROR QUERYING DATABASE TABLE')};

       var dict = new Object();
       dict["productList"] = result;
        res.send(dict);
    });
});
});

app.get('/api/mysubzi/:barCodeId', (req, res) => {
  let barCodeId = req.params.barCodeId
  con.connect(function(err) {
  con.query("SELECT * FROM inventoryList WHERE barCodeId=?",barCodeId, function (err, result, fields) {
     if (err) {res.send('ERROR QUERYING DATABASE TABLE')};
       res.send(result);
   });
});
});

app.post('/api/mysubzi/addmysubzi/', (req, res) => {
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

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})