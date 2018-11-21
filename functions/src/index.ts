import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';
import { request } from 'http';
admin.initializeApp()
const db = admin.firestore()
db.settings({timestampsInSnapshots: true})

// // Start writing Firebase Functions
// // https://firebase.google.com/docs/functions/typescript
//
// export const helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

export const getGame = functions.https.onRequest(async(request, response) => {
    try {
        const result = await db.doc('games/FghD3237j4qPNfn6z2ls').get()
        response.send(result.data())
    } catch (error) {
        console.error(error)
        response.status(500).send('Algo de errado não está certo!')
    }
})

export const getVitaoGame = functions.https.onRequest(async(request, response) => {
    try {
        const result = await db.doc('players/M48i45fv78SN2kFNXIK1').get()
        const gamesPromises = []
        const vitaoGames = result.data().games
        for (const gameId in vitaoGames) {
            const promiseGame = 
            db.doc(`games/${gameId}`).get()
            gamesPromises.push(promiseGame)
        }
        const result2 = await Promise.all(gamesPromises)
        const gamesData = []
        result2.forEach(game => {
            const gameData = game.data()
            gameData.gameId = game.id
            gamesData.push(gameData)
        });
        response.send(gamesData)
        
    } catch (error) {
        console.error(error)
        response.status(500).send('Deu ruim!')   
    }
})

