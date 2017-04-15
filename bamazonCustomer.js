//This program will allow the user to view a database
// list of items with a choice to pick an item
// and the amount of quantity to buy.

var mysql = require("mysql");
var inquirer = require("inquirer");

//connection for the mysql database
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "test",
  database: "Bamazon"
});

//connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  displaySearch();
});

//Function displaySearch connects to the products database and displays
// the item name, its ID, the type of department it belongs to and the
// qunatity that exists
var displaySearch = function() 
{
	//makes the query using mysql command to display products
	connection.query('SELECT * FROM products', function (error, results, fiedls)
	{
	if (error) throw error;
	console.log(results);
		//The for loop only displays the ID number, product name, and the price of the
		// items in the the products database
		for (var i = 0; i < results.length; i++) {
			console.log("ID number: " + results[i].item_id + " || " + "Product Name: " + 
				results[i].product_name + " || " + "Price: " + results[i].price +
				" || " + "Stock Available: " + results[i].stock_quantity);
		}
		runSearch();
	});
}

//runSearch function allows the user to pick an item from the database list
// and the amount of units to buy
var runSearch = function() {
connection.query('SELECT * FROM products', function (error, results)
	{
	if (error) throw error;
	//use node package inquirer to ask questions
	  inquirer.prompt([
		{
		  name: "action",
		  type: "input",
		  message: "What would you like to buy? Type in item id:",
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
		    message: "How many units would you like?",
		    validate: function(value) {
	     	 if (isNaN(value) === false) {
		        return true;
		     }
		      return false;
	    	}
	    }
	    ]).then(function(answer) {
	    //depending on the ID the user typed in, it will sort through all
	    //of the object items and match the one pick and assign it to a variable
	  	var chosenItem;
	  	for (var i = 1; i < results.length; i++) {
	  		if (results[i].item_id === parseInt(answer.action)) {
	  			chosenItem = results[i];
	  			console.log("Item chosen: " + chosenItem.product_name);
	  		}
	  	}

	  	//depending on the stock quantity, the amount chosen will be updated
	  	//in mysql database by subtracting the total amount of stock with 
	  	//the number requested which will be the new amount of stock
	  	if (chosenItem.stock_quantity >= parseInt(answer.bid)) {
	  		var subtractAmt = parseInt(chosenItem.stock_quantity - answer.bid);
	  		connection.query("UPDATE products SET ? WHERE ?", 
	  			[{ stock_quantity: subtractAmt }, {item_id: chosenItem.item_id}],
	  		 function (error, results)
			{
				console.log("Item bought, stock quantity has updated");
				console.log("You bought: " + chosenItem.product_name + " || Priced: " + 
					chosenItem.price);
			});
	  	}
	  	//if not enough stock, send message and return to function runsearch
	  	else {
	  		console.log("Insufficient quantity");
	  		return runSearch();
	  	} //ends else

	  }); //ends function with answer parameter
	}); //ends connection query from line 50
} // ends runSearch function

