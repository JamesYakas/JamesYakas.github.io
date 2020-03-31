//Script to display the specials

// Form inputs
const specialId = document.getElementById('specialId');
const specialName = document.getElementById('specialName');
const suburb = document.getElementById('suburb');
const category = document.getElementById('category');
const cusineType = document.getElementById('cusineType');
const establishmentType = document.getElementById('establishmentType');
const typeOfSpecial = document.getElementById('typeOfSpecial');
const address = document.getElementById('address');

//Display all div
const displayAll = document.getElementById('displayAll');

//Form buttons
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
// const readBtn = document.getElementById('readBtn');
// const displayBtn = document.getElementById('displayBtn');

//Listbox
const listbox = document.getElementById('specialListBox');

// Hold firebase functions
const database = firebase.firestore();

// Store specials collection
const specialsCollection = database.collection('specials');


//Function for when the page loads
$(document).ready(function () {
    onPageLoad();
    // $('select').material_select();
    // $('select').formSelect();
});

//Function for the function of when the page loads
function onPageLoad(){
    // All commands here

    //Reset the listbox

    //Get the listbox
    var listBox = document.getElementById('specialListBox');

    //Variable for looping through the listbox options
    var index = 0;

    //Get the data of all the specials by using the get method directly on the specials collection which holds the different documents
    specialsCollection.get()
    .then(snapshot =>{
        snapshot.forEach(special => {
            console.log(special.id, ' => ', special.data());

            //Populate the list box
            listBox.options[index] = new Option(special.data().suburb, special.id);

            //Move onto the next option
            index++;
        });
    })

    //Display first element
    .then(() => {
        const query1 = specialsCollection.where(firebase.firestore.FieldPath.documentId(), '==', listbox.options[0].value);
        query1.get()
        .then(snapshot => {
            snapshot.forEach(special =>{ //How to break after special found because seems unncessary to keep iterating
                //console.log(special.id, ' => ', special.data());
                //Set the special id txtbox to the user's listbox selection
                specialId.value = special.id //listbox.options[listbox.selectedIndex].value;
                //Set the rest of the special's attributes of the special selected
                suburb.value = special.data().suburb;
                category.value = special.data().category;
                cusineType.value = special.data().cusine_type;
                establishmentType.value = special.data().establishment_type;
                typeOfSpecial.value = special.data().type_of_special;
                address.value = special.data().address;
            });
        })
    })
    .then(() => {console.log('Documents found from db Successfully');})
    .catch(error => {console.error(error)});
}
  
//Add data - Automatically set random id in database (doesn't take into account specialID txtbox)
addBtn.addEventListener('click', e => {
    e.preventDefault();

    //Disable the main operation buttons
    //disableMainOperatiobBtns();
});

//Update data - Based on id set in the specialID txtbox
//To update data we should specifiy the documents reference and use the update method which 
//takes an object that holds the new data as a parameter.
updateBtn.addEventListener('click', e =>{
    e.preventDefault();

    //Transfer the special in question to the update txtboxes
    updateSpecialID.value = specialId.value;
    updateSuburb.value = suburb.value;
    updateCategory.value = category.value;
    updateCusineType.value = cusineType.value;
    updateEstablishmentType.value = establishmentType.value
    updateTypeOfSpecial.value = typeOfSpecial.value;
    updateAddress.value = address.value;

    //Display the add panel
    //document.getElementById('updatePanel').style.display = "block";

    //Disable the main operation buttons
    //disableMainOperatiobBtns()
    

});

//Delete data - Based on id set in the specialID txtbox
deleteBtn.addEventListener('click', e =>{
    e.preventDefault();

    //Delete document
    specialsCollection.doc(specialId.value).delete() //specialData[option.selectedIndex].firebaseID
    .then(() => {console.log('Document deleted Successfully');})
    .then(() => {onPageLoad();}) //Reset the specialDataset with the special removed
    .then(() => {removeLastOption(listbox);})
    .catch(error => {console.error(error)});
});

//Function to display all specials in a div
displayBtn.addEventListener('click', e =>{
    e.preventDefault();

    //Clear the number of specails found display
    displayNumOfSpecialsFound.innerHTML = "";

    //Clear the display div
    displayAll.innerHTML = "";

    //FETCH FROM DB
    var index = 0;
    //Get the data of all the specials by using the get method directly on the specials collection which holds the different documents
    specialsCollection.get()
    .then(snapshot =>{
        snapshot.forEach(special => {
            //console.log(special.id, ' => ', special.data());

            //Move onto the next option
            index++;

            displayAll.innerHTML += index  + "<br>"
            +"Category: " + special.data().category + "<br>"
            + "Cuisine Type: " + special.data().cusine_type + "<br>"
            + "Establishment Type: " + special.data().establishment_type + "<br>"
            + "Suburb: " + special.data().suburb + "<br>"
            + "Special Type: " + special.data().type_of_special + "<br>"
            +"<br>";         
        });
    })  
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
 



//Function to get a special details from listbox (onclick) and populate the form
function getSpecial(){

    //FETCH FROM DB

    //const query1 = specialsCollection.doc(listbox.options[listbox.selectedIndex].value).get();
    const query1 = specialsCollection.where(firebase.firestore.FieldPath.documentId(), '==', listbox.options[listbox.selectedIndex].value);
    query1.get()
    .then(snapshot => {
        snapshot.forEach(special =>{ //How to break after special found because seems unncessary to keep iterating
            //console.log(special.id, ' => ', special.data());
            //Set the special id txtbox to the user's listbox selection
            specialId.value = special.id //listbox.options[listbox.selectedIndex].value;
            //Set the rest of the special's attributes of the special selected
            suburb.value = special.data().suburb;
            category.value = special.data().category;
            cusineType.value = special.data().cusine_type;
            establishmentType.value = special.data().establishment_type;
            typeOfSpecial.value = special.data().type_of_special;
            address.value = special.data().address;
        });
    })
    .then(() => {console.log('Query found Successfully');})
    .catch(error => {console.error(error)});
}

//Function to enable the main operation buttons
function enableMainOperatiobBtns(){
    //Enable the main operation buttons
    addBtn.disabled = false;
    updateBtn.disabled = false;
    deleteBtn.disabled = false;
    //readBtn.disabled = false;
    //displayBtn.disabled = false;
}

//Function to disable the main operation buttons
function disableMainOperatiobBtns(){
    //Disable the main operation buttons
    addBtn.disabled = true;
    updateBtn.disabled = true;
    deleteBtn.disabled = true;
    //readBtn.disabled = true;
    //displayBtn.disabled = true;
}
