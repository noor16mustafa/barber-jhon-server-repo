const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.erpq6o3.mongodb.net/?retryWrites=true&w=majority`;


const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const serviceCollection = client.db('barberServiceReview').collection('services');
        const reviewCollection = client.db('barberServiceReview').collection('reviews');

        app.get('/servicesHome', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.limit(3).toArray();
            res.send(services);
        });

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollection.find(query);
            const services = await cursor.toArray();
            res.send(services);
        });

        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);

            res.send(service);
        });

        //review api
        app.post('/reviews', async (req, res) => {
            const reviewDetails = req.body;
            reviewDetails['time'] = new Date();
            const result = await reviewCollection.insertOne(reviewDetails);
            res.send(result);
        })

        app.get('/reviews', async (req, res) => {
            let query = {};

            if (req.query.service) {
                query = {
                    service: req.query.service
                }
            }
            const cursor = reviewCollection.find(query);
            const reviews = await cursor.toArray();
            res.send(reviews);
        })

    }
    catch (error) {
        console.error(error);
    }
}
run().catch(err => console.error(err.message))



app.get('/', (req, res) => {
    res.send('Service review api is running');
})

app.listen(port, () => {
    console.log(`Service Review Server is running on port ${port}`);
})