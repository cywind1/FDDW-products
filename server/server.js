const {MongoClient} = require('mongodb');
const express = require('express');
const app = express();
app.use(express.json());
const MongodbURI = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority"
const mongoClient = new MongoClient(MongodbURI);

const db_enki_carts = 'enki-carts';
const db_enki_users = 'enki-users';
const db_enki_products = 'enki-products';
const db_collection_carts = 'carts';
const db_collection_products = 'products';
const db_collection_users = 'users';

async function db_connectAndDo(todo, data, the_collection, the_db) {
    try {
        await mongoClient.close();
        await mongoClient.connect();
        await todo(data, the_collection, the_db);
    } catch (e) {
        console.error(e);
    }finally{
       
    }
}

// not yet working_insertedId
async function db_insertData(data, the_collection, the_db) {
    console.log("inserting...")

    try {
        const result = await mongoClient.db(the_db).collection(the_collection).insertOne(data);
        console.log(`Inserted new row in DB ${the_db} -> ${the_collection} with id ${result.insertedId}`);
    } catch (e) {
        console.error(e);
    }
}

async function db_updateData(data, the_collection, the_db) {
    console.log("updating...")
    try {
        const result = await mongoClient.db(the_db).collection(the_collection).updateOne(data);
        console.log(`Updated new row in DB ${the_db} -> ${the_collection} with id ${result.updatedId}`);
    } catch (e) {
        console.error(e);
    }
}

const data_products_ten = {
    "title": "Clean Code: A Handbook of Agile Software Craftsmanship",
    "author": "Robert C. Martin",
    "genre": "novel",
    "published": "01/08/2008",
    "pages": "464",
    "price": "43.89",
    "currency": "euro",
    "photo": "https://images-na.ssl-images-amazon.com/images/I/41yafGMO+rL._SX376_BO1,204,203,200_.jpg",
    "description": "Even bad code can function. But if code isn’t clean, it can bring a development organization to its knees. Every year, countless hours and significant resources are lost because of poorly written code. But it doesn’t have to be that way.\n\n Noted software expert Robert C. Martin, presents a revolutionary paradigm with Clean Code: A Handbook of Agile Software Craftsmanship. Martin, who has helped bring agile principles from a practitioner’s point of view to tens of thousands of programmers, has teamed up with his colleagues from Object Mentor to distill their best agile practice of cleaning code “on the fly” into a book that will instill within you the values of software craftsman, and make you a better programmer―but only if you work at it.", 
    "available": "3",

};

db_connectAndDo(db_insertData, data_products_ten, db_collection_products, db_enki_products).catch(console.error);


const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// app.post()
// app.put()
// app.delete()

    // app.get('/api/courses',(req, res) => {
    //     res.send([1,2,3]);
    // });

    // app.get('/api/courses/:id',(req, res) => {
    //     res.send(req.query);
    // });
