const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config()
const app = express();
const port = process.env.PORT || 5000;

// middleware

app.use(cors());
app.use(express.json());






const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ltkvgnf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();


const collegeCollection = client.db('college-hunts').collection('colleges');
const admissionCollection = client.db('college-hunts').collection('admission');
const reviewsCollection = client.db('college-hunts').collection('reviews');


app.get('/colleges', async(req, res) => {
    const cursor = collegeCollection.find();
    const result = await cursor. toArray();
    res.send(result);
})

app.get('/colleges/:id', async(req, res) => {
    const id = req.params.id;
    const query = {_id: new ObjectId(id)}

    const options = {
        projection: {
            name: 1,
            image: 1,
            admission_process: 1,
            event_details: 1,
            research_works: 1,
            sports: 1,
            events: 1,
            
research_history: 1,

number_of_research:1,
ratings: 1
            
        }
    }
    const result = await collegeCollection.findOne(query, options);
    res.send(result)
})


app.post('/admissions', async(req, res) => {
  const admission = req.body;
  const result = await admissionCollection.insertOne(admission);
  res.send(result)
})

app.get('/admissions', async(req, res) =>{
  let query = {};
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result  = await admissionCollection.find(query).toArray();
  res.send(result)
})


app.get('/admissions/:id', async(req, res) => {
  const id = req.params.id;
  const query = {_id: new ObjectId(id)}

  const options = {
      projection: {
        collegeName: 1
         
          
      }
  }
  const result = await admissionCollection.findOne(query, options);
  res.send(result)
})



app.post('/reviews', async(req, res) => {
  const reviews = req.body;
  const result = await reviewsCollection.insertOne(reviews);
  res.send(result)
})

app.get('/reviews', async(req, res) =>{
  let query = {};
  if(req.query?.email){
    query = {email: req.query.email}
  }
  const result  = await reviewsCollection.find(query).toArray();
  res.send(result)
})





    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);










app.get('/', (req, res) => {
    res.send('college is running')
})
app.listen(port, ()=> {
    console.log(`college server is running on port ${port}`)
})