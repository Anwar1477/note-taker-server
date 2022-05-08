const express = require("express");
var cors = require("cors");
const app = express();
const port = 4000;

// Added Midleware
app.use(cors());
app.use(express.json());

//9VsrNoYqMNuVtgYA
//notes

const { MongoClient, ServerApiVersion,ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://notes:9VsrNoYqMNuVtgYA@cluster0.ti3jc.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  try {
    await client.connect();
    const notesCollection = client.db("notesTaker").collection("notes");

    // Read All Data

    app.get("/notes", async (req, res) => {
      const q = req.query;
      console.log(q);

      const cursor = notesCollection.find({});

      const result = await cursor.toArray();

      res.send(result);
    });
    app.post("/note", async (req, res) => {
      const data = req.body;
      console.log(data);

      const result = await notesCollection.insertOne(data);
      res.send(result);
    });

    // update notesTaker

    app.put('/note/:id',async (req,res)=>{
      const id = req.params.id;
      const data = req.body;
      console.log("from update api", data);
      const filter = { _id: ObjectId(id) };
      const options = { upsert: true };

      const updateDoc = {
        $set: {
          userName: data.userName,
          textData: data.textData,
        },
      };

      const result = await notesCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      // console.log('from put method',id)
      res.send(result);

      // Delete Method 

      app.delete("/note/:id", async (req, res) => {
        const id = req.params.id;
        const filter = { _id: ObjectId(id) };
  
        const result = await notesCollection.deleteOne(filter);
  
        res.send(result);
      });

    })

    console.log("connected to db");
  } finally {
  }
}
run().catch(console.dir);
// client.connect((err) => {
//   const nodeCollection = client.db("test").collection("devices");
//   // perform actions on the collection object
//   console.log("connect to db");
//   // client.close();
// });

app.get("/", (req, res) => {
  res.send("Hello World! get request got it");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
