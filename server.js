// Jai Swaminarayanconst 

// Express
express = require('express');
let app = express();

// Pug
const pug = require('pug');

// Read File
const fs = require('fs');

// Middleware
app.use(express.json());
app.use(express.static("views"));
app.use(express.urlencoded({ extended: true }));

// Set up the routes
app.get("/", loadHomePage);
app.get("/home", loadHomePage);
app.get("/restaurants", loadRestaurant);
app.get("/addrestaurant", addRestaurant);

app.get("/client.js", function(req, res) {
    res.sendFile(__dirname + "/" + "client.js");
});

app.post("/restaurants", saveAddedRestaurant);
app.get("/restaurants/:restID", getRestaurant);
app.put("/restaurants/:restID", updateRestaurant);


// Route Functionality
function loadHomePage(request, response) {
    response.send(pug.renderFile("views/home.pug"));
}

function loadRestaurant(request, response) {

    response.format({
        'text/html': () => {
            console.log("This is an HTML page request for restaurants!");
            response.set('Content-Type', 'text/html');
            response.send(pug.renderFile("views/restaurants.pug", {
                restaurants: restaurants,
            }))
        },
        'application/json': () => {
            console.log("This is an JSON page request for restaurants!");
            response.set('Content-Type', 'application.json');
            response.json({
                restaurants: restID
            })
        },
        'default': () => { response.status(406).send("Not Acceptable") }
    });
}

function addRestaurant(request, response) {
    response.send(pug.renderFile("views/addRestaurant.pug"));
}

function saveAddedRestaurant(request, response) {

    console.log("This is the added restaurant:\n", request.body);
    restaurants.push((request.body));
    console.log("The server has these restaurants", restaurants);
    response.send(request.body);

}

function getRestaurant(request, response) {

    let currentRestaurant = request.params.restID;

    let requiredIndex;

    for (let i = 0; i < restaurants.length; i++) {
        if (restaurants[i].id == currentRestaurant) {
            requiredIndex = i;
        }
    }

    console.log("This is the index for restaurant", requiredIndex);
    let requiredRestaurant = restaurants[requiredIndex];
    console.log("This is the required Restaurant:\n", requiredRestaurant);

    response.format({
        'text/html': () => {
            console.log("This is an HTML page request for restaurants!");
            response.set('Content-Type', 'text/html');
            response.send(pug.renderFile("views/restaurantInfo.pug", {
                restaurant: requiredRestaurant,
                restID: currentRestaurant
            }));
        },
        'application/json': () => {
            console.log("This is an JSON page request for restaurants!");
            console.log("This is the current Restaurant Object",
                restaurants[requiredIndex]);
            response.set('Content-Type', 'application/json');
            response.json(
                restaurants[requiredIndex]
            )
        },
        'default': () => { response.status(406).send("Not Acceptable") }
    });
}

function updateRestaurant(request, response) {
    console.log("This is res recieved after updating: ", request.body);

    let currentRestaurant = request.params.restID;
    let requiredIndex;

    for (let i = 0; i < restID.length; i++) {
        if (i == currentRestaurant) {
            requiredIndex = i;
        }
    }
    restaurants[requiredIndex] = JSON.parse(request.body);
    response.send(request.body);
}

// Read JSON files and store data on the server.
let restaurants = [];
let restID = [];

fs.readdir("./restaurants", (err, files) => {
    if (err) return console.log(err);
    console.log(files);

    for (let i = 1; i < files.length; i++) {
        let rest = require("./restaurants/" + files[i]);
        restaurants.push(rest);
        restID.push(rest.id);
        console.log("This is the restaurant id: ", rest.id);
        console.log(restaurants);
    }
});

// Start Server
app.listen(3000);
console.log("Server listening at http://localhost:3000");