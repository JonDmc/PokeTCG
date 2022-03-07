const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const { user } = require('pg/lib/defaults')

//GET route for displaying all the cards
router.get('/', async (req, res) => {
    try {
        const viewCards = await db.card.findAll({
            where: {
                userId: res.locals.user.id
            }
        })
        res.render('cards/show', { cards: viewCards })
    } catch (error) {
        console.log(error)
    }
})

//GET route for new.ejs
router.get('/new', async (req, res) => {
    if (req.cookies.userId) {

        //getting the current time
        const today = new Date()
        var date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate()
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds()
        var dateTime = date + ' ' + time

        //getting the difference
        const d1 = new Date(dateTime)
        const d2 = new Date(res.locals.user.timestamp)
        const difference = Math.abs(d1 - d2)
        const hrs = difference / (1000 * 60 * 60)
        const mins = (hrs - Math.floor(hrs)) * 60
        const secs = (mins - Math.floor(mins)) * 60
        const timer = Math.floor(hrs) + ":" + Math.floor(mins) + ":" + Math.floor(secs)

        const result = await axios.get(`https://api.pokemontcg.io/v2/cards?q=supertype:pokemon`)
        const searchResults = result.data.data
        let rand = Math.floor(Math.random() * searchResults.length)
        res.render('cards/new', { card: searchResults[rand], user: res.locals.user, currentTime: dateTime, timer, hrs })


    } else {
        res.redirect('user/login')
    }
})

//POST route for getting new cards from new.ejs
router.post('/new', async (req, res) => {
    const result = await axios.get(`https://api.pokemontcg.io/v2/cards?q=id:${req.body.currentCard}`)
    const searchResults = result.data.data[0] //data array
    const attackArr = searchResults.attacks //attacks array
    // console.log(searchResults)
    let attacks = []
    let weakness
    let resistance
    for (const index in attackArr) { //getting the attack name inside the attack array
        const element = attackArr[index];//getting the attack name from the array
        attacks.push(element.name)//storing the names in attacks array
    }
    //getting the weakeness type from the weaknesses[obj]
    if (searchResults.weaknesses) {
        searchResults.weaknesses.forEach(element => {//getting the type inside an array of obj
            weakness = element.type
        })
    } else weakness = 'N/A'


    //getting the resistance type from the resistances[obj]
    if (searchResults.resistances) {
        searchResults.resistances.forEach(element => {
            resistance = element.type
        })
    } else resistance = 'N/A'

    try {
        // const [newCard, cardCreated] = await db.card.findOrCreate({
        await db.card.create({
            name: searchResults.name,
            image: searchResults.images.small,
            type: searchResults.types[0],
            attack: attacks[0],
            weakness: weakness,
            resistance: resistance,
            rarity: searchResults.rarity,
            userId: req.body.userId
        })
        // if (newCard) {
        //     res.redirect('/cards/new')
        // }
        res.locals.user.update({
            timestamp: req.body.currentTime
        })
        res.locals.user.save()

    } catch (err) {
        console.log(err)
    }
    res.redirect('/cards/new')
})

//GET route for viewing specific cards
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

//POST route for deleting specific card
router.delete('/:id', async (req, res) => {
    try {
        const foundCard = await db.card.findOne({
            where: {
                id: req.params.id
            }
        })
        await foundCard.destroy()
        res.redirect('/cards/')
    } catch (error) {
        console.log(error)
    }
})

module.exports = router