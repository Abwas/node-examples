var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

var dboper = require('./operations');

//connect to our mongo database
var url = 'mongodb://localhost:27017/conFusion';
//use connect method to connect to the server
MongoClient.connect(url, function(err,db) {
    //check for error connecting to server. Exit if error.
    assert.equal(err,null);
    //else no error, log and continue on
    console.log("Connected correctly to the server");
    
    //lets preform some database operations utilizing our node module operations.js!
    //each database operation needs a callback opearation
    
    // Insert parameters: (database, document to insert, collection to be inserted to, callback)
    dboper.insertDocument(db, {name: "Vadonut", description: "Test Description"}, "dishes", function (result) {
        //log out returned value
        console.log(result.ops);
        
        //Find Documents parameters: (database, collection, callback)
        dboper.findDocuments(db, "dishes", function(docs) {
            //returned value from callback logged to console to show the document that was found
            console.log(docs);
            
            //Update Documents parameters: (database, document to update, what to update, collection, callback)
            dboper.updateDocument(db, {name:"Vadonut"}, {description:"Updated Description"}, "dishes", function(result) {
                console.log(result.result);
                
                //call findDocuments again so we can see the changes to our documents that we just made ^
                dboper.findDocuments(db, "dishes", function(docs) {
                    console.log(docs);
                    
                    //finally, dropCollection parameters (collection to delete, callback)
                    db.dropCollection("dishes", function(result) {
                        console.log(result);
                        //close the database
                        db.close();
                    });
                });
            });
        });
    });
});