var MongoClient = require('mongodb').MongoClient,
    assert = require('assert');

//connection URL
//running on local server at port 27017 and connecting to conFusion database
var url = 'mongodb://localhost:27017/conFusion';

//use connect method to connect to our server
MongoClient.connect(url, function(err, db) {
    //check if there is an error. If there is, error != null and our application will fail
    assert.equal(err, null);
    //otherwise, log out and continue
    console.log("Connected correctly to server");
    
    //name the specific collection we want to look at
    var collection = db.collection("dishes");
    
    //use collection method 'insertOne' which allows us to insert one document into the collection
    //returns a callback
    collection.insertOne({name: "Uthapizza", description: "test"},
                        function(err,result) {
        //again, check for error. If error, our applictation fails
        assert.equal(err,null);
        //otherwise, log out and continue
        console.log("After Insert:");
        console.log(result.ops)
        
        //run this code in the callback to ensure the insert is done first
        //retrieve all the documents that are a part of this collection and print them out on the screen
        //find empty collection which means find all. Send to an array, and execute callback
        collection.find({}).toArray(function(err,docs) {
            assert.equal(err, null);
            console.log("Found:");
            console.log(docs);
            
            //drop the collection from the db so that the db is returned to pristine condition
            //wouldn't typically do this, just want to clean the array for other examples later
            db.dropCollection("dishes", function(err,result) {
                assert.equal(err,null);
                //close connection to the database
                db.close();
            });
        });  
    });  
});