const express = require('express');
const app = express();
const cors = require('cors')
const bodyParser = require('body-parser');
const LocalStorage = require('node-localstorage').LocalStorage,
localStorage = new LocalStorage('./scratch');
const { base64encode, base64decode } = require('nodejs-base64');
const mysql = require('mysql2');
const connection = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password:'',
  database: 'parking'
});
app.use(express.json());
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


localStorage.setItem('branch_fk', '22001');
localStorage.setItem('userID', '22001');
const dateNow = new Date().toISOString().slice(0, 10);
const dateTime = new Date().toISOString().
replace(/T/, ' ').      // replace T with a space
replace(/\..+/, '');

const branch_fk = localStorage.getItem('branch_fk');
const userlogin=localStorage.getItem('userID');
app.post('/addtype', async (req, res, next) =>{
  const {carImg,typeName}=req.body;
  try{
    connection.query(
      'INSERT INTO  `tb_typecar`(carImg,typeName) VALUES(?,?) ',
      [carImg,typeName],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message: 'ການດຳເນີນງານສຳເລັດ!'});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});

app.get('/redtype', async (req, res, next) =>{
  connection.query(
    'SELECT * FROM `tb_typecar`',
    (err, results, fields) =>{
      res.json(results);
    }
  );
})

app.get('/redtype/:id', async (req, res, next) =>{
  const id = req.params.id;
  connection.query(
    'SELECT * FROM `tb_typecar` WHERE `typecarID` = ?',
  [id],
    (err, results, fields) =>{
      res.json(results);
    }
  );
});
 
//================ set API prices ========\\

app.post('/add-price', async (req, res, next) =>{
  const {typecar_fk,type_deposit,prices}=req.body;
  try{
    connection.query(
      'INSERT INTO  `tb_prices`(branch_fk,typecar_fk,type_deposit,prices) VALUES(?,?,?,?) ',
      [branch_fk,typecar_fk,type_deposit,prices],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການດຳເນີນງານສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});

//======  update price


app.patch('/update-price/:id', async (req, res) =>{
  const priceID= req.params.id;
  const {typecar_fk,type_deposit,prices}=req.body;
  try{
    connection.query(
      'UPDATE tb_prices SET typecar_fk=?,type_deposit=?,prices=? WHERE priceID=?',
      [typecar_fk,type_deposit,prices,priceID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການແກ້ໄຂຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//------delete price

app.delete('/del-price/:id', async (req, res) =>{
  const priceID= req.params.id;
  try{
    connection.query(
      'DELETE FROM tb_prices WHERE priceID=?',
      [priceID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການລຶບຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//-----fetch price

app.get('/red-price', async (req, res) =>{
  connection.query('SELECT * FROM tb_prices LEFT JOIN tb_branchs ON tb_prices.branch_fk = tb_branchs.branchID LEFT JOIN tb_typecar ON  tb_prices.typecar_fk = tb_typecar.typecarID WHERE `branch_fk` = ?',
  [branch_fk],
    (err, results, fields) =>{
      res.json(results);
    }
  );
})

app.get('/red-price/:id', async (req, res, next)=> {
  const id = req.params.id;
  try{
  connection.query(
    'SELECT * FROM tb_prices LEFT JOIN tb_branchs ON tb_prices.branch_fk = tb_branchs.branchID LEFT JOIN tb_typecar ON  tb_prices.typecar_fk = tb_typecar.typecarID WHERE `priceID` = ?',
  [id],
    (err, results, fields)=> {
      res.json(results);
    }
  );
  }catch(err){
    console.log(err);
    return res.status(500).send();
      }
    });


//================ set API users ========\\

app.post('/add-users', async (req, res) =>{
  const userPassword = base64encode(req.body.userPassword); 
  const {userNane,userEmail,userStatus}=req.body;
  try{
    connection.query(
      'INSERT INTO  `tb_users`(branch_fk,userNane,userEmail,userPassword,userStatus) VALUES(?,?,?,?,?) ',
      [branch_fk,userNane,userEmail,userPassword,userStatus],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການດຳເນີນງານສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});

//------  update users


app.patch('/update-users/:id', async (req, res) =>{
  const userID= req.params.id;
  const userPassword = base64encode(req.body.userPassword); 
  const {userNane,userEmail,userStatus}=req.body;
  try{
    connection.query(
      'UPDATE tb_users SET userNane=?,userEmail=?,userPassword=?,userStatus=? WHERE userID=?',
      [userNane,userEmail,userPassword,userStatus,userID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການແກ້ໄຂຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//------delete users

app.delete('/del-users/:id', async (req, res) =>{
  const userID= req.params.id;
  try{
    connection.query(
      'DELETE FROM tb_users WHERE userID=?',
      [userID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການລຶບຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//-----fetch users

app.get('/red-users', async (req, res) =>{
  connection.query('SELECT * FROM tb_users  LEFT JOIN tb_branchs ON tb_users.branch_fk = tb_branchs.branchID WHERE `branch_fk` = ?',
  [branch_fk],
    (err, results, fields) =>{
      res.json(results);
    }
  );
})
//------- red There are conditions
app.get('/single-users/:id', async (req, res)=> {
  const id = req.params.id;
  try{
  connection.query(
    'SELECT * FROM tb_users  LEFT JOIN tb_branchs ON tb_users.branch_fk = tb_branchs.branchID WHERE `userID` = ?',
  [id],
    (err, results, fields)=> {
      res.json(results);
    }
  );
  }catch(err){
    console.log(err);
    return res.status(500).send();
      }
    });



//================ set API branch ========\\

app.post('/add-branch', async (req, res) =>{
  const {branchName,tel,province_fk,district_fk,villageName}=req.body;
  try{
    connection.query(
      'INSERT INTO  `tb_branchs`(branchName,tel,province_fk,district_fk,villageName) VALUES(?,?,?,?,?) ',
      [branchName,tel,province_fk,district_fk,villageName],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການດຳເນີນງານສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});

//------  update branch


app.patch('/update-branch/:id', async (req, res) =>{
  const branchID= req.params.id;
  const {branchName,tel,province_fk,district_fk,villageName}=req.body;
  try{
    connection.query(
      'UPDATE tb_branchs SET branchName=?,tel=?,province_fk=?,district_fk=?,villageName=? WHERE branchID=?',
      [branchName,tel,province_fk,district_fk,villageName,branchID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການແກ້ໄຂຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//------delete branch

app.delete('/del-branch/:id', async (req, res) =>{
  const branchID= req.params.id;
  try{
    connection.query(
      'DELETE FROM tb_branchs WHERE branchID=?',
      [branchID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການລຶບຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//-----fetch branch

app.get('/red-branch', async (req, res)=> {
  connection.query(`SELECT * FROM  tb_branchs
	LEFT JOIN tb_porvince ON  tb_branchs.province_fk = tb_porvince.porvinceID
	LEFT JOIN tb_district ON  tb_branchs.district_fk = tb_district.districtID`,
    (err, results, fields)=> {
      res.json(results);
    }
  );
})
//------- red There are conditions
app.get('/single-branch/:id', async (req, res)=> {
  const id = req.params.id;
  try{
  connection.query(
    `SELECT * FROM tb_branchs
	LEFT JOIN tb_porvince ON  tb_branchs.province_fk = tb_porvince.porvinceID
	LEFT JOIN tb_district ON  tb_branchs.district_fk = tb_district.districtID WHERE branchID=?`,
  [id],
    (err, results, fields)=> {
      res.json(results);
    }
  );
  }catch(err){
    console.log(err);
    return res.status(500).send();
      }
    });




//================ set API deposit ການຝາກລົດ ========\\

app.post('/add-deposit', async (req, res) =>{
  const {typecar_fk,province_fk,text,registration,type_deposit,prices}=req.body;
  try{
    connection.query(
      'INSERT INTO  `tb_deposit`(branch_fk,typecar_fk,province_fk,text,registration,type_deposit,prices,userIn_fk,dateIn,statusCheck) VALUES(?,?,?,?,?,?,?,?,?,?)',
      [branch_fk,typecar_fk,province_fk,text,registration,type_deposit,prices,userlogin,dateTime,1],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການດຳເນີນງານສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});

//------  update tb_deposit


app.patch('/out-car/:id', async (req, res) =>{
  const depositID= req.params.id;
  try{
    connection.query(
      'UPDATE tb_deposit SET statusCheck=?,userOut_fk=?,dateOut=? WHERE depositID=?',
      [2,userlogin,dateTime,depositID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການແກ້ໄຂຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//------delete tb_deposit

app.delete('/del-deposit/:id', async (req, res) =>{
  const depositID= req.params.id;
  try{
    connection.query(
      'DELETE FROM tb_deposit WHERE depositID=?',
      [depositID],
      (err, results, fields) => {
          if(err){
              return res.status(400).send();
          }
          return res.status(200).json({message:"ການລຶບຂໍ້ມູນສຳເລັດ"});
      }
    )
  }catch(err){
console.log(err);
return res.status(500).send();
  }
});
//-----fetch tb_deposit

app.get('/red-deposit', async (req, res)=> {
  connection.query(`SELECT tb_deposit.depositID, 
	tb_deposit.branch_fk, 
	tb_deposit.typecar_fk, 
	tb_deposit.province_fk, 
	tb_deposit.text, 
	tb_deposit.registration, 
	tb_deposit.type_deposit, 
	tb_deposit.prices, 
	tb_deposit.userIn_fk, 
	tb_deposit.dateIn, 
	tb_deposit.statusCheck, 
	tb_deposit.userOut_fk, 
	tb_deposit.dateOut, 
	tb_branchs.tel, 
	tb_typecar.carImg, 
	tb_typecar.typeName, 
	tb_porvince.porvinceName, 
	A.userNane AS userName_in,
	B.userNane AS userName_out 
  FROM tb_deposit
	LEFT JOIN tb_branchs ON  tb_deposit.branch_fk = tb_branchs.branchID
	LEFT JOIN tb_typecar ON  tb_deposit.typecar_fk = tb_typecar.typecarID
	LEFT JOIN tb_porvince ON  tb_deposit.province_fk = tb_porvince.porvinceID
	LEFT JOIN tb_users AS A ON  tb_deposit.userIn_fk = A.userID
	LEFT JOIN tb_users AS B ON  tb_deposit.userOut_fk = B.userID 
  WHERE tb_deposit.branch_fk=? AND DATE(dateIn)=?`,[branch_fk,dateNow],
    (err, results, fields)=> {
      res.json(results);
    }
  );
})
//------- red There are conditions tb_deposit
app.get('/single-deposit/:id', async (req, res)=> {
  const id = req.params.id;
  try{
  connection.query(
    `SELECT * FROM tb_deposit WHERE depositID=?`,
  [id],
    (err, results, fields)=> {
      res.json(results);
    }
  );
  }catch(err){
    console.log(err);
    return res.status(500).send();
      }
    });



app.listen(8000, function () {
  console.log('ການເຊື່ອມຕໍ່ຖານຂໍ້ມູນສຳເລັດ ລັນດ່ວຍ port 8000')

})