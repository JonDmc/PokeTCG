const express = require('express')
const router = express.Router()
const axios = require('axios')


router.get('/', (req, res) => {
    const url = `https://api.pokemontcg.io/v2/cards`
    // const url = `https://api.pokemontcg.io/v2/cards?q=set.name:generations subtypes:mega`
    console.log(url)
    axios.get(url)
        .then(response => {
            const searchResults = response.data.data
            // res.send(searchResults)
            // console.log(searchResults)
            res.render('cards/show', { results: searchResults })
        })
})

router.get('/new', async (req, res) => {
    res.render('cards/new')
})

module.exports = router