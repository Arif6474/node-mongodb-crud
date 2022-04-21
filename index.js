const express = require('express');
const app = express();
const port = process.env.PORT || 5000;
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

app.use(cors());
app.use(express.json());
// user : dbuser1
// password : vk00dANUvfaMYpiL



const uri = "mongodb+srv://dbuser1:vk00dANUvfaMYpiL@cluster0.baljp.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run (){
   try {
    await client.connect();
    const userCollection = client.db("foodExpress").collection("user");
   //get user 
    app.get("/user" , async (req, res) => {
        const query ={};
        const cursor = userCollection.find(query);
        const users = await cursor.toArray();
        res.send(users);
    })

    app.get("/user/:id", async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.findOne(query);
        res.send(result);


    })
    // update user 
    app.put('/user/:id', async (req, res) => {
        const id = req.params.id;
        const filter = {_id: ObjectId(id)};
        const updatedUser = req.body;
        const options = { upsert: true };

        const updateDoc = {
            $set: {
              
                  name : updatedUser.name,
                  email : updatedUser.email
              
            },
          };
          const result = await userCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })
    // post user
    app.post('/user', async (req, res) => {
        const newUser = req.body;
        console.log('adding new user' , newUser);
        const result = await userCollection.insertOne(newUser);
        res.send(result)

    })
    // delete the user
    app.delete('/user/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: ObjectId(id)};
        const result = await userCollection.deleteOne(query);
        res.send(result)
    })
   }
   finally {
    // await client.close();
  }
}
run().catch(console.dir);

app.get('/', (req, res) =>{
    res.send('Running my node CRUD server')
})

app.listen(port, () => {
    console.log('crud server is running ');
})