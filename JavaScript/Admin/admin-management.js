//Script for admin management
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

//Reference to the objectId to delete for an admin
var delObjectId;

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

//var objectId;

//Function for when the page loads
function onPageLoad(){

    //Clear the table
    var Table = document.getElementById("myTable");
    Table.innerHTML = "";

    //Get the table
    tbl = document.getElementById('myTable');

    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "CLICK ME";                   // Insert text

    //Set paging
    var queryBuilder = Backendless.DataQueryBuilder.create();
    queryBuilder.setPageSize( 100 ).setOffset( 0 );

    //Find all users in the Users table
    Backendless.Data.of( "Users" ).find( queryBuilder )
    .then( function( result ) {
        console.log(result);
        var i;
        var arrlen = result.length;
        for(i=0;i<arrlen;i++){
            //Populate the table
            addRow(tbl, result[i].email, result[i].userStatus, "edit", "delete_forever", result[i].objectId, result[i].objectId, "update", "delete", result[i].objectId, result[i].objectId);
        }


     })
    .catch( function( error ) {
        console.log(error);
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
function addRow(tbl, val_1, val_2, val_3, val_4, id_1, id_2, id_3, id_4, name_3, name_4) {
    var tr = document.createElement('tr');
    tr.id = id_1;

    addCell(tr, val_1, id_1);
    addCell(tr, val_2, id_2);
    addCellRight(tr, val_3, id_3, name_3);
    addCellRight(tr, val_4, id_4, name_4);

    tbl.appendChild(tr)
}

//Function to add a button
function addBtn(tbl){
    var btn = document.createElement("BUTTON");   // Create a <button> element
    btn.innerHTML = "CLICK ME";                   // Insert text
    tbl.appendChild(btn);

}

//Register admin button
registerAdminBtn.addEventListener('click', e => {
        //Dismiss current toasts
        M.Toast.dismissAll();
});

//Function to register an admin
function registerAdmin(){
    console.log("Register Admin");

    //Credientails
    var email = document.getElementById("user_email").value.trim();
    var password = document.getElementById("user_passw").value;
    var confirmPassword = document.getElementById("confirm_pass").value;

    //Check if valid entries 
    if(email == "" || password == "" || password != confirmPassword || password.length < 8 || !password.match(/.*[A-Z].*/) || !password.match(/.*\d.*/) ||
    (/\s/.test(password)) == true){
        //Create error message
        var errorMessage = "";
        //Find which values are null and invalid
        if(email == ""){
            errorMessage += "\"Email\" is required!" + "<br>";
        }
        if(password == ""){
            errorMessage += "\"Password\" is required!" + "<br>";
        }
        if(password.length < 8){
            errorMessage += "\"Password\" must be at least 8 characters!" + "<br>";
        }
        if(password != "" && (!password.match(/.*[A-Z].*/))){ //(?=.*[A-Z]) 
            errorMessage += "Password requires at least 1 uppercase character!" + "<br>";
        }
        if(password != "" && (!password.match(/.*\d.*/))){ //(?=.*[A-Z]) 
            errorMessage += "Password requires at least 1 number!" + "<br>";
        }
        if(password != "" && (password != confirmPassword)){
            errorMessage += "Passwords don't match!" + "<br>";
        }
        if((/\s/.test(password)) == true){
            errorMessage += "Password cannot contain spaces!" + "<br>";
        }
        //Display error message
        toastNotification(errorMessage, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
    }else{
        function userRegistered( user )
        {
            onPageLoad();
            console.log( "user has been registered" );
            toastNotification('Admin created successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd'); // Display success message
        }
    
        function gotError( err ) // see more on error handling
        {
            toastNotification(err.message, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
            console.log( "error code - " + err.statusCode );
        }
    
        var user = new Backendless.User();
        user.email = email;
        user.password = password;
    
        //Register user as admin
        return Backendless.UserService.register( user ).then( userRegistered ).catch( gotError );
    }
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

// //Function for either button update or delete
// function btnUpdateDelete(){
//     console.log("Update/Delete btn clicked");
// }

//Button for update
$(document).on('click','#update',function(){

    
    // const elem = document.getElementById('modal2');
    // const instance = M.Modal.init(elem, {dismissible: true});
    // instance.open();

    // //Get the user ID
    // var objectId = $(this).attr("name");
    // console.log(objectId);

    // //Get cell of 
    // // var cellText = $(this).closest('table').find('tr:#' + objectId).find('td:first').text(); //tr:last  ('tr:last td:first').text(); //tr:last 
    // //var cellText = $(this).closest('table').find('tr:#' + objectId + 'td:first').text();
    // //var cellText = $("#objectId");

    // //row = $('#' + row_id);

    // var row = $('#' + objectId);
    // var cellText = row.find('td:first').text();
    // //Transfer email to the delete modal for confirmation
    // document.getElementById('modalDeleteAdminMessage').innerHTML = "Do you want to delete the selected Admin? <br><br>" +  "<b>" + cellText + "</b>";
    // console.log(cellText);


    // //document.location.href = "#modal1";
    // //href="#modal1";
    // // alert('Clicked');
    
    // //alert($(this).attr("name"));
    // // var x = $(this).name();
    // // console.log(x);

});

//Delete admin confirm button
modalDeleteAdminConfirm.addEventListener('click', e => {
    console.log("delete admin");

    // var objectId = $("#update").attr("name");
    //console.log(delObjectId);

    // Delete the admin
    return Backendless.Data.of( "Users" ).remove( { objectId:delObjectId } )
    .then( function( timestamp ) {
        onPageLoad();
        console.log(timestamp);
        console.log("User deleted");
        toastNotification('Admin deleted successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd'); // Display success message
     })
    .catch( function( error ) {
        toastNotification(error, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
     });
});

//Button for delete
$(document).on('click','#delete',function(){


    const elem = document.getElementById('modal2');
    const instance = M.Modal.init(elem, {dismissible: true});
    instance.open();

    //Get the user ID
    var objectId = $(this).attr("name");
    console.log(objectId);

    //Get cell of 
    // var cellText = $(this).closest('table').find('tr:#' + objectId).find('td:first').text(); //tr:last  ('tr:last td:first').text(); //tr:last 
    //var cellText = $(this).closest('table').find('tr:#' + objectId + 'td:first').text();
    //var cellText = $("#objectId");

    //row = $('#' + row_id);

    var row = $('#' + objectId);
    var cellText = row.find('td:first').text();
    //Transfer email to the delete modal for confirmation
    document.getElementById('modalDeleteAdminMessage').innerHTML = "Do you want to delete the selected Admin? <br><br>" +  "<b>" + cellText + "</b>";
    console.log(cellText);

    //Save the admin's object id
    delObjectId = objectId;


    //document.location.href = "#modal1";
    //href="#modal1";
    // alert('Clicked');
    
    //alert($(this).attr("name"));
    // var x = $(this).name();
    // console.log(x);



    // // alert('Clicked');
    // //alert($(this).attr("name"));
    // var objectId = $(this).attr("name");

    // //Delete the user
    // return Backendless.Data.of( "Users" ).remove( { objectId:objectId } )
    // .then( function( timestamp ) {
    //     onPageLoad();
    //     console.log(timestamp);
    //     console.log("User deleted");
    //     toastNotification('Admin deleted successfully!', 'toast-tick', 'white-check-mark.png','light-blue darken-2',4000,'#0277bd'); // Display success message
    //  })
    // .catch( function( error ) {
    //     toastNotification(error, 'toast-error', 'error-symbol.png', 'red lighten-1','Infinity','#ce5548');
    //  });
    // // var x = $(this).name();
    // // console.log(x);

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
    // $(document).on('click', '#toast-container .toast', function() {
    //     $(this).fadeOut(function(){
    //         $(this).remove();
    //     });
    // });
}