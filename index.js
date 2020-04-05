const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
require('dotenv').config();

const app = express();

app.use(cors());
app.use(bodyParser.json());


const uri = process.env.DB_PATH;

let client = new MongoClient(uri, { useNewUrlParser: true });

const users = ["Asad", 'Moin', 'Sabed', 'Susmita', 'Sohana', 'Sabana'];


app.get('/foodItems', (req, res) => {
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("FoodStore").collection("Items");
        collection.find().toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});

app.get('/product/:key', (req, res) => {
    const key = req.params.key;

    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({ key }).limit(10).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents[0]);
            }
        });
        client.close();
    });
});


app.post('/getProductByKey', (req, res) => {
    const key = req.params.key;
    const productKey = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("onlineStore").collection("products");
        collection.find({ key: { $in: productKey } }).toArray((err, documents) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(documents);
            }
        });
        client.close();
    });
});
//delete
//update 
// post
app.post('/addFoodItem', (req, res) => {
    const product = req.body;
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("FoodStore").collection("Items");
        collection.insert(product, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

app.post('/placeOrder', (req, res) => {
    const orderDetail = req.body;
    orderDetail.time = new Date();
    client = new MongoClient(uri, { useNewUrlParser: true });
    client.connect(err => {
        const collection = client.db("FoodStore").collection("orders");
        collection.insertOne(orderDetail, (err, result) => {
            if (err) {
                console.log(err)
                res.status(500).send({ message: err });
            }
            else {
                res.send(result.ops[0]);
            }
        });
        client.close();
    });
});

const port = process.env.PORT || 4200;
app.listen(port, () => console.log('Listenting to port 4200'));  