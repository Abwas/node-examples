var assert = require('assert');

//insert a document. 4 parameters: the database, the document to insert, the collection to be insterted to, and a callback
exports.insertDocument= function(db, document, collection, callback) {
    
    //assign the collection we are using to coll
    var coll = db.collection(collection);
    
    //insert the function, return callback
    coll.insert(document, function(err, result) {
        
        //check if error != null. If not null, exit function immediatly and show error
        assert.equal(err,null);
        
        //else, log  document information and initiate callback
        console.log("Inserted " + result.result.n + " documents into the document collection " + collection);
        callback(result);
    });
};

//find all documents
exports.findDocuments = function(db, collection, callback){
    
    //get a reference to the documents in collection
    var coll = db.collection(collection);
    
    //find the documents and send them to an array then callback
    coll.find({}).toArray(function(err, docs) {
        assert.equal(err,null);
        callback(docs);
    });  
};

//delete a single document
//document parameter is a filter (part of a document that we use to identify the document to delete)
exports.removeDocument = function(db, document, collection, callback) {
    var coll = db.collection(collection);
    
    //deletes the very first document in the collection that matches the criteria
    coll.deleteOne(document, function(err,result) {
        assert.equal(err,null);
        console.log("Removed the document " + document);
        callback(result);
    });
};

//update a single document
exports.updateDocument = function(db, document, update, collection, callback) {
    var coll = db.collection(collection);
    
    //updates the very first document that matches the criteria I supply
    //Parameters: 1st: document 2nd: which particular field in document I want to update
    coll.updateOne(document, {$set: update}, null, function(err,result){
        assert.equal(err,null);
        console.log("Updated the document with " + update);
        callback(result);
    });
};