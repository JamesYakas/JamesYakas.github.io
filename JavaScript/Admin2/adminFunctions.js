//Script for admin functionality
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

//Array to hold Australia and New Zealand establishments
var masterEstablishmentsAustralia = [];
var masterEstablishmentsNewZealand = [];
//var coords;

var cellID;



//Function for when the page loads
$(document).ready(function () {


    //Get the table
    // tbl = document.getElementById('tbl');
    
    //Add rows to the table
    //addRow(tbl, 'foo', 'bar', "hello1", "hello11");
    //addRow(tbl, 'one', 'two', "hello2", "hello22");

    onPageLoadTable();

    //Add row handlers
    //addRowHandlers();
    
    //onPageLoad();
    // $('select').material_select();
    $('.tabs').tabs();
    $('select').formSelect();
    $('.modal').modal();
    //Data for add establishment auto complete field
    $('input.autocomplete').autocomplete({
        data: {
          "Sushi Bar Rose Bay": 'FE497F9F-3300-F248-FFF0-87FBF48BBC00',
          "734 New South Head Rd": 'FE497F9F-3300-F248-FFF0-87FBF48BBC00',
          "Jewel on the Bay": '87FFFAD6-C7EE-9094-FF6E-5CF6AF213C00',
          "639 New South Head Rd": '87FFFAD6-C7EE-9094-FF6E-5CF6AF213C00',
          "Google": 'https://placehold.it/250x250'
        },
      });
    //Dynamically re-apply materialize css
    $('input#input_text, textarea#add_description').characterCounter();
    $('input#input_text, textarea#update_description').characterCounter();
    M.textareaAutoResize($('#description'));
    //$('.modal-add').modal('startingTop', '1%');
    $('.modal-add').modal({
        // dismissible: false, 
        //opacity: 1, // Opacity of modal background
            //inDuration: 300, // Transition in duration
        // outDuration: 200, // Transition out duration
        startingTop: '4%' // Starting top style attribute
        //endingTop: '10%', // Ending top style attribute
    });
    //Time picker
    $('.timepicker').timepicker();
});
//Function for function of when the page loads for the table
function onPageLoadTable(){
    //Clear the table 
    $("#myTable tr").remove(); 
    //Get the table
    tbl = document.getElementById('myTable');//document.getElementById('tbl');

    //Retrieve establishments from the db
    var queryBuilder = Backendless.DataQueryBuilder.create();

    //Where country = Australia
    queryBuilder.setWhereClause( "Country = 'Australia'");

    Backendless.Data.of( "Establishment" ).find( queryBuilder )
    .then( function( objectArray ) {
        //console.log(objectArray[1].Location.x);
        console.log(objectArray);
        for(var i=0;i<objectArray.length;i++){
            //Populate the list box
            //establishmentListBox.options[index] = new Option(objectArray[i].Name + " | " + objectArray[i].Address, objectArray[i].objectId);
            addRow(tbl, objectArray[i].Name, objectArray[i].Address, objectArray[i].objectId, objectArray[i].objectId);
        }
        //Save the Australia establishments
        masterEstablishmentsAustralia = objectArray;

        //Add row handlers
        addRowHandlers();
    })
    .catch( function( error ) {
    });

    //Table filter
    $("#myInput").on("keyup", function() {
        var value = $(this).val().toLowerCase();
        $("#myTable tr").filter(function() { //tbl
          $(this).toggle($(this).text().toLowerCase().indexOf(value) > -1)
        });
      });

// delegate the event handling to the table
document.querySelector('tbody').addEventListener('click', function(e) {
  var closestCell = e.target.closest('tr'), // identify the closest td when the click occured
      activeCell = e.currentTarget.querySelector('tr.selected'); // identify the already selected td

  closestCell.classList.add('selected'); // add the "selected" class to the clicked td
  if (activeCell) activeCell.classList.remove('selected'); // remove the "selected" class from the previously selected td

})

}

//Function for the function of when the page loads
function onPageLoad(){

    //Get the establishment listbox
    var establishmentListBox = document.getElementById('establishmentListBox');

    //Variable for looping through the listbox options
    var index = 0;

    //Retrieve establishments from the db
    var queryBuilder = Backendless.DataQueryBuilder.create();

    //Where country = Australia
    queryBuilder.setWhereClause( "Country = 'Australia'");

    Backendless.Data.of( "Establishment" ).find( queryBuilder )
    .then( function( objectArray ) {
        console.log(objectArray);
        for(var i=0;i<objectArray.length;i++){
            //Populate the list box
            establishmentListBox.options[index] = new Option(objectArray[i].Name + " | " + objectArray[i].Address, objectArray[i].objectId);
            
            //Move onto the next option
            index++;
        }
        //Save the Australia establishments
        masterEstablishmentsAustralia = objectArray;
    })
    .catch( function( error ) {
    });
}

//Function to add a cell
function addCell(tr, val, id) {
    var td = document.createElement('td');

    td.id = id;
    td.innerHTML = val;
    tr.appendChild(td)
}

//Function to add a row
function addRow(tbl, val_1, val_2, id_1, id_2) {
    var tr = document.createElement('tr');
    //tr.id = "hello";
    //tr.id = 'id' + 1;

    addCell(tr, val_1, id_1);
    addCell(tr, val_2, id_2);

    tbl.appendChild(tr)
}

//Function to add row handlers
function addRowHandlers() {
    var table = document.getElementById("tbl");
    var rows = table.getElementsByTagName("tr");
    for (i = 0; i < rows.length; i++) {
        var currentRow = table.rows[i];
        var createClickHandler = 
            function(row) 
            {
                return function() { 
                                        var cell = row.getElementsByTagName("td")[0];
                                        var id = cell.id;//cell.innerHTML;
                                        cellID = id;
                                        displaySpecials();
                                        //alert("id:" + id);
                                 };
            };
        currentRow.onclick = createClickHandler(currentRow);
    }
}
  
//Add button
addBtn.addEventListener('click', e => {
    e.preventDefault();

    // //Get the text of the selected establishment in the establishment listbox
    // var establishmentListBoxText = document.getElementById('establishmentListBox').options[establishmentListBox.selectedIndex].innerHTML;
    //Get the text of the selected establishment in the table
    var establishmentNameAndAddress = document.getElementById('name').value + " | " +  document.getElementById('address').value;
    //If establishmentNameAndAddress empty
    if(establishmentNameAndAddress == " | "){
        establishmentNameAndAddress = "Please select an existing establishment.";
    }

    // //Transfer establishment selected in the establishmentListBox to the add form's "add to existing establishment?"" search feild
    // document.getElementById('addToExistingEstablishment').value = establishmentListBoxText;
    //Transfer establishment selected in the establishmentListBox to the add form's "add to existing establishment?"" search feild
    document.getElementById('addToExistingEstablishment').value = establishmentNameAndAddress;

    // //Set name of the input to the establishment's objectID
    // document.getElementById('addToExistingEstablishment').name = document.getElementById('establishmentListBox').options[establishmentListBox.selectedIndex].value;
    //Set name of the input to the establishment's objectID
    document.getElementById('addToExistingEstablishment').name = document.getElementById('establishmentId').value;
});

//Add confirm button 
addConfirmBtn.addEventListener('click', e => {
    console.log("add button clicked");
    e.preventDefault();

    //If checkbox is not checked, create new establishment and special concurrently
    if(document.getElementById('chkBoxAddToEstablishment').checked == false){
        console.log("Create new establishment and special concurrently");

        //Get the add form data
        var addAddress = document.getElementById('add_address').value;
        var addSuburb = document.getElementById('add_suburb').value;

        //Save the establishment objectId
        var establishmentObjectId;
        //Save the special objectID
        var specialObjectId;

        //Turn address into coords
        var location = addAddress + " " + addSuburb;
        var lat;
        var lng;
        //var coordsObj = {};
        var coords = [];
        axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{ //https://maps.googleapis.com/maps/api/geocode/json //?components=country:NZ||country:AU //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Raf&sensor=false&types=(regions)&key=YOUR_API_KEY&components=country:ESP|country:uk|country:us
            params:{
                address:location, 
                key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',  
            }
        })
        .then(function(response){
            //Geometry
            lat = response.data.results[0].geometry.location.lat; //var
            lng = response.data.results[0].geometry.location.lng; //var
            console.log(lat + " : " + lng);

            
            coords.push(lat);
            coords.push(lng);

            //coordsObj = {};
            //coordsObj.lat = lat;
            //coordsObj.lng = lng;
            
            //return coordsObj;
            return coords;
        })
        .then(() => {

        
        //Save establishment and get objectId
        const getEstablishmentObjectId = () => {
            console.log(coords);
            console.log(coords[0]);
            console.log(coords[1]);

            //Get the add form data
            var addName = document.getElementById('add_name').value;
            var addCountry = document.getElementById('add_country').value;
            var addEstablishmentType = document.getElementById('add_establishment_type').value;
            var addCuisineType = document.getElementById('add_cusine_type').value;

            //Create establishment from user's entries
            var establishment = {
                Location: new Backendless.Data.Point().setLatitude(coords[0]).setLongitude(coords[1]),
                Name: addName,
                Address: addAddress,
                Suburb: addSuburb,
                Country: addCountry,
                Cuisine_Type: addCuisineType,
                Establishment_Type: addEstablishmentType
            }

            //Link the geopoint with the establishment
            //establishment.location = point;

            //Save establishment to db (return to wait until saved and an objectId can be retrieved)
            return Backendless.Data.of('Establishment').save( establishment )
            .then(savedObject => savedObject.objectId);
        };
        //Save special and get objectId
        const getSpecialObjectId = () => {
            //Get the add form data
            var addstartTime = document.getElementById('add_start_time').value;
            var endstartTime = document.getElementById('add_end_time').value;
            var addCategory = document.getElementById('add_category').value;
            var addTypeOfSpecial = document.getElementById('add_type_of_special').value;
            var addDescription = document.getElementById('add_description').value;

            //Create special from user's enteries
            var special = {
                Start_Time: addstartTime,
                End_Time: endstartTime,
                Category: addCategory,
                Type_Of_Special: addTypeOfSpecial,
                Description: addDescription
            }

            //Save special to db (return to wait until saved and an objectId can be retrieved)
            return Backendless.Data.of('Special').save(special)
            .then(savedObject => savedObject.objectId);
        };
        //Add special to establishment/form relation
        Promise.all([
            getEstablishmentObjectId(),
            getSpecialObjectId(),
        ]).then(([establishmentObjectId, specialObjectId]) => {
            console.log(establishmentObjectId);
            console.log(specialObjectId);
            var parentObject = { objectId: establishmentObjectId };
            var childObject = { objectId:specialObjectId };
            var children = [ childObject ];
    
            return Backendless.Data.of( "Establishment" ).addRelation( parentObject, "establishmentSpecials", children )
            .then( function( count ) {
                console.log( "relation has been set" );
            })
            .catch( function( error ) {
                console.log( "server reported an error - " + error.message );
            });
        })
        .then(() => {console.log('Data Successfully Written');})
        .then(() => {onPageLoadTable();})
        .then(() => {document.querySelector('#addspecial-form').reset();})
        .then(() => {M.updateTextFields();})
        .catch(error => {console.error(error)})
    });

    }else if(document.getElementById('chkBoxAddToEstablishment').checked == true){ //If checkbox is checked, add special to existing establishment
        //Add special to existing establishment
        console.log("Add special to existing establishment");

        //var establishmentObjectId = document.getElementById('addToExistingEstablishment').name;
        //console.log(objectID);

        //Get establishment objectId
        const getEstablishmentObjectId = () => {
            return establishmentObjectId = document.getElementById('addToExistingEstablishment').name;
        };
        //Save special and get objectId
        const getSpecialObjectId = () => {
            //Get the add form data
            var addstartTime = document.getElementById('add_start_time').value;
            var endstartTime = document.getElementById('add_end_time').value;
            var addCategory = document.getElementById('add_category').value;
            var addTypeOfSpecial = document.getElementById('add_type_of_special').value;
            var addDescription = document.getElementById('add_description').value;

            //Create special from user's enteries
            var special = {
                Start_Time: addstartTime,
                End_Time: endstartTime,
                Category: addCategory,
                Type_Of_Special: addTypeOfSpecial,
                Description: addDescription
            }

            //Save special to db (return to wait until saved and an objectId can be retrieved)
            return Backendless.Data.of('Special').save(special)
            .then(savedObject => savedObject.objectId);
        };
        //Add special to establishment/form relation
        Promise.all([
            getEstablishmentObjectId(),
            getSpecialObjectId(),
        ]).then(([establishmentObjectId, specialObjectId]) => {
            console.log(establishmentObjectId);
            console.log(specialObjectId);
            var parentObject = { objectId: establishmentObjectId };
            var childObject = { objectId:specialObjectId };
            var children = [ childObject ];
    
            return Backendless.Data.of( "Establishment" ).addRelation( parentObject, "establishmentSpecials", children )
            .then( function( count ) {
                console.log( "relation has been set" );
            })
            .catch( function( error ) {
                console.log( "server reported an error - " + error.message );
            });
        })
        .then(() => {console.log('Data Successfully Written');})
        .then(() => {onPageLoadTable();}) //Re-load the table
        .then(() => {document.querySelector('#addspecial-form').reset();}) //Clear the establishment fields
        .then(() => {enableEstablishmentDetails()}) //Re-enable disabled establishment fields
        .then(() => {M.updateTextFields();}) //Materialise - Update the text fields to fix label positioning
        .catch(error => {console.error(error)});
    }
});

//Add Cancel button
addCancelBtn.addEventListener('click', e => {
    e.preventDefault();

    //Hide the add panel
     //document.getElementById('modal1').style.display = "none";

    //Reset the form
    addspecialForm = document.querySelector('#addspecial-form');
    addspecialForm.reset();

    //Change fields to enabled
    document.getElementById('add_name').disabled = false;
    document.getElementById('add_address').disabled = false;
    document.getElementById('add_suburb').disabled = false;
    document.getElementById('add_country').disabled = false;
    document.getElementById('add_establishment_type').disabled = false;
    document.getElementById('add_cusine_type').disabled = false;
    //Change heading to display "Create for a new establishment"
    document.getElementById('addSpecialSubHeading').innerHTML = "<h5>" +"Create for a new establishment" + "</h5>"

    //Materalize - Update the 'select' add country and establishment type options
    $('select').formSelect(); 

    //Materalize - Update text feilds so label is reset
    M.updateTextFields();
    //This works without addspecialForm.reset();?
    //document.getElementById('addToExistingEstablishment').innerHTML = "";
 });

//Function to display establishment if add special to establishement check box is checked
function checkBoxAddToEstablishmentFunc(){

    //If checked but no establishment is selected or an invalid establishment is used
    if(document.getElementById('establishmentId').value == ""){
        alert("You need to select a valid establishment");
        //Set the checkbox to false
        document.getElementById('chkBoxAddToEstablishment').checked = false
    }
    else{
        //If checked
        if(document.getElementById('chkBoxAddToEstablishment').checked == true){
            //TODO -- Make it so when the user searches for an establishment, the id is obtained and then feilds are filled in this way
            //Change heading
            document.getElementById('addSpecialSubHeading').innerHTML = "<h5>" +"Adding special to this establishment" + "</h5>"
            //Transfer the feilds
            document.getElementById('add_name').value = document.getElementById('name').value;
            document.getElementById('add_name').disabled = true;
            document.getElementById('add_address').value = document.getElementById('address').value;
            document.getElementById('add_address').disabled = true;
            document.getElementById('add_suburb').value = document.getElementById('suburb').value;
            document.getElementById('add_suburb').disabled = true;
            //Country select
            if(document.getElementById('headingLstBoxEstablishments').innerHTML == "Establishments - Australia"){
                document.getElementById('add_country').value = "Australia";
                document.getElementById('add_country').disabled = true;
                //Update the add_county option
                //$('select').formSelect();
            }else{
                document.getElementById('add_country').value = "New Zealand";
                document.getElementById('add_country').disabled = true;
                //Update the add_county option
                //$('select').formSelect(); 
            }
            document.getElementById('add_establishment_type').value = document.getElementById('establishmentType').value;
            document.getElementById('add_establishment_type').disabled = true;
            document.getElementById('add_cusine_type').value = document.getElementById('cusineType').value;
            document.getElementById('add_cusine_type').disabled = true;

            //Materalize - Update the 'select' add country and establishment type options
            $('select').formSelect();
            //Materalize - Update text feilds so label is reset
            M.updateTextFields();
        }else{
            //Change heading
            document.getElementById('addSpecialSubHeading').innerHTML = "<h5>" +"Create for a new establishment" + "</h5>"
            //Clear and reset the input feilds
            document.getElementById('add_name').value = "";
            document.getElementById('add_name').disabled = false;
            document.getElementById('add_address').value = "";
            document.getElementById('add_address').disabled = false;
            document.getElementById('add_suburb').value = "";
            document.getElementById('add_suburb').disabled = false;
            document.getElementById('add_country').value = "";
            document.getElementById('add_country').disabled = false;
            document.getElementById('add_establishment_type').value = "";
            document.getElementById('add_establishment_type').disabled = false;
            document.getElementById('add_cusine_type').value = "";
            document.getElementById('add_cusine_type').disabled = false;

            //Materalize - Update the 'select' add country and establishment type options
            $('select').formSelect(); 

            //Materalize - Update text feilds so label is reset
            M.updateTextFields();
        }
    }
}

//Update button
updateBtn.addEventListener('click', e =>{
    e.preventDefault();

    //If an establishment id is not displayed in the establishment id form/if the user hasn't selected an establishment from the establishment listbox/if the page has just loaded/if the user just added or deleted
    //Once the user has selected any item from either listboxes this will not trigger, even if click out of a listbox
    // if((establishmentId.value == "" || establishmentId.value == undefined) || (establishmentIdSpecial.value == "" || establishmentIdSpecial.value == undefined || specialId.value == "" || specialId.value == undefined)){
    //     //alert("Please select an establishment or special to update");
    // }
    // else{
        //If establishment selected from the establishmentListBox
        if(document.getElementById('formHeading').innerHTML == "Establishment details"){
            console.log("updating establishment details");

            //Hide the update special form
            document.getElementById("formUpdateSpecialDetails").style.display = "none";
            //Show the update establishment form
            document.getElementById("formUpdateEstablishmentDetails").style.display = "block";

            //Change heading
            document.getElementById('updateHeading').innerHTML = "Update establishment";

            //Transfer establishment details over to the update modal from the establishment display form
            document.getElementById('update_establishmentId').value = document.getElementById('establishmentId').value;
            document.getElementById('update_name').value = document.getElementById('name').value;
            document.getElementById('update_address').value = document.getElementById('address').value;
            document.getElementById('update_suburb').value = document.getElementById('suburb').value;
            document.getElementById('update_establishment_type').value = document.getElementById('establishmentType').value;
            document.getElementById('update_cusine_type').value = document.getElementById('cusineType').value;

        }//If special selected from the specialListBox
        else if(document.getElementById('formHeading').innerHTML == "Special details"){
            console.log("updating special details");

            //Change heading
            document.getElementById('updateHeading').innerHTML = "Update special";

            //Hide the update establishment form
            document.getElementById("formUpdateEstablishmentDetails").style.display = "none"; //formUpdateEstablishmentDetails
            //Show the update special form
            document.getElementById("formUpdateSpecialDetails").style.display = "block"; //formUpdateSpecialDetails
        
            var date = new Date();
            var currentTime = date.getHours() + ':' + date.getMinutes();
            //console.log(date.getHours());
            //console.log(date.getMinutes());

            //Transfer special details over to the update modal from the special display form
            document.getElementById('update_start_time').value = convertTo24Hour2('startTime'); //convertTo24Hour(document.getElementById('startTime').value); //'startTime').value); //Time picker takes 24 hour format and displays as 12 hour, so convert 12 hour to 24 hour
            document.getElementById('update_end_time').value = convertTo24Hour2('endTime'); //convertTo24Hour(document.getElementById('endTime').value); //Time picker takes 24 hour format and displays as 12 hour, so convert 12 hour to 24 hour
            document.getElementById('update_category').value = document.getElementById('category').value;
            document.getElementById('update_type_of_special').value = document.getElementById('typeOfSpecial').value;
            document.getElementById('update_description').value = document.getElementById('description').value;

            // time = document.getElementById('startTime').value;
            // var hours = Number(time.match(/^(\d+)/)[1]);
            // var minutes = Number(time.match(/:(\d+)/)[1]);
            // var AMPM = time.match(/\s(.*)$/)[1];
            // if(AMPM == " PM" && hours<12) hours = hours+12;
            // if(AMPM == " AM" && hours==12) hours = hours-12;
            // var sHours = hours.toString();
            // var sMinutes = minutes.toString();
            // if(hours<10) sHours = "0" + sHours;
            // if(minutes<10) sMinutes = "0" + sMinutes;
            //alert(sHours + ":" + sMinutes);

        }

        //Update text fields so label is reset
        //Materalize - Update the 'select' establishment type and cuisine type options for the establishment and category and type of special for the special
        $('select').formSelect(); 
        //THIS STUFFS UP LABELS WHEN CLICK UPDATE
        M.updateTextFields();
    //}
});

function convertTo24Hour(time) {
    var hours = parseInt(time.substr(0, 2));
    if(time.indexOf(' AM') != -1 && hours == 12) {
        time = time.replace('12', '0');
    }
    if(time.indexOf(' PM')  != -1 && hours < 12) {
        time = time.replace(hours, (hours + 12));
    }
    return time.replace(/( AM| PM)/, '');
}

function convertTo24Hour2(id){
    time = document.getElementById(id).value;
    var hours = Number(time.match(/^(\d+)/)[1]);
    var minutes = Number(time.match(/:(\d+)/)[1]);
    var AMPM = time.match(/\s(.*)$/)[1];
    if(AMPM == "PM" && hours<12) hours = hours+12;
    if(AMPM == "AM" && hours==12) hours = hours-12;
    var sHours = hours.toString();
    var sMinutes = minutes.toString();
    if(hours<10) sHours = "0" + sHours;
    if(minutes<10) sMinutes = "0" + sMinutes;

    return sHours + ":" + sMinutes;
}
  
 

//Update confirm button
updateConfirmBtn.addEventListener('click', e =>{
    e.preventDefault();

    //Get establishment objectId
    var establishmentObjectId = document.getElementById('establishmentId').value;

    //If updating an establishment
    if(document.getElementById('formHeading').innerHTML == "Establishment details"){

        // document.getElementById('update_establishmentId').value = document.getElementById('establishmentId').value;
        // document.getElementById('update_name').value = document.getElementById('name').value;
        // document.getElementById('update_address').value = document.getElementById('address').value;
        // document.getElementById('update_suburb').value = document.getElementById('suburb').value;
        // document.getElementById('update_establishment_type').value = document.getElementById('establishmentType').value;
        // document.getElementById('update_cusine_type').value = document.getElementById('cusineType').value;

        //Retrieve 

        //Create the updated establishment
        var establishment = {
          objectId:document.getElementById('establishmentId').value,
          Name:document.getElementById('update_name').value,
          Address: document.getElementById('update_address').value,
          Suburb: document.getElementById('update_suburb').value,
          Establishment_Type: document.getElementById('update_establishment_type').value,
          Cuisine_Type: document.getElementById('update_cusine_type').value
        }
  
        //Update establishment in db (return so that it's actaully updated from db before refreshing client side)      
        return Backendless.Data.of( "Establishment" ).save( establishment )
        .then( function( savedObject ) {
          console.log( "Establishment instance has been updated" );
          console.log(savedObject);
        })
        .catch( function( error ) {
          console.log( "an error has occurred " + error.message );
        })
        .then(() => {return onPageLoadTable();})
        .then(() =>{ 
            //Update the establishment form to reflect the recent changes. Normally updated via listbox click but no click is present on 'Update'
            document.getElementById('name').value = document.getElementById('update_name').value;
            document.getElementById('address').value = document.getElementById('update_address').value;
            document.getElementById('suburb').value = document.getElementById('update_suburb').value;
            document.getElementById('establishmentType').value = document.getElementById('update_establishment_type').value;
            document.getElementById('cusineType').value = document.getElementById('update_cusine_type').value;
        }) 
        .catch(error => {console.error(error)});
    }else if(document.getElementById('formHeading').innerHTML == "Special details"){ //If updating a special

        //Create the updated special
        var special = {
            objectId:document.getElementById('specialId').value,
            Start_Time:document.getElementById('update_start_time').value,
            End_Time:document.getElementById('update_end_time').value,
            Category:document.getElementById('update_category').value,
            Type_Of_Special: document.getElementById('update_type_of_special').value,
            Description: document.getElementById('update_description').value
          }
    
          //Update establishment in db (return so that it's actaully updated from db before refreshing client side)      
          return Backendless.Data.of( "Special" ).save( special )
          .then( function( savedObject ) {
            console.log( "Special instance has been updated" );
          })
          .catch( function( error ) {
            console.log( "an error has occurred " + error.message );
          })
          .then(() => {return onPageLoadTable();})
          .then(() =>{ 
              //Update the special form to reflect the recent changes. Normally updated via listbox click but no click is present on 'Update'
              document.getElementById('startTime').value = tConvert(document.getElementById('update_start_time').value);
              document.getElementById('endTime').value = tConvert(document.getElementById('update_end_time').value);
              document.getElementById('category').value = document.getElementById('update_category').value;
              document.getElementById('typeOfSpecial').value = document.getElementById('update_type_of_special').value;
              document.getElementById('description').value = document.getElementById('update_description').value;

              //Update the special listbox
              //Get the establishment listbox
            //   var establishmentListBox = document.getElementById('establishmentListBox');
            //  establishmentListBox.selectedIndex = 0;
            //  console.log(establishmentListBox.selectedIndex);
            //  document.getElementById('establishmentListBox').dispatchEvent(new Event('click'));
            //  //displaySpecials();
            //  console.log("display specials");
              
          }) 
          .catch(error => {console.error(error)});
    }
});


//Update cancel button
updateCancelBtn.addEventListener('click', e => {
    e.preventDefault();

    //Update text feilds so label is reset
    //M.updateTextFields();
 });
 
//Delete establishment/special button
deleteBtn.addEventListener('click', e =>{
    e.preventDefault();

    var establishmentId = document.getElementById('establishmentId');
    //If an establishment id is not displayed in the establishment id form/if the user hasn't selected an establishment from the establishment listbox/if the page has just loaded/if the user just added or deleted
    //Once the user has selected any item from either listboxes this will not trigger, even if click out of a listbox
    if(establishmentId.value == ""){
        alert("Please select an establishment or special to delete");
    }else{
        //If an establishment selected via the establishmentListBox
        if(document.getElementById('formHeading').innerHTML == "Establishment details"){

            //Get the establishment objectId
            var establishmentObjectId = document.getElementById('establishmentId').value;
            console.log(establishmentObjectId);

            //Check if the establishment has specials to prevent deletion
            //For each establishment
            for(var i=0;i<masterEstablishmentsAustralia.length;i++){
                //When establishment found
                if(masterEstablishmentsAustralia[i].objectId == establishmentObjectId){
                    //Check how many specials the establishment contains
                    if(masterEstablishmentsAustralia[i].establishmentSpecials.length > 0){
                        alert("Error - The establishment must contain no specials to delete.")
                    }else{
                        //Delete establishment from db (return so that it's actaully deleted from db before refreshing client side)
                        return Backendless.Data.of( "Establishment" ).remove( { objectId:establishmentObjectId } )
                        .then( function( timestamp ) {
                            console.log( "Establishment instance has been deleted" );
                        })
                        .catch( function( error ) {
                            console.log( "an error has occurred " + error.message );
                        })
                        .then(() => {onPageLoadTable();})
                        //.then(() => {removeLastOption(establishmentListBox);})
                        .then(() => {
                            //Clear the specialListBox
                            $("#specialListBox").empty()

                            //Clear the establishment form
                            displayEstablishmentandSpecialForm = document.querySelector('#displayEstablishmentandSpecial-form');
                            displayEstablishmentandSpecialForm.reset();

                            //Clear the 'Add special to the existing establishment?' input
                            document.getElementById('addToExistingEstablishment').value = "";
                            console.log(document.getElementById('addToExistingEstablishment').value);
                        })
                        .catch(error => {console.error(error)});
                    }
                }
            } 
        }//If a special was selected via the specialListBox
        else if(document.getElementById('formHeading').innerHTML == "Special details"){

            //Get the special objectId
            var specialobjectId = document.getElementById('specialId').value;

            //Delete special from db (return so that it's actaully deleted from db before refreshing client side)
            return Backendless.Data.of( "Special" ).remove( { objectId:specialobjectId } )
            .then( function( timestamp ) {
                console.log( "Special instance has been deleted" );
              })
            .catch( function( error ) {
                console.log( "an error has occurred " + error.message );
              })
            .then(() => {
                //Remove special that was just deleted from the specialListbox
                $("#specialListBox option:selected").remove();

                //Clear the special form
                displayEstablishmentandSpecialForm = document.querySelector('#displayEstablishmentandSpecial-form');
                displayEstablishmentandSpecialForm.reset();

            })
            .then(() => {onPageLoadTable();}) 
            .catch(error => {console.error(error)});
        }
    }
});

//Function to clear the listbox
function removeOptions(selectElement) {
    var i, L = selectElement.options.length - 1;
    for(i = L; i >= 0; i--) {
       selectElement.remove(i);
    }
 }

//Function to remove the last select option in the listbox when delete as just because the listbox is populated with new options starting from index 0 the last one remains
function removeLastOption(selectElement){
    if(selectElement.length>0){
        selectElement.remove(selectElement.length-1);
    }
}

//Function to display specials when clicking on an establishment
function displaySpecials(){
    //console.log("CellID" + cellID);

    //Hide the special form
    document.getElementById("formSpecialDetails").style.display = "none";
    //Show the establishment form
    document.getElementById("formEstablishmentDetails").style.display = "block";

    //Define divs
    var establishmentId = document.getElementById('establishmentId');
    var name = document.getElementById('name');
    var address = document.getElementById('address');
    var suburb = document.getElementById('suburb');
    var establishmentType = document.getElementById('establishmentType');
    var cusineType = document.getElementById('cusineType');


    //DISPLAY ESTABLISHMENT DATA ON DISPLAY FORM
    //Display "Establishment details" on the display form
    document.getElementById('formHeading').innerHTML = "Establishment details";

    //Get the establishment listbox
    var establishmentListBox = document.getElementById('establishmentListBox');

    //Get the establishmentID of the item selected in the establishmentListBox
    var establishmentID = cellID; //establishmentListBox.options[establishmentListBox.selectedIndex].value; //cellID


    //When establishment object found in masterEstablishments populate the display form
    for(var i=0;i<masterEstablishmentsAustralia.length;i++){
        //console.log(masterEstablishmentsAustralia[i])
         if(masterEstablishmentsAustralia[i].objectId == establishmentID){
             establishmentId.value = masterEstablishmentsAustralia[i].objectId, //listbox.options[listbox.selectedIndex].value;
             name.value = masterEstablishmentsAustralia[i].Name,
             address.value = masterEstablishmentsAustralia[i].Address,
             suburb.value = masterEstablishmentsAustralia[i].Suburb,
             establishmentType.value = masterEstablishmentsAustralia[i].Establishment_Type,
             cusineType.value = masterEstablishmentsAustralia[i].Cuisine_Type
         }
    }

    //DISPLAY SPECIALS IN THE SPECIAL LISTBOX 
    //Get the specials listbox
    var specialsListBox = document.getElementById('specialListBox');
    //Clear the specials listbox
    removeOptions(specialsListBox);

    //Varible for storing the index of the establishment that has the same id as in the establishment id
    var establishmentPosition; 

    //For each establishment in the entire masterEstablishments array
    for(var i=0;i<masterEstablishmentsAustralia.length;i++){
        //If the current iteration's id is that of the establishment that was clicked
        if(establishmentID == masterEstablishmentsAustralia[i].objectId){
            //Debug - Display the establishment to the conosle
            //console.log(masterEstablishmentsAustralia[i]);
            //Save the establishment position
            establishmentPosition = i;
            //For each special in the identified establishment, display all categorys and type_of_special
            for(var a=0;a<masterEstablishmentsAustralia[establishmentPosition].establishmentSpecials.length;a++){
                //console.log(masterEstablishments[establishmentPosition].special[a].category);
                //Display the category and type_of_special properties of each special of the identified establishment in the specials listbox
                specialsListBox.options[a] = new Option(masterEstablishmentsAustralia[establishmentPosition].establishmentSpecials[a].Category 
                    + " | " + masterEstablishmentsAustralia[establishmentPosition].establishmentSpecials[a].Type_Of_Special
                    , masterEstablishmentsAustralia[establishmentPosition].objectId); //(Ideally establishment objectId not special objecId as it would mean for each establishment if special array objectId =, instead of for each establishment get objectID when click on a special) 
            }
            //Since the correct establishment has been found, break
            break;
        }
    }
}

//Function to get the specials (special data on form) when clicking on a special
function getSpecial(){

    //Hide the establishment form
    document.getElementById("formEstablishmentDetails").style.display = "none";
    //Show the special form
    document.getElementById("formSpecialDetails").style.display = "block";

    //DISPLAY SPECIAL DATA ON DISPLAY FORM
    //Display "Special details" on the display form
    document.getElementById('formHeading').innerHTML = "Special details";

    //Get the special listbox
    var specialListBox = document.getElementById('specialListBox');

    //Get the establishmentID that the special/s selected in the specialListBox belongs to
    var establishmentID = specialListBox.options[specialListBox.selectedIndex].value;

    //Get the index of the special listbox selected
    var specialNum = specialListBox.options[ specialListBox.selectedIndex].index; 
    // console.log("Special listbox index of special: " + specialNum);


    //For each establishment in the entire masterEstablishments array
    for(var i=0;i<masterEstablishmentsAustralia.length;i++){
        //If the current iteration's id is that of the establishment (establishment's special) that was clicked
        if(establishmentID == masterEstablishmentsAustralia[i].objectId){
            //Correct establishment found - Display the specials details
            document.getElementById('establishmentIdSpecial').value = masterEstablishmentsAustralia[i].objectId;
            document.getElementById('specialId').value = masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].objectId;//SpecialID;
            document.getElementById('startTime').value = tConvert(masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].Start_Time);
            document.getElementById('endTime').value = tConvert(masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].End_Time);
            document.getElementById('category').value = masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].Category;
            document.getElementById('typeOfSpecial').value = masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].Type_Of_Special;
            document.getElementById('description').value = masterEstablishmentsAustralia[i].establishmentSpecials[specialNum].Description;

            //Since the correct establishment has been found, break
            break;
        }

    }
}

//Function to display Australia establishments
function displayAus(){
    alert("Displaying Aus")

    document.getElementById('headingLstBoxEstablishments').innerHTML = "Establishments - Australia"
}

//Function to display the New Zealand establishments
function displayNZ(){
    alert("Displaying NZ")
    document.getElementById('headingLstBoxEstablishments').innerHTML = "Establishments - New Zealand"
}

//Function for searching for an establishment or special
function adminSearch(){
    //If there are entries in more than one text box, display an error
    inputs = [];
    inputs.push(document.getElementById('searchEstablishmentID').value);
    inputs.push(document.getElementById('searchSpecialID').value);
    inputs.push(document.getElementById('searchAddress').value);
    inputs.push(document.getElementById('searchName').value);

    console.log(inputs);
    var count = 0;
    for(var i=0;i<inputs.length;i++){
        if(inputs[i] != ""){
            count++;
        }
    }

    //If more than one input is filled
    if(count > 1){
        alert("Only 1 field required");
    }else if(count == 0){ //If there are no fields, do nothing
        
    }
    else{ //Search if only 1 field is filled
        //Search by address
        if(inputs[2] != ""){
            //Loop all establishments
            for(var i = 0;i<masterEstablishmentsAustralia.length;i++){
                //If address found
                if(masterEstablishmentsAustralia[i].Address == inputs[2]){
                    var objectId = masterEstablishmentsAustralia[i].objectId;
                    console.log(objectId);
                    //Change position of establishment listbox to that of the establishment found
                    document.getElementById("establishmentListBox").selectedIndex = "2";
                }
            }
        }
    }


    if(document.getElementById('searchEstablishmentID') == null || 
    document.getElementById('searchSpecialID') == null ||
    document.getElementById('searchAddress') == null ||
    document.getElementById('searchName') == null){
        alert("nothing");
    }
}

//Function to enable add form establishment details when confimed and saved to db or add form canceled
function enableEstablishmentDetails(){
    //Change fields to enabled
    document.getElementById('add_name').disabled = false;
    document.getElementById('add_address').disabled = false;
    document.getElementById('add_suburb').disabled = false;
    document.getElementById('add_country').disabled = false;
    document.getElementById('add_establishment_type').disabled = false;
    document.getElementById('add_cusine_type').disabled = false;
    //Materalize - Update the 'select' add country, establishment type and cuisine type options
    $('select').formSelect(); 
}

//Function to convert 24 hour to 12 hour
function tConvert (time) {
    // Check correct time format and split into components
    time = time.toString ().match (/^([01]\d|2[0-3])(:)([0-5]\d)(:[0-5]\d)?$/) || [time]; //(:[0-5]\d)
  
    if (time.length > 1) { // If time format correct
      time = time.slice (1);  // Remove full string match value
      time[5] = +time[0] < 12 ? ' AM' : ' PM'; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join (''); // return adjusted time or original string
  }
  

//Debug - Function to get time
function getTimePeroid(){
    console.log("testt");
    console.log(document.getElementById('add_time_start2').value);
    //document.getElementById("add_time_start2").value = "22:53:05";

    console.log(document.getElementById('test').value);
    document.getElementById("test").value = "22:53:05";
}