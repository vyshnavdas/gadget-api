import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes';
import gadgetRoutes from './routes/gadget.routes';
import swaggerUi from 'swagger-ui-express';
import swaggerSpec from './utils/swagger';


dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/auth', authRoutes);
//app.use('/gadgets', gadgetRoutes);

app.use('/gadget', gadgetRoutes);


// Swagger Docs Route
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(PORT, () => {
  console.log(`🚀 Server running`);
});
