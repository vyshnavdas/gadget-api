import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import gadgetRoutes from './routes/gadget.routes';
import { prisma } from './config/prisma';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
//app.use('/gadgets', gadgetRoutes);

app.use('/gadget', gadgetRoutes);

app.listen(PORT, () => {
  console.log(`🚀 Server running`);
});
