const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')


router.get('/', async (req, res) => {
    // const url = `https://api.pokemontcg.io/v2/cards`
    // axios.get(url)
    //     .then(response => {
    //         const searchResults = response.data.data
    //         // res.send(searchResults)
    //         // console.log(searchResults)
    //         res.render('cards/show', { results: searchResults })
    //     })
    try {
        const viewCards = await db.card.findAll()
        res.render('cards/show', { cards: viewCards })
    } catch (error) {
        console.log(error)
    }
})

router.get('/new', async (req, res) => {
    const result = await axios.get(`https://api.pokemontcg.io/v2/cards`)
    const searchResults = result.data.data
    let rand = Math.floor(Math.random() * searchResults.length)
    res.render('cards/new', { card: searchResults[rand] })
})


router.post('/new', async (req, res) => {
    const result = await axios.get(`https://api.pokemontcg.io/v2/cards?q=id:${req.body.currentCard}`)
    const searchResults = result.data.data[0] //data array
    const attackArr = searchResults.attacks //attacks array
    // console.log(searchResults)
    let attacks = []
    let weakness
    let resistance
    for (const index in attackArr) { //getting the attack name inside the attack array
        // if (Object.hasOwnProperty.call(attack, index)) {
        const element = attackArr[index];//getting the attack name from the array
        // console.log('attack:' + element.name)
        // }
        attacks.push(element.name)//storing the names in attacks array
        // console.log(attacks)
    }
    searchResults.weaknesses.forEach(element => {//getting the type inside an array of obj
        weakness = element.type
        // console.log(element.type)
    })

    if (searchResults.resistances) {
        searchResults.resistances.forEach(element => {
            resistance = element.type
        })
    } else resistance = 'N/A'

    try {
        await db.card.create({
            name: searchResults.name,
            image: searchResults.images.small,
            type: searchResults.types[0],
            attack: attacks[0],
            weakness: weakness,
            resistance: resistance,
            rarity: searchResults.rarity
        })

    } catch (err) {
        console.log(err)
    }
    res.redirect('./new')
})

router.get('/:id', async (req, res) => {
    try {
        const result = await db.card.findOne({
            where: {
                id: req.params.id
            }
        })
        res.render('cards/view', { card: result })
    } catch (error) {
        console.log(error)
    }
})

module.exports = router