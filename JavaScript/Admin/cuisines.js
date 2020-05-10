//Script for cuisine management
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

//Reference to the objectId to delete or update for an cuisine
var queryObjectId;

document.addEventListener('DOMContentLoaded', function() {
    onPageLoad();
    const user = localStorage.getItem("currentUser");
    console.log(user);

    document.getElementById('userEmail').innerHTML = "Hi, " + user;

    var elems = document.querySelectorAll('.fixed-action-btn');
    var instances = M.FloatingActionButton.init(elems);
    var elems = document.querySelectorAll('.modal');
    var instances = M.Modal.init(elems);
});

//Function for when the page loads
function onPageLoad(){

    //Clear the table
    var tbl = document.getElementById("myTable");
    tbl.innerHTML = "";

    //Get the table
    tbl = document.getElementById('myTable');

    //Create query
    var queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setSortBy( ["Name"] );
    queryBuilder.setPageSize( 100 ).setOffset( 0 );

    //Find all cuisines in the Cuisines table
    return Backendless.Data.of( "Cuisine" ).find(queryBuilder)
    .then( function( result ) {
        console.log(result);
        var i;
        var arrlen = result.length;
        for(i=0;i<arrlen;i++){
            //Populate the table
            addRow(tbl, result[i].Name, "edit", "delete_forever", result[i].objectId, "update", "delete", result[i].objectId, result[i].objectId);
        }
        console.log("10. onPageLoad() complete");
     })
    .catch( function( error ) {
        console.log(error);
        toastNotification(error.message, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
     });

}


//Function to add a cell
function addCell(tr, val, id) {
    var td = document.createElement('td');

    td.id = id;
    td.innerHTML = val;
    tr.appendChild(td)
}

//Function to add a cell right alligned
function addCellRight(tr, val, id, elname) {
    var td = document.createElement('td');

    td.classList.add("right-align"); //tbl-update
    //td.id = id;

    //Add button
    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.classList.add("waves-effect");
    //btn.classList.add("red");
    btn.classList.add("waves-light");
    btn.classList.add("btn-small");
    btn.classList.add("material-icons");
    btn.innerHTML = val;                   // Insert text
    if(btn.innerHTML == "delete_forever"){
        btn.classList.add("red");
        btn.classList.add("lighten-2");
    }else{
        btn.classList.add("green");
        btn.classList.add("lighten-2");
    }
    //Add id to btn
    btn.id = id;
    //Add name to btm
    btn.name = elname;
    td.appendChild(btn);//document.body.appendChild(btn);               // Append <button> to <body>

    //td.innerHTML = val;
    tr.appendChild(td)
}

// //Function to add a cell right alligned
// function addCellRightDelete(tr, val, id) {
//     var td = document.createElement('td');

//     td.classList.add("tbl-delete"); //tbl-delete
//     td.id = id;
//     td.innerHTML = val;
//     tr.appendChild(td)
// }

//Function to add a row
function addRow(tbl, val_1, val_3, val_4, id_1, id_3, id_4, name_3, name_4) {
    var tr = document.createElement('tr');
    tr.id = id_1;

    addCell(tr, val_1, id_1);
    //addCell(tr, val_2, id_2);
    addCellRight(tr, val_3, id_3, name_3);
    addCellRight(tr, val_4, id_4, name_4);

    tbl.appendChild(tr)
}

//Register admin button
addCuisineBtn.addEventListener('click', e => {
    //Dismiss current toasts
    M.Toast.dismissAll();
});

//Function to add a cuisine
function addCuisine(){
    //Credientails
    var cuisine = document.getElementById("add_cuisine").value.trim();

    //Check if valid entries 
    if(cuisine == "" || cuisine.length > 20 || (cuisine != "" && !cuisine.match(/^[A-Za-z ]+$/))){
        //Create error message
        var errorMessage = "";
        //Find which values are null and invalid
        if(cuisine == ""){
            errorMessage += "\"Cuisine\" is required!" + "<br>";
        }
        if(cuisine.length > 20){
            errorMessage += "\"Cuisine\" must be less than 20 characters!" + "<br>";
        }
        if((cuisine != "" && !cuisine.match(/^[A-Za-z ]+$/))){
            errorMessage += "\"Cuisine\" contains non-alphabetic characters!" + "<br>";
        }
        //Display error message
        toastNotification(errorMessage, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
    }else{
        var cuisine = {
            Name: cuisine,
        }
        return Backendless.Data.of( "Cuisine" ).save( cuisine )
        .then(()=> {return onPageLoad();})
        .then(() => {console.log("11. Notification sent"); toastNotification('Cuisine has been created successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd'); //Display success message
            document.getElementById('add_cuisine').value = ""})
        .catch( function( error ) {
            if(error.message == "Duplicate value " + "'" + cuisine.Name + "'" +  " for column 'Name'"){
                toastNotification("Cuisine with the name " + "'" + cuisine.Name + "'" + " already exists.", 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
            }else{ //Duplicate value 'French' for column 'Name'
                console.log( "an error has occurred " + error.message );
                console.log("Duplicate value " + "'" + cuisine.Name + "'" +  " for column 'Name'");
                toastNotification(error.message, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
            }

        });
    }
}

//Cancel add cuisine button
modalAddCuisineCancel.addEventListener('click', e => {
    //Clear the cuisine entry
    document.getElementById('add_cuisine').value = "";
});

//Button for delete
$(document).on('click','#delete',function(){
    //Dismiss current toasts
    M.Toast.dismissAll();

    const elem = document.getElementById('modal2');
    const instance = M.Modal.init(elem, {dismissible: true});
    instance.open();

    //Get the user ID
    var objectId = $(this).attr("name");
    console.log(objectId);

    //Get the text of the cuisine name
    var row = $('#' + objectId);
    var cellText = row.find('td:first').text();
    //Transfer email to the delete modal for confirmation
    document.getElementById('modalDeleteCuisineMessage').innerHTML = "Do you want to delete the selected Cuisine? <br><br>" +  "<b>" + cellText + "</b>";
    console.log(cellText);

    //Save the cuisine's object id
    queryObjectId = objectId;
    console.log(queryObjectId)
});

//Delete cuisine confirm button
modalDeleteCuisineConfirm.addEventListener('click', e => {

    console.log(queryObjectId)
    // Delete the cuisine
    return Backendless.Data.of( "Cuisine" ).remove( { objectId:queryObjectId } )
     .then(() => {return onPageLoad();})
     .then(() => {console.log("11. Notification sent"); toastNotification('Cuisine deleted successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd');}) // Display success message
    .catch( function( error ) {
        toastNotification(error, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
     });
});

//Button for update
$(document).on('click','#update',function(){
    //Dismiss current toasts
    M.Toast.dismissAll();

    const elem = document.getElementById('modal3');
    const instance = M.Modal.init(elem, {dismissible: true});
    instance.open();

    //Get the user ID
    var objectId = $(this).attr("name");
    console.log(objectId);

    //Get the text of the cuisine name
    var row = $('#' + objectId);
    var cellText = row.find('td:first').text();
    //Transfer cuisine to the update modal for confirmation
    document.getElementById('update_cuisine').value = cellText;
    console.log(cellText);
    //Update dynamically
    M.updateTextFields();

    //Save the cuisine's object id
    queryObjectId = objectId;
    console.log(queryObjectId)
});

//Update cuisine confirm button
modalUpdateCuisineConfirm.addEventListener('click', e => {

    console.log(queryObjectId)
    //Get the text of the cuisine name
    var row = $('#' + queryObjectId);
    var cellText = row.find('td:first').text();

    //Get the form data
    var updateName = document.getElementById('update_cuisine').value.trim();

    //If there are errors
    if(updateName == "" || updateName.length > 20 || (updateName != "" && !updateName.match(/^[A-Za-z ]+$/))
    || updateName == cellText){
        //Create error message
        var errorMessage = "";  
        //Find which values are null and invalid
        if(updateName == ""){
            errorMessage += "\"Cuisine\" is required!" + "<br>";
        }
        if(updateName.length > 20){
            errorMessage += "\"Cuisine\" must be less than 20 characters!" + "<br>";
        }   
        if(updateName != "" && !updateName.match(/^[A-Za-z ]+$/)){
            errorMessage += "\"Cuisine\" contains non-alphabetic characters!" + "<br>";
        }
        if(updateName == cellText){
            return
        }
        //Display error message
        toastNotification(errorMessage, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');        
    }else{
        //Create the updated cuisine
        var cuisine = {
            Name: updateName,
            objectId: queryObjectId
        }
        // Delete the cuisine
        return Backendless.Data.of( "Cuisine" ).save( cuisine )
        .then(() => {return onPageLoad();})
        .then(() => {console.log("11. Notification sent"); toastNotification('Cuisine updated successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd');}) // Display success message
        .catch( function( error ) {
            toastNotification(error, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
        });
    }
});

//Function to display a toast notification
function toastNotification(message, imgClass, img, colour, time, sideColour){
    M.toast({html: '<div class="toast-side">' + '</div>' + '<div class="toast-notification-con">' + '<img class=' + "\"" + imgClass + "\"" + ' src="../images/'  + img + "\"" + '>' + '<div class="toast-message">' + "" + message + "" + '</div>'  + '<img class="toast-close" src="../images/toast-close.png" height="16" width="16">' + '</div>', displayLength:time, classes: "" + colour + ""})
    $('.toast-side').css({"background-color":sideColour});

    //toast-close
    $(document).on('click', '.toast-close', function() {
        $('#toast-container .toast').fadeOut(500, function(){
            $('#toast-container .toast').remove();
        });
    });
}

//Logout
function logoutUser(){
    //Store user state
    var status = "logged_out";
    localStorage.setItem("userStatus", status);
    console.log(status); 
    //Re-direct to login page
    window.location.href = "../admin.html";  
}