// Backendless database setup
(function () {
    const APP_ID = 'CA14D4D2-1B0F-4527-FF1E-9C38D5AEFC00';
    const API_KEY = '64606BDA-9451-4847-BCA2-AE0422269CFE';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();



// The number of shops
var shopLen = 0;
// The number of items
var itemLen = 0;

// The objectIds of the shops
var shopObjectIds = [];
// The objectIds of the items
var itemObjectIds = [];

// Check whether a stock price needs to be updated
var priceValue;

// Check whether enter was pressed when a value was updated
var valueUpdated = false

/**
 * When DOM content is loaded
 */
document.addEventListener('DOMContentLoaded', function () {

    // Display the user's email
    document.getElementById("users_email").innerHTML = "Signed in as: " + userData.email;

    //Load the javascript components
    pageOnLoad();
});

/**
 * Load the page's JavaScript functionality, including creating the table
 */
function pageOnLoad() {

    console.log("0. OnPageLoad()")
    // Clear the table
    var Parent = document.getElementById('myTable');
    while (Parent.hasChildNodes()) {
        Parent.removeChild(Parent.firstChild);
    }


    // Clear the shop and item objectId arrays
    shopObjectIds = [];
    itemObjectIds = [];
    // Clear the number shops and items reported
    shopLen = 0;
    itemLen = 0;

    // Array to hold the shops with a blank as the first object
    var shops = [{ name: "", objectId: "" }];
    // Array to hold the items
    const items = [];
    // Save the previous shop name to check for uniqueness 
    var prevShop = "";

    // Create a query and set the relations.
    var queryBuilder = Backendless.DataQueryBuilder.create().setWhereClause("ownerId = " + "'" + userData.id + "'");
    queryBuilder.setPageSize( 100 );
    queryBuilder.setRelated(["item",
        "shop"]);

    // Sort by shop created then item created
    queryBuilder.setSortBy(["shop.created", "item.created"]);

    // Set page size to 100
    // queryBuilder.setPageSize(100);

    // Retrieve the results from the Stock table
    Backendless.Data.of("Stock").find(queryBuilder)
        .then(function (stock) {
            //console.log(stock);

            // No stocks (items and shops) added
            if (stock.length == 0) {

                // Display the shops and 
                console.log("No stocks");

                // Need to create Query builder and sort by name etc 

                //Find out if there is at least 1 shop or at least 1 item

                // Get count of shops and push shop to shopObjectIds and shopLen
                const getshops = new Promise((resolve, reject) => {

                    // Sort shops by date created
                    var queryBuilderShops = Backendless.DataQueryBuilder.create().setWhereClause("ownerId = " + "'" + userData.id + "'");
                    queryBuilderShops.setPageSize( 100 ); //.setOffset( 0 );
                    queryBuilderShops.setSortBy(["created"]);

                    Backendless.Data.of("Shops").find(queryBuilderShops)
                        .then(function (shops) {

                            resolve(shops);
                        })
                })

                // Get count of items and push item to itempObjectIds and itemLen
                const getItems = new Promise((resolve, reject) => {

                    // Sort items by date created
                    var queryBuilderItems = Backendless.DataQueryBuilder.create().setWhereClause("ownerId = " + "'" + userData.id + "'");
                    queryBuilderItems.setSortBy(["created"]);

                    Backendless.Data.of("Items").find(queryBuilderItems)
                        .then(function (items) {

                            resolve(items);
                        })
                })

                Promise.all([
                    getshops,
                    getItems
                ]).then((shopsitems) => {
                    console.log(shopsitems);

                    // Determine whether at least 1 shop or at least 1 item is present
                    if (shopsitems[0].length > 0) {
                        console.log("At least 1 shop")

                        shopLen = shopsitems[0].length;

                        console.log(shopObjectIds);
                        console.log("Number of items: " + itemLen)
                        console.log("Number of shops: " + shopLen)

                        document.getElementById("noShopItemAdded").innerHTML = "Only " + shopLen + " shops added";

                        // Get the table
                        var tbl = document.getElementById("myTable");

                        // Create the row for shops
                        var shopRow = document.createElement("tr");

                        // Create blank cell and append to the row
                        var shopCellBlank = document.createElement("td");
                        shopCellBlank.style.visibility = 'hidden';
                        // Append to the row
                        shopRow.appendChild(shopCellBlank);


                        // Create row for notifiying about adding an item
                        var itemRow = document.createElement("tr");

                        // Create cell
                        var itemCell = document.createElement("td");
                        // Set item text
                        itemCell.innerHTML = "Please add an item";

                        // Add cell to the row
                        itemRow.appendChild(itemCell);


                        var a = 0;
                        var numShops = shopsitems[0].length;
                        // For each shop
                        for (a; a < numShops; a++) {

                            // Store each shop objectId
                            shopObjectIds.push(shopsitems[0][a].objectId)

                            // Create a cell for the shops
                            var shopCell = document.createElement("td");

                            // Create the span
                            var shopNameSpan = document.createElement("span");

                            // Set the span's inner html, make editable and set the spans Id
                            shopNameSpan.innerHTML = shopsitems[0][a].name;
                            shopNameSpan.contentEditable = "true";
                            shopNameSpan.Id = shopsitems[0][a].objectId;

                            // Apply makeEditable, focusOut and focusIn functions to the cell's Name Span
                            shopNameSpan.onclick = function () { makeEditable(this); };
                            shopNameSpan.onblur = function () { focusOut(this); };
                            shopNameSpan.onfocus = function () { focusIn(this); };

                            // Append the shopNameSpan to the cell and assign an objectId to the cell.
                            shopCell.appendChild(shopNameSpan);
                            shopCell.Id = shopsitems[0][a].objectId;

                            // Create the column delete button
                            var colDelbtn = document.createElement('button');

                            // Set the text and value of the button and assign an on click function
                            colDelbtn.type = "button";
                            colDelbtn.innerHTML = "x";
                            colDelbtn.value = shopsitems[0][a].objectId;
                            colDelbtn.onclick = function () { deleteCol(this); };
                            colDelbtn.classList.add("catHdingBtn");

                            // Append the button to the cell
                            shopCell.appendChild(colDelbtn);


                            // Append the cell to the rows
                            shopRow.appendChild(shopCell);

                            // Create blank cells for notifiying about adding an item
                            var blankCell = document.createElement("td");
                            itemRow.appendChild(blankCell);

                        }

                        // Add row to table
                        tbl.appendChild(shopRow);



                        // Add row to table
                        tbl.appendChild(itemRow);


                    } else if (shopsitems[1].length > 0) {
                        console.log("At least 1 item")

                        // itemObjectIds.push(shopsitems[1][0].objectId)
                        // Need to push all itemObjectIds
                        // var b = 0;
                        // var 
                        itemLen = shopsitems[1].length;

                        console.log(itemObjectIds);
                        console.log("Number of items: " + itemLen)
                        console.log("Number of shops: " + shopLen)

                        document.getElementById("noShopItemAdded").innerHTML = "Only " + itemLen + " items added";

                        // Get the table
                        var tbl = document.getElementById("myTable");

                        // Create blank row for shops
                        var shopRow = document.createElement("tr");
                        var shopCellBlank = document.createElement("td");
                        shopCellBlank.style.visibility = 'hidden';
                        var shopCellHeading = document.createElement("td");
                        shopCellHeading.innerHTML = "Please add some shops or \"General price\" for Example";

                        // Add cells to row
                        shopRow.appendChild(shopCellBlank);
                        shopRow.appendChild(shopCellHeading);
                        // Add row to table
                        tbl.appendChild(shopRow);



                        var a = 0;
                        var numItems = shopsitems[1].length;
                        // For each item
                        for (a; a < numItems; a++) {

                            // Store each item ObjectId
                            itemObjectIds.push(shopsitems[1][a].objectId);

                            // Create the row
                            var itemRow = document.createElement("tr");

                            // Create the cell
                            var itemCell = document.createElement("td");
                            // Create an empty cell
                            var emptyItemCell = document.createElement("td");

                            // Create the span
                            var itemNameSpan = document.createElement("span");

                            // Set the span inner html, make editable and set the spans Id
                            itemNameSpan.innerHTML = shopsitems[1][a].name;
                            itemNameSpan.contentEditable = "true";
                            itemNameSpan.Id = shopsitems[1][a].objectId;

                            // Apply makeEditable, focusOut and focusIn functions to the cell's Name Span
                            itemNameSpan.onclick = function () { makeEditable(this); };
                            itemNameSpan.onblur = function () { focusOut(this); };
                            itemNameSpan.onfocus = function () { focusIn(this); };

                            console.log(itemNameSpan.innerHTML);

                            // Append the itemNamespan to the cell and assign an objectId to the cell.
                            itemCell.appendChild(itemNameSpan);
                            itemCell.Id = shopsitems[1][a].objectId;

                            // Create the column delete button
                            var rowDelbtn = document.createElement('button');

                            // Set the text and value of the button and assign an on click function
                            rowDelbtn.type = "button";
                            rowDelbtn.innerHTML = "x";
                            rowDelbtn.value = shopsitems[1][a].objectId;
                            rowDelbtn.onclick = function () { deleteRow(this); };
                            rowDelbtn.classList.add("catHdingBtn");

                            // Append the button to the cell
                            itemCell.appendChild(rowDelbtn);

                            // Append the cell to the row
                            itemRow.appendChild(itemCell);
                            itemRow.appendChild(emptyItemCell);

                            console.log(itemRow);
                            // Append the row to the table
                            tbl.appendChild(itemRow);
                        }
                    } else {
                        console.log("Please add a shop or item");

                        // Get the table
                        var tbl = document.getElementById("myTable");

                        // Create shop row

                        // Create blank row for shops
                        var shopRow = document.createElement("tr");
                        var shopCellBlank = document.createElement("td");
                        shopCellBlank.style.visibility = 'hidden';
                        var shopCellHeading = document.createElement("td");
                        shopCellHeading.innerHTML = "Please add some shops or \"General price\" for Example";

                        // Add cells to row
                        shopRow.appendChild(shopCellBlank);
                        shopRow.appendChild(shopCellHeading);

                        // Create row for notifiying about adding an item
                        var itemRow = document.createElement("tr");

                        // Create item cell
                        var itemCell = document.createElement("td");
                        // Set item text
                        itemCell.innerHTML = "Please add an item";

                        // Create blank item cell
                        var blankItemCell = document.createElement("td");

                        // Add item and blank item cell to the row
                        itemRow.appendChild(itemCell);
                        itemRow.appendChild(blankItemCell);

                        // Add rows to table
                        tbl.appendChild(shopRow);
                        tbl.appendChild(itemRow);

                        // Create item row
                        document.getElementById("noShopItemAdded").innerHTML = "Please add a shop or item";
                    }
                })

                // Get count of items


            } else {

                var a = 0;
                var stockLen = stock.length;
                // For each stock
                for (a; a < stockLen; a++) {

                    // Push the shop to "shops" if shop name of the stock is different from the previous shop name
                    if (stock[a].shop.name != prevShop) {
                        var shop = { name: stock[a].shop.name, objectId: stock[a].shop.objectId };
                        shops.push(shop);

                        //Store the shop objectId for adding an new item
                        shopObjectIds.push(stock[a].shop.objectId);
                    }

                    // Create the newItem object (name, objectId, prices [price, objectId])- Check to see performance when just newItem in else statement
                    const newItem = { name: stock[a].item.name, objectId: stock[a].item.objectId, prices: [{ price: stock[a].price, objectId: stock[a].objectId }] };

                    // If newItem is not in "items", then add it, otherwise add the shop's prices to the object
                    if (items.some(item => item.name == newItem.name)) {

                        // Get the index of the the item - Expensive? (check alternative in One Note) - Can I somehow get index from if statement?
                        var index = items.findIndex(x => x.objectId === newItem.objectId);

                        // Add the price and objectId to the prices array of the item
                        items[index].prices.push({ price: stock[a].price, objectId: stock[a].objectId });

                    } else {

                        // Add the newItem - The newItem does not exist in "items"
                        items.push(newItem)
                        itemObjectIds.push(stock[a].item.objectId);
                    }

                    // Set the previous shop for next time as the current shop name
                    prevShop = stock[a].shop.name;
                }

                // Get the table
                var tbl = document.getElementById('myTable');

                // Get the number of shops - length -1 as there as a blank shop at the top left
                shopLen = shops.length - 1;
                //var rows = shops.concat(items);

                // Merge "items" with "shops" to keep data to one array - TODO shops should be recalled rows, though each shop does have items
                shops.push.apply(shops, items);
                console.log(shops);


                // Create a table row - Out of loop as shop data is spread across more than 1 iteration
                var row = document.createElement("tr");

                a = 0; // Reset the loop - Reuse 'a' variable
                var dataSetLen = shops.length;

                // For each element/object
                for (a; a < dataSetLen; a++) {

                    // If for an item - (a starts at 0, so even though shopLen is 2, it will iterate 3 times, which is okay as the first cell is not a shop but a blank "")
                    if (a > shopLen) {
                        // Create the item row
                        var rowItem = document.createElement("tr");
                    }

                    // Create a cell
                    var cell = document.createElement("td");

                    // On "enter" key press down
                    cell.addEventListener("keydown", function (event) {

                        // Number 13 is the "Enter" key on the keyboard
                        if (event.keyCode === 13) {

                            // Set cell to lose focus
                            this.blur();

                            // Cancel the default action, if needed
                            event.preventDefault();
                        }
                    });

                    // If the name contains data, set cell text, otherwise hide the cell
                    if (shops[a].name != "") {

                        console.log(shops[a].name)
                        // Create a span for the categories  heading - shops and items
                        var categoryHeading = document.createElement("span");

                        // Set the category heading name and make editable.
                        categoryHeading.innerHTML = shops[a].name;
                        categoryHeading.contentEditable = "true";
                        categoryHeading.Id = shops[a].objectId;

                        categoryHeading.onclick = function () { makeEditable(this); };
                        categoryHeading.onblur = function () { focusOut(this); };
                        categoryHeading.onfocus = function () { focusIn(this); };

                        // cell.onblur = function () { focusOut(this); };

                        // Append to the cell and assign an objectId to the cell.
                        cell.appendChild(categoryHeading);
                        cell.Id = shops[a].objectId;

                        // If item, add the row delete button and append the prices
                        if (a > shopLen) {

                            // Row - Create Buttons
                            var rowDelbtn = document.createElement('button');

                            // Set the type, text and value of the button and assign an on click function
                            rowDelbtn.type = "button";
                            rowDelbtn.innerHTML = "x";
                            rowDelbtn.value = shops[a].objectId;
                            rowDelbtn.onclick = function () { deleteRow(this); };
                            rowDelbtn.classList.add("catHdingBtn");

                            // Append the button to the cell
                            cell.appendChild(rowDelbtn);

                            // Append the item (cell 0 - name and button)
                            rowItem.appendChild(cell);

                            var b = 0;
                            var priceLen = shops[a].prices.length;
                            // For each price of the item
                            for (b; b < priceLen; b++) {

                                // Create the cell
                                var cellPrice = document.createElement("td");
                                cellPrice.contentEditable = "true";
                                cellPrice.innerHTML = shops[a].prices[b].price;
                                cellPrice.Id = shops[a].prices[b].objectId;

                                // On click
                                //cellPrice.addEventListener('click', makeEditable);
                                cellPrice.onclick = function () { makeEditable(this); };
                                // cellPrice.onfocusout = function () { focusOut(this); };
                                cellPrice.onblur = function () { focusOut(this); };
                                cellPrice.onfocus = function () { focusIn(this); };


                                // // On "enter" key press down // TODO - this updates the last cell
                                // cellPrice.addEventListener("keydown", function (event) {

                                //     console.log("hi");

                                //     // Number 13 is the "Enter" key on the keyboard
                                //     if (event.keyCode === 13) {

                                //         // console.log(e);
                                //         // console.log(e.innerHTML);
                                //         // console.log(e.contentEditable);
                                //         // console.log(e.Id)

                                //         // Update stock price

                                //         var stock = {
                                //             objectId: cellPrice.Id,
                                //             price: cellPrice.innerHTML,
                                //         }

                                //         // console.log(stock);

                                //         // non-blocking API
                                //         Backendless.Data.of("Stock").save(stock)
                                //             .then(function (savedObject) {
                                //                 console.log("Stock instance has been updated");
                                //                 console.log(savedObject);
                                //             })
                                //             .catch(function (error) {
                                //                 console.log("an error has occurred " + error.message);
                                //             });



                                //         // Set cellPrice cell to lose focus
                                //         this.blur();

                                //         // Cancel the default action, if needed
                                //         // event.preventDefault();
                                //     }
                                // });


                                // // On "enter" key press down
                                // cellPrice.addEventListener("keydown", function (event) {

                                //     // Number 13 is the "Enter" key on the keyboard
                                //     if (event.keyCode === 13) {

                                //         console.log(cellPrice);
                                //         console.log(cellPrice.innerHTML);
                                //         // console.log(cellPrice.contentEditable);
                                //         // console.log(cellPrice.Id)

                                //         // Update stock price

                                //         var stock = {
                                //             objectId: cellPrice.Id,
                                //             price: "Jack Daniels",
                                //         }

                                //         // console.log(stock);

                                //         // // non-blocking API
                                //         // Backendless.Data.of("Contact").save(contact)
                                //         //     .then(function (savedObject) {
                                //         //         console.log("Contact instance has been updated");
                                //         //     })
                                //         //     .catch(function (error) {
                                //         //         console.log("an error has occurred " + error.message);
                                //         //     });



                                //         // Set cellPrice cell to lose focus
                                //         this.blur();

                                //         // Cancel the default action, if needed
                                //         event.preventDefault();
                                //     }
                                // });

                                // Append the price cell to the item row
                                rowItem.appendChild(cellPrice);
                            }
                        }
                    } else {
                        cell.style.visibility = 'hidden'; //.style.display= 'none'; 
                    }

                    // Column - Create Buttons

                    // If row is the first and the cell is any but the first
                    if (a > 0 && a <= shopLen) {

                        // Column - Create the column delete button
                        var colDelbtn = document.createElement('button');

                        // Set the type, text and value of the button and assign an on click function
                        colDelbtn.type = "button";
                        colDelbtn.innerHTML = "x";
                        colDelbtn.value = shops[a].objectId;
                        colDelbtn.onclick = function () { deleteCol(this); };
                        colDelbtn.classList.add("catHdingBtn");

                        // Append the button to the cell
                        cell.appendChild(colDelbtn);
                    }

                    // Append the shop cell to the shop row if the iteration is for a shop
                    if (a <= shopLen) {

                        // Append the cell to the row
                        row.appendChild(cell);
                    }

                    // Append the shop row to the table if all the shop cells have been added to the row, otherwise append the item row
                    if (a == shopLen) { // TODO - Apparently this if statement is unnecessary

                        // The last shop cell has been added to the shop row

                        // Append the shop row to the table
                        tbl.appendChild(row);

                    } else if (a > shopLen) {

                        // The iteration is for an item row

                        // Append the item row to the table
                        tbl.appendChild(rowItem);
                    }
                }

                // Store the number of items
                itemLen = items.length;
                console.log("Number of items: " + itemLen)
                console.log("Number of shops: " + shopLen)

                // There are shops and items added, so remove the warning message
                document.getElementById("noShopItemAdded").innerHTML = "";

            }
        })
        .catch(function (error) {
            console.log(error);
        });

    // Clear the add Item or shop input if one was just added
    document.getElementById("add_item_input").value = '';
    document.getElementById("add_shop_input").value = '';
}

/**
 * Delete a row
 */
function deleteRow(btn) {

    // Get the row index
    var rowDel = btn.closest('tr').rowIndex - 1;

    // Store the cell object Ids
    var cellObjectIds = [];

    // Get the table
    var table = document.getElementById("myTable");

    // Get the row which is to be deleted
    var row = table.rows[rowDel];

    // For each col/cell of the row to be deleted
    for (var j = 0, col; col = row.cells[j]; j++) {

        // Columns would be accessed using the "col" variable assigned in the for loop

        // Store the objectIds of each cell
        cellObjectIds.push(col.Id)
    }

    // If there are shops/stocks, delete the shop and also the stocks
    if (shopLen > 0) {

        // Delete Item - Promise
        const deleteItem = new Promise((resolve, reject) => {

            // Delete the item - Single (index 0)
            Backendless.Data.of("Items").remove({ objectId: cellObjectIds[0] })
                .then(function (objectsDeleted) {
                    resolve(objectsDeleted);
                    //console.log(timestamp);
                })
                .catch(function (error) {
                    reject(error);
                    //console.log(eror)
                });

        })

        // Delete Stocks - Promise
        const deleteStocks = new Promise((resolve, reject) => {

            // Store all the stocks ObjectIds
            var stocks = [];


            // Add all stock objectIds to the stocks array (starting at index 1)

            var a = 1;
            var stocksObjectIdsLen = cellObjectIds.length;
            //For each stock
            for (a; a < stocksObjectIdsLen; a++) {

                // Get ObjectId of the stock
                var objectId = { objectId: cellObjectIds[a] }

                // Store objectId
                stocks.push(objectId);
            }

            // Bulk delete - Delete the stocks
            Backendless.Data.of("Stock").bulkDelete(stocks)
                .then(function (objectsDeleted) {
                    //console.log("Server has deleted " + objectsDeleted + " objects");
                    resolve("Server has deleted " + objectsDeleted + " objects")
                })
                .catch(function (error) {
                    //console.log("Server reported an error " + error);
                    reject("Server reported an error " + error);
                })

        })

        // Promise all promises and then call pageOnLoad() once all promises are resolved
        Promise.all([
            deleteItem,
            deleteStocks
        ]).then((messages) => {
            console.log(messages)
            pageOnLoad();
        })

    } else {

        // Delete item alone

        // Delete the item - Single (index 0)
        Backendless.Data.of("Items").remove({ objectId: cellObjectIds[0] })
            .then(() => {
                pageOnLoad();
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

/**
 * Delete a column
 */
function deleteCol(btn) {

    // Get the table
    var tbl = document.getElementById('myTable');

    // Getting the rows in table. 
    var row = tbl.rows;

    // Removing the column at index(1). TODO - Get the column index that the button is on 
    // Get the cell index that the delete col button is on  
    var i = btn.closest('td').cellIndex;
    console.log(i)

    // Get the cell id
    var cellId = btn.closest('td').Id

    // Store the cell object Ids
    var cellObjectIds = [];

    // For each row
    for (var j = 0; j < row.length; j++) {

        // Deleting the ith cell of each row. 
        // row[j].deleteCell(i);
        var cellId = row[j].cells[i];

        // Save the cell object ids
        cellObjectIds.push(cellId.Id)
    }

    // If there are items/stocks, delete the shop and also the stocks
    if (itemLen > 0) {

        // Delete Shop - Promise
        const deleteShop = new Promise((resolve, reject) => {

            // Delete the shop - Single (index 0)
            Backendless.Data.of("Shops").remove({ objectId: cellObjectIds[0] })
                .then(function (timestamp) {
                    resolve(timestamp);
                })
                .catch(function (error) {
                    reject(error);
                });

        })

        // Delete Stocks - Promise
        const deleteStocks = new Promise((resolve, reject) => {

            // Store all the stocks ObjectIds
            var stocks = [];

            // Add all stock objectIds to the stocks array (starting at index 1)

            var a = 1;
            var stocksObjectIdsLen = cellObjectIds.length;
            //For each stock
            for (a; a < stocksObjectIdsLen; a++) {

                // Get ObjectId of the stock
                var objectId = { objectId: cellObjectIds[a] }

                // Store objectId
                stocks.push(objectId);
            }

            // Bulk delete - Delete the stocks
            Backendless.Data.of("Stock").bulkDelete(stocks)
                .then(function (objectsDeleted) {
                    //console.log("Server has deleted " + objectsDeleted + " objects");
                    resolve("Server has deleted " + objectsDeleted + " objects")
                })
                .catch(function (error) {
                    //console.log("Server reported an error " + error);
                    reject("Server reported an error " + error);
                })
        })

        // Promise all promises and then call pageOnLoad() once all promises are resolved
        Promise.all([
            deleteShop,
            deleteStocks
        ]).then((messages) => {
            console.log(messages)
            pageOnLoad();
        })

    } else {

        // Delete Shop alone 

        // Delete the shop - Single (index 0)
        Backendless.Data.of("Shops").remove({ objectId: cellObjectIds[0] })
            .then(() => {
                pageOnLoad();
            })
            .catch(function (error) {
                console.log(error);
            });

    }

}

/**
 * Add an item
 */
function addItem() {


    // If there are shops
    if (shopLen > 0) {

        // Create Item - Promise
        const createItem = new Promise((resolve, reject) => {

            // Get the Add Item input text
            let addItem = document.getElementById('add_item_input').value;

            var item = {
                name: addItem
            }


            // Promise to return the item's objectId
            Backendless.Data.of("Items").save(item)
                .then(function (savedObject) {
                    console.log("1." + savedObject.name + " New Item instance has been saved");

                    console.log("2. New item objectId: " + savedObject.objectId);

                    // // shops currently added
                    // console.log("Total num of shops: " + shopLen);
                    // console.log("Number of items: " + itemLen + " (before number of items re-calculated)");

                    // console.log("Current item objectIds");
                    // console.log(itemObjectIds);

                    // Return the item objectId
                    resolve(savedObject.objectId);

                })
        })


        // Create stocks (for how many shops there are for the given item)- Promise
        const createStocks = new Promise((resolve, reject) => {

            console.log("Will this run?!!!!!!!!!!?")
            console.log(shopLen);

            // Store the blank stocks
            var blankStocks = [];

            var z = 0;
            // Create the blank stock objects
            for (z; z < shopLen; z++) {

                // Store the blank stock
                blankStocks.push({ "name": "" })
            }


            Backendless.Data.of("Stock").bulkCreate(blankStocks)
                .then(function (result) {
                    //console.log( "Objects have been saved" );
                    console.log("Blank stocks");
                    console.log(result);
                    resolve(result);
                })
                .catch(function (error) {
                    //console.log( "Server reported an error " + error );
                    reject("Server reported an error " + error)
                })

        })

        // Promise all promises
        Promise.all([
            createItem,
            createStocks
        ]).then((objectIds) => {

            // Count how many relations have been set.
            var relationsSet = 0;

            var a = 0;
            // The number of new blank stocks
            var stockObjectIdsLen = objectIds[1].length;

            // For each blank stock
            for (a; a < stockObjectIdsLen; a++) {

                // The stock
                var parentObject = { objectId: objectIds[1][a] };
                // The item
                var childObject = { objectId: objectIds[0] };
                var children = [childObject];

                // Set relation for item and stock
                Backendless.Data.of("Stock").addRelation(parentObject, "item", children)
                    .then(function (count) {
                        console.log("relation has been set - item");
                        //console.log(count);

                        // Increase the number of relations set
                        relationsSet += 1;

                        if (relationsSet == stockObjectIdsLen * 2) {
                            console.log(stockObjectIdsLen * 2 + " total relations set with stocks (item & shop)");
                            pageOnLoad();
                        }

                    })
                    .catch(function (error) {
                        console.log("server reported an error - " + error.message);
                    });

                // The shop
                var childObject2 = { objectId: shopObjectIds[a] };
                var children2 = [childObject2];

                // Set relation for shop and stock
                Backendless.Data.of("Stock").setRelation(parentObject, "shop", children2)
                    .then(function (count) {
                        console.log("relation has been set - shop");

                        // Increase the number of relations set
                        relationsSet += 1;

                        if (relationsSet == stockObjectIdsLen * 2) {
                            console.log(stockObjectIdsLen * 2 + " total relations set with stocks (item & shop)");
                            pageOnLoad();
                        }

                    })
                    .catch(function (error) {
                        console.log("server reported an error - " + error.message);
                    });

            }
        })


        // createItemNoRelation.then((message) => {
        //     console.log(message)
        // })

    } else {
        // If there are no shops

        // Create Item with no relation - Promise
        const createItemNoRelation = new Promise((resolve, reject) => {

            // Get the Add Item input text
            let addItem = document.getElementById('add_item_input').value;

            var item = {
                name: addItem
            }

            // Promise to return the item's objectId
            Backendless.Data.of("Items").save(item)
                .then(function (savedObject) {
                    console.log("1. Item added without a shop present");
                    console.log("2." + savedObject.name + " New Item instance has been saved");

                    // If there are no shops i.e only an item added, refresh the table
                    resolve(pageOnLoad());
                })
        })

    }


}


/**
 * Add a shop
 */
function addShop() {

    // If there are items
    if (itemLen > 0) {

        // Create Shop - Promise
        const createShop = new Promise((resolve, reject) => {

            // Get the Add Item input text
            let addShop = document.getElementById('add_shop_input').value;
            console.log(addShop);

            // Create the shop object
            var shop = {
                name: addShop
            }

            // Promise to return the shop's objectId
            Backendless.Data.of("Shops").save(shop)
                .then(function (savedObject) {
                    console.log("1." + savedObject.name + " New Shop instance has been saved");

                    console.log("2. New shop objectId: " + savedObject.objectId);

                    // Return the item objectId
                    resolve(savedObject.objectId);

                })

        })

        // Create stocks (for how many items there are for the given shop) - Promise
        const createStocks = new Promise((resolve, reject) => {

            // Store the blank stocks
            var blankStocks = [];

            var z = 0;
            // Create the blank stock objects
            for (z; z < itemLen; z++) {

                // Store the blank stock
                blankStocks.push({ "name": "" })
            }


            Backendless.Data.of("Stock").bulkCreate(blankStocks)
                .then(function (result) {
                    //console.log( "Objects have been saved" );
                    console.log("Blank stocks");
                    console.log(result);
                    resolve(result);
                })
                .catch(function (error) {
                    //console.log( "Server reported an error " + error );
                    reject("Server reported an error " + error)
                })

        })

        // Promise all promises
        Promise.all([
            createShop,
            createStocks
        ]).then((objectIds) => {

            // Count how many relations have been set.
            var relationsSet = 0;

            var a = 0;
            // The number of new blank stocks
            var stockObjectIdsLen = objectIds[1].length;

            // For each blank stock
            for (a; a < stockObjectIdsLen; a++) {

                // The stock
                var parentObject = { objectId: objectIds[1][a] };
                // The shop
                var childObject = { objectId: objectIds[0] };
                var children = [childObject];

                // Set relation for shop and stock
                Backendless.Data.of("Stock").addRelation(parentObject, "shop", children)
                    .then(function (count) {
                        console.log("relation has been set - shop");
                        //console.log(count);

                        // Increase the number of relations set
                        relationsSet += 1;

                        // If the number of relations set is equal to the number of stocks x 2 (each stock requires two relations, one with shop and one with item)
                        if (relationsSet == stockObjectIdsLen * 2) {
                            console.log(stockObjectIdsLen * 2 + " total relations set with stocks (item & shop)");
                            pageOnLoad();
                        }

                    })
                    .catch(function (error) {
                        console.log("server reported an error - " + error.message);
                    });

                // The item
                var childObject2 = { objectId: itemObjectIds[a] };
                var children2 = [childObject2];

                // Set relation for item and stock
                Backendless.Data.of("Stock").setRelation(parentObject, "item", children2)
                    .then(function (count) {
                        console.log("relation has been set - item");
                        //console.log(count);

                        // Increase the number of relations set
                        relationsSet += 1;

                        // If the number of relations set is equal to the number of stocks x 2 (each stock requires two relations, one with shop and one with item)
                        if (relationsSet == stockObjectIdsLen * 2) {
                            console.log(stockObjectIdsLen * 2 + " total relations set with stocks (item & shop)");
                            pageOnLoad();
                        }
                    })
                    .catch(function (error) {
                        console.log("server reported an error - " + error.message);
                    });

            }

        })

    } else {
        // If there are no items

        // Create Shop with no relation - Promise
        const createShopNoRelation = new Promise((resolve, reject) => {

            // Get the Add Shop input text
            let addShop = document.getElementById('add_shop_input').value;

            var shop = {
                name: addShop
            }

            // Promise to return the item's objectId
            Backendless.Data.of("Shops").save(shop)
                .then(function (savedObject) {
                    console.log("1. Shop added without an item present");
                    console.log("2." + savedObject.name + " New Item instance has been saved");

                    // If there are no items i.e only an item added, refresh the table
                    resolve(pageOnLoad());
                })
        })
    }

}

/**
 * Make cell editable
 */
function makeEditable(e) {

    // Reset value updated to false
    valueUpdated = false;

    console.log(e)
    console.log(e.innerHTML)

    //     alert("row" + e.closest('tr').rowIndex + 
    //     " -column" + e.closest('td').cellIndex);

    // // Decide what table to update
    // var table = "Stock";

    // var object = {
    //     objectId: e.Id,
    //     price: e.innerHTML,
    // }

    // if (e.closest('tr').rowIndex == 1) {
    //     table = "Shops"

    //     object = {
    //         objectId: e.Id,
    //         name: e.innerHTML,
    //     }
    // } else if (e.closest('td').cellIndex == 0) {
    //     table = "Items"

    //     object = {
    //         objectId: e.Id,
    //         name: e.innerHTML,
    //     }
    // }
    // console.log(table);
    // console.log(object)

    // || e.closest('td').cellIndex == 0

    // Store the price value to check whether it changes when off click and therefore updated
    priceValue = e.innerHTML;

    if (e.hasAttribute("keydown") == false) {

        e.setAttribute("keydown", true)

        console.log("Added first event listener");

        e.addEventListener("keydown", function (event) {

            // e.value = "d";
            //console.log("hi");


            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {


                // Only update if value different
                if (e.innerHTML != priceValue) {

                    // console.log(e);
                    // console.log(e.innerHTML);
                    // console.log(e.contentEditable);
                    // console.log(e.Id)

                    // Update stock price

                    // var stock = {
                    //     objectId: e.Id,
                    //     price: e.innerHTML,
                    // }

                    // console.log(stock);

                    // Decide what table to update
                    var table = "Stock";

                    var object = {
                        objectId: e.Id,
                        price: e.innerHTML,
                    }

                    if (e.closest('tr').rowIndex == 1) {
                        table = "Shops"

                        object = {
                            objectId: e.Id,
                            name: e.innerHTML,
                        }
                    } else if (e.closest('td').cellIndex == 0) {
                        table = "Items"

                        object = {
                            objectId: e.Id,
                            name: e.innerHTML,
                        }
                    }
                    console.log(table);
                    // console.log(object)

                    // non-blocking API
                    Backendless.Data.of(table).save(object)
                        .then(function (savedObject) {
                            console.log("Stock instance has been updated");
                            console.log(savedObject);
                        })
                        .catch(function (error) {
                            console.log("an error has occurred " + error.message);
                        });

                    // Set that the has been value updated
                    valueUpdated = true;

                    // // Set cellPrice cell to lose focus
                    // this.blur();

                    // Cancel the default action, if needed
                    // event.preventDefault();
                }

                // Set cellPrice cell to lose focus
                this.blur();
            }
        });
    }

}

/**
 * When off click from a cell - lose focus
 */
function focusOut(e) {

    console.log("Out of focus");
    // console.log(e);
    // console.log("row" + e.closest('tr').rowIndex +
    //     " -column" + e.closest('td').cellIndex);
    // Find out what row col e is on

    console.log(priceValue);

    // // Which table to use
    // var table = "Stock";

    // if (e.closest('td').cellIndex == 0) {
    //     table = "Items";
    // }
    // else if (e.closest('tr').rowIndex == 1) {
    //     table = "Shops"
    // }

    // Update stock price

    // Check whether the price value is different and if a value has not been updated
    if (e.innerHTML != priceValue && valueUpdated == false) {


        // Which table to use
        var table = "Stock";

        var object = {
            objectId: e.Id,
            price: e.innerHTML,
        }

        if (e.closest('td').cellIndex == 0) {
            table = "Items";

            var object = {
                objectId: e.Id,
                name: e.innerHTML,
            }
        }
        else if (e.closest('tr').rowIndex == 1) {
            table = "Shops"

            var object = {
                objectId: e.Id,
                name: e.innerHTML,
            }
        }
        console.log(table);
        console.log(object);

        // non-blocking API
        Backendless.Data.of(table).save(object)
            .then(function (savedObject) {
                console.log("object instance has been updated");
                console.log(savedObject);
            })
            .catch(function (error) {
                console.log("an error has occurred " + error.message);
            });

    }
}

/**
 * When enter a cell - gain focus
 */
function focusIn(e) {

    console.log("In focus");
    console.log(priceValue);

    // Store the price value to say that there are no changes when focusOut() is called check whether it changes when off click and therefore updated
    priceValue = e.innerHTML;

    // As tab focus in can be seen as a mouse click for entering a cell, the event listening for an Enter key press needs to be added

    if (e.hasAttribute("keydown") == false) {

        e.setAttribute("keydown", true)

        // console.log("Added first event listener");

        e.addEventListener("keydown", function (event) {

            // e.value = "d";
            // console.log("hi");


            // Number 13 is the "Enter" key on the keyboard
            if (event.keyCode === 13) {


                // Only update if value different
                if (e.innerHTML != priceValue) {

                    // console.log(e);
                    // console.log(e.innerHTML);
                    // console.log(e.contentEditable);
                    // console.log(e.Id)

                    // Update stock price

                    // var stock = {
                    //     objectId: e.Id,
                    //     price: e.innerHTML,
                    // }

                    // console.log(stock);

                    // Decide what table to update
                    var table = "Stock";

                    var object = {
                        objectId: e.Id,
                        price: e.innerHTML,
                    }

                    if (e.closest('tr').rowIndex == 1) {
                        table = "Shops"

                        object = {
                            objectId: e.Id,
                            name: e.innerHTML,
                        }
                    } else if (e.closest('td').cellIndex == 0) {
                        table = "Items"

                        object = {
                            objectId: e.Id,
                            name: e.innerHTML,
                        }
                    }
                    console.log(table);
                    // console.log(object)

                    // non-blocking API
                    Backendless.Data.of(table).save(object)
                        .then(function (savedObject) {
                            console.log("Stock instance has been updated");
                            console.log(savedObject);
                        })
                        .catch(function (error) {
                            console.log("an error has occurred " + error.message);
                        });

                    // Set that the has been value updated
                    valueUpdated = true;

                    // // Set cellPrice cell to lose focus
                    // this.blur();

                    // Cancel the default action, if needed
                    // event.preventDefault();
                }

                // Set cellPrice cell to lose focus
                this.blur();
            }
        });
    }

}

/**
 * Logout the current user
 */
logout_user.addEventListener('click', e => {
    console.log("logout user");

    logoutUser();

    function userLoggedOut() {
        console.log("user has been logged out");


        // Re-direct to the index
        window.location.href = "index.html";

        // Store user state to local storage
        //localStorage.setItem("userStatus", "logged_out");
        localStorage.setItem('userData', JSON.stringify({
            status: false
        }));
    }

    function gotError(err) // see more on error handling
    {
        console.log("error message - " + err.message);
        console.log("error code - " + err.statusCode);
    }

    function logoutUser() {
        Backendless.UserService.logout()
            .then(userLoggedOut)
            .catch(gotError);
    }


});