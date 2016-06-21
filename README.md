# Node-Examples
**What does each folder mean??**
_______
#### Simple Example [folder]
* simplerect.js
  Simply for illustration purposes. No modules, just code
* rect-1.js, solve-1.js
  Same code as in simplerect.js. Difference is that we've introduced modules
* rect-2.js, solve-2.js
  A more complex example that includes callbacks, closures, and error handling. Still the same code output as above.
* solve-3.js
  An even more complex example that utilizes yargs node module to allow command line input. Instead of hard coding the variables we now input them in command line
  
#### Node-Http [folder]
* server-1.js, server-2.js
  Simple HTML server that returns html files from a folder
  
#### Node-Express [folder]
* Utilize application routes and express router in Express framework to support a restful API

#### Con-fusion-app [folder]
* Created 3 separate Node Modules implementing an express router to support the rest API

#### Node-Express-Gen [folder]
* Utilized the express generator to build the same rest API as above, but much quicker and easier. Steps:
1. npm install express-generator -g
2. express node-express-gen
3. npm install
4. npm start

** How to install Mand run MongoDB with the Node-Express-Gen Folder above:**
* Go to http://www.mongodb.org, then download and install MongoDB as per the instructions given there.
* Create a folder named mongodb on your computer and create a subfolder under it named data.
* Move to the mongodb folder and then start the MongoDB server by typing the following at the prompt: ```mongod --dbpath=data```
* Open another command window and then type the following at the command prompt to start the mongo REPL shell: ```mongo```
* The Mongo REPL shell will start running and give you a prompt to issue commands to the MongoDB server. At the Mongo REPL prompt, type the following commands one by one and see the resulting behavior: ``` db
     use conFusion
     db
     db.help() ```
* You will now create a collection named dishes, and insert a new dish document in the collection: 
``` db.dishes.insert({ name: "Uthapizza", description: "Test" }); ```
* Then to print out the dishes in the collection, type:
``` db.dishes.find().pretty(); ```
* Next, we will learn the information encoded into the ObjectId by typing the following at the prompt: 
``` var id = new ObjectId();
     id.getTimestamp(); ```


#### Node-mongodb [folder]
* simpleserver.js
* Utilize the node MongoDB driver module and configure node application to communicate with the MongoDB server. 

** How to Use it**
* ```npm install```
* navigate to mongodb folder and run ```mongod --dbpath=data```
* navigate to node-mongodb folder and run ```node simpleserver```

--------
#### Rest-Server [folder]
**This folder is the production folder and puts all of our learning together**
* Integrated the REST API server based on the Express framework that we implemented earlier, together with the Mongoose schema and models that we developed to create a full-fledged REST API server
* To build this we started by scaffolding out an Express application using ```express rest-server```
* We then added in our ```app.js``` file from the node-express-gen folder.
* We then added in our routes from node-express-gen: ```dishRouter.js promoRouter.js leaderRouter.js```
* We then copied in our models
* Then ran ```npm install``` and ```npm install mongoose mongoose-currency --save``` to add them to our dependency list.
* After wiring it all together with some code changes, we are good to go!

**To run**
* navigate to your database: ```mongod --dbpath=data```
* navigate to rest-server: ```npm-start```
* Open postman and run your post/get/put/delete requests to test
