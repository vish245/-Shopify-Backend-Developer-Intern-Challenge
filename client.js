// Jai Swaminarayan

// Receives the data and add it into an object.
// Restaurant Information:
/*  1) id
    2) name -> user
    3) min order -> user
    4) Dilivery Fee -> user
 */

let submit = document.getElementById("submit");
let restaurant;

var id = 3

function createRestaurant() {
    let restaurantName = document.getElementById("rName").value;
    let diliveryFee = document.getElementById("dFee").value;
    let minOrderFee = document.getElementById("minOrder").value;

    if (isNaN(diliveryFee)) {
        alert("Please enter a numerical for Dilivery Fee!");
    }
    if (isNaN(minOrderFee)) {
        alert("Please enter a numerical value for Minimum Order!");
    } else {
        restaurant = {
            "id": id++,
            "name": restaurantName,
            "min_order": minOrderFee,
            "delivery_fee": diliveryFee,
            "menu": {}
        };
    }
}

function addRestaurant() {

    createRestaurant();

    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let res = JSON.parse(xhttp.response);
            console.log("This the data received from the client: ", res);
        }
    };

    xhttp.open('POST', '/restaurants', true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    console.log("This is the new restaurant", restaurant);
    xhttp.send(JSON.stringify(restaurant));
    location.replace(`http://localhost:3000/restaurants/${restaurant.id}`)
}
submit.addEventListener('click', addRestaurant);

// Manipulating the http://localhost:3000/restaurants/:restID
// Make divs to manipulate the DOM 

var currentRestaurant;
var itemId;

function getCurrentRestaurant() {
    //currentRes = null
    let currId = Number(window.location.href.charAt(window.location.href.length - 1));
    console.log("This is the ID in get function: ", currId);
    let menu = document.getElementById("menu");
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
            let currentRes = JSON.parse(xhttp.response);
            currentRestaurant = currentRes
            console.log("This the data received from the client: ", currentRestaurant);
        }
    };

    xhttp.open('GET', `/restaurants/${currId}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send();

    if (menu.innerHTML !== "")
        itemId = Number(menu.lastChild.lastChild.id) + 1;
    else {
        itemId = 0;
    }

    console.log("This is the updated itemId: ", itemId);
}

function addCategory() {
    let categoryName = document.getElementById("categoryName").value
    if (categoryName in currentRestaurant.menu) {
        alert("The category already exists");
    } else {
        let option = document.createElement("option");
        option.value = document.getElementById("categoryName").value;
        option.innerHTML = document.getElementById("categoryName").value;
        document.getElementById("sCategory").appendChild(option);
        currentRestaurant.menu[document.getElementById("categoryName").value] = {};
        document.getElementById('menu').innerHTML += `<div id=${categoryName}><h3>${categoryName}</h3></div>`;
        alert("Category added at bottom of page!");
    }
}

function addItem() {
    let menu = document.getElementById('menu');
    let categoryDiv = (document.getElementById('sCategory').value);
    console.log(categoryDiv);
    let itemName = document.getElementById('itemName').value;
    let itemDescription = document.getElementById('itemDescription').value;
    let itemPrice = document.getElementById('itemPrice').value;

    console.log("This is the current id: ", itemId);

    if (isNaN(itemPrice)) {
        alert("COULD NOT ADD ITEM: Item price should be a valid numerical value!")
    } else {
        document.getElementById(categoryDiv).innerHTML += `<div id=${itemId}><p><b>Item ID: ${itemId}</b></p><p>Item Name: ${itemName}</p><p>Description: ${itemDescription}</p>
                                            <p>Price: ${itemPrice}</p><br></div>`;
        alert("CONGRATULATION! Item Added Under Respective Category!");


    }

    currentRestaurant.menu[categoryDiv][itemId] = {
        "name": itemName,
        "description": itemDescription,
        "price": itemPrice
    }
    itemId++;
}

function saveChanges() {

    currentRestaurant.name = document.getElementById("restName").value;
    currentRestaurant.min_order = document.getElementById("minimumOrder").value;
    currentRestaurant.delivery_fee = document.getElementById("deliveryFee").value;
    let currId = Number(window.location.href.charAt(window.location.href.length - 1));
    let xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function() {

        if (this.readyState == 4 && this.status == 200) {
            let responseObj = JSON.parse(xhttp.response);
            console.log("This the data received back from the server : ", responseObj);
        }
    };
    xhttp.open('PUT', `/restaurants/${currId}`, true);
    xhttp.setRequestHeader("Content-Type", "application/json");
    xhttp.setRequestHeader("Accept", "application/json");
    xhttp.send(JSON.stringify(currentRestaurant));
    alert("Restaurant has been updated!");
}