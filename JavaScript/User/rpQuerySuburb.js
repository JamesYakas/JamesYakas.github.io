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
    //The array to hold all the markers
    var masterMarkers = [];
    var filteredMarkers = [];
    //The bool to decide if the markers should be unfiltered or filtered
    var boolFilteredMarkers = true;
    
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

            //RETRIEVE SPECIALS FROM THE DB BASED ON USER'S SUBURB
            var queryBuilder = Backendless.DataQueryBuilder.create();

            //Set the relations to get
            queryBuilder.setRelated( [ "establishmentSpecials"] );
    
            queryBuilder.setWhereClause( "Suburb = " + "'" + suburb + "'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );
    
            Backendless.Data.of( "Establishment" ).find( queryBuilder )
            .then( function( objectArray ) {

                //Clear the list
                document.getElementById('rpList').innerHTML = "";
    
                //For every establishment
                for(var i=0;i<objectArray.length;i++){
                    console.log(objectArray);
                    
                    //If it contains specials
                    if(objectArray[i].establishmentSpecials.length > 0){
    
                        //Display the establishment details
                        document.getElementById('rpList').innerHTML += 
                        // "<hr style='width:20%'>" +
                        "<b>" + objectArray[i].Establishment_Type + "</b>" + "<br>" + 
                        objectArray[i].Name + "<br>" + 
                        objectArray[i].Address + "<br>" + 
                        objectArray[i].Cuisine_Type + "<br>" +
                        '<img class="rpImage" src="' + objectArray[i].Image + '"' + '>' +  "<br>" +  "<br>";
                        // objectArray[i].Image + "<br>";
    
                        //For every special
                        for(var a=0;a<objectArray[i].establishmentSpecials.length;a++){
    
                            //Display the special details
                            document.getElementById('rpList').innerHTML +=
                            "<b>" + "Special".fontcolor("#29a381") + "</b>" + "<br>" + 
                            objectArray[i].establishmentSpecials[a].Category + "<br>" + 
                            objectArray[i].establishmentSpecials[a].Description + "<br>" +
                            tConvert(objectArray[i].establishmentSpecials[a].Start_Time) + "<br>" +
                            tConvert(objectArray[i].establishmentSpecials[a].End_Time) + "<br>" + "<br>";
                        }
    
                        //Display break point for the next establishment
                        document.getElementById('rpList').innerHTML += "<hr style='width:20%'>";
                    }
                }
                //Save a copy of object array as masterEstablishment
                masterEstablishments = objectArray;

                //Display the user's suburb
                document.getElementById('rpDisplaySuburb').innerHTML = "Displaying specials in " + suburb.fontcolor("#FF3399") + " (postcode)";
                console.log("1. Populate list");
            })
            .catch( function( error ) {
            });
    
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

                console.log("2. Get suburb coords");
                
            })

            //CREATE THE MAP MARKERS
            var queryBuilder = Backendless.DataQueryBuilder.create();
    
            queryBuilder.setWhereClause( "Suburb = " + "'" + suburb + "'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );
    
            Backendless.Data.of( "Establishment" ).find() //queryBuilder 
            .then( function( objectArray ) {
                console.log("3. Start map markers creation");
                //For every establishment
                for(var i=0;i<objectArray.length;i++){
                    //console.log(objectArray);
                    //console.log(objectArray[i].establishmentSpecials[0].Type_Of_Special);
                    console.log("4.1 Start creating a single marker");
                    //Apply relevant marker image (restaurant/bar)
                    var img;
                    if(objectArray[i].Establishment_Type == "Restaurant"){
                        img = 'images/restaurant.png'
                    }else if(objectArray[i].Establishment_Type == "Bar") {
                        img = 'images/bar.png'
                    }
                    
                    //Add the marker object to the markers array (unfiltered)
                    masterMarkers.push({
                        coords:{lat: objectArray[i].Location.y, lng: objectArray[i].Location.x},
                        iconImage: img,
                        content: objectArray[i].Suburb + "<br>" + "(description)",
                        //Custom special data for filtering
                        category: objectArray[i].establishmentSpecials[0].Category,
                        cusine_type: objectArray[i].Cuisine_Type,
                        establishment_type: objectArray[i].Establishment_Type,
                        type_of_special: objectArray[i].establishmentSpecials[0].Type_Of_Special
                    });
                    console.log("4.2 Finish creating a single marker");

                    //Add the marker to the filtered array if the suburb is that of the user's suburb
                    if(objectArray[i].Suburb == suburb){
                        filteredMarkers.push({
                            coords:{lat: objectArray[i].Location.y, lng: objectArray[i].Location.x},
                            iconImage: img,
                            content: objectArray[i].Suburb + "<br>" + "(description)",
                            //Custom special data for filtering
                            category: objectArray[i].establishmentSpecials[0].Category,
                            cusine_type: objectArray[i].Cuisine_Type,
                            establishment_type: objectArray[i].Establishment_Type,
                            type_of_special: objectArray[i].establishmentSpecials[0].Type_Of_Special
                        })
                    }
                    
                } 
                //return masterMarkers;
                console.log("5. Finish map markers creation");
            })
            .catch( function( error ) {
            })
            .then(() => { 
                console.log("6. Initialize map");
                initMap();
            })
    
            //initMap();
            //Materialize 'select' initialisation for filters
            $('select').formSelect();
    }

    //Google map init function
    function initMap(){

        console.log("7. Map Initialization started");

        //Map options - zoom and center
        var options = {
            zoom: 13,
            center: {lat: lat, lng: lng} //lat -36.8785  lng 174.7633
        }

        // masterMarkers.push({
        //     coords:{lat: -33.870461, lng: 151.268311},
        //     iconImage: 'images/restaurant.png',
        //     content: + "<br>" + "(description)",
        //     //Custom special data for filtering
        //     category: "special.data().category",
        //     cusine_type: "special.data().cusine_type",
        //     establishment_type: "special.data().establishment_type",
        //     type_of_special: "special.data().type_of_special"
        // });
        // console.log(masterMarkers.length);

        console.log("8. Start print markers");
        //log markers
        for(var i=0;i<masterMarkers.length;i++){
            console.log(masterMarkers[i]);
        }
        console.log("9. End print markers");


        // masterMarkers.push({
        //     coords:{lat: -36.879, lng: 174.764},
        //     iconImage: 'images/restaurant.png',
        //     content: + "<br>" + "(description)",
        //     //Custom special data for filtering
        //     category: "special.data().category",
        //     cusine_type: "special.data().cusine_type",
        //     establishment_type: "special.data().establishment_type",
        //     type_of_special: "special.data().type_of_special"
        // });

        // for(var i=0;i<masterMarkers.length;i++){
        //     console.log(masterMarkers[i]);
        // }

        //console.log("masterMarkers");

        //Initialise the map object
        var map = new 
        google.maps.Map(document.getElementById('rpGoogleMap'), options);

        console.log("10. Map created");

        //Loop through 'markers' array and add markers to map
        //For filtered markers
        if(boolFilteredMarkers == true){
            for(var i=0;i<filteredMarkers.length;i++){
                //Add marker
                addMarker(filteredMarkers[i]);
            }
        }else if(boolFilteredMarkers == false){ //For markers (unfiltered)
            for(var i=0;i<masterMarkers.length;i++){ //markers
                //Add marker
                addMarker(masterMarkers[i]); //markers
            }
        }

        // //Loop through 'markers' array and add markers to map
        // //For filtered markers
        // for(var i=0;i<filteredMarkers.length;i++){
        //     //Add marker
        //     addMarker(filteredMarkers[i]);
        // }

        console.log("11. Markers added");


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

    //Function for the start time filter
    function timePeriodFilter(){
        // //Reference to the start time filter selections
        // var startTime = $('#timePeriodStartFilter').val();
        // var endTime = $('#timePeriodEndFilter').val();

        // console.log(startTime);
        // console.log(endTime);
        applyFilters();
    }

    //Function for the special category filter
    function specialCategoryFilter(){
        applyFilters();
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
        var startTime = $('#timePeriodStartFilter').val();
        var endTime = $('#timePeriodEndFilter').val();
        var specialCategories = $('#specialCategoryFilter').val();
        var cusineTypes = $('#cusineTypeFilter').val();
        var establishmentTypes = $('#establishmentTypeFilter').val();
        var typeOfSpecials = $('#typeOfSpecialFilter').val();

        //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the filteredEstablishments for the rest of the type of filters 
        var filteredEstablishments = masterEstablishments;

        //Filter filteredEstablishments based on the start time filter

        // //Filter
        // //Start: 18:30, End: 20:30
        // //Special
        // //Start: 17:00, End: 18:00
        // //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping 
        // if((1080 > 1110) && (1020 < 1230)){
        //     console.log("Special can be showen as the special is overlapping the filter");
        // }else{
        //     console.log("Special cannot be showen as the special is not overlapping the filter");
        // }
        // //Filter
        // //Start: 18:30, End: 20:30
        // //Special
        // //Start: 19:00, End: 21:00
        // //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping 
        // if((1260 > 1110) && (1140 < 1230)){
        //     console.log("Special can be showen as the special is overlapping the filter");
        // }else{
        //     console.log("Special cannot be showen as the special is not overlapping the filter");
        // }
        //Filter
        //Start: 18:30, End: 20:30
        //Special
        //Start: 19:00, End: 21:00

        var filterStartTime = ((startTime.substring(0, 2) * 60) + +startTime.substring(3, 5));
        var filterEndTime = ((endTime.substring(0, 2) * 60) + +endTime.substring(3, 5));
        console.log(filterStartTime);
        console.log(filterEndTime);

        //Array for holding the establishments 
        var tempEstablishments = [];
        //Array for holding temp specials that are allowed to be shown
        var tempSpecials = [];
        //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to time period
        var specialObjectIds = [];
        
        //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping 
        //For every establishment
        for(var i=0;i<filteredEstablishments.length;i++){

            //Save the establishment 
            //var tempfilteredEstablishments = filteredEstablishments;
            //tempEstablishments.push(tempfilteredEstablishments[i].establishmentSpecials.splice(0));
            //Remove establishmentSpecials

            //array.splice(index, 1);

            //For every special in the establishment
            for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                //Get the Start_Time and End_Time
                var specialStartTime = filteredEstablishments[i].establishmentSpecials[a].Start_Time;
                var specialEndTime = filteredEstablishments[i].establishmentSpecials[a].End_Time;
                //Convert to minutes
                specialStartTime = ((specialStartTime.substring(0, 2) * 60) + +specialStartTime.substring(3, 5));
                specialEndTime = ((specialEndTime.substring(0, 2) * 60) + +specialEndTime.substring(3, 5));

                //Find how many specials each establishment has
                //var amountOfSpecials = filteredEstablishments[i].establishmentSpecials.length;

                //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping 
                if((specialEndTime  > filterStartTime) && (specialStartTime < filterEndTime)){
                    //Displays ones allowed to show to console
                    //console.log("Allowed to show");
                    //console.log(filteredEstablishments[i].establishmentSpecials[a]);

                    //Save the allowed specials
                    tempSpecials.push(filteredEstablishments[i].establishmentSpecials[a]);

                    //Save the special's object Id
                    specialObjectIds.push(filteredEstablishments[i].establishmentSpecials[a].objectId);
                }else{
                    //Delete these specials
                }
            }
        }

        //Filter based on time peroid
        // if(tempSpecials.length >= 1){
        //     filteredEstablishments =
        //     filteredEstablishments.reduce( (result, e) => {
        //         const len = 
        //             e.establishmentSpecials
        //             .filter((x) => specialCategories.includes(x.Category));

        //         if(len.length > 0)
        //             return [ ...result, {...e, establishmentSpecials: len}];

        //         return result; 
        //     }, []);
        // }

        //console.log(specialCategories);
        //console.log(tempSpecials);
        console.log("Specials that are allowed to be shown");
        console.log(tempSpecials);
        console.log("objectIds of specials that are allowed to be shown");
        console.log(specialObjectIds);

        //Filter based on time period
        if(specialObjectIds.length >= 1){
            filteredEstablishments =
            filteredEstablishments.reduce( (result, e) => {
                const len = 
                    e.establishmentSpecials
                    .filter((x) => specialObjectIds.includes(x.objectId));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result; 
            }, []);
        }

        // console.log("Filtered specials main");
        // console.log(filteredEstablishments);

        //console.log("Temp establishments");
        //console.log(tempEstablishments);
        // // const Moment = require('moment');
        // // const MomentRange = require('moment-range');
        // // const moment = MomentRange.extendMoment(Moment);

        // var range  = moment.range(new Date(startTime.substring(0, 2), startTime.substring(3, 5)), new Date(endTime.substring(0, 2), endTime.substring(3, 5))); //Filter
        // var range2 = moment.range(new Date(07, 30), new Date(09, 30)); //Special

        // // var range  = moment.range(new Date(06, 00), new Date(08, 00)); //Filter
        // // var range  = moment.range(06, 08); //Filter
        // // var range2 = moment.range(07,08); //Special
        // console.log(range2.overlaps(range));

        // // console.log(range);
        // // console.log(range);
        // //console.log(startTime);
        // console.log(startTime.substring(0, 2)); //startTime[0].substring(3, 4)
        // console.log(startTime.substring(3, 5));
        // console.log(endTime.substring(0, 2))//endTime[0].substring(3, 4));
        // console.log(endTime.substring(3, 5));
        // console.log(startTime);
        // console.log(endTime);




        // filteredEstablishments =
        // filteredEstablishments.reduce( (result, e) => {
        //     const len = 
        //         e.establishmentSpecials
        //         .filter((range2.overlaps(range)));

        //     if(len.length > 0)
        //         return [ ...result, {...e, establishmentSpecials: len}];

        //     return result; 
        // }, []);


        //Filter filteredEstablishments based on the special category filter
        if(specialCategories.length >= 1){
            filteredEstablishments =
            filteredEstablishments.reduce( (result, e) => {
                const len = 
                    e.establishmentSpecials
                    .filter((x) => specialCategories.includes(x.Category));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result; 
            }, []);
        }
        //Filter filteredEstablishments based on the cusine type filter
        if(cusineTypes.length >= 1){
             var filteredEstablishments = filteredEstablishments.filter(x => cusineTypes.includes(x.Cuisine_Type));  
        }
        //Filter allSpecialsFiltered1 based on the establishment type filter
        if(establishmentTypes.length >= 1){
            var filteredEstablishments = filteredEstablishments.filter(x => establishmentTypes.includes(x.Establishment_Type));
        }
        //Filter filteredEstablishments based on the special type type filter
        if(typeOfSpecials.length >= 1){
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
            filteredEstablishments[i].Cuisine_Type + "<br>" + 
            '<img class="rpImage" src="' + filteredEstablishments[i].Image + '"' + '>' +  "<br>" +  "<br>";

            //For every special
            for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                //Display the special details
                document.getElementById('rpList').innerHTML +=
                "<b>" + "Special".fontcolor("#29a381") + "</b>" + "<br>" + 
                filteredEstablishments[i].establishmentSpecials[a].Category + "<br>" + 
                filteredEstablishments[i].establishmentSpecials[a].Description + "<br>" + 
                tConvert(filteredEstablishments[i].establishmentSpecials[a].Start_Time) + "<br>" +
                tConvert(filteredEstablishments[i].establishmentSpecials[a].End_Time) + "<br>" + "<br>";
            }

            //Display break point for the next establishment
            document.getElementById('rpList').innerHTML += "<hr style='width:20%'>";
        }
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

    //Function for revealing all suburb markers on the map
    function btnRevealSuburbMarkers(){
        //The reveal btn
        btnReveal = document.getElementById('rpBtnMapRevealSuburbs');

        //Reveal all markers - Show all marker specials
        if(btnReveal.value == "show"){
            //Flip button text
            btnReveal.innerHTML = "Filter suburbs";
            //Change value
            btnReveal.value = "hide"

            //Use the markers array
            boolFilteredMarkers = false;

            //Initalise the map with the new set of markers. Specific marker set is decided in initMap()
            initMap();
        }else if(btnReveal.value == "hide"){ //Filter suburbs - Filter marker specials to the user's suburb
            //Flip button text
            btnReveal.innerHTML = "Reveal all suburbs";    
            //Change value
            btnReveal.value = "show"    

            //Use the markers (unfiltered) array
            boolFilteredMarkers = true;

            //Initalise the map with the new set of markers. Specific marker set is decided in initMap()
            initMap();
        }
    }

     //Function to research a suburb
     function research(){
         //Re-assign suburb
         //suburb = document.getElementById('rpReSearchInputDiv').value;
         suburb = document.getElementById("rpReSearchInputDiv").value;

        //Store the suburb in localStorage
        localStorage.setItem("usersSuburb", suburb);

        //Reset the markers
        masterMarkers = [];
        filteredMarkers = [];

         //Re-load the page
         pageOnLoad();

         console.log(suburb);
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



