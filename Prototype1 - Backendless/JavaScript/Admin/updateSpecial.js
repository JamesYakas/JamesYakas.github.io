//Script to update a special

//Form inputs
const updateSpecialID = document.getElementById('update_specialId');
const updateSuburb = document.getElementById('update_suburb');
const updateCategory = document.getElementById('update_category');
const updateCusineType = document.getElementById('update_cusine_type');
const updateEstablishmentType = document.getElementById('update_establishment_type');
const updateTypeOfSpecial = document.getElementById('update_type_of_special');
const updateAddress = document.getElementById('update_address');

//Form buttons
const updateConfirmBtn = document.getElementById('updateConfirmBtn');
const updateCancelBtn = document.getElementById('updateCancelBtn');

//Update data - Based on id set in the specialID txtbox
//To update data we should specifiy the documents reference and use the update method which 
//takes an object that holds the new data as a parameter.
updateConfirmBtn.addEventListener('click', e =>{
    e.preventDefault();

    specialsCollection.doc(updateSpecialID.value).update({ //Here admin enters a previous specialID
        suburb: updateSuburb.value,
        category: updateCategory.value,
        cusine_type: updateCusineType.value,
        establishment_type: updateEstablishmentType.value,
        type_of_special: updateTypeOfSpecial.value,
        address: updateAddress.value
        ////Updating an object - Object.property
        //'Dimensions.x': '40cm',
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
        ////Increment and decrement values
        //'Dimensions.y': firebase.firestore.FieldValue.increment(8) //should be used on a non-object to work
    }).then(() => {console.log('Data Updated Successfully');})
    .then(() => {onPageLoad();}) //Reset the specialDataset with the updated special
    // .then(() => {document.getElementById('updatePanel').style.display = "none"; //Hide the update panel
    // enableMainOperatiobBtns();})
    .catch(error => {console.error(error)});
});

//Function to cancel the update panel
updateCancelBtn.addEventListener('click', e => {
    e.preventDefault();

    //Hide the add panel
     document.getElementById('updatePanel').style.display = "none";

    //Enable the main operation buttons
    enableMainOperatiobBtns();

 });
