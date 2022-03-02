const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')

router.get('/', async (req, res) => {
    try {
        const viewDeck = await db.deck.findAll()
        res.render('decks/show', { deck: viewDeck })

    } catch (error) {
        console.log(error)
    }
})

module.exports = router