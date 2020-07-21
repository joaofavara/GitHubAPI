const express = require('express');
const bodyParser  = require('body-parser');
const router = require('./controlle');

const app = express();

app.use(bodyParser.json());

app.use('/api', router);

app.listen(3001, () => {
    console.log('Server is running!');
})
 
