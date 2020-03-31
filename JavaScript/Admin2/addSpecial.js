//Script to add a special

//Add data - Automatically set random id in database (doesn't take into account specialID txtbox)
addConfirmBtn.addEventListener('click', e => {
    console.log("add button clicked");
    e.preventDefault();

    //Get the add form data
    var addAddress = document.getElementById('add_address');
    var addSuburb = document.getElementById('add_suburb');

    //Turn address into coords
    var location = addAddress.value + " " + addSuburb.value;
    var lat;
    var lng;
    axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{ //https://maps.googleapis.com/maps/api/geocode/json //?components=country:NZ||country:AU //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Raf&sensor=false&types=(regions)&key=YOUR_API_KEY&components=country:ESP|country:uk|country:us
        params:{
            address:location, 
            key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',  
        }
    })
    .then(function(response){
        //Geometry
        //console.log(response.data.results[0].formatted_address)
        lat = response.data.results[0].geometry.location.lat; //var
        lng = response.data.results[0].geometry.location.lng; //var

        //location: new firebase.firestore.GeoPoint(latitude, longitude)
    })
    .then(() => {
        //Get the add form data (should document. be declared under name: document.value?)
        var addName = document.getElementById('add_name');
        var addCountry = document.getElementById('add_country');
        var addEstablishmentType = document.getElementById('add_establishment_type');
        var addCusineType = document.getElementById('add_cusine_type');
        var addCategory = document.getElementById('add_category');
        var addTypeOfSpecial = document.getElementById('add_type_of_special');
        var addDescription = document.getElementById('add_description');

        //Save data to database automatically using a constant to store the id, then using set method later to call it
        const ID = establishmentsCollection.doc();
        ID.set({
            name: addName.value,
            address: addAddress.value,
            suburb: addSuburb.value,
            country: addCountry.value,
            establishment_type: addEstablishmentType.value,
            cusine_type: addCusineType.value,
            special: firebase.firestore.FieldValue.arrayUnion({
                id: "s1" + ID.id,
                category: addCategory.value,
                type_of_special: addTypeOfSpecial.value,
                description: addDescription.value
            }),
            coords: new firebase.firestore.GeoPoint(lat, lng) 
        })
        console.log(ID.id);
    })
    .then(() => {console.log('Data Successfully Written');})
    .then(() => {onPageLoad();}) //Refresh the listbox with the new establishment / special
    .then(() => {document.querySelector('#addspecial-form').reset();})
    .then(() => {M.updateTextFields();})
    //Update text feilds so label is reset
    .catch(error => {console.error(error)});
});

//Function to cancel the add panel
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
    //Update the add_county option
    $('select').formSelect(); 
    document.getElementById('add_establishment_type').disabled = false;
    document.getElementById('add_cusine_type').disabled = false;

    //Update text feilds so label is reset
    M.updateTextFields();
    //This works without addspecialForm.reset();?
    //document.getElementById('addToExistingEstablishment').innerHTML = "";
 });

