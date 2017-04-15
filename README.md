# Bamazon

## Description
There will be two files that run with node.js the first,
`bamazonCustomer.js`will allow the user to view a database
list of items with a choice to pick an item and the amount
of quantity to buy. The second, `bamazonManager.js` will the
user to view a database list of items, view items with low
inventory, add items to an inventory, and add a new product.

### BamazonCustomer
When launching this node app, the user will be prompted to
select the ID of an item to purchase and how many units to 
purchase. I chose 1 item to buy which will log the item bought
and the price of the item. Example: ![screenshot1](screenshot1.png)
Running the app again will display the new stock quantity. 
Example: ![screenshot2](screenshot2.png)

### BamazonManager
This is similar to the customer but with more options. First, 
when launching the app it will display 4 options,
![screenshot3](screenshot3.png)
When selecting the first option, `View Products for Sale`, it 
will list all the items ![screenshot4](screenshot4.png)
The second option, `View Low Inventory` will display all the 
items with a stock quantity of less than 5. Example: 
![screenshot5](screenshot5.png) The third option, `Add to Inventory`
will allow the manager to select an item by ID and add
the desired stock amount. Example: ![screenshot6](screenshot6.png)
Jacket’s stock when from 10 to 13. Example: ![screenshot7](screenshot7.png)
Finally, the last option, `Add new Product` will prompt the manager to 
enter a new product to the database. Example: ![screenshot8](screenshot8.png)
There is now a 17th ID number with T-shirt ![screenshot9](screenshot9.png)
