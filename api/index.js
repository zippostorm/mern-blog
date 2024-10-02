import express from 'express';
import mongoose from 'mongoose';
import dotevn from 'dotenv';

dotevn.config();

mongoose
    .connect(process.env.MONGO)
    .then(() => {
        console.log('MongoDB is connected');
    })
    .catch((err) => {
        console.log(err);
    });

const app = express();

app.listen(3000, () => {
    console.log("Server running on port 3000!");
});