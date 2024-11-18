import express from 'express';
import whatsappRoutes from './routes/whatsappRoutes';

const app = express();
app.use(express.json());

app.use('/api', whatsappRoutes);
//app get / route
app.get('/', (req, res) => {
    res.send('Server is ready');
});

export default app;
