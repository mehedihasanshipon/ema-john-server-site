const express = require('express');
require('dotenv').config();
const MongoClient = require('mongodb').MongoClient;
const cors = require('cors');

const app = express();
const port = 3002;

app.use(cors());
app.use(express.json());

// console.log(process.env.DB_PASS);

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.dzoti.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;

app.get('/', (req, res) => {
  res.send('Hello ema-john!')
})




const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("emajohn").collection("products");
  const ordersCollection = client.db("emajohn").collection("orders");
  console.log("Database connected succesfully");
  
  // Post data from ui
  app.post('/addProduct',(req,res)=>{
    const products = req.body;
    // console.log(product);
    collection.insertOne(products)
    .then(result=>{
      // console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })

  // Send data to ui
  app.get('/products',(req,res)=>{
    collection.find({})
    .toArray((err,documents)=>{
      res.send(documents);
    })
  })
  // Load single data
  app.get('/product/:key',(req,res)=>{
    collection.find({key:req.params.key})
    .toArray((err,documents)=>{
      res.send(documents[0]);
    })
  })

  // load some products by keys
  app.post('/productsByKeys',(req,res)=>{
    const productKeys = req.body;
    // console.log(productKeys);
    collection.find({key:{$in:productKeys}})
    .toArray((err,documents)=>{
      res.send(documents)
    })
  })

   // Order data from ui
   app.post('/addOrder',(req,res)=>{
    const order = req.body;
    // console.log(product);
    ordersCollection.insertOne(order)
    .then(result=>{
      // console.log(result.insertedCount);
      res.send(result.insertedCount > 0);
    })
  })
});


app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})