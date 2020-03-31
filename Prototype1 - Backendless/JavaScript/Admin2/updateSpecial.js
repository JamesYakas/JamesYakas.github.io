//Script to update a special

//Form inputs


//Form buttons
// const updateConfirmBtn = document.getElementById('updateConfirmBtn');
// const updateCancelBtn = document.getElementById('updateCancelBtn');

//Update data - Based on id set in the specialID txtbox
//To update data we should specifiy the documents reference and use the update method which 
//takes an object that holds the new data as a parameter.
updateConfirmBtn.addEventListener('click', e =>{
    e.preventDefault();

    var updateSpecialID = document.getElementById('update_specialId');
    var updateSuburb = document.getElementById('update_suburb');
    var updateCategory = document.getElementById('update_category');
    var updateCusineType = document.getElementById('update_cusine_type');
    var updateEstablishmentType = document.getElementById('update_establishment_type');
    var updateTypeOfSpecial = document.getElementById('update_type_of_special');
    var updateAddress = document.getElementById('update_address');

    specialsCollection.doc(updateSpecialID.value).update({ //Here admin enters a previous specialID
        suburb: updateSuburb.value,
        category: updateCategory.value,
        cusine_type: updateCusineType.value,
        establishment_type: updateEstablishmentType.value,
        type_of_special: updateTypeOfSpecial.value,
        address: updateAddress.value
    }).then(() => {console.log('Data Updated Successfully');})
    .then(() => {onPageLoad();}) //Refresh the special listbox with the updated special
    .catch(error => {console.error(error)});
});

//Function to cancel the update panel
updateCancelBtn.addEventListener('click', e => {
    e.preventDefault();

    //Update text feilds so label is reset
    //M.updateTextFields();
 });
