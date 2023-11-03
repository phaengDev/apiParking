const express = require('express');
const cors = require('cors')
const app = express();
app.use(express.json());
const mysql = require('mysql');

const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

// const _ =require('lodash');
app.use(cors());

const server = app.listen(3000, ()=>{
    console.log('Nodejs is runing on port 300')
});

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database:'parking'
  });
  
  con.connect(function(err) {
    if (err) throw err;
    console.log("Connected!");
  });

  app.post('/addtype', async (req, res, next) =>{
    const {carImg,typeName}=req.body;
    try{
    con.query(
        'INSERT INTO  `tb_typecar`(carImg,typeName) VALUES(?,?) ',
        [carImg,typeName],
        (err, results, fields) => {
            if(err){
                return res.status(400).send();
            }
            return res.status(200).json({message: 'insert successfuly create!'});
        }
      )
    }catch(err){
console.log(err);
return res.status(500).send();
    }
  })

  app.get('/redtype', async (req, res)=> {
    try{
    con.query(
        'SELECT * FROM `tb_typecar`',
        (err, results, fields)=> {
            res.json(results);
        }
      );
    }catch(err){
      console.log(err);
      return res.status(500).send();
          }
  });

  app.get('/redtype/:id', function (req, res) {
    const id=req.params.id;
    con.query(
        'SELECT * FROM `tb_typecar` WHERE typecarID =?',
        [id],
        function(err, results, fields) {
            if(err){
                return res.status(400).send();
            }
            res.status(200).json(results);
        }
      );
    
  })

module.exports=app;