const express = require('express')
const router = express.Router()
const db = require('../models')
const bcrypt = require('bcrypt')
const cryptojs = require('crypto-js')
const { user } = require('pg/lib/defaults')
require('dotenv').config()

router.get('/new', (req, res) => {
    res.render('user/signup', { error: null })
})

router.get('/profile', async (req, res) => {
    try {
        const viewCards = await db.card.findAll({
            where: {
                userId: res.locals.user.id
            }
        })

        const viewDeck = await db.deck.findAll({
            where: {
                userId: res.locals.user.id
            }
        })

        const arr1 = []//getting cards
        for (let i = 0; i < viewDeck.length; i++) { //getting the no. of decks created
            const cardsOnDeck = await db.deck.findOne({ //getting the cards from those decks
                where: {
                    id: viewDeck[i].id
                }
            })
            arr1.push(cardsOnDeck.getCards()) //pushing the cards in an array to call later
        }
        const theseCards = await Promise.all(arr1)

        res.render('user/profile', { cards: viewCards, decks: viewDeck, theseCards })
    } catch (error) {
        console.log(error)
    }

})

router.post('/', async (req, res) => {
    let message
    if (!req.body.email || !req.body.username || !req.body.password) {
        message = 'Input the proper info'
        res.render('user/signup', { error: message })
    }
    else {
        try {
            const username = await db.user.findOne({
                where: {
                    username: req.body.username
                }
            })
            if (username) {//if username is found, send error
                message = 'Username is taken'
                res.render('user/signup', { error: message })
            }
            else {
                const [newUser, created] = await db.user.findOrCreate({
                    where: {
                        username: req.body.username,
                        email: req.body.email
                    }
                })

                if (!created) {
                    console.log('user already exists')
                    res.render('user/login', { error: null })
                    //render the login page and send an appropriate message
                } else {
                    const hashedPassword = bcrypt.hashSync(req.body.password, 10)
                    newUser.password = hashedPassword
                    await newUser.save()

                    //encrypt the user id via AES
                    const encryptedUserId = cryptojs.AES.encrypt(newUser.id.toString(), process.env.SECRET)
                    const encryptedUserIdString = encryptedUserId.toString()
                    console.log(encryptedUserIdString)
                    //store the encrypted id in the cookie of the res obj
                    res.cookie('userId', encryptedUserIdString)
                    // redirect back to home page
                    res.redirect('/users/profile')
                }

            }
        } catch (error) {
            console.log(error)
        }
    }
})

router.get('/login', (req, res) => {
    res.render('user/login', { error: null })
})

router.post('/login', async (req, res) => {
    const user = await db.user.findOne({
        where: {
            email: req.body.email
        }
    })
    if (!user) {//didn't find the user in the database
        console.log('user not found')
        res.render('user/login', { error: 'Invalid email/password' })
    } else if (!bcrypt.compareSync(req.body.password, user.password)) {//found user but password was wrong
        console.log('Incorrect password')
        res.render('user/login', { error: 'Invalid email/password' })
    } else {
        console.log('logging in the user!')
        //encrypt the user id via AES
        const encryptedUserId = cryptojs.AES.encrypt(user.id.toString(), process.env.SECRET)
        const encryptedUserIdString = encryptedUserId.toString()
        console.log(encryptedUserIdString)
        //store the encrypted id in the cookie of the res obj
        res.cookie('userId', encryptedUserIdString)
        // redirect back to home page
        res.redirect('/users/profile')
    }
})

router.get('/logout', (req, res) => {
    console.log('logging out')
    res.clearCookie('userId')
    res.redirect('/')
})

//export all these routes to the entry point file
module.exports = router
