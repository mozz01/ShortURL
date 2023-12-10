// Models for the URL Collection

// Import dependencies.
import mongoose from 'mongoose';
import 'dotenv/config';

// Connect based on the .env file parameters.
mongoose.connect(
    process.env.MONGODB_CONNECT_STRING,
    { useNewUrlParser: true }
);
const db = mongoose.connection;


// Confirm that the database has connected and print a message in the console.
db.once("open", (err) => {
    if(err)
    {
        res.status(500).json({ Error: `\n\tFailed to establish a connetion with the database.\n` });
    } 
    else  
    {
        console.log('\n\tSuccess: Connected to the database.\n');
    }
});


// SCHEMA: Define the collection's schema.
const urlSchema = mongoose.Schema({
	long:             { type: String, required: true },
    shortid:          { type: String, required: true },
	short:            { type: String, required: true },
	clicks:           { type: Number, default: 0 },
    dateAdded:        { type: Date, required: true, default: Date.now }
});


// Compile the model from the schema 
// by defining the collection name "urls".
const urls = mongoose.model('URLs', urlSchema);


// CREATE model *****************************************
const createURL = async (long, shortid, short, clicks, dateAdded) => {
    const url = new urls({ 
        long: long,
        shortid: shortid,
        short: short,
        clicks: clicks,
        dateAdded: dateAdded 
    });
    return url.save();
}


// RETRIEVE model *****************************************
// Retrieve all documents and return a promise.
const retrieveURLs = async () => {
    const query = urls.find();
    return query.exec();
}


// RETRIEVE by ID
const retrieveURLByID = async (_id) => {
    const query = urls.findById({_id: _id});
    return query.exec();
}


// RETRIEVE by SHORTID
const retrieveURLByShortID = async (_shortid) => {
    const query = urls.find({shortid: _shortid});
    return query.exec();
}


// DELETE model based on _id  *****************************************
const deleteURLById = async (_id) => {
    const result = await urls.deleteOne({_id: _id});
    return result.deletedCount;
};


// UPDATE model *****************************************************
const updateURL = async (_id, long, shortid, short, clicks, dateAdded) => {
    const result = await urls.replaceOne({_id: _id }, {
        long: long,
        shortid: shortid,
        short: short,
        clicks: clicks,
        dateAdded: dateAdded 
    });
    return { 
        _id: _id, 
        long: long,
        shortid: shortid,
        short: short,
        clicks: clicks,
        dateAdded: dateAdded 
    }
}


// EXPORT the variables for use in the controller file.
export { createURL, retrieveURLs, retrieveURLByID, updateURL, deleteURLById, retrieveURLByShortID }