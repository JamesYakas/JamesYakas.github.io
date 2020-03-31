// Form inputs
const specialId = document.getElementById('specialId');
const specialName = document.getElementById('specialName');

const suburb = document.getElementById('suburb');
const category = document.getElementById('category');
const cusineType = document.getElementById('CusineType');
const establishmentType = document.getElementById('establishmentType');
const typeOfSpecial = document.getElementById('typeOfSpecial');
const displayAll = document.getElementById('displayAll');

//Form buttons
const addBtn = document.getElementById('addBtn');
const updateBtn = document.getElementById('updateBtn');
const deleteBtn = document.getElementById('deleteBtn');
const readBtn = document.getElementById('readBtn');
const displayBtn = document.getElementById('displayBtn');

// Hold firebase functions
const database = firebase.firestore();

// Store specials collection
const specialsCollection = database.collection('specials');

//Array to display specicals
var displaySpecialsArray = new Array();
//Array to display special details in form
var formSpecialArray = new Array();

//Add data
addBtn.addEventListener('click', e => {
    console.log("add button clicked");
    e.preventDefault();
    // // Save data to database, under special id
    // specialsCollection.doc(specialId.value).set({
    //     special_name:  specialName.value,
    //     special_cuisine_type: specialCuisineType.value
    // }, {merge: true}) //Merge to existing data entries 
    // .then(() => {console.log('Data Successfully Written');})
    // .catch(error => {console.error(error)});

    // //Save data to database using automatically generated id, using .add instead of .set (doesn't require "Merge")
    // specialsCollection.add({
    //     special_name:  specialName.value,
    //     special_cuisine_type: specialCuisineType.value
    // })
    // .then(() => {console.log('Data Successfully Written');})
    // .catch(error => {console.error(error)});

    //Save data to database automatically using a constant to store the id, then using set method later to call it
    const ID = specialsCollection.doc();
    ID.set({
        suburb:  suburb.value,
        category: category.value,
        cusine_type: cusineType.value,
        establishment_type: establishmentType.value,
        type_of_Special: typeOfSpecial.value
    })
    .then(() => {console.log('Data Successfully Written');})
    .catch(error => {console.error(error)});
});

//Update data
//To update data we should specifiy the documents reference and use the update method which 
//takes an object that holds the new data as a parameter.
updateBtn.addEventListener('click', e =>{
    e.preventDefault();
    specialsCollection.doc(specialId.value).update({ //Here admin enters a previous specialID
        special_name: specialName.value,
        special_cuisine_type: 'Mexican',
        //Updating an object - Object.property
        'Dimensions.x': '40cm',
        // //To override all properties of an object
        // Dimensions: {
        //     height: 'long',
        //     y: '20cm',
        //     z: '10cm'
        // }
        // //Updating an array - Add data to an array
        // favourite_music: firebase.firestore.FieldValue.arrayUnion('Metal')
        // //Remove data from an array
        // favourite_music: firebase.firestore.FieldValue.arrayRemove('Rock')
        // //Get time stamp when data got updated on the server
        // edited: firebase.firestore.FieldValue.serverTimestamp()
        //Increment and decrement values
        'Dimensions.y': firebase.firestore.FieldValue.increment(8) //should be used on a non-object to work
    }).then(() => {console.log('Data Updated Successfully');})
    .catch(error => {console.error(error)});
});

//Delete data
deleteBtn.addEventListener('click', e =>{
    e.preventDefault();
    // //Delete feild
    // specialsCollection.doc(specialId.value).update({
    //     favourite_music: firebase.firestore.FieldValue.delete()
    // }).then(() => {console.log('Data Updated Successfully');})
    // .catch(error => {console.error(error)});

    //Delete document
    specialsCollection.doc(specialId.value).delete()
    .then(() => {console.log('Document deleted Successfully');})
    .catch(error => {console.error(error)});
});

//Display data
displayBtn.addEventListener('click', e =>{
    e.preventDefault();

    //Get the data of all the users by using the get method directly on the specials collection which holds the different documents
    specialsCollection.get()
    .then(snapshot =>{
        snapshot.forEach(special => {
            console.log(special.id, ' => ', special.data());

            //var specialArray = new Array();
            //Push special data to the displaySpecialsArray
            displaySpecialsArray.push(special.data());
             //special.data();
             
            //displayAll.innerHTML = displaySpecialsArray[0].category;//[1].category;//special.data().category;
        });
    })
    .then(() => {displayAllSpecials(displaySpecialsArray);}) //Display all of the special details
    .then(() => {console.log('Documents found Successfully');})
    .catch(error => {console.error(error)});
});

//Function to display all the special details
function displayAllSpecials(array){
    //Clear the display div
    displayAll.innerHTML = "";
    for (index = 0; index < array.length; ++index) {
        displayAll.innerHTML += index+1  + "<br>"
        +"Category: " + array[index].category + "<br>"
        + "Cuisine Type: " + array[index].cusine_type + "<br>"
        + "Establishment Type: " + array[index].establishment_type + "<br>"
        + "Suburb: " + array[index].suburb + "<br>"
        + "Special Type: " + array[index].type_of_Special + "<br>"
        +"<br>";

        //console.log(a[index]);
        //Cear the array
        displaySpecialsArray = [];

    }
}



//Read data
readBtn.addEventListener('click', e =>{
    e.preventDefault();
    // //Use get method on the reference of a document
    // specialsCollection.doc(specialId.value).get()
    // .then(special =>{
    //     if(special.exists)
    //         console.log(special.data());
    //     else
    //         console.log('Special does not exist');
    // })
    // .then(() => {console.log('Document found Successfully');})
    // .catch(error => {console.error(error)});

    // //Get the data of all the users by using the get method directly on the specials collection which holds the different documents
    // specialsCollection.get()
    // .then(snapshot =>{
    //     snapshot.forEach(special => {
    //         console.log(special.id, ' => ', special.data());
    //     });
    // })
    // .then(() => {console.log('Documents found Successfully');})
    // .catch(error => {console.error(error)});

    //Query - Query a database based on a feilds value
    const query1 = specialsCollection.where('special_name', '==', 'Fried Rice');
    const query2 = specialsCollection.where('special_cuisine_type', '==', 'Italian');
    //Query of an array
    const query3 = specialsCollection.where('favourite_languages', 'array-contains', 'C#');
    //Query if contains any in an array
    const languages = ['C#', 'php', 'java']
    const query4 = specialsCollection.where('favourite_languages', 'array-contains-any', languages);
    //Chain multiple queries, however feilds of the query must be the same
    const query5 = specialsCollection.where('special_name', '==', 'Pizza').where('special_name', '==', 'Bread');
    query5.get()
    .then(snapshot => {
        snapshot.forEach(special =>{
            console.log(special.id, ' => ', special.data());
        });
    })
    .then(() => {console.log('Query found Successfully');})
    .catch(error => {console.error(error)});
});

//Function to get the special details from listbox (onclick) and populate the form
function getSpecial(){

    //Get txtbox special ID
    var txtBoxSpecialID = document.getElementById('specialId');
    //Get txtbox suburb
    var txtBoxSpecialSuburb = document.getElementById('suburb');
    //Get txtbox Special Category
    var txtBoxSpecialCatagory = document.getElementById('category');
    //Get txtbox Cusine type
    var txtBoxSpecialCusineType = document.getElementById('cusineType');
    //Get txtbox Establishment Type
    var txtBoxEstablishmentType = document.getElementById('establishmentType');
    //Get txtbox Type Of Special
    var txtBoxTypeOfSpecial = document.getElementById('typeOfSpecial');

    //Get listbox
    var listbox = document.getElementById('specialListBox');

    //Find what select option index clicked
    var selectedIndex = listbox.selectedIndex;

    //Set the special id txtbox to the user's listbox selection
    txtBoxSpecialID.value = formSpecialArray[selectedIndex];

    //Populate the form of the special's attributes based on id
    specialsCollection.get()
    .then(snapshot =>{
        snapshot.forEach(special => {
            //If a special id in the db is that of the special id selected via the listbox
            if(special.id == formSpecialArray[selectedIndex]){
                //Display to console the data of the special in question
                console.log(special.id, ' => ', special.data());

                //Populate the form with the specail's data
                txtBoxSpecialSuburb.value = special.data().suburb;
                txtBoxSpecialCatagory.value = special.data().category;
                txtBoxSpecialCusineType.value = special.data().cusine_type;
                txtBoxEstablishmentType.value = special.data().establishment_type;
                txtBoxTypeOfSpecial.value = special.data().type_of_Special;
            }
            

            //var specialArray = new Array();
            //Push special data to the displaySpecialsArray
            //displaySpecialsArray.push(special.data());
             //special.data();
             
            //displayAll.innerHTML = displaySpecialsArray[0].category;//[1].category;//special.data().category;
        });
    })
    .then(() => {console.log('ID specific document found Successfully');})
    .catch(error => {console.error(error)});

}

//Function to populate the special list box from the database
function populateSpecialListBox(){
    // alert("Loaded");

    // //Get the listbox
    // var listBox = getElementById('specialListBox');

    // //Populate the list box
    // listBox.options[0] = new Option('test', 'Test');

}

//Function when the admin page loads using jQuery
$(document).ready(function () {
 
    //alert("Loaded");

    //Get the listbox
    var listBox = document.getElementById('specialListBox');

    // //Populate the list box
    // listBox.options[0] = new Option('test', 'Test');

    var index = 0;
    //Get the data of all the users by using the get method directly on the specials collection which holds the different documents
    specialsCollection.get()
    .then(snapshot =>{
        snapshot.forEach(special => {
            console.log(special.id, ' => ', special.data());

            //Populate the list box
            listBox.options[index] = new Option(special.id, special.id);

            index++;
            //Push special data to formArray
            formSpecialArray.push(special.id);

            //var specialArray = new Array();
            //Push special data to the displaySpecialsArray
            //displaySpecialsArray.push(special.data());
                //special.data();
                
            //displayAll.innerHTML = displaySpecialsArray[0].category;//[1].category;//special.data().category;
        });
    })
    //.then(() => {displayAllSpecials(displaySpecialsArray);}) //Display all of the special details
    .then(() => {console.log('Documents found Successfully');})
    .catch(error => {console.error(error)});
}) ;






