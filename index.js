const express = require('express');
const bodyParser = require('body-parser');
// require('dotenv').load();
cors = require("cors");
const app = express();
const mysql = require('mysql');
const Razorpay = require('razorpay');


const instance = new Razorpay({
    key_id: "rzp_test_JntHi2BV44NhUR",
    key_secret: "a7WbsxnxMz57YOtKoXJCzAvB"
});
// parse application/json
app.use(bodyParser.json());

app.use(function(req, res, next) {
    res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.header(
        'Access-Control-Allow-Headers',
        'Origin, X-Requested-With, Content-Type, Accept'
    );
    next();
});

//create database connection
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'password',
    database: 'Jhankar'
});

//connect to database
conn.connect((err) =>{
    if(err) throw err;
    console.log('Mysql Connected...');
});

//show all products
app.get('/api/products',(req, res) => {
    let sql = "SELECT * FROM product";
    let query = conn.query(sql, (err, results) => {
        console.log("call to products api");
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
        console.log("call back for products api");
    });
});

app.get('/api/categories',(req, res) => {
    let sql = "SELECT * FROM category_table";
    let query = conn.query(sql, (err, results) => {
        console.log("call to categories api");
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//show single product
app.get('/api/products/:id',(req, res) => {
    let sql = "SELECT * FROM product_table WHERE " +
        "id="+req.params.id;
    console.log("call to category wise products api");
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//add new product
app.post('/api/cart',(req, res) => {
    let data = {product_name: req.body.product_name, product_price: req.body.product_price};
    let sql = "INSERT INTO cart SET ?";
    let query = conn.query(sql, data,(err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//update product
app.put('/api/products/:id',(req, res) => {
    let sql = "UPDATE product SET product_name='"+req.body.product_name+"', product_price='"+req.body.product_price+"' WHERE product_id="+req.params.id;
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

//Delete product
app.delete('/api/products/:id',(req, res) => {
    let sql = "DELETE FROM product WHERE product_id="+req.params.id+"";
    let query = conn.query(sql, (err, results) => {
        if(err) throw err;
        res.send(JSON.stringify({"status": 200, "error": null, "response": results}));
    });
});

app.get('/api/v1/rzp_capture/:payment_id/:amount', (req, res) => {
    console.log("call to capture api");
    const {payment_id } = req.params;
    const amount = Number(req.params.amount*100);
    instance.payments.capture(payment_id, amount).then((data) => {
        res.json(data);
    }).catch((error) => {
        res.json(error);
        console.log("fail to capture api");
    });
});

app.get('/api/v1/rzp_refunds/:payment_id', (req, res) => {
    const {payment_id} = req.params;
    console.log("call to refund api");
    instance.payments.refund(payment_id).then((data) => {
        res.json(data);
    }).catch((error) => {
        res.json(error);
    });
});


//Server listening
app.listen(8000,() =>{
    console.log('Server started on port 8000...');
});



app.get("/", (req, res) => {
    res.send({ message: "We did it!!!" });
});
