const express = require('express')
const router = express.Router()
const axios = require('axios')
const db = require('../models')
const { user } = require('pg/lib/defaults')
const { render } = require('express/lib/response')

//displaying all decks
router.get('/', async (req, res) => {
    try {
        const viewDeck = await db.deck.findAll({
            where: {
                userId: res.locals.user.id
            }
        })
        res.render('decks/show', { decks: viewDeck })

    } catch (error) {
        console.log(error)
    }
})
router.get('/new', async (req, res) => {
    res.render('decks/new')
})

//creating a new empty deck
router.post('/new', async (req, res) => {
    try {
        await db.deck.findOrCreate({
            where: {
                name: req.body.deckName,
                userId: res.locals.user.id
            }
        })
        res.redirect('/decks')
    } catch (error) {
        console.log(error)
    }
})

//viewing the cards inside the specific deck
router.get('/:id', async (req, res) => {
    try {
        const cardsOnDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            },
            include: [db.card]
        })
        res.render('decks/view', { cardsOnDeck, deckId: req.params.id })
    } catch (error) {
        console.log(error)
    }
})

//displaying all the cards that the user can add to the deck
router.get('/:id/add', async (req, res) => {

    const availableCards = await db.card.findAll({
        where: {
            id: res.locals.user.id
        }
    })
    const currentUser = await db.user.findOne({
        where: {
            id: res.locals.user.id
        }
    })
    const userCard = await currentUser.getCards()

    res.render('decks/add', { cards: userCard, deckId: req.params.id })
})

//adding the specific card inside the specific deck
router.post('/:id/add', async (req, res) => {
    try {

        const currentDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            },
            include: [db.user]
        })
        const currentCard = await db.card.findOne({
            where: {
                id: req.body.cardId
            }
        })
        await currentDeck.addCard(currentCard)
        res.redirect(`/decks/${req.params.id}`)
        // res.send(currentCard)
    } catch (error) {
        console.log(error)
    }

})

//displays the available cards that can be remove on the specific deck
router.get('/:id/remove', async (req, res) => {
    try {
        const cardsOnDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            },
            include: [db.card]
        })
        res.render('decks/remove', { cardsOnDeck, deckId: req.params.id })
    } catch (error) {
        console.log(error)
    }
})

router.post('/:id/remove', async (req, res) => {
    try {

        const currentDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            },
            include: [db.user]
        })
        const currentCard = await db.card.findOne({
            where: {
                id: req.body.cardId
            }
        })
        await currentDeck.removeCard(currentCard)
        res.redirect(`/decks/${req.params.id}`)
    } catch (error) {
        console.log(error)
    }

})

module.exports = router


