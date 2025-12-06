import express from 'express';

const app = express();
const port = process.env.PORT || 3000;

app.get('/healthcheck', (req, res) => {
    const response = {
        date: new Date().toISOString(),
        status: 'OK',
        message: 'Healthcheck passed'
    };
    res.status(200).json(response);
});

app.get('/', (req, res) => {
    res.send('Welcome to CoinKeeper!');
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});