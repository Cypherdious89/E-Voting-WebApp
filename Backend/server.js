const express = require('express');
const app = express();
const cors = require('cors');

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
    res.send('Node server running !!')
})

app.post('/api/signup', (req, res) => {
    console.log(req.body);
    res.json({'status' :'OK!'});
})

app.listen(5500, () => {
    console.log('Server running on PORT 5500');
})