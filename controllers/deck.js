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
    res.render('decks/new', { error: null })
})

//creating a new empty deck
router.post('/new', async (req, res) => {
    if (req.body.deckName) {
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
    } else {
        res.redirect('/decks')
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

    const foundDeck = await db.deck.findOne({
        where: {
            id: req.params.id
        }
    })
    const allCards = await db.card.findAll({
        where: {
            userId: res.locals.user.id
        }
    })
    const cardsOnDeck = await foundDeck.getCards()

    // availableCards = allCards - cardsOnDeck
    //filtering process
    let arr1 = []
    allCards.forEach(card => {
        arr1.push(card.id)
    })
    let arr2 = []
    cardsOnDeck.forEach(card => {
        arr2.push(card.id)
    })
    let arr3 = arr1.filter(id => !arr2.includes(id))

    let availableCards = []
    for (let i = 0; i < arr3.length; i++) {
        availableCards.push(await db.card.findOne({
            where: {
                id: arr3[i]
            }
        }))
    }

    res.render('decks/add', { cards: availableCards, deckId: req.params.id })
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

//POST route to remove the card from the deck
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

//GET editing the deck page
router.get('/:id/edit', async (req, res) => {
    try {
        const foundDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            }
        })
        res.render('decks/edit', { foundDeck })
    } catch (error) {
        console.log(error)
    }
})

//PUT route to update edited deck
router.put('/:id/edit', async (req, res) => {
    try {
        const foundDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            }
        })
        foundDeck.update({
            name: req.body.newDeckName
        })
        await foundDeck.save()
        res.redirect('/decks/')
    } catch (error) {
        console.log(error)
    }
})

//DELETE route for the deck
router.delete('/:id', async (req, res) => {
    try {
        const foundDeck = await db.deck.findOne({
            where: {
                id: req.params.id
            }
        })
        await foundDeck.destroy()
        res.redirect('/decks/')
    } catch (error) {
        console.log(error)
    }
})


module.exports = router


