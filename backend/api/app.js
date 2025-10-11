const express = require('express')
const app = express()
app.get('/', (req,res)=>res.send('Server running'))
app.listen(3000,() => {
    console.log('server running')
})
const axios = require('axios')
app.get('/joke', async (req,res)=>{
    const r = await axios.get('https://api.chucknorris.io/jokes/random')
    res.json(r.data)
})
