import express from 'express';
import whatsappRoutes from './routes/whatsappRoutes';

const app = express();
app.use(express.json());
app.use('/', (req, res) => {
    res.send('Hello World');
});
app.use('/api', whatsappRoutes);

export default app;
