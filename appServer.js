const express = require('express');

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    const test = {
        nome: 'Batata',
        idade: 12
    };
    res.json(test);
})

app.post('/github', (req, res, next) => {
    const result = req.body;
    console.log('result: ', result);
    // return res.status(200);
    return res.end();
    // return next();
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`Server is running in ${port}`));