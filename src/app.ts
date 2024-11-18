import express from 'express';
import whatsappRoutes from './routes/whatsappRoutes';

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Server is ready');
});
app.use('/api', whatsappRoutes);
//app get / route

export default app;
