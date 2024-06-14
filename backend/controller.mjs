// Controllers for the URL Collection

import 'dotenv/config';
import express from 'express';
import * as urls from './model.mjs';

const PORT = process.env.PORT;
const app = express();
app.use(express.json());  // REST needs JSON MIME type.


// CREATE controller ******************************************
app.post ('/urls', (req,res) => { 
    urls.createURL(
        req.body.long, 
        req.body.shortid, 
        req.body.short, 
        req.body.clicks, 
        req.body.dateAdded
        )
        .then(url => {
            console.log(`"${url.short}" was added to the collection.`);
            res.status(201).json(url);
        })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
        });
});


// RETRIEVE controller ****************************************************
app.get('/urls', (req, res) => {
    urls.retrieveURLs()
        .then(urls => { 
            if (urls !== null) 
            {
                console.log(`All urls were retrieved from the collection.`);
                res.json(urls);
            } 
            else 
            {
                res.status(404).json({ Error: 'The requested collection does not exist.' });
            }         
         })
        .catch(error => {
            console.log(error);
            res.status(400).json({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
        });
});


app.use("/urls", (req, res, next) => {
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    next();
});


// RETRIEVE by ID controller
app.get('/urls/:_id', (req, res) => {
    urls.retrieveURLByID(req.params._id)
    .then(url => { 
        if (url !== null) 
        {
            console.log(`"${url.short}" was retrieved, based on its ID.`);
            res.json(url);
        } 
        else 
        {
            res.status(404).json({ Error: 'The requested url does not exist.' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
    });

});


app.use("/urls/shortid/:_shortid", (req, res, next) => {
    res.set("Access-Control-Allow-Headers", "*");
    res.set("Access-Control-Allow-Origin", "*");
    res.set("Access-Control-Allow-Methods", "GET");
    next();
});


// RETRIEVE by ShortID controller
app.get('/urls/shortid/:_shortid', (req, res) => {
    urls.retrieveURLByShortID(req.params._shortid)
    .then(url => { 
        if (url !== null && url.short != null) 
        {
            console.log(`"${url.short}" was retrieved, based on its short ID.`);
            res.json(url);
        } 
        else 
        {
            res.status(404).json({ Error: 'The requested url does not exist.' });
        }         
     })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
    });

});


// UPDATE controller ************************************
app.put('/urls/:_id', (req, res) => {
    urls.updateURL(
        req.params._id, 
        req.body.long, 
        req.body.shortid, 
        req.body.short, 
        req.body.clicks, 
        req.body.dateAdded
    )
    .then(url => {
        console.log(`"${url.short}" was updated.`);
        res.json(url);
    })
    .catch(error => {
        console.log(error);
        res.status(400).json({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
    });
});


// DELETE Controller ******************************
app.delete('/urls/:_id', (req, res) => {
    urls.deleteURLById(req.params._id)
        .then(deletedCount => {
            if (deletedCount === 1) 
            {
                console.log(`Based on its ID, ${deletedCount} url was deleted.`);
                res.status(200).send({ Success: 'The url was deleted successfully.' });
            }
            else 
            {
                res.status(404).json({ Error: 'The requested url does not exist.' });
            }
        })
        .catch(error => {
            console.error(error);
            res.status(400).send({ Error: 'Bad request: The server failed to fulfill your request due to invalid format.' });
        });
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}...`);
});