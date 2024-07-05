import express from "express";
import adminRoutes from "./routes/admin.js";
import clientRoutes from "./routes/client.js";
import cors from "cors";
import mongoose from "mongoose";

const app = express();
const port = process.env.PROJECT_PORT || 3000;

app.use(express.json()); // parses body payloads
app.use(express.static('public'));

app.use(cors())

// connect to mongo db
mongoose.connect("mongodb://localhost:27017/hotel-reserving-demo");

// register route handlers
app.use('/api/admin', adminRoutes)
app.use('/api', clientRoutes)


import User from "./app/Models/User.js";
app.get('/', (req, res) => {
    // mongoose.connection.db.collection('test').insertOne({
    //     key: 'value',
    // });

    res.send("Demo Hotel Reserving Project <br> Developers: Reza Golian(Roomzher Knight) & Mohammad Ali Seidi");
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})


