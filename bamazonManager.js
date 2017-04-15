//This program will allow the user to view a database
// list of items, view items with low inventory,
// add items to an inventory, and add a new product

//all the required packages
var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "test",
  database: "Bamazon"
});

connection.connect(function(err) {
  if (err) throw err;
  displaySearch();
});

//function displaySearch will use inquirer to pick an option for the manager to do
//then route to the correct option's function
var displaySearch = function() {
  inquirer.prompt(
	{
		name: "action",
		type: "list",
		message: "Select an option:",
		choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"]
	}).then(function (answer) {

		if (answer.action === "View Products for Sale") {
			console.log("you chose view Products for sale");
			displayItems();
		}
		if (answer.action === "View Low Inventory") {
			console.log("you chose View Low Inventory");
			lowInventory();
		}
		if (answer.action === "Add to Inventory") {
			console.log("you chose view Add to Inventory");
			addInventory();
			
		}
		if (answer.action === "Add New Product") {
			console.log("you chose view Add New Product");
			addProduct();
		}
	});
}
//function displayItems will show all the products available
function displayItems() {
	connection.query('SELECT * FROM products', function (error, results, fiedls)
	{
	if (error) throw error;
	// console.log(results);
		for (var i = 0; i < results.length; i++) {
			console.log("ID number: " + results[i].item_id + " || " + "Product Name: " + 
				results[i].product_name + " || " + "Price: " + results[i].price + " || " 
				+ results[i].stock_quantity);
		}
		// connection.end();
		// runSearch();
	});
}

//function lowInventory will show products from the database will the stock quantity
// 5 or lower
function lowInventory() {
	connection.query('SELECT * FROM products', function (error, results, fiedls)
	{ 
		if (error) throw error;
	// console.log(results);
		for (var i = 0; i < results.length; i++) {
			if (results[i].stock_quantity < 5) {
				console.log("ID number: " + results[i].item_id + " || " + "Product Name: " + 
				results[i].product_name + " || " + "Price: " + results[i].price + " || " 
				+ results[i].stock_quantity);
				}
			}

	});
}

//function addInventory will allow the manager to select the id of and item and
// update its quantity
function addInventory() {
	displayItems();
	connection.query('SELECT * FROM products', function (error, results)
	{
		if (error) throw error;
	  inquirer.prompt([
		{
		  name: "action",
		  type: "input",
		  message: "What would you like to add stock of? Type in item id:",
		  validate: function (input) {
		  	if (isNaN(input) === false && parseInt(input) <= parseInt(results.length)) {
			return true;
			  }
			  console.log("\nPlease input a correct value!");
			  return false;
		  }
		},
	    {
		   	name: "bid",
		    type: "input",
		    message: "How many units would you like to add?",
		    validate: function(value) {
	     	 if (isNaN(value) === false) {
		        return true;
		     }
		      return false;
	    }
	   }
	    ]).then(function(answer) {
	    //after using inquier for item selection, we find the matching object and
	    //set it to a variable
	    var chosenItem;
	  	for (var i = 1; i < results.length; i++) {
	  		if (results[i].item_id === parseInt(answer.action)) {
	  			chosenItem = results[i];
	 			console.log("Item chosen: " + chosenItem.product_name);
	  		}
	  	}
	  	//the stock quantity will then be added by adding the current stock to 
	  	//the amount the user entered and stored in a variable
	  	var addedAmount = parseInt(chosenItem.stock_quantity) + parseInt(answer.bid);
	  	//Using addedAmount will set the new quantity with the mysql query call
	  	connection.query("UPDATE products SET ? WHERE ?",
	  			[{ stock_quantity: addedAmount }, {item_id: chosenItem.item_id}],
	  		 function (error, results)
			{
				console.log("Quantity successfully updated");
			}); //ends UPDATE products connection query

		}); //ends function answer

	}); //ends connection query
} //ends addInventory function

//function addProuct will add a new product with all its properties using inquier
function addProduct() {
  inquirer.prompt([{
    name: "item",
    type: "input",
    message: "What is the name of the item?"
  }, {
    name: "department",
    type: "input",
    message: "What department is this item in?"
  }, {
    name: "price",
    type: "input",
    message: "What is the price of this item?",
    validate: function(value) {
      if (isNaN(value) === false) {
        return true;
      }
      return false;
    }}, {
    name: "stock",
    type: "input",
    message: "How much stock is available?",
    validate: function(value2) {
      if (isNaN(value2) === false) {
        return true;
      }
      return false;
    }
  }]).then(function(answer) {
  	console.log(answer);

  	//using the answer from inquier, we make a query call to mysql product database,
  	// and update the database
	connection.query('INSERT INTO products SET ?', {
		product_name: answer.item,
		department_name: answer.department,
		price: answer.price,
		stock_quantity: answer.stock
		}, function (error, results, fiedls)
			{ 
		  if (error) throw error;
      		console.log("Your inventory was updated successfully!");
		}); //ends INSERT INTO

	}); // ends function .then answer function

} //ends addInventory function



