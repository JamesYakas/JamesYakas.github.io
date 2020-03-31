//User Script to query a suburb
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

    //Retrieve the user's suburb from local storage (from the landing page)
    var suburb = localStorage.getItem("usersSuburb");

    //The array to hold all the establishments and their specials
    var masterEstablishments = [];
    var markers = [];


    //Coords - Set to 0 by default
    var lat = 0;
    var lng = 0;


    //The fucntion when the page loads
    $(document).ready(function (){
        pageOnLoad();
    });

    function pageOnLoad(){
            //Retrieve suburb from local storage
            const suburb = localStorage.getItem("usersSuburb");

            // var queryBuilder = Backendless.DataQueryBuilder.create();
    
            // // queryBuilder.setWhereClause( "Suburb = '1'" );
    
            // Backendless.Data.of( "Special" ).find()
            // .then( function( objectArray ) {
            //     console.log(objectArray);
            // })
            // .catch( function( error ) {
            // });
    
            //RETRIEVE SPECIALS FROM THE DB BASED ON USER'S SUBURB
            var queryBuilder = Backendless.DataQueryBuilder.create();
    
            // var query = "'" + suburb + "'"
            // console.log(query);
    
            queryBuilder.setWhereClause( "Suburb = " + "'" + suburb + "'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );
    
            Backendless.Data.of( "Establishment" ).find( queryBuilder )
    
            // set query builder properties
            // queryBuilder.setWhereClause( "Suburb = 'Rose Bay'" );
    
            // Backendless.Data.of( "Establishment" ).find( queryBuilder )
            .then( function( objectArray ) {

                //Clear the list
                document.getElementById('rpList').innerHTML = "";
                
    
                //Display how many specials currently found
                //document.getElementById('rpNumOfSpecialsFound').innerHTML = "<br>" + "There is " + count + " specials in " + suburb + "!";
                //console.log(objectArray);
    
                //For every establishment
                for(var i=0;i<objectArray.length;i++){
                    
                    //If it contains specials
                    if(objectArray[i].establishmentSpecials.length > 0){
    
                        //Display the establishment details
                        document.getElementById('rpList').innerHTML += 
                        // "<hr style='width:20%'>" +
                        "<b>" + objectArray[i].Establishment_Type + "</b>" + "<br>" + 
                        objectArray[i].Name + "<br>" + 
                        objectArray[i].Address + "<br>" + 
                        objectArray[i].Cuisine_Type + "<br>" + "<br>";
    
                        //For every special
                        for(var a=0;a<objectArray[i].establishmentSpecials.length;a++){
    
                            //Display the special details
                            document.getElementById('rpList').innerHTML +=
                            "<b>" + "Special".fontcolor("#29a381") + "</b>" + "<br>" + 
                            objectArray[i].establishmentSpecials[a].Category + "<br>" + 
                            objectArray[i].establishmentSpecials[a].Description + "<br>" + "<br>";
                        }
    
                        //Display break point for the next establishment
                        document.getElementById('rpList').innerHTML += "<hr style='width:20%'>";
                    }
                }
                //Save a copy of object array as masterEstablishment
                masterEstablishments = objectArray;

                //Display the user's suburb
                document.getElementById('rpDisplaySuburb').innerHTML = "Displaying specials in " + suburb.fontcolor("#FF3399") + " (postcode)";
            })
            .catch( function( error ) {
            });
            
            // console.log("3. hi");
            // //Display the establishment and special's details
            // document.getElementById('rpList').innerHTML +=
            // //"Establishment ID: " + objectArray[i].EstablishmentID + "<br>" +
            // "<hr style='width:20%'>" +
            // // "<b>" + "Establishment" + "</b>" + "<br>" +
            // "<b>" + objectArray[a].Establishment_Type + "</b>" + "<br>" +
            // objectArray[i].establishmentSpecials.Name + "<br>" +
            // objectArray[i].Address + "<br>" +
            // // "Suburb: " + objectArray[a].Suburb + "<br>" +
            // // "Country: " + objectArray[a].Country + "<br>" +
            // objectArray[i].Cuisine_Type + "<br>" + "<br>" +
            // // "Establishment type: " + objectArray[a].Establishment_Type + "<br>" + "<br>" + 
            // "<b>" + "Special" + "</b>" + "<br>"  +
            // objectArray[i].establishmentSpecials[i].Category + "<br>" +
            // // "Type of special: " + objectArray[a].establishmentSpecials[i].Type_Of_Special + "<br>" +
            // objectArray[i].establishmentSpecials[i].Description + "<br>" +
            // "<hr style='width:20%'>";  
    
    
            //GET COORDS FOR USER'S SUBURB
            // Store the user's location
            var location = suburb;
            //Get the geocode response data
            axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{ 
                params:{
                    address:location, 
                    key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',  
                }
            }) //Use the reponse data
            .then(function(response){
    
                //Store the geometry (lat and lng) variables for when the map is initialised
                lat = response.data.results[0].geometry.location.lat;
                lng = response.data.results[0].geometry.location.lng;
                
            })
            //CREATE THE MAP MARKERS
            //Cycle through the specials collection based on user's suburb - query1
            .then(() => {
                //Initailise the map with users's location and map markers as just declared
                initMap();
            })
    
            //initMap();
            //Materialize 'select' initialisation for filters
            $('select').formSelect();
    }

    //Google map init function
    function initMap(){

        //Map options - zoom and center
        var options = {
            zoom: 13,
            center: {lat: lat, lng: lng} //lat -36.8785  lng 174.7633
        }

        //Initialise the map object
        var map = new 
        google.maps.Map(document.getElementById('rpGoogleMap'), options);

        //Loop through 'markers' array and add markers to map
        //For filtered markers
        for(var i=0;i<markers.length;i++){
            //Add marker
            addMarker(markers[i]);
        }

        //Function to add a marker
        function addMarker(props){
            //Initialise a marker object
            var marker = new google.maps.Marker({
            position:props.coords,
            map:map,
            //Custom special data for filtering
            category:props.category,
            cusine_type:props.cusine_type,
            establishment_type:props.establishment_type,
            type_of_special:props.type_of_special
            });

            //Check for custon icon
            if(props.iconImage){
            //Set icon image
            marker.setIcon(props.iconImage);
            }

            //Check content
            if(props.content){
                //Initialise a window/content object
                var infoWindow = new google.maps.InfoWindow({
                    content: props.content
                });
                marker.addListener('click', function(){
                    infoWindow.open(map, marker);
                });
            }
        }
    }

    //Function for the special category filter
    function specialCategoryFilter(){
        applyFilters();
        // //Clear the list
        // document.getElementById('rpList').innerHTML = "";

        // //Reference to the special category, cusine type, establishment type and type of special filter selections
        // var specialCategories = $('#specialCategoryFilter').val();
        // var cusineTypes = $('#cusineTypeFilter').val();
        // var establishmentTypes = $('#establishmentTypeFilter').val();
        // var typeOfSpecials = $('#typeOfSpecialFilter').val();

        // //console.log("Establishments");
        // //console.log(masterEstablishments);

        // // var establishments = {
        // //     Address: "594 New South Head Rd",
        // //     Establishment_Type: "Restaurant",
        // //     establishmentSpecials: {
        // //         Category: "Breakfast Special",
        // //         Description: "$2 Waffles"
        // //         },
        // //     Address: "333 Garden Rd",
        // //     Establishment_Type: "Restaurant",
        // //     establishmentSpecials: {
        // //         Category: "Dinner Special",
        // //         Description: "$3 Chips"
        // //         }
        // //     }

        // // var establishments = [ {address: "55 Garden rd"},
        // //     [{Category: "Breakfast Special"}, {Category: "Dinner Special"}]
        // //   ];



        // //specials = [{Category: "Breakfast Special"}, {Category: "Dinner Special"}]

        // //establishments.push(specials);



    
        // //console.log("establishmentst");
        // //console.log(establishments);

        // //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the allSpecialsFiltered1 for the rest of the type of filters 
        // //var allSpecialsFiltered1 = masterEstablishments.establishmentSpecials;
        // //console.log(allSpecialsFiltered1);

        // //Markers
        // //allMarkersFiltered1 = markers;
        // //var allMarkersFiltered2 = allMarkersFiltered1;

        // //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the allSpecialsFiltered1 for the rest of the type of filters 
        // var filteredEstablishments = masterEstablishments;

        // //Filter masterEstablishments based on the special category filter
        // if(specialCategories.length >= 1){

        //     //var establishments;
        //     //var allEstablishmentsFiltered1

        //     console.log("Test");
        //     filteredEstablishments =
        //     masterEstablishments.reduce( (result, e) => {
        //         const len = 
        //             e.establishmentSpecials
        //             .filter((x) => specialCategories.includes(x.Category));

        //         if(len.length > 0)
        //             return [ ...result, {...e, establishmentSpecials: len}];

        //         return result; 
        //     }, []);



        //     //For all Establishments
        //     //for(var i=0;i<masterEstablishments.length;i++){
        //         //Filter out Catorgory from establishmentSpecials where Category is not found in specialCategories
        //         //establishments = masterEstablishments[i].establishmentSpecials.filter(x => specialCategories.includes(x.Category));

        //         //var specialCategories = ["Breakfast Special"];
        //         //establishments = masterEstablishments.filter(e => e.establishmentSpecials.some(x => specialCategories.includes(x.Category)))


        //         //establishments = masterEstablishments.filter(establishment => establishment.establishmentSpecials.find(x => specialCategories.establishmentSpecials.includes(x.Category)));

        //         //const result = roles.filter(role => role.groups.find(group => user.groups.includes(group.id)));
        //         //console.log(result);
                
        //         // establishments = masterEstablishments.filter((element) => element.establishmentSpecials.some((subElement) => subElement.specialCategories.includes(subElement.Category)))
        //         // .map(element => {
        //         //     return Object.assign({}, element, {subElements : element.establishmentSpecials.filter(subElement => subElement.specialCategories.includes(subElement.Category))});
                
        //         //   }); 
        //     //}

        //     // establishments = masterEstablishments;
        //     // establishments.map((element) => {
        //     //     return {...element, establishmentSpecials: element.establishmentSpecials.some((subElement) => specialCategories.includes(subElement.Category))}
        //     //   })

        //     // let establishments = masterEstablishments
        //     // .filter((element) => 
        //     // element.establishmentSpecials.some((subElement) => subElement.specialCategories.includes(subElement.Category)))
        //     // .map(element => {
        //     // let newElt = Object.assign({}, element); // copies element
        //     // return newElt.establishmentSpecials.filter(subElement => subElement.specialCategories.includes(subElement.Category));
        //     // });

        //     // console.log("Filtered establishments");
        //     //console.log(establishments);

        //     //For all Establishments
        //     //for(var i=0;i<masterEstablishments.length;i++){
        //         //allEstablishmentsFiltered1 = masterEstablishments.filter(x => allSpecialsFiltered.includes(x.establishmentSpecials));
        //      //   }
        //     //console.log(allEstablishmentsFiltered1);

        //      //var allSpecialsFiltered1 = masterEstablishments[1].establishmentSpecials.filter(x => specialCategories.includes(x.Category));
        //      //console.log(allSpecialsFiltered1);
        //      //var allMarkersFiltered2 = allMarkersFiltered1.filter(x => specialCategories.includes(x.category));
        // }
        // //Filter filteredEstablishments based on the cusine type filter
        // if(cusineTypes.length >= 1){
        //      var filteredEstablishments = filteredEstablishments.filter(x => cusineTypes.includes(x.Cuisine_Type));
        //      //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => cusineTypes.includes(x.cusine_type));
             
        // }
        // //Filter allSpecialsFiltered1 based on the establish type filter
        // if(establishmentTypes.length >= 1){
        //     var filteredEstablishments = filteredEstablishments.filter(x => establishmentTypes.includes(x.Establishment_Type));
        //     //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => establishmentTypes.includes(x.establishment_type));
        // }
        // //Filter filteredEstablishments based on the establish type filter
        // if(typeOfSpecials.length >= 1){
        //     //var filteredEstablishments = filteredEstablishments.filter(x => typeOfSpecials.includes(x.Type_Of_Special));
        //     //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => typeOfSpecials.includes(x.type_of_special));
        //     filteredEstablishments =
        //     filteredEstablishments.reduce( (result, e) => {
        //         const len = 
        //             e.establishmentSpecials
        //             .filter((x) => typeOfSpecials.includes(x.Type_Of_Special));

        //         if(len.length > 0)
        //             return [ ...result, {...e, establishmentSpecials: len}];

        //         return result; 
        //     }, []);
        // }

        // console.log(filteredEstablishments);

        // //Display all the special's details
        // for(var i =0;i<filteredEstablishments.length;i++){
        //     //Display the establishment details
        //     document.getElementById('rpList').innerHTML += 
        //     // "<hr style='width:20%'>" +
        //     "<b>" + filteredEstablishments[i].Establishment_Type + "</b>" + "<br>" + 
        //     filteredEstablishments[i].Name + "<br>" + 
        //     filteredEstablishments[i].Address + "<br>" + 
        //     filteredEstablishments[i].Cuisine_Type + "<br>" + "<br>";

        //     //For every special
        //     for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

        //         //Display the special details
        //         document.getElementById('rpList').innerHTML +=
        //         "<b>" + "Special".fontcolor("#29a381") + "</b>" + "<br>" + 
        //         filteredEstablishments[i].establishmentSpecials[a].Category + "<br>" + 
        //         filteredEstablishments[i].establishmentSpecials[a].Description + "<br>" + "<br>";
        //     }

        //     //Display break point for the next establishment
        //     document.getElementById('rpList').innerHTML += "<hr style='width:20%'>";
        // }

        // // //Create query builder
        // // var queryBuilder = Backendless.DataQueryBuilder.create();

        // // // var objectId = [];

        // // // objectId in ("Establishment"[establishmentSpecials = 'Breakfast Special'])
        // // // .then( function( objectArray ) {

        // // //     console.log(objectArray);
        // // // })

        // // specialCategories = ["Breakfast Special"];
        // // //Where suburb = Rose Bay and establishmentSpecials category = 
        // // queryBuilder.setWhereClause( "Suburb = 'Rose Bay'and establishmentSpecials.Category IN (" + "'" + specialCategories + "'" + ")"); //( "Suburb = " + "'" + suburb + "'" + "and establishmentSpecials.Category = 'Breakfast Special'");//, AND, establishmentSpecials.Category = 'Breakfast Special');//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );
  
        // // Backendless.Data.of( "Establishment" ).find( queryBuilder )
        // // .then( function( objectArray ) {
        // //     console.log(objectArray);
        // // })
        // // .catch( function( error ) {
        // // });
    }

    //Function for the cusine type filter
    function cusineTypeFilter(){
    applyFilters();
    }

    //Function for the establishment type filter
    function establishmentTypeFilter(){
    applyFilters();
    }

    //Function for the type of special filter
    function typeOfSpecialFilter(){
    applyFilters();
    }

    //Function for filters
    function applyFilters(){
        //Clear the list
        document.getElementById('rpList').innerHTML = "";

        //Reference to the special category, cusine type, establishment type and type of special filter selections
        var specialCategories = $('#specialCategoryFilter').val();
        var cusineTypes = $('#cusineTypeFilter').val();
        var establishmentTypes = $('#establishmentTypeFilter').val();
        var typeOfSpecials = $('#typeOfSpecialFilter').val();

        //console.log("Establishments");
        //console.log(masterEstablishments);

        // var establishments = {
        //     Address: "594 New South Head Rd",
        //     Establishment_Type: "Restaurant",
        //     establishmentSpecials: {
        //         Category: "Breakfast Special",
        //         Description: "$2 Waffles"
        //         },
        //     Address: "333 Garden Rd",
        //     Establishment_Type: "Restaurant",
        //     establishmentSpecials: {
        //         Category: "Dinner Special",
        //         Description: "$3 Chips"
        //         }
        //     }

        // var establishments = [ {address: "55 Garden rd"},
        //     [{Category: "Breakfast Special"}, {Category: "Dinner Special"}]
        //   ];



        //specials = [{Category: "Breakfast Special"}, {Category: "Dinner Special"}]

        //establishments.push(specials);



    
        //console.log("establishmentst");
        //console.log(establishments);

        //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the allSpecialsFiltered1 for the rest of the type of filters 
        //var allSpecialsFiltered1 = masterEstablishments.establishmentSpecials;
        //console.log(allSpecialsFiltered1);

        //Markers
        //allMarkersFiltered1 = markers;
        //var allMarkersFiltered2 = allMarkersFiltered1;

        //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the allSpecialsFiltered1 for the rest of the type of filters 
        var filteredEstablishments = masterEstablishments;

        //Filter masterEstablishments based on the special category filter
        if(specialCategories.length >= 1){

            //var establishments;
            //var allEstablishmentsFiltered1

            console.log("Test");
            filteredEstablishments =
            masterEstablishments.reduce( (result, e) => {
                const len = 
                    e.establishmentSpecials
                    .filter((x) => specialCategories.includes(x.Category));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result; 
            }, []);



            //For all Establishments
            //for(var i=0;i<masterEstablishments.length;i++){
                //Filter out Catorgory from establishmentSpecials where Category is not found in specialCategories
                //establishments = masterEstablishments[i].establishmentSpecials.filter(x => specialCategories.includes(x.Category));

                //var specialCategories = ["Breakfast Special"];
                //establishments = masterEstablishments.filter(e => e.establishmentSpecials.some(x => specialCategories.includes(x.Category)))


                //establishments = masterEstablishments.filter(establishment => establishment.establishmentSpecials.find(x => specialCategories.establishmentSpecials.includes(x.Category)));

                //const result = roles.filter(role => role.groups.find(group => user.groups.includes(group.id)));
                //console.log(result);
                
                // establishments = masterEstablishments.filter((element) => element.establishmentSpecials.some((subElement) => subElement.specialCategories.includes(subElement.Category)))
                // .map(element => {
                //     return Object.assign({}, element, {subElements : element.establishmentSpecials.filter(subElement => subElement.specialCategories.includes(subElement.Category))});
                
                //   }); 
            //}

            // establishments = masterEstablishments;
            // establishments.map((element) => {
            //     return {...element, establishmentSpecials: element.establishmentSpecials.some((subElement) => specialCategories.includes(subElement.Category))}
            //   })

            // let establishments = masterEstablishments
            // .filter((element) => 
            // element.establishmentSpecials.some((subElement) => subElement.specialCategories.includes(subElement.Category)))
            // .map(element => {
            // let newElt = Object.assign({}, element); // copies element
            // return newElt.establishmentSpecials.filter(subElement => subElement.specialCategories.includes(subElement.Category));
            // });

            // console.log("Filtered establishments");
            //console.log(establishments);

            //For all Establishments
            //for(var i=0;i<masterEstablishments.length;i++){
                //allEstablishmentsFiltered1 = masterEstablishments.filter(x => allSpecialsFiltered.includes(x.establishmentSpecials));
             //   }
            //console.log(allEstablishmentsFiltered1);

             //var allSpecialsFiltered1 = masterEstablishments[1].establishmentSpecials.filter(x => specialCategories.includes(x.Category));
             //console.log(allSpecialsFiltered1);
             //var allMarkersFiltered2 = allMarkersFiltered1.filter(x => specialCategories.includes(x.category));
        }
        //Filter filteredEstablishments based on the cusine type filter
        if(cusineTypes.length >= 1){
             var filteredEstablishments = filteredEstablishments.filter(x => cusineTypes.includes(x.Cuisine_Type));
             //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => cusineTypes.includes(x.cusine_type));
             
        }
        //Filter allSpecialsFiltered1 based on the establish type filter
        if(establishmentTypes.length >= 1){
            var filteredEstablishments = filteredEstablishments.filter(x => establishmentTypes.includes(x.Establishment_Type));
            //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => establishmentTypes.includes(x.establishment_type));
        }
        //Filter filteredEstablishments based on the establish type filter
        if(typeOfSpecials.length >= 1){
            //var filteredEstablishments = filteredEstablishments.filter(x => typeOfSpecials.includes(x.Type_Of_Special));
            //var allMarkersFiltered2 = allMarkersFiltered2.filter(x => typeOfSpecials.includes(x.type_of_special));
            filteredEstablishments =
            filteredEstablishments.reduce( (result, e) => {
                const len = 
                    e.establishmentSpecials
                    .filter((x) => typeOfSpecials.includes(x.Type_Of_Special));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result; 
            }, []);
        }

        console.log(filteredEstablishments);

        //Display all the special's details
        for(var i =0;i<filteredEstablishments.length;i++){
            //Display the establishment details
            document.getElementById('rpList').innerHTML += 
            // "<hr style='width:20%'>" +
            "<b>" + filteredEstablishments[i].Establishment_Type + "</b>" + "<br>" + 
            filteredEstablishments[i].Name + "<br>" + 
            filteredEstablishments[i].Address + "<br>" + 
            filteredEstablishments[i].Cuisine_Type + "<br>" + "<br>";

            //For every special
            for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                //Display the special details
                document.getElementById('rpList').innerHTML +=
                "<b>" + "Special".fontcolor("#29a381") + "</b>" + "<br>" + 
                filteredEstablishments[i].establishmentSpecials[a].Category + "<br>" + 
                filteredEstablishments[i].establishmentSpecials[a].Description + "<br>" + "<br>";
            }

            //Display break point for the next establishment
            document.getElementById('rpList').innerHTML += "<hr style='width:20%'>";
        }

        // //Create query builder
        // var queryBuilder = Backendless.DataQueryBuilder.create();

        // // var objectId = [];

        // // objectId in ("Establishment"[establishmentSpecials = 'Breakfast Special'])
        // // .then( function( objectArray ) {

        // //     console.log(objectArray);
        // // })

        // specialCategories = ["Breakfast Special"];
        // //Where suburb = Rose Bay and establishmentSpecials category = 
        // queryBuilder.setWhereClause( "Suburb = 'Rose Bay'and establishmentSpecials.Category IN (" + "'" + specialCategories + "'" + ")"); //( "Suburb = " + "'" + suburb + "'" + "and establishmentSpecials.Category = 'Breakfast Special'");//, AND, establishmentSpecials.Category = 'Breakfast Special');//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );
  
        // Backendless.Data.of( "Establishment" ).find( queryBuilder )
        // .then( function( objectArray ) {
        //     console.log(objectArray);
        // })
        // .catch( function( error ) {
        // });
    }

    //Function to show the list
    function btnShowList(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        //Disable reveal all suburbs map  button
        document.getElementById("rpBtnMapRevealSuburbs").style.display = "none";
     
        // if(list.style.display == "block"){
        // list.style.display = "none";
        // map.style.display = "block";
        // }else{
        // list.style.display = "block";
        // map.style.display = "none;"
        //}
     }
     
     //Function to show the map
     function btnShowMap(){
        //Disable list
        document.getElementById("rpList").style.display = "none";
        //Enable map
        document.getElementById("rpGoogleMap").style.display = "block";
        //Enable reveal all suburbs map  button
        document.getElementById("rpBtnMapRevealSuburbs").style.display = "block";
     }

     //Function to research a suburb
     function research(){
         //Re-assign suburb
         //suburb = document.getElementById('rpReSearchInputDiv').value;
         suburb = document.getElementById("rpReSearchInputDiv").value;

        //Store the suburb in localStorage
        localStorage.setItem("usersSuburb", suburb);

         //Re-load the page
         pageOnLoad();

         console.log(suburb);

     }



