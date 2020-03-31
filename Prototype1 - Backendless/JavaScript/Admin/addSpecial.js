//Script to add a special

//Form inputs
const addSuburb = document.getElementById('add_suburb');
const addCategory = document.getElementById('add_category');
const addCusineType = document.getElementById('add_cusine_type');
const addEstablishmentType = document.getElementById('add_establishment_type');
const addTypeOfSpecial = document.getElementById('add_type_of_special');
const addAddress = document.getElementById('add_address');

//Form buttons
const addConfirmBtn = document.getElementById('addConfirmBtn');
const addCancelBtn = document.getElementById('addCancelBtn');


//Add data
// addspecialForm.addEventListener('submit', (e) => {
//     e.preventDefault();

//     addspecialForm.request();
// });

//Add data - Automatically set random id in database (doesn't take into account specialID txtbox)
addConfirmBtn.addEventListener('click', e => {
    console.log("add button clicked");
    e.preventDefault();

    //Turn address into coords
    var location = addAddress.value;
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
        //Save data to database automatically using a constant to store the id, then using set method later to call it
        const ID = specialsCollection.doc();
        ID.set({
            suburb: addSuburb.value,
            category: addCategory.value,
            cusine_type: addCusineType.value,
            establishment_type: addEstablishmentType.value,
            type_of_special: addTypeOfSpecial.value,
            address: addAddress.value,
            coords: new firebase.firestore.GeoPoint(lat, lng) 
        })
    })


    // .then(() => {
    //     var location = addAddress.value;
    //     axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{ //https://maps.googleapis.com/maps/api/geocode/json //?components=country:NZ||country:AU //https://maps.googleapis.com/maps/api/place/autocomplete/json?input=Raf&sensor=false&types=(regions)&key=YOUR_API_KEY&components=country:ESP|country:uk|country:us
    //         params:{
    //             address:location, 
    //             key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',  
    //         }
    //     })
    //     .then(function(response){
    //         //Geometry
    //         //console.log(response.data.results[0].formatted_address)
    //         lat = response.data.results[0].geometry.location.lat; //var
    //         lng = response.data.results[0].geometry.location.lng; //var

    //         //location: new firebase.firestore.GeoPoint(latitude, longitude)

    //         specialsCollection.doc(ID).update({ //Here admin enters a previous specialID
    //             //Updating an object - Object.property
    //             coords: new firebase.firestore.GeoPoint(lat, lng)
    //         })
    //     }) 
    // })
    .then(() => {console.log('Data Successfully Written');})
    .then(() => {onPageLoad();}) //Reset the specialDataset with the new special
    //.then(() => {enableMainOperatiobBtns();})
    .then(() => {document.querySelector('#addspecial-form').reset();})
    .catch(error => {console.error(error)});
});

//Function to cancel the add panel
addCancelBtn.addEventListener('click', e => {
    e.preventDefault();

    console.log("hi");

    //Hide the add panel
     //document.getElementById('modal1').style.display = "none";

    //Enable the main operation buttons
    //enableMainOperatiobBtns();

    //Reset the form
    addspecialForm = document.querySelector('#addspecial-form');
    addspecialForm.reset();

 });

