//Admin Script to query a suburb

//Form inputs
//Admin
const querySuburb = document.getElementById('querySuburb');
//User
const userSuburb = localStorage.getItem("usersSuburb");

//Form buttons
const querySuburbBtn = document.getElementById('querySuburbBtn');

//Displays
const displayNumOfSpecialsFound = document.getElementById('displayNumFound');

//Function to query a suburb of specials
querySuburbBtn.addEventListener('click', e => {
    e.preventDefault();

    //Clear the the div
    displayAll.innerHTML = "";

    //Count how many specials there are in a suburb
    var count =0;

    ////FETCH FROM DATASET
    // //Loop through the specialsDataset
    // for(index=0;index<specialsDataset.length;++index){
    //     //If the suburbs in the dataset is that of the user's query
    //     if(specialsDataset[index].suburb == querySuburb.value){

    //         //Increase the counter
    //         ++count;

    //         //Confirm to the user

    //         displayAll.innerHTML += "<br>" + "There is " + count + " specials in " + querySuburb.value + "!" + "<br>" + "<br>" +
    //         //Display the specail's details
    //         "Suburb:" + specialsDataset[index].suburb + "<br>" +
    //         "Special category:" + specialsDataset[index].category + "<br>" +
    //         "Cusine type:" + specialsDataset[index].cusine_type + "<br>" +
    //         "Establishment type:" + specialsDataset[index].establishment_type + "<br>" +
    //         "Type of special:" + specialsDataset[index].type_of_special + "<br>";


    //     }
    // }

    //FETCH FROM DB
    //Query - Query a database based on a feilds value
    const query1 = specialsCollection.where('suburb', '==', querySuburb.value);
    query1.get()
    .then(snapshot => {
        snapshot.forEach(special =>{
            console.log(special.id, ' => ', special.data());

             //Increase the counter
             ++count;

            //Confirm to the user
            //Display how many specails found
            displayNumOfSpecialsFound.innerHTML = "<br>" + "There is " + count + " specials in " + querySuburb.value + "!";
            
            
            //Display the specail's details
            displayAll.innerHTML += //"<br>" + "There is " + count + " specials in " + querySuburb.value + "!" + "<br>" + "<br>" +
            "Suburb:" + special.data().suburb + "<br>" +
            "Special category:" + special.data().category + "<br>" +
            "Cusine type:" + special.data().cusine_type + "<br>" +
            "Establishment type:" + special.data().establishment_type + "<br>" +
            "Type of special:" + special.data().type_of_special + "<br>" + "<br>";            
        });
    })
    .then(() => {console.log('Query found Successfully');})
    .catch(error => {console.error(error)});



 });