# Project 2 - Pokemon TC-GO
Pokemon has been popular ever since its release in the 1990s and since that day, it has been continously evolving. So much so, the pokemons that you see on tv and gameboys became a reality through Pokemon Cards, in which up to this day is still very popular for its Collection. This app will allow the user to experience the basic trading and collecting part of the game.

## API
- [Pokemon TCG](https://pokemontcg.io/) - a pokemon api containing in-depth data regarding pokemon cards

## ERDs
![Pokemon TCG](erd.drawio.png)

# Routes

| Method | Path | Purpose |
| ------ | -------------- | -------------------------------- |
| GET | `/` | Log in page |
| POST | `/SignUp` | Sign up page and receiving of randomized cards |
| GET | `/profile` | displays the User profile, i.e. user's collection |
| GET | `/cards` | displays the User's collection of cards |
| GET | `/cards/new` | generates one new card each time a button is hit |
| GET | `/cards/:id` | displays the basic information of the card, i.e. name, type, attack,... |
| GET | `/decks` | displays the User's Decks, which consist of 10 cards per deck|
| POST | `/decks/new` | creates a new deck, then redirects back to `GET /decks`|
| GET | `/decks/:id` | display the cards inside the specific deck |
| PUT | `/decks/:id/update` | Updates the specific date, i.e. adding/removing cards or changing names of the deck |

# Wireframes
### Collecting part
#### Log-in page
![Login page](./wireframes/login.JPG)
#### Sign-up page
![SignUp page](./wireframes/signup.JPG)
#### Profile page
![Profile page](./wireframes/profile.JPG)
#### Cards page
![Cards page](./wireframes/cards.JPG)
![Cards/:id page](./wireframes/card-indiv.JPG)
![Cards/new page](./wireframes/card-new.JPG)
#### Decks page
![Decks page](./wireframes/decks.JPG)
![Decks/:id page](./wireframes/deck-indiv.JPG)
![Decks/new page](./wireframes/deck-new.JPG)
![Decks/update page](./wireframes/deck-update.JPG)

# User Stories
- As a user, I want to collect/trade cards
- As a user, I want to see my collection of cards
- As a user, I want to build or customize my deck by adding and removing cards
- As a user, I want to see my list of decks
- As a user, I am able to obtain a new card without trading

# MVP Goals
- Be able to fetch and store basic card data from the api
- Be able to display the collection of cards
- Be able to generate a randomized card for the user whenever 'generate' button is hit.
- Be able to 'skip' a generated card, by pressing the skip button, if the user doesn't want the current card. 
- Be able to display the list of decks, and the cards inside that deck
- Be able to add and/or remove cards from a specific deck

# Stretch Goals
### Collecting part
- Be able to make the user wait for 2hrs to have the ability to generate a new card
### Trading part
- Be able to post a specific card for trading
- Be able to comment on different posts with a specific card that the user want to trade with
- Be able to trade with other users
- Be able to remove the post, once the trade is complete or when the user deletes it
- Be able to trade with other people live with the use of mapbox