import "dotenv/config";
import express from 'express'
import connectMongoDB from "../database/database";
import { transactionRoutes } from './infrastructure/routes/TransactionRoutes';
import { config } from "dotenv";
config();

const app = express();
const PORT = process.env.PORT || 3006;

app.use(express.json());
app.use('/api/v1/finances', transactionRoutes)

app.listen(PORT, () => {
    console.log("Server is running on port", PORT);
});

connectMongoDB();