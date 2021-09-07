const {MongoClient} = require('mongodb');
const express = require('express');
const app = express();
app.use(express.json());

const db_enki_carts = 'enki-carts';
const db_enki_users = 'enki-users';
const db_enki_products = 'enki-products';
const db_collection_carts = 'carts';
const db_collection_products = 'products';
const db_collection_users = 'users';

const data_products_test = {
    "title": "My Own Words",
    "author": "Ruth Ginsburg",
    "genre": "history",
    "published": "7/8/2018",
    "pages": "400",
    "price": "13.35",
    "currency": "euro",
    "photo": "https://images-na.ssl-images-amazon.com/images/I/41ZhmNOH8ZL._SX326_BO1,204,203,200_.jpg",
    "description": "The New York Times bestselling book from Supreme Court Justice Ruth Bader Ginsburg—“a comprehensive look inside her brilliantly analytical, entertainingly wry mind, revealing the fascinating life of one of our generation's most influential voices in both law and public opinion” (Harper’s Bazaar).", 
    "available": "3",
};

const uri = "mongodb+srv://enki-admin-cart:enki1234@cluster0.5xz0p.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(uri);

async function db_connectAndDo(todo, test) { {
    try {
        // Connect to the MongoDB cluster
        await client.connect();

        // Make the appropriate DB calls

        if(todo == db_insertData) {
            console.log("Inserting...");
            return await todo(test)
        }else if(todo == db_findAll) {
            console.log("Finding all...");
            return await todo(test) 
        }else if(todo == db_updateData) {
            console.log("Updating...");
            return await todo(test)
        }else if(todo == db_deleteData) {
            console.log("Deleting...");
            return await todo(test) 
        }else {
            console.log("Function not found");
            return -1;
        }

    } catch (e) {
        console.error(e);
    } finally {
        // Close the connection to the MongoDB cluster
        client.close();
    }
 }
}

/**
 * @param {MongoClient} client A MongoClient that is connected to a cluster with the database
 * @param {string} nameOfListing The name of the listing you want to update / find
 * @param {object} updatedBooklist An object containing all of the properties to be updated for the given listing
 */

// create
async function db_insertData(in_test){
    const result = await client.db(db_enki_products).collection(db_collection_products).insertOne(in_test);
    console.log(`New book(s) created with the following id(s):${result.insertedId}`);
}

// read
async function findBookByTitle(client, nameOfListing) {
    const cursor = await client.db(db_enki_products).collection(db_collection_products).find({ title: nameOfListing });
    if (cursor) {
        console.log(`Found book(s) in the db with the title '${nameOfListing}':`);
    } else {
        console.log(`No books found with the title '${nameOfListing}'`);
    }
    const results = await cursor.toArray();

    if (results.length > 0) {
        console.log(`Found book(s) with the title ${nameOfListing}`) ;
        results.forEach((result, i) => {   
            console.log();
            console.log(`${i + 1}. Title: ${result.title}`);
            console.log(`   _id: ${result._id}`);
            console.log(`   Author: ${result.author}`);
            console.log(`   Available: ${result.available}`);
        });
    } else {
        console.log(`No books found with the title ${nameOfListing}`) ;
    }
}

// update
async function db_updateData(up_test){
    // Print the book
    await findBookByTitle(client, up_test.title);
    // Update the book to have 7 copies
    await updateDBByTitle(client, up_test.title, { available: "7" });
    // Print the updated Book listing
    await findBookByTitle(client, up_test.title);
}

// updateOne = first one, old one will remain
async function updateDBByTitle(client, nameOfListing, updatedBooklist) {
    console.log( 'updateDBByTitle working');
    console.log({ title: nameOfListing });
    console.log(updatedBooklist);
    const result = await client.db(db_enki_products).collection(db_collection_products).updateOne({ title: nameOfListing }, { $set: updatedBooklist });
    console.log(`${result.matchedCount} document(s) matched the query criteria.`);
    console.log(`${result.modifiedCount} document(s) was/were updated.`);
}

// delete
async function db_deleteData(dt_test){
    // Print the book
    await findBookByTitle(client, dt_test.title);
    // Delete the book items
    await deleteDBByTitle(client, dt_test.title);
    // Print the updated book listing
    await findBookByTitle(client, dt_test.title);
}

async function deleteDBByTitle(client, nameOfListing) {
    const result = await client.db(db_enki_products).collection(db_collection_products).deleteOne({ title: nameOfListing });
    console.log(`${result.deletedCount} document(s) was/were deleted.`);
}

// db_connectAndDo( db_insertData, data_products_test).catch(console.error);
// db_connectAndDo( db_deleteData, data_products_test).catch(console.error);
//  db_connectAndDo( db_updateData, data_products_test).catch(console.error);
db_connectAndDo(db_findAll).catch(console.error);

const port = process.env.PORT || 3000;
app.listen(port, () => console.log(`Listening on port ${port}...`));

// function db_findAll
async function db_findAll() {
    const cursor = await client.db(db_enki_products).collection(db_collection_products).find();
    const results = await cursor.toArray();
    results.sort((a, b) => a.title.localeCompare(b.title));
    if (results.length > 0) {
        console.log('Found a listing in the collection :');
        console.log(results.length);
        return results;
    } else {
        console.log('No listings found' );
        return 0;
    }
}

//SERVER - Products
app.get('/books', (req, res) => {
    //send all books from the db
    db_connectAndDo(db_findAll, false, false)
        .then((results) => {
            let data = { "book_results": results }
            res.send(data);
        });
});

app.get('/books/:id', (req, res) => {
    //send only a specific book
    const book_id = req.params.id;
    console.log(book_id);
    db_connectAndDo(db_findElementById, false, book_id)
        .then((result) => {
            res.send(result);
        });
});

app.put('/books', (req, res) => {
    //update the "available" of the products that are bought
    const products = req.body.sold;
    products.forEach((product) => {
        //update every product
        db_connectAndDo(db_findAndUpdateProduct, product[1], { _id: ObjectId(product[0]) });
    });
});



// app.post()
// app.put()
// app.delete()

    // 
    // app.get('/api/courses/:id',(req, res) => {
    //     res.send(req.query);
    // });
