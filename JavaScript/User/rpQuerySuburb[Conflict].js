//User Script to query a suburb
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

    //Retrieve the user's suburb from local storage (from the landing page)
    var suburb = localStorage.getItem("usersSuburb");
    //Whether this is the initial search
    var initialSearch = true;
    //Whether map has already loaded once
    //var mapNotLoadLoaded = true;
    //The type of special selected
    var _typeOfSpecial = ["Drink"];

    //The array to hold all the establishments and their specials
    var masterEstablishments = [];
    //The array to hold all the markers
    var masterMarkers = [];
    //The array to hold all the filtered markers
    var filteredMarkers = [];
    //Bool to signal to use filteredMasterMarkers
    var useFilteredMarkers = false;
    //The map
    //var map;

    //Coords - Set to 0 by default
    var lat = 0;
    var lng = 0;

    document.addEventListener('DOMContentLoaded', function() {
        pageOnLoad();
      });


    function pageOnLoad(){
        // //Retrieve suburb from local storage
        // var suburb = localStorage.getItem("usersSuburb");
        if(initialSearch){
            //Debug
            // console.log(suburb);
            // if(suburb == "Mt Eden"){
            //     document.getElementById('rpbtnList').style.display = "none";
            // }

            //Get results from Index instead
            //SWITCH TO objectArray = instead
            var objectArrayJSON = sessionStorage.getItem('suburbResults');
            //console.log(objectArrayJSON);
            var objectArray = JSON.parse(objectArrayJSON);
            //console.log(objectArray);

            //Clear the list
            document.getElementById('rpList').innerHTML = "";

            var ordering = {}, // map for efficient lookup of sortIndex
            sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
            for (var i=0; i<sortOrder.length; i++)
                ordering[sortOrder[i]] = i;

            //console.log(ordering);
            //console.log(objectArray[0].establishmentSpecials);

            // objectArray.establishmentSpecials.sort( function(a, b) {
            //     return (ordering[a.Category] - ordering[b.Category]) || a.Description.localeCompare(b.Description);
            // });

            //Count the number of specials found
            var numSpecials = 0;

            //Filter the establishemnts to firstly only show those with drink specials
            var typeOfSpecial = ["Drink"];
            var filteredEstablishments =
            objectArray.reduce( (result, e) => {
                const len =
                    e.establishmentSpecials
                    .filter((x) => typeOfSpecial.includes(x.Type_Of_Special));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result;
            }, []);


            //For every establishment
            for(var i=0;i<filteredEstablishments.length;i++){
                //console.log(objectArray);
                //If it contains specials
                if(filteredEstablishments[i].establishmentSpecials.length > 0){ //and special is a drink

                    //If any of the establishment's specials are drink specials
                    //Sort by Breakfast, Lunch, Dinner, Happy Hour
                    filteredEstablishments[i].establishmentSpecials.sort( function(a, b) {
                        return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                    });

                    //Display the establishment details
                    document.getElementById('rpList').innerHTML +=
                    "<div class=\"establishment-wrapper\"  data-id=\"" + filteredEstablishments[i].objectId + "\" id=\"viewEstablishmentPage\">" + //'<a href="establishment.html">' +
                    '<img class="rpImage" src="' + filteredEstablishments[i].Image + '"' + '>'// + '</a>'
                    +  "<br>" +
                    "<b>" + filteredEstablishments[i].Name + "</b>" + "<br>" +
                    filteredEstablishments[i].Cuisine_Type + "<br>" +
                    filteredEstablishments[i].objectId + "<br>" +
                    filteredEstablishments[i].Address + "<br>" + "<br>" +
                    "</div>";

                    //Create a table for the establishment's specials
                    document.getElementById('rpList').innerHTML +=

                    //Table
                    "<div class=\"tbl-wrapper\" >" +
                        "<table id='tbl' class=\"striped\">" + //class=\"striped\" //border=5
                            "<colgroup>" +
                                "<col span=\"1\" class=\"tbl-special\">" +
                                "<col span=\"1\" class=\"tbl-days\">" +
                            "</colgroup>" +
                            "<thead>" +
                                "<tr>" +
                                "<th class=\"tbl-special-th\">" + "Special" + "</th>" +
                                "<th class=\"tbl-days-th\">" + "Days" + "</th>" +
                                "</tr>" +
                                "</thead>" +
                                "<tbody id=\"myTable" + filteredEstablishments[i].objectId + "\"" + ">" + "</tbody>" +
                        "</table>" +
                    "</div>";

                    //For every special
                    for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                        //Get the table
                        var tbl = document.getElementById('myTable' + filteredEstablishments[i].objectId);

                        // var ordering = {}, // map for efficient lookup of sortIndex
                        // sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
                        // for (var i=0; i<sortOrder.length; i++)
                        //     ordering[sortOrder[i]] = i;

                        // somethingToSort.sort( function(a, b) {
                        //     return (ordering[a.type] - ordering[b.type]) || a.name.localeCompare(b.name);
                        // });

                        //Covert days of week to MTWTFSS
                        var days = [];
                        days = filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', ');

                        //console.log(days);

                        // var daysM = "<f id=\"M" + i + "\"" + ">" + "M" + "</f>";
                        var daysM = "M ";
                        var daysT= "T ";
                        var daysW = "W ";
                        var daysTh = "T ";
                        var daysF = "F ";
                        var daysS = "S ";
                        var daysSu = "S";

                        //For every letter in the form 0,1,2,3,4,5,6, e.g 2, 5 and 6 (Wednesday, Saturday and Sunday)
                        //daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu);
                        for(var g=0; g<days.length; g++){
                            //If monday
                            if(days[g] == "Monday"){
                                // $('#M' + i).addClass('daysAbbreviated');
                                // var div = $("#M")
                                // div.classList.add("daysAbbreviated");
                                daysM  = daysM.fontcolor("#FF3399");
                                // daysM = "<b>" + daysM  + " " + "</b>";
                            }else if(days[g] == "Tuesday"){//If tuesday
                                daysT  = daysT.fontcolor("#FF3399");
                                // daysT = "<b>" + daysT + " " + "</b>";
                            }else if(days[g] == "Wednesday"){//If wednesday
                                daysW  = daysW.fontcolor("#FF3399");
                                // daysW = "<b>" + daysW + " " + "</b>";
                            }else if(days[g] == "Thursday"){//If thursday
                                daysTh  = daysTh.fontcolor("#FF3399");
                                // daysTh = "<b>" + daysTh + " " + "</b>";
                            }else if(days[g] == "Friday"){//If friday
                                daysF  = daysF.fontcolor("#FF3399");
                                // daysF = "<b>" + daysF + " " + "</b>";
                            }else if(days[g] == "Saturday"){//If saturday
                                daysS  = daysS.fontcolor("#FF3399");
                                // daysS = "<b>" + daysS + " " + "</b>";
                            }else if(days[g] == "Sunday"){//If sunday
                                daysSu = daysSu.fontcolor("#FF3399");
                                // daysSu = "<b>" + daysSu + " " + "</b>";
                            }
                        }

                        //Fill table
                        addRow(tbl, "<div class=\"category\">" + filteredEstablishments[i].establishmentSpecials[a].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredEstablishments[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(filteredEstablishments[i].establishmentSpecials[a].End_Time) + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);
                        addRowBottom(tbl, filteredEstablishments[i].establishmentSpecials[a].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);

                        //Count number of specials
                        numSpecials++;
                        //addRow(tbl, objectArray[i].establishmentSpecials[a].Category.replace("Special", "") + "<br>" +  objectArray[i].establishmentSpecials[a].Description, tConvert(objectArray[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(objectArray[i].establishmentSpecials[a].End_Time) + "<br>" + objectArray[i].establishmentSpecials[a].Days_Of_Week, objectArray[i].establishmentSpecials[a].objectId);
                        //addRow(tbl, objectArray[i].establishmentSpecials[a].Description, objectArray[i].establishmentSpecials[a].Days_Of_Week, objectArray[i].establishmentSpecials[a].objectId);
                    }
                    //Display break point for the next establishment
                    document.getElementById('rpList').innerHTML += "<br>";
                }
            }

            //Create dynamic cuisine select box
            var cuisineSelectBox = document.getElementById('cusineTypeFilter');
            //Clear the cuisine select box
            $("#cusineTypeFilter").empty()
            //For every establishment
            var index = 1;
            var c=0;
            var arrlen = objectArray.length;
            var suburbCuisines = [];
            //For every special
            var c2=0;
            //Push all cuisines into suburbCuisines array (even if duplicates)
            //For every establishment
            for (c = 0; c < arrlen; c++) { //c = 0; c < arrlen; c++
                var food = false;
                //For every special - check if any of the specials are food
                for(c2=0;c2<objectArray[c].establishmentSpecials.length;c2++){
                    if(objectArray[c].establishmentSpecials[c2].Type_Of_Special == "Food"){
                        //Say the establishment has a special that is of type food
                        console.log(objectArray[c].Name);
                        food=true;
                        break;
                    }
                }

                //If an establishment has a special that is of type food
                if(food==true){
                    //If Cuisine_Type contains two Cuisines
                    if(objectArray[c].Cuisine_Type.includes(", ")){
                        //console.log("Includes , " + objectArray[c].Cuisine_Type);
                        //Store the multi Cuisine into a string
                        var tempCuisine = objectArray[c].Cuisine_Type;
                        console.log(tempCuisine);
                        //Split the string into a temp array
                        var tempCuisineArr = tempCuisine.split(", ");
                        //Push each element in the array into the suburbCuisines array
                        var e=0;
                        var arrLene = tempCuisineArr.length;
                        for(e;e<arrLene;e++){
                            suburbCuisines.push(tempCuisineArr[e]);
                        }
                        console.log(tempCuisineArr);
                        //suburbCuisines.push(tempCuisineArr);
                    }else{
                        //Push cusisine types into array
                        suburbCuisines.push(objectArray[c].Cuisine_Type); //.split(", ")
                    }
                    index++;
                }
            }
            console.log(suburbCuisines);
            //Filter suburbCuisines into uniqueSuburbCuisines array containing only unique suburbs
            var uniqueSuburbCuisines = suburbCuisines.filter( onlyUnique );
            //Sort alphabetically
            uniqueSuburbCuisines.sort();
            console.log(uniqueSuburbCuisines);
            //Populate cuisine select element
            var indexUnique = 1;
            var b=0;
            var uniqueCuisinesArrylen = uniqueSuburbCuisines.length;
            for(b=0;b<uniqueCuisinesArrylen;b++){
                cuisineSelectBox.options[0] = new Option("Any", "");
                cuisineSelectBox.options[0].disabled = true;
                cuisineSelectBox.options[indexUnique] = new Option(uniqueSuburbCuisines[b], uniqueSuburbCuisines[b]);
                indexUnique++;
            }
            $('select').formSelect();
            //$('.tabs').tabs();
            var elems = document.querySelectorAll('#foodDrink');
            var options = {
                duration: 100
            }
            M.Tabs.init(elems, options);

            //Save a copy of object array as masterEstablishment
            masterEstablishments = objectArray;

            //Display the user's suburb
            // var suburb = localStorage.getItem("usersSuburb");
            document.getElementById('rpDisplaySuburb').innerHTML = suburb.fontsize(6) + " Specials - ".fontsize(6);//.fontcolor("#FF3399")
            console.log("1. Populate list");
            // //Set Initial Search as false
            // initialSearch = false;

            //Display number of specials found
            document.getElementById('rpNumOfSpecialsFound').innerHTML = "Found " + "'" + numSpecials + "'" + " matching Drink specials";
        }else{
            // //Retrieve suburb from local storage
            // const suburb = localStorage.getItem("usersSuburb");

            //Debug
            // console.log(suburb);
            // if(suburb == "Mt Eden"){
            //     document.getElementById('rpbtnList').style.display = "none";
            // }
            //Use the masterMarkers array
            useFilteredMarkers = false;

            //Set the Drink/Food tab to Drink
            //Add active class to the Drink tab
            document.getElementById('tabDrink').classList.add("active");
            //Reset the filters
            $('#daysOfWeekFilter').val("");
            document.getElementById('timePeriodStartFilter').selectedIndex = "0";
            document.getElementById('timePeriodEndFilter').selectedIndex = "16";
            $('#specialCategoryFilter').val("");


            //Count the number of specials found
            var numSpecials = 0;

            var ordering = {}, // map for efficient lookup of sortIndex
            sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
            for (var i=0; i<sortOrder.length; i++)
                ordering[sortOrder[i]] = i;

            //RETRIEVE SPECIALS FROM THE DB BASED ON USER'S SUBURB
            var queryBuilder = Backendless.DataQueryBuilder.create();
            //Set the relations to get and the where clause
            queryBuilder.setRelated( [ "establishmentSpecials"] );
            queryBuilder.setWhereClause( "Suburb = " + "'" + suburb + "'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );

            return Backendless.Data.of( "Establishment" ).find( queryBuilder )
            .then( function( objectArray ) {

                //Clear the list
                document.getElementById('rpList').innerHTML = "";

                //Filter the establishemnts to firstly only show those with drink specials
                var typeOfSpecial = ["Drink"];
                var filteredEstablishments =
                objectArray.reduce( (result, e) => {
                    const len =
                        e.establishmentSpecials
                        .filter((x) => typeOfSpecial.includes(x.Type_Of_Special));

                    if(len.length > 0)
                        return [ ...result, {...e, establishmentSpecials: len}];

                    return result;
                }, []);

                //For every establishment
                for(var i=0;i<filteredEstablishments.length;i++){
                    console.log(filteredEstablishments);
                    //If it contains specials
                    if(filteredEstablishments[i].establishmentSpecials.length > 0){

                        //Sort by Breakfast, Lunch, Dinner, Happy Hour
                        filteredEstablishments[i].establishmentSpecials.sort( function(a, b) {
                            return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                        });

                        //Display the establishment details
                        document.getElementById('rpList').innerHTML +=
                        "<div class=\"establishment-wrapper\"  data-id=\"" + filteredEstablishments[i].objectId + "\" id=\"viewEstablishmentPage\">" + //'<a href="establishment.html">' +
                        '<img class="rpImage" src="' + filteredEstablishments[i].Image + '"' + '>'// + '</a>'
                        +  "<br>" +
                        "<b>" + filteredEstablishments[i].Name + "</b>" + "<br>" +
                        filteredEstablishments[i].Cuisine_Type + "<br>" +
                        filteredEstablishments[i].Address + "<br>" + "<br>" +
                        "</div>";

                        //Create a table for the establishment's specials
                        document.getElementById('rpList').innerHTML +=

                        //Table
                        "<div class=\"tbl-wrapper\" >" +
                            "<table id='tbl'  class=\"striped\">" + //class=\"striped\" //border=5
                                "<colgroup>" +
                                    "<col span=\"1\" class=\"tbl-special\">" +
                                    "<col span=\"1\" class=\"tbl-days\">" +
                                "</colgroup>" +
                                "<thead>" +
                                    "<tr>" +
                                    "<th class=\"tbl-special-th\">" + "Special" + "</th>" +
                                    "<th class=\"tbl-days-th\">" + "Days" + "</th>" +
                                    "</tr>" +
                                    "</thead>" +
                                    "<tbody id=\"myTable" + filteredEstablishments[i].objectId + "\"" + ">" + "</tbody>" +
                            "</table>" +
                        "</div>";

                        //For every special
                        for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                            //Get the table
                            var tbl = document.getElementById('myTable' + filteredEstablishments[i].objectId);

                            //Covert days of week to MTWTFSS
                            var days = [];
                            days = filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', ');

                            console.log(days);

                            // var daysM = "<f id=\"M" + i + "\"" + ">" + "M" + "</f>";
                            var daysM = "M ";
                            var daysT= "T ";
                            var daysW = "W ";
                            var daysTh = "T ";
                            var daysF = "F ";
                            var daysS = "S ";
                            var daysSu = "S";

                            //For every letter in the form 0,1,2,3,4,5,6, e.g 2, 5 and 6 (Wednesday, Saturday and Sunday)
                            //daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu);
                            for(var g=0; g<days.length; g++){
                                //If monday
                                if(days[g] == "Monday"){
                                    // $('#M' + i).addClass('daysAbbreviated');
                                    // var div = $("#M")
                                    // div.classList.add("daysAbbreviated");
                                    daysM  = daysM.fontcolor("#FF3399");
                                    // daysM = "<b>" + daysM  + " " + "</b>";
                                }else if(days[g] == "Tuesday"){//If tuesday
                                    daysT  = daysT.fontcolor("#FF3399");
                                    // daysT = "<b>" + daysT + " " + "</b>";
                                }else if(days[g] == "Wednesday"){//If wednesday
                                    daysW  = daysW.fontcolor("#FF3399");
                                    // daysW = "<b>" + daysW + " " + "</b>";
                                }else if(days[g] == "Thursday"){//If thursday
                                    daysTh  = daysTh.fontcolor("#FF3399");
                                    // daysTh = "<b>" + daysTh + " " + "</b>";
                                }else if(days[g] == "Friday"){//If friday
                                    daysF  = daysF.fontcolor("#FF3399");
                                    // daysF = "<b>" + daysF + " " + "</b>";
                                }else if(days[g] == "Saturday"){//If saturday
                                    daysS  = daysS.fontcolor("#FF3399");
                                    // daysS = "<b>" + daysS + " " + "</b>";
                                }else if(days[g] == "Sunday"){//If sunday
                                    daysSu = daysSu.fontcolor("#FF3399");
                                    // daysSu = "<b>" + daysSu + " " + "</b>";
                                }
                            }

                            //Fill table
                            addRow(tbl, "<div class=\"category\">" + filteredEstablishments[i].establishmentSpecials[a].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredEstablishments[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(filteredEstablishments[i].establishmentSpecials[a].End_Time) + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);
                            addRowBottom(tbl, filteredEstablishments[i].establishmentSpecials[a].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);

                            //Count number of specials
                            numSpecials++;

                            //addRow(tbl, objectArray[i].establishmentSpecials[a].Category.replace("Special", "") + "<br>" +  objectArray[i].establishmentSpecials[a].Description, tConvert(objectArray[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(objectArray[i].establishmentSpecials[a].End_Time) + "<br>" + objectArray[i].establishmentSpecials[a].Days_Of_Week, objectArray[i].establishmentSpecials[a].objectId);
                            //addRow(tbl, objectArray[i].establishmentSpecials[a].Description, objectArray[i].establishmentSpecials[a].Days_Of_Week, objectArray[i].establishmentSpecials[a].objectId);
                        }
                        //Display break point for the next establishment
                        document.getElementById('rpList').innerHTML += "<br>";
                    }
                }

                //Create dynamic cuisine select box
                var cuisineSelectBox = document.getElementById('cusineTypeFilter');
                //Clear the cuisine select box
                $("#cusineTypeFilter").empty()
                //For every establishment
                var index = 1;
                var c=0;
                var arrlen = objectArray.length;
                var suburbCuisines = [];
                //For every special
                var c2=0;
                //Push all cuisines into suburbCuisines array (even if duplicates)
                //For every establishment
                for (c = 0; c < arrlen; c++) { //c = 0; c < arrlen; c++
                    var food = false;
                    //For every special - check if any of the specials are food
                    for(c2=0;c2<objectArray[c].establishmentSpecials.length;c2++){
                        if(objectArray[c].establishmentSpecials[c2].Type_Of_Special == "Food"){
                            //Say the establishment has a special that is of type food
                            console.log(objectArray[c].Name);
                            food=true;
                            break;
                        }
                    }


                    //If an establishment has a special that is of type food
                    if(food==true){
                        //If Cuisine_Type contains two Cuisines
                        if(objectArray[c].Cuisine_Type.includes(", ")){
                            //console.log("Includes , " + objectArray[c].Cuisine_Type);
                            //Store the multi Cuisine into a string
                            var tempCuisine = objectArray[c].Cuisine_Type;
                            console.log(tempCuisine);
                            //Split the string into a temp array
                            var tempCuisineArr = tempCuisine.split(", ");
                            //Push each element in the array into the suburbCuisines array
                            var e=0;
                            var arrLene = tempCuisineArr.length;
                            for(e;e<arrLene;e++){
                                suburbCuisines.push(tempCuisineArr[e]);
                            }
                            console.log(tempCuisineArr);
                            //suburbCuisines.push(tempCuisineArr);
                        }else{
                            //Push cusisine types into array
                            suburbCuisines.push(objectArray[c].Cuisine_Type); //.split(", ")
                        }
                        index++;
                    }
                }
                var uniqueSuburbCuisines = suburbCuisines.filter( onlyUnique );
                //Sort alphabetically
                uniqueSuburbCuisines.sort();
                //Populate cuisine select element
                var indexUnique = 1;
                var b=0;
                var uniqueCuisinesArrylen = uniqueSuburbCuisines.length;
                for(b=0;b<uniqueCuisinesArrylen;b++){
                    cuisineSelectBox.options[0] = new Option("Any", "");
                    cuisineSelectBox.options[0].disabled = true;
                    cuisineSelectBox.options[indexUnique] = new Option(uniqueSuburbCuisines[b], uniqueSuburbCuisines[b]);
                    indexUnique++;

                }
                var elems = document.querySelectorAll('#foodDrink');
                var options = {
                    duration: 100
                }
                M.Tabs.init(elems, options);
                //Add active class to the Drink tab
                document.getElementById('tabDrink').classList.add("active");
                // var instance = M.Tabs.getInstance(elem);
                // instance.select('tabDrink');
                //Change _typeOfSpecial back to drink
                _typeOfSpecial = ["Drink"];

                //Save a copy of object array as masterEstablishment
                masterEstablishments = objectArray;

                //Display number of specials found
                document.getElementById('rpNumOfSpecialsFound').innerHTML = "Found " + "'" + numSpecials + "'" + " matching Drink specials";

                //Display the user's suburb
                document.getElementById('rpDisplaySuburb').innerHTML = suburb.fontsize(6) + " Specials ".fontsize(6) +  "- 2029";

                //If on the map - Disable map
                document.getElementById("rpGoogleMap").style.display = "none";
                //Enable list
                document.getElementById("rpList").style.display = "block";
                //Disable the cuisine filter
                document.getElementById('cusineTypeFilter').disabled = true;
                $('select').formSelect();

                console.log("1. Populate list");
            })
            .then(() => {
                //GET COORDS FOR USER'S SUBURB
                // Store the user's location
                var location = suburb;
                //Get the geocode response data
                return axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{
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

                }).then(() => {
                    console.log("3. Start map markers creation");
                    //For every establishment
                    for(var i=0;i<masterEstablishments.length;i++){

                        //If there are specials for the establishment
                        if(masterEstablishments[i].establishmentSpecials.length > 0){

                            console.log("4.1 Start creating a single marker");
                            //Apply relevant marker image (restaurant/bar)
                            var img = 'images/restaurant.png';
                            console.log(masterEstablishments[i].Location.y);
                            //Add the marker object to the markers array (unfiltered)
                            masterMarkers.push({
                                coords:{lat: masterEstablishments[i].Location.y, lng: masterEstablishments[i].Location.x}, //coords:{lat: objectArray[i].Location.y, lng: objectArray[i].Location.x},
                                iconImage: img,
                                content: "<a href=\"establishment.html\">" + masterEstablishments[i].Name + "</a>"  + "<br>" + masterEstablishments[i].Cuisine_Type + "<br>" + masterEstablishments[i].Address + "<br>",
                                //Custom special data for filtering
                                Cuisine_Type: masterEstablishments[i].Cuisine_Type,
                                establishmentSpecials: masterEstablishments[i].establishmentSpecials
                                //category: masterEstablishments[i].establishmentSpecials[0].Category,
                                //cusine_type: masterEstablishments[i].Cuisine_Type,
                                //establishment_type: masterEstablishments[i].Establishment_Type,
                                //type_of_special: masterEstablishments[i].establishmentSpecials[0].Type_Of_Special
                            });
                            console.log("4.2 Finish creating a single marker");
                        }

                    }
                    //return masterMarkers;
                    console.log("5. Finish map markers creation");
            })
            // .catch( function( error ) {
            // })
            .then(() => {
                console.log("6. Initialize map");
                //initMap();
            })
            })
            .catch( function( error ) {
            });
        }

        var elems = document.querySelectorAll('select');
        instances = M.FormSelect.init(elems);

        if(initialSearch){
            //GET COORDS FOR USER'S SUBURB
            // Store the user's location
            var location = suburb;
            //Get the geocode response data
            return axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{
                params:{
                    address:location,
                    key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',
                }
            }) //Use the reponse data
            .then(function(response){
                console.log(response);
                var postCode = response.data.results[0].formatted_address.match(/\d{4}/)[0]; //"Year: 2018".match(/\d{4}/)[0]
                document.getElementById('rpDisplaySuburb').innerHTML = suburb.fontsize(6) + " Specials - ".fontsize(6) +  postCode;
                //Store the geometry (lat and lng) variables for when the map is initialised
                lat = response.data.results[0].geometry.location.lat;
                lng = response.data.results[0].geometry.location.lng;

                console.log("2. Get suburb coords");

            }).then(() => {

            //CREATE THE MAP MARKERS
                console.log("3. Start map markers creation");
                //For every establishment
                for(var i=0;i<masterEstablishments.length;i++){

                    //If there are specials for the establishment
                    if(masterEstablishments[i].establishmentSpecials.length > 0){

                        console.log("4.1 Start creating a single marker");
                        //Apply relevant marker image (restaurant/bar)
                        var img = 'images/restaurant.png';

                        //Add the marker object to the markers array (unfiltered)
                        masterMarkers.push({
                            coords:{lat: masterEstablishments[i].Location.coordinates[1], lng: masterEstablishments[i].Location.coordinates[0]}, //coords:{lat: objectArray[i].Location.y, lng: objectArray[i].Location.x},
                            iconImage: img,
                            content: "<a href=\"establishment.html\">" + masterEstablishments[i].Name + "</a>" + "<br>" + masterEstablishments[i].Cuisine_Type + "<br>" + masterEstablishments[i].Address,
                            //Custom special data for filtering
                            Cuisine_Type: masterEstablishments[i].Cuisine_Type,
                            establishmentSpecials: masterEstablishments[i].establishmentSpecials,
                            objectId:masterEstablishments[i].objectId
                            //category: masterEstablishments[i].establishmentSpecials[0].Category,
                            //cusine_type: masterEstablishments[i].Cuisine_Type,
                            //establishment_type: masterEstablishments[i].Establishment_Type,
                            //type_of_special: masterEstablishments[i].establishmentSpecials[0].Type_Of_Special
                        });
                        console.log("4.2 Finish creating a single marker");
                    }

                }
                //return masterMarkers;
                console.log("5. Finish map markers creation");
            })
            .catch( function( error ) {
            })
            .then(() => {
                console.log("6. Initialize map");
                //initMap();
            })
        }else{
            // //GET COORDS FOR USER'S SUBURB
            // // Store the user's location
            // var location = suburb;
            // //Get the geocode response data
            // return axios.get('https://maps.googleapis.com/maps/api/geocode/json?components=country:NZ|country:AU',{
            //     params:{
            //         address:location,
            //         key:'AIzaSyBmpzz0lX4w2UV3KXivbLrQ3AHJUvOzbOI',
            //     }
            // }) //Use the reponse data
            // .then(function(response){

            //     //Store the geometry (lat and lng) variables for when the map is initialised
            //     lat = response.data.results[0].geometry.location.lat;
            //     lng = response.data.results[0].geometry.location.lng;

            //     console.log("2. Get suburb coords");

            // }).then(() => {
            //     console.log("3. Start map markers creation");
            //     //For every establishment
            //     for(var i=0;i<masterEstablishments.length;i++){

            //         //If there are specials for the establishment
            //         if(masterEstablishments[i].establishmentSpecials.length > 0){

            //             console.log("4.1 Start creating a single marker");
            //             //Apply relevant marker image (restaurant/bar)
            //             var img = 'images/restaurant.png';
            //             console.log(masterEstablishments[i].Location.y);
            //             //Add the marker object to the markers array (unfiltered)
            //             masterMarkers.push({
            //                 coords:{lat: masterEstablishments[i].Location.y, lng: masterEstablishments[i].Location.x}, //coords:{lat: objectArray[i].Location.y, lng: objectArray[i].Location.x},
            //                 iconImage: img,
            //                 content: masterEstablishments[i].Suburb + "<br>" + "(description)",
            //                 //Custom special data for filtering
            //                 category: masterEstablishments[i].establishmentSpecials[0].Category,
            //                 cusine_type: masterEstablishments[i].Cuisine_Type,
            //                 establishment_type: masterEstablishments[i].Establishment_Type,
            //                 type_of_special: masterEstablishments[i].establishmentSpecials[0].Type_Of_Special
            //             });
            //             console.log("4.2 Finish creating a single marker");
            //         }

            //     }
            //     //return masterMarkers;
            //     console.log("5. Finish map markers creation");
            // })
            // .catch( function( error ) {
            // })
            // .then(() => {
            //     console.log("6. Initialize map");
            //     initMap();
            // })
        }
    }

    //Google map init function
    function initMap(){

        console.log("7. Map Initialization started");

        //Map options - zoom and center
        var options = {
            zoom: 13,
            center: {lat: lat, lng: lng} //lat -36.8785  lng 174.7633
        }


        console.log("8. Start print markers");
        // //log markers
        // for(var i=0;i<masterMarkers.length;i++){
        //     console.log(masterMarkers[i]);
        // }
        console.log("9. End print markers");


        // console.log(map);
        //console.log(useFilteredMarkers);
        //Initialise the map object
        //if(useFilteredMarkers == false){
            var map = new google.maps.Map(document.getElementById('rpGoogleMap'), options);
            //setMapOnAll(null);
            console.log("Running first time");
            //Loop through all the markers and remove
            // for (var i = 0; i < filteredMarkers.length; i++) {
            //     filteredMarkers[i].setMap(null);
            //}
        //}

        // useFilteredMarkers = true;


            //Loop through all the markers and remove
            // for (var i = 0; i < filteredMarkers.length; i++) {
            //     filteredMarkers[i].setMap(null);
            // }


        console.log("10. Map created");

        console.log("10.1 clear markers")
        //filteredMarkers = [];
        // for (var i = 0; i < filteredMarkers.length; i++) {
        //     filteredMarkers[i].setMap(null);
        //   }

        console.log(useFilteredMarkers);
        //ifuseFilteredMarkers == true
        //if(useFilteredMarkers == true){
            if(useFilteredMarkers == false){
                //Loop through 'markers' array and add markers to map
                for(var i=0;i<masterMarkers.length;i++){ //markers
                    //Add marker
                    addMarker(masterMarkers[i]); //markers
                }
            }else{
                //Loop through 'markers' array and add markers to map
                for(var i=0;i<filteredMarkers.length;i++){ //markers
                    //Add marker
                    addMarker(filteredMarkers[i]); //markers
                }
            }
        //}


        //Decide whether to use the filteredMarkers array or the masterMarkers array
        // if(useFilteredMarkers){
        //     //Loop through 'markers' array and add markers to map
        //     for(var i=0;i<filteredMarkers.length;i++){ //markers
        //         //Add marker
        //         addMarker(filteredMarkers[i]); //markers
        //     }
        // }else{
        //     //Loop through 'markers' array and add markers to map
        //     for(var i=0;i<masterMarkers.length;i++){ //markers
        //         //Add marker
        //         addMarker(masterMarkers[i]); //markers
        //     }
        // }


        console.log("11. Markers added");

        //new google.maps.LatLng(markers[i][1], markers[i][2]

        var activeInfoWindow;
        //Function to add a marker
        function addMarker(props){
            //Initialise a marker object
            var marker = new google.maps.Marker({
            position:props.coords, //new google.maps.LatLng(props.coords.lat, props.coords.lng)
            map:map,
            //Custom establishment and special data for filtering
            Cuisine_Type:props.Cusine_Type,
            establishmentSpecials:props.establishmentSpecials,
            objectId:props.objectId
            //category:props.category,
            //establishment_type:props.establishment_type,
            //type_of_special:props.type_of_special
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
                    if (activeInfoWindow) { activeInfoWindow.close();}
                    infoWindow.open(map, marker);
                    activeInfoWindow = infoWindow;
                });
            }
        }

        // //Clear markers
        // clearMarkers();

    }

    // Sets the map on all markers in the array.
    function setMapOnAll(map) {
        for (var i = 0; i < filteredMarkers.length; i++) {
            filteredMarkers[i].setMap(map);
        }
    }

    // Removes the markers from the map, but keeps them in the array.
    function clearMarkers() {
        setMapOnAll(null);
        filteredMarkers = [];
    }

    function deleteMarkers() {
        //Loop through all the markers and remove
        for (var i = 0; i < filteredMarkers.length; i++) {
            filteredMarkers[i].setMap(null);
        }
        filteredMarkers = [];
    };

    //Function for the days of the week filter
    function daysOfWeekFilter(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        applyFilters();
    }

    //Function for the start time filter
    function timePeriodFilter(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        // //Reference to the start time filter selections
        // var startTime = $('#timePeriodStartFilter').val();
        // var endTime = $('#timePeriodEndFilter').val();

        // console.log(startTime);
        // console.log(endTime);
        applyFilters();
    }

    //Function for the special category filter
    function specialCategoryFilter(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        applyFilters();
    }

    //Function for the cusine type filter
    function cusineTypeFilter(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        applyFilters();
    }

    //Function for the establishment type filter
    function establishmentTypeFilter(){
    applyFilters();
    }

    // //Function for the type of special filter
    // function typeOfSpecialFilter(){
    // applyFilters();
    // }

    //Function for the type of special filter
    function typeOfSpecialFilterDrink(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        //Disable the cuisine filter
        //document.getElementById('cusineTypeFilterWrapper').style.display = "none";
        document.getElementById('cusineTypeFilter').disabled = true;
        $('select').formSelect();
        //var _typeOfSpecial = ["Drink"];
        //alert($(".active").attr('id'));
        _typeOfSpecial = ["Drink"];
        applyFilters();
    }

    //Function for the type of special filter
    function typeOfSpecialFilterFood(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        //Enable the cuisine filter
        //document.getElementById('cusineTypeFilterWrapper').style.display = "block";
        document.getElementById('cusineTypeFilter').disabled = false;
        $('select').formSelect();
        //var _typeOfSpecial = ["Food"];
        //alert($(".active").attr('id'));
        _typeOfSpecial = ["Food"];
        applyFilters(); //_typeOfSpecial
    }

    //Function for filters
    function applyFilters(){ //drinkOrFood
        //Clear the list
        document.getElementById('rpList').innerHTML = "";

        //Debug markers
        // console.log(masterMarkers);
        // console.log(masterEstablishments);

        // const selectedStartTime = document.querySelectorAll('#timePeriodStartFilter');
        // var startTime = Array.from(selectedStartTime).map(el => el.value);
        // const selectedEndTime = document.querySelectorAll('#timePeriodStartFilter');
        // var endTime = Array.from(selectedEndTime).map(el => el.value);
        // const selectedSpecialCategories = document.querySelectorAll('#specialCategoryFilter');
        // var specialCategories = Array.from(selectedSpecialCategories).map(el => el.value);
        // const selectedCusineTypes = document.querySelectorAll('#cusineTypeFilter');
        // var cusineTypes = Array.from(selectedCusineTypes).map(el => el.value);
        // const selectedTypeOfSpecials = document.querySelectorAll('#typeOfSpecialFilter');
        // var typeOfSpecials = Array.from(selectedTypeOfSpecials).map(el => el.value);

        //Reference to the special category, cusine type, establishment type and type of special filter selections
        var daysOfWeek = $('#daysOfWeekFilter').val();
        var startTime = $('#timePeriodStartFilter').val();
        var endTime = $('#timePeriodEndFilter').val();
        var specialCategories = $('#specialCategoryFilter').val();
        var cusineTypes = $('#cusineTypeFilter').val();
        //console.log(cusineTypes);
        //var establishmentTypes = $('#establishmentTypeFilter').val();
        // var typeOfSpecials = $('#typeOfSpecialFilter').val();
        //If drink tab selected, set ["Drink"], if food tab selected, set ["Food"]
//         var food = $('.tab').find('.active');
// console.log(food);

        var typeOfSpecials = _typeOfSpecial;
        // typeOfSpecials.push($(".active").attr('id'));
        // console.log(daysOfWeek);
        console.log(typeOfSpecials);
        //console.log(drinkOrFood);

        //Incase a filter in the sequence or all filters .length is 0 (not selected), initialise the filteredEstablishments for the rest of the type of filters
        var filteredEstablishments = masterEstablishments;

        //LIST - Filter based on days of the week
        //console.log(daysOfWeek);
        //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to time period
        var specialObjectIdsDays = [];
        //Array for holding temp specials that are allowed to be shown
        var tempSpecialsDays = [];
        //For every establishment
        for(var i=0;i<filteredEstablishments.length;i++){

            //For every special in the establishment
            for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){


                //Store the days of the week of this special
                //console.log(filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', '));

                //If filter is in special's days
                let checker = (arr, target) => target.every(v => arr.includes(v));

                //if check(...) ==true {}
                //console.log(checker(filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', '), daysOfWeek));
                //console.log(checker(filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', '), daysOfWeek));
                if(checker(filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', '), daysOfWeek) == true){
                    //Displays ones allowed to show

                    //Save the allowed specials
                    tempSpecialsDays.push(filteredEstablishments[i].establishmentSpecials[a]);
                    //Save the special's object Id
                    specialObjectIdsDays.push(filteredEstablishments[i].establishmentSpecials[a].objectId);
                }
            }
        }

        //console.log("Specials that are allowed to be shown - Days");
        //console.log(tempSpecialsDays);
        //console.log("objectIds of specials that are allowed to be shown - Days");
        //console.log(specialObjectIdsDays);

        //Filter based on days
        if(specialObjectIdsDays.length >= 0){ //1
            filteredEstablishments =
            filteredEstablishments.reduce( (result, e) => {
                const len =
                    e.establishmentSpecials
                    .filter((x) => specialObjectIdsDays.includes(x.objectId));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result;
            }, []);
        }

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
        //console.log(filterStartTime);
        //console.log(filterEndTime);

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
                    //Displays ones allowed to show
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
        // console.log("Specials that are allowed to be shown");
        // console.log(tempSpecials);
        // console.log("objectIds of specials that are allowed to be shown");
        // console.log(specialObjectIds);

        //Filter based on time period
        if(specialObjectIds.length >= 0){ //1
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
        // //Filter filteredEstablishments based on the cusine type filter
        // //ONE CUISINE
        // if(cusineTypes.length >= 1){
        //      var filteredEstablishments = filteredEstablishments.filter(x => cusineTypes.includes(x.Cuisine_Type));
        // }

        //MULTIPLE CUISINES
        //Only apply filter if food is selected
        if(_typeOfSpecial[0] == "Food"){
            //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to cuisine type
            var specialObjectIdsCuisines = [];
            //Array for holding temp specials that are allowed to be shown
            var tempSpecialsCuisines = [];
            //For every establishment
            for(var i=0;i<filteredEstablishments.length;i++){
                //Hold the establishment's cuisines if contains more than two
                var establishemntsMultiCuisines = [];

                //If Cuisine_Type contains two Cuisines
                if(filteredEstablishments[i].Cuisine_Type.includes(", ")){
                    //Store the multi Cuisine into a string
                    var tempCuisine = filteredEstablishments[i].Cuisine_Type;
                    //console.log(tempCuisine);
                    //Split the string into a temp array
                    var tempCuisineArr = tempCuisine.split(", ");
                    //Push each element in the array into the establishemntsMultiCuisines array
                    var e=0;
                    var arrLene = tempCuisineArr.length;
                    for(e;e<arrLene;e++){
                        establishemntsMultiCuisines.push(tempCuisineArr[e]);
                    }
                    //Japanese and Chinese as two elements in an array
                    //  console.log(establishemntsMultiCuisines);
                    // console.log(cusineTypes);
                    //suburbCuisines.push(tempCuisineArr);
                }
                else{
                    establishemntsMultiCuisines.push(filteredEstablishments[i].Cuisine_Type);
                }
                //Print out all the cuisines in each establishment
                //console.log(establishemntsMultiCuisines);
                //console.log(cusineTypes);
                //Determine if the cuisines of each establishment includes any of the cuisines in the filter
                // var n = establishemntsMultiCuisines.includes("Japanese", "Chinese");
                //For each cuisineType filter option

                for(var p=0;p<cusineTypes.length;p++){
                    //console.log(cusineTypes[p]);
                    //For each of the establishment's cuisines
                    //for(var c=0;c<establishemntsMultiCuisines.length;c++){
                        //var n = establishemntsMultiCuisines.includes(cusineTypes[p]);
                        //console.log(n);
                        if(establishemntsMultiCuisines.includes(cusineTypes[p]) == true){ //if(n == true)
                            //Save the allowed specials
                            tempSpecialsCuisines.push(filteredEstablishments[i]);
                            //Save the special's object Id
                            specialObjectIdsCuisines.push(filteredEstablishments[i].objectId);
                        }
                    //}
                }
            }

            //Display the establishments filtered by cuisine type
            console.log(tempSpecialsCuisines);
            console.log(cusineTypes);
            console.log(specialObjectIdsCuisines);
            //TODO - perhaps remove duplicate elements by object ID

            if(cusineTypes.length >= 1){
                filteredEstablishments = filteredEstablishments.filter(x => specialObjectIdsCuisines.includes(x.objectId));
            }
        }

        // //Filter based on cuisines
        // if(specialObjectIdsCuisines.length >= 0){ //1
        //     filteredEstablishments =
        //     filteredEstablishments.reduce( (result, e) => {
        //         const len =
        //             e.establishmentSpecials
        //             .filter((x) => specialObjectIdsCuisines.includes(x.objectId));

        //         if(len.length > 0)
        //             return [ ...result, {...e, establishmentSpecials: len}];

        //         return result;
        //     }, []);
        // }

        //Filter allSpecialsFiltered1 based on the establishment type filter
        // if(establishmentTypes.length >= 1){
        //     var filteredEstablishments = filteredEstablishments.filter(x => establishmentTypes.includes(x.Establishment_Type));
        // }
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

        //console.log(filteredEstablishments);

        var ordering = {}, // map for efficient lookup of sortIndex
        sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
        for (var i=0; i<sortOrder.length; i++)
            ordering[sortOrder[i]] = i;

        //Count the number of specials found
        var numSpecials = 0;

        //DISPLAY ALL THE ESTABLISHMENT'S SPECIAL DETAILS
        //For every establishment
        for(var i =0;i<filteredEstablishments.length;i++){

            //Sort by Breakfast, Lunch, Dinner, Happy Hour
            filteredEstablishments[i].establishmentSpecials.sort( function(a, b) {
                return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
            });

            //Display the establishment details
            document.getElementById('rpList').innerHTML +=
            "<div class=\"establishment-wrapper\"  data-id=\"" + filteredEstablishments[i].objectId + "\" id=\"viewEstablishmentPage\">" + //'<a href="establishment.html">' +
            '<img class="rpImage" src="' + filteredEstablishments[i].Image + '"' + '>'// + '</a>'
            +  "<br>" +
            "<b>" + filteredEstablishments[i].Name + "</b>" + "<br>" +
            filteredEstablishments[i].Cuisine_Type + "<br>" +
            filteredEstablishments[i].Address + "<br>" + "<br>" +
            "</div>";

            //Create a table for the establishment's specials
            document.getElementById('rpList').innerHTML +=

            //Table
            "<div class=\"tbl-wrapper\" >" +
                "<table id='tbl' class=\"striped\">" + //class=\"striped\" //border=5
                    "<colgroup>" +
                        "<col span=\"1\" class=\"tbl-special\">" +
                        "<col span=\"1\" class=\"tbl-days\">" +
                    "</colgroup>" +
                    "<thead>" +
                        "<tr>" +
                        "<th class=\"tbl-special-th\">" + "Special" + "</th>" +
                        "<th class=\"tbl-days-th\">" + "Days" + "</th>" +
                        "</tr>" +
                        "</thead>" +
                        "<tbody id=\"myTable" + filteredEstablishments[i].objectId + "\"" + ">" + "</tbody>" +
                "</table>" +
            "</div>";

            //For every special
            for(var a=0;a<filteredEstablishments[i].establishmentSpecials.length;a++){

                //Display the special details
                //Get the table
                var tbl = document.getElementById('myTable' + filteredEstablishments[i].objectId);

                //Covert days of week to MTWTFSS
                var days = [];
                days = filteredEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', ');

                console.log(days);

                // var daysM = "<f id=\"M" + i + "\"" + ">" + "M" + "</f>";
                var daysM = "M ";
                var daysT= "T ";
                var daysW = "W ";
                var daysTh = "T ";
                var daysF = "F ";
                var daysS = "S ";
                var daysSu = "S";

                //For every letter in the form 0,1,2,3,4,5,6, e.g 2, 5 and 6 (Wednesday, Saturday and Sunday)
                //daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu);
                for(var g=0; g<days.length; g++){
                    //If monday
                    if(days[g] == "Monday"){
                        // $('#M' + i).addClass('daysAbbreviated');
                        // var div = $("#M")
                        // div.classList.add("daysAbbreviated");
                        daysM  = daysM.fontcolor("#FF3399");
                        // daysM = "<b>" + daysM  + " " + "</b>";
                    }else if(days[g] == "Tuesday"){//If tuesday
                        daysT  = daysT.fontcolor("#FF3399");
                        // daysT = "<b>" + daysT + " " + "</b>";
                    }else if(days[g] == "Wednesday"){//If wednesday
                        daysW  = daysW.fontcolor("#FF3399");
                        // daysW = "<b>" + daysW + " " + "</b>";
                    }else if(days[g] == "Thursday"){//If thursday
                        daysTh  = daysTh.fontcolor("#FF3399");
                        // daysTh = "<b>" + daysTh + " " + "</b>";
                    }else if(days[g] == "Friday"){//If friday
                        daysF  = daysF.fontcolor("#FF3399");
                        // daysF = "<b>" + daysF + " " + "</b>";
                    }else if(days[g] == "Saturday"){//If saturday
                        daysS  = daysS.fontcolor("#FF3399");
                        // daysS = "<b>" + daysS + " " + "</b>";
                    }else if(days[g] == "Sunday"){//If sunday
                        daysSu = daysSu.fontcolor("#FF3399");
                        // daysSu = "<b>" + daysSu + " " + "</b>";
                    }
                }

                //Fill table
                addRow(tbl, "<div class=\"category\">" + filteredEstablishments[i].establishmentSpecials[a].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredEstablishments[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(filteredEstablishments[i].establishmentSpecials[a].End_Time) + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);
                addRowBottom(tbl, filteredEstablishments[i].establishmentSpecials[a].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredEstablishments[i].establishmentSpecials[a].objectId);

                //Count number of specials
                numSpecials++;
            }
            //Display break point for the next establishment
            document.getElementById('rpList').innerHTML += "<br>";
        }
        //Display number of specials found
        document.getElementById('rpNumOfSpecialsFound').innerHTML = "Found " + "'" + numSpecials + "'" + " matching " + _typeOfSpecial[0] + " specials";

        //Markers
        //If map is displayed (and apply filters when map button pressed)
        if(document.getElementById('rpGoogleMap').style.display == "block"){
            console.log("Map displayed");

            //Clear the filteredMarkers array
            // for (var i = 0; i < filteredMarkers.length; i++) {
            //     filteredMarkers[i].setMap(null);
            // }
            // filteredMarkers = [];

            //Clear the markers
            //clearMarkers();

            //Signal to use the filteredMarkers array
            useFilteredMarkers = true;
            //Get a fresh copy of the masterMarkers array
            filteredMarkers = masterMarkers;
            console.log(masterEstablishments);
            console.log(filteredMarkers);

            //MARKERS - Filter based on days of the week
            //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to time period
            var specialObjectIdsDaysMarkers = [];
            //Array for holding temp specials that are allowed to be shown
            var tempSpecialsDaysMarkers = [];
            //For every establishment
            for(var i=0;i<filteredMarkers.length;i++){

                //For every special in the establishment
                for(var a=0;a<filteredMarkers[i].establishmentSpecials.length;a++){


                    //If filter is in special's days
                    let checker = (arr, target) => target.every(v => arr.includes(v));

                    if(checker(filteredMarkers[i].establishmentSpecials[a].Days_Of_Week.split(', '), daysOfWeek) == true){
                        //Displays ones allowed to show

                        //Save the allowed specials
                        tempSpecialsDaysMarkers.push(filteredMarkers[i].establishmentSpecials[a]);
                        //Save the special's object Id
                        specialObjectIdsDaysMarkers.push(filteredMarkers[i].establishmentSpecials[a].objectId);
                    }
                }
            }


            //Filter based on days
            if(specialObjectIdsDaysMarkers.length >= 0){ //1
                filteredMarkers =
                filteredMarkers.reduce( (result, e) => {
                    const len =
                        e.establishmentSpecials
                        .filter((x) => specialObjectIdsDaysMarkers.includes(x.objectId));

                    if(len.length > 0)
                        return [ ...result, {...e, establishmentSpecials: len}];

                    return result;
                }, []);
            }

            //MARKERS - Filter based on time
            var filterStartTimeMarkers = ((startTime.substring(0, 2) * 60) + +startTime.substring(3, 5));
            var filterEndTimeMarkers = ((endTime.substring(0, 2) * 60) + +endTime.substring(3, 5));

            //Array for holding temp specials that are allowed to be shown
            var tempSpecialsMarkers = [];
            //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to time period
            var specialObjectIdsMarkers = [];

            //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping
            //For every establishment
            for(var i=0;i<filteredMarkers.length;i++){


                //For every special in the establishment
                for(var a=0;a<filteredMarkers[i].establishmentSpecials.length;a++){

                    //Get the Start_Time and End_Time
                    var specialStartTimeMarkers = filteredMarkers[i].establishmentSpecials[a].Start_Time;
                    var specialEndTimeMarkers = filteredMarkers[i].establishmentSpecials[a].End_Time;
                    //Convert to minutes
                    specialStartTimeMarkers = ((specialStartTimeMarkers.substring(0, 2) * 60) + +specialStartTimeMarkers.substring(3, 5));
                    specialEndTimeMarkers = ((specialEndTimeMarkers.substring(0, 2) * 60) + +specialEndTimeMarkers.substring(3, 5));

                    //If special ending time is greater than filter starting time AND special starting time is less than filter end time, then they are overlapping
                    if((specialEndTimeMarkers  > filterStartTimeMarkers) && (specialStartTimeMarkers < filterEndTimeMarkers)){

                        //Save the allowed specials
                        tempSpecialsMarkers.push(filteredMarkers[i].establishmentSpecials[a]);

                        //Save the special's object Id
                        specialObjectIdsMarkers.push(filteredMarkers[i].establishmentSpecials[a].objectId);
                    }else{
                        //Delete these specials
                    }
                }
            }

            //Filter based on time period
            if(specialObjectIdsMarkers.length >= 0){ //1
                filteredMarkers =
                filteredMarkers.reduce( (result, e) => {
                    const len =
                        e.establishmentSpecials
                        .filter((x) => specialObjectIdsMarkers.includes(x.objectId));

                    if(len.length > 0)
                        return [ ...result, {...e, establishmentSpecials: len}];

                    return result;
                }, []);
            }

        //MARKERS - Filter filteredMarkers based on the special category filter
        if(specialCategories.length >= 1){
            filteredMarkers =
            filteredMarkers.reduce( (result, e) => {
                const len =
                    e.establishmentSpecials
                    .filter((x) => specialCategories.includes(x.Category));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result;
            }, []);
        }

        //console.log(filteredMarkers);

        //MARKERS - Filter filteredMarkers based on the cusine type filter
        // //ONE CUISINE
        // if(cusineTypes.length >= 1){
        //     filteredMarkers = filteredMarkers.filter(x => cusineTypes.includes(x.Cuisine_Type));
        // }

        //MULTIPLE CUISINES
        //Array for holding the specials object Ids which are are used to filter out all the specials which are not allowed to be displayed in respect to cuisine type
        var specialObjectIdsCuisinesMarkers = [];
        //Array for holding temp specials that are allowed to be shown
        var tempSpecialsCuisinesMarkers = [];
        //For every establishment
        for(var i=0;i<filteredMarkers.length;i++){
            //Hold the establishment's cuisines if contains more than two
            var establishemntsMultiCuisinesMarkers = [];

            //If Cuisine_Type contains two Cuisines
            if(filteredMarkers[i].Cuisine_Type.includes(", ")){
                //Store the multi Cuisine into a string
                var tempCuisineMarkers = filteredMarkers[i].Cuisine_Type;
                //console.log(tempCuisine);
                //Split the string into a temp array
                var tempCuisineArrMarkers = tempCuisineMarkers.split(", ");
                //Push each element in the array into the establishemntsMultiCuisines array
                var e=0;
                var arrLene = tempCuisineArrMarkers.length;
                for(e;e<arrLene;e++){
                    establishemntsMultiCuisinesMarkers.push(tempCuisineArrMarkers[e]);
                }
                //Japanese and Chinese as two elements in an array
                //  console.log(establishemntsMultiCuisines);
                // console.log(cusineTypes);
                //suburbCuisines.push(tempCuisineArr);
            }
            else{
                establishemntsMultiCuisinesMarkers.push(filteredMarkers[i].Cuisine_Type);
            }
            //Print out all the cuisines in each establishment
            //console.log(establishemntsMultiCuisines);
            //console.log(cusineTypes);
            //Determine if the cuisines of each establishment includes any of the cuisines in the filter
            // var n = establishemntsMultiCuisines.includes("Japanese", "Chinese");
            //For each cuisineType filter option

            for(var p=0;p<cusineTypes.length;p++){
                //console.log(cusineTypes[p]);
                //For each of the establishment's cuisines
                //for(var c=0;c<establishemntsMultiCuisines.length;c++){
                    //var n = establishemntsMultiCuisines.includes(cusineTypes[p]);
                    //console.log(n);
                    if(establishemntsMultiCuisinesMarkers.includes(cusineTypes[p]) == true){ //if(n == true)
                        //Save the allowed specials
                        tempSpecialsCuisinesMarkers.push(filteredMarkers[i]);
                        //Save the special's object Id
                        specialObjectIdsCuisinesMarkers.push(filteredMarkers[i].objectId);
                    }
                //}
            }
        }

        //Display the establishments filtered by cuisine type
        console.log(tempSpecialsCuisinesMarkers);
        console.log(cusineTypes);
        console.log(specialObjectIdsCuisinesMarkers);
        //TODO - perhaps remove duplicate elements by object ID

        if(cusineTypes.length >= 1){
             filteredMarkers = filteredMarkers.filter(x => specialObjectIdsCuisinesMarkers.includes(x.objectId));
        }

        //MARKERS - Filter filteredEstablishments based on the special type type filter
        if(typeOfSpecials.length >= 1){
            filteredMarkers =
            filteredMarkers.reduce( (result, e) => {
                const len =
                    e.establishmentSpecials
                    .filter((x) => typeOfSpecials.includes(x.Type_Of_Special));

                if(len.length > 0)
                    return [ ...result, {...e, establishmentSpecials: len}];

                return result;
            }, []);
        }

       //console.log(filteredMarkers);

            initMap();

            // //Map options - zoom and center
            // var options = {
            //     zoom: 13,
            //     center: {lat: lat, lng: lng} //lat -36.8785  lng 174.7633
            // }


            // console.log("8. Start print markers");
            // //log markers
            // for(var i=0;i<masterMarkers.length;i++){
            //     console.log(masterMarkers[i]);
            // }
            // console.log("9. End print markers");


            // //Initialise the map object
            // var map = new
            // google.maps.Map(document.getElementById('rpGoogleMap'), options);

            // //Loop through 'markers' array and add markers to map
            // for(var i=0;i<filteredMarkers.length;i++){ //markers
            //     //Add marker
            //     addMarker(filteredMarkers[i]); //markers
            // }

            // var activeInfoWindow;
            // //Function to add a marker
            // function addMarker(props){
            //     //Initialise a marker object
            //     var marker = new google.maps.Marker({
            //     position:props.coords,
            //     map:map,
            //     //Custom establishment and special data for filtering
            //     Cuisine_Type:props.Cusine_Type,
            //     establishmentSpecials:props.establishmentSpecials,
            //     //category:props.category,
            //     //establishment_type:props.establishment_type,
            //     //type_of_special:props.type_of_special
            //     });

            //     //Check for custon icon
            //     if(props.iconImage){
            //     //Set icon image
            //     marker.setIcon(props.iconImage);
            //     }

            //     //Check content
            //     if(props.content){
            //         //Initialise a window/content object
            //         var infoWindow = new google.maps.InfoWindow({
            //             content: props.content
            //         });
            //         marker.addListener('click', function(){
            //             if (activeInfoWindow) { activeInfoWindow.close();}
            //             infoWindow.open(map, marker);
            //             activeInfoWindow = infoWindow;
            //         });
            //     }
            // }

        }
    }

    //Function to show the list
    function btnShowList(){
        //Disable map
        document.getElementById("rpGoogleMap").style.display = "none";
        //Enable list
        document.getElementById("rpList").style.display = "block";
        //Enable the filters
        // document.getElementById("daysOfWeekFilter").disabled = false;
        // document.getElementById("timePeriodStartFilter").disabled = false;
        // document.getElementById("timePeriodEndFilter").disabled = false;
        // document.getElementById("specialCategoryFilter").disabled = false;
        document.getElementById("cusineTypeFilter").disabled = false;
        $('select').formSelect();
        //Apply filter if on establishment page
        if(!document.getElementById('rpNumOfSpecialsFound').innerHTML.includes("Special")){
            console.log("Apply filter because on establishment page");
        }
     }

     //Function to show the map
     function btnShowMap(){
        //Disable list
        document.getElementById("rpList").style.display = "none";
        //Enable map
        document.getElementById("rpGoogleMap").style.display = "block";
        //Disable the filters
        // document.getElementById("daysOfWeekFilter").disabled = true;
        // document.getElementById("timePeriodStartFilter").disabled = true;
        // document.getElementById("timePeriodEndFilter").disabled = true;
        // document.getElementById("specialCategoryFilter").disabled = true;
        // document.getElementById("cusineTypeFilter").disabled = true;
        // $('select').formSelect();
        //Clear the markers
        //clearMarkers();
        //deleteMarkers(); //How can you set the map it the map isn't initaliosed?
        //Apply filters
        applyFilters();
    }


    //Function to get unique values
    function onlyUnique(value, index, self) {
        return self.indexOf(value) === index;
    }

    //Function to add a cell top
    function addCellTop(tr, val, id) {
        var td = document.createElement('td');

        //td.id = id;
        td.innerHTML = val;
        td.colSpan = 2;
        td.classList.add("cellTopCSS"); //tbl-update
        tr.appendChild(td)
    }

    //Function to add a cell
    function addCell(tr, val, id) {
        var td = document.createElement('td');

        //td.id = id;
        td.innerHTML = val;
        td.classList.add("cellCSS"); //tbl-update
        tr.appendChild(td)
    }

    //Function to add a cell bottom
    function addCellBottom(tr, val, id) {
        var td = document.createElement('td');

        //td.id = id;
        td.innerHTML = val;
        td.classList.add("cellBottomCSS"); //tbl-update
        tr.appendChild(td)
    }
    //Function to add a row top
    function addRowTop(tbl, val_1, id_1) {
        var tr = document.createElement('tr');
        tr.id = id_1;


        addCellTop(tr, val_1);
        // addCell(tr, val_2);
        //addCellRight(tr, val_3, id_3, name_3);
        //addCellRight(tr, val_4, id_4, name_4);

        tbl.appendChild(tr)
    }

    //Function to add a row
    function addRow(tbl, val_1, val_2, id_1) {
        var tr = document.createElement('tr');
        tr.id = id_1;


        addCell(tr, val_1);
        addCell(tr, val_2);
        //addCellRight(tr, val_3, id_3, name_3);
        //addCellRight(tr, val_4, id_4, name_4);

        tbl.appendChild(tr)
    }

    //Function to add a row bottom
    function addRowBottom(tbl, val_1, val_2, id_1) {
        var tr = document.createElement('tr');
        //tr.classList.add("rowBottomCSS");
        tr.id = id_1;

        addCellBottom(tr, val_1);
        addCellBottom(tr, val_2);
        //addCellRight(tr, val_3, id_3, name_3);
        //addCellRight(tr, val_4, id_4, name_4);

        tbl.appendChild(tr)
    }

    //Function for day abbreviations
    // function daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu){
    //     for(var g=0; g<days.length; g++){
    //         //If monday
    //         if(days[g] == "Monday"){
    //             // $('#M' + i).addClass('daysAbbreviated');
    //             // var div = $("#M")
    //             // div.classList.add("daysAbbreviated");
    //             daysM  = daysM.fontcolor("#FF3399");
    //             console.log("???");
    //             // daysM = "<b>" + daysM  + " " + "</b>";
    //         }else if(days[g] == "Tuesday"){//If tuesday
    //             daysT  = daysT.fontcolor("#FF3399");
    //             // daysT = "<b>" + daysT + " " + "</b>";
    //         }else if(days[g] == "Wednesday"){//If wednesday
    //             daysW  = daysW.fontcolor("#FF3399");
    //             // daysW = "<b>" + daysW + " " + "</b>";
    //         }else if(days[g] == "Thursday"){//If thursday
    //             daysTh  = daysTh.fontcolor("#FF3399");
    //             // daysTh = "<b>" + daysTh + " " + "</b>";
    //         }else if(days[g] == "Friday"){//If friday
    //             daysF  = daysF.fontcolor("#FF3399");
    //             // daysF = "<b>" + daysF + " " + "</b>";
    //         }else if(days[g] == "Saturday"){//If saturday
    //             daysS  = daysS.fontcolor("#FF3399");
    //             // daysS = "<b>" + daysS + " " + "</b>";
    //         }else if(days[g] == "Sunday"){//If sunday
    //             daysSu = daysSu.fontcolor("#FF3399");
    //             // daysSu = "<b>" + daysSu + " " + "</b>";
    //         }
    //     }
    // }

    // //Function to view an establishment page
    // function viewEstablishmentPage(){
    //     console.log("View establishment page button clicked");
    //     //console.log(this.value);
    //     //Get the object ID
    //     var objectId = $(this).attr("name");
    //     console.log(objectId);
    //     //name=\"filteredEstablishments[i].objectId\"
    // }

    //Function to view an establishment page
    $(document).on('click','#viewEstablishmentPage',function(){
        //Get the objectId of the establishment clicked on
        var objectId = $(this).attr('data-id');
        //console.log("Object ID to find:" + objectId);

        //Get the table of the establishment
        table = document.getElementById("myTable" + objectId);

        var i=0
        var arrLen = masterEstablishments.length;
        //For every establishment
        for(i;i<arrLen;i++){
            //If the establishment that was clicked on is found in the array
            if(objectId == masterEstablishments[i].objectId){
                //Display the establishment details
                document.getElementById('rpList').innerHTML =
                "<div class=\"establishment-wrapper\">" + //'<a href="establishment.html">' +
                '<img class="rpImage" src="' + masterEstablishments[i].Image + '"' + '>'// + '</a>'
                +  "<br>" +
                "<b>" + masterEstablishments[i].Name + "</b>" + "<br>" +
                masterEstablishments[i].Cuisine_Type + "<br>" +
                masterEstablishments[i].objectId + "<br>" +
                masterEstablishments[i].Address + "<br>" + "<br>" +
                "</div>";   

                //Create a table for the establishment's specials
                document.getElementById('rpList').innerHTML +=

                //Table
                "<div class=\"tbl-wrapper\" >" +
                    "<table id='tbl' class=\"striped\">" + //class=\"striped\" //border=5
                        "<colgroup>" +
                            "<col span=\"1\" class=\"tbl-special\">" +
                            "<col span=\"1\" class=\"tbl-days\">" +
                        "</colgroup>" +
                        "<thead>" +
                            "<tr>" +
                            "<th class=\"tbl-special-th\">" + "Special" + "</th>" +
                            "<th class=\"tbl-days-th\">" + "Days" + "</th>" +
                            "</tr>" +
                            "</thead>" +
                            "<tbody id=\"myTable" + i + "\"" + ">" + "</tbody>" +
                    "</table>" +
                "</div>";

                //Array to hold the special objectIds of the establishment on the filtered List
                var filteredSpecials = [];
                var a=0;
                var tableRows = table.rows.length;
                //For each special in the filtered list
                for(a;a<tableRows;a++){
                    filteredSpecials.push(table.rows[a].id);
                    a++
                }
                //Print filtered special objectIds
                console.log("Object IDs:");
                console.log(filteredSpecials);

                //Array for holding the special objects instead of just the special objectId's
                var filteredSpecialsObjects = [];

                //Array clone of masterEstablishments[i]
                var establishment = masterEstablishments[i];
                console.log("Establishment");
                console.log(establishment);

                
                //Array to hold all the specials in the establishment
                var establishementSpecials = [];
                var s=0;
                var estSpecialLen = establishment.establishmentSpecials.length;
                console.log("Establishment's number of specials: " + estSpecialLen);
                //For every special in the establishment store the special
                for(var s=0;s<estSpecialLen;s++){
                    establishementSpecials.push(establishment.establishmentSpecials[s]);

                    // //Convert the filteredSpecials array of special objectIds to specials while we are looping through the establishment's specials
                    // //For all the objectIds of the filteredSpecials
                    // for(var t=0;t<filteredSpecials.length;t++){
                    //     //If an objectId is the same as the ojectId in the establishment's specials
                    //     if(filteredSpecials[t] == masterEstablishments[i].establishmentSpecials[s].objectId){
                    //         //Save this special in object for
                    //         filteredSpecialsObjects.push(masterEstablishments[i].establishmentSpecials[s]);
                    //     }
                    // }

                }
                console.log("Establishment's specials: ");
                console.log(establishementSpecials);

                //Order 'filteredSpecialsObjects' and 'otherEstSpecials' by Start time within Category
                var ordering = {}, // map for efficient lookup of sortIndex
                sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
                for (var z=0; z<sortOrder.length; z++)
                    ordering[sortOrder[z]] = z;

                //Filter the establishment's specials, leaving only those that are not in the filtered list
                var otherEstSpecials = establishementSpecials.filter(e => !filteredSpecials.includes(e.objectId));
                //Sort otherEstSpecials by Breakfast, Lunch, Dinner, Happy Hour
                otherEstSpecials.sort( function(a, b) {
                    return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                });    
                console.log("Sorted - Other establishment specials: ");
                console.log(otherEstSpecials);

                //Filter the Establishment's Specials, leaving only those that are in the filtered list
                var filteredSpecialsObjects = establishementSpecials.filter(e => filteredSpecials.includes(e.objectId));
                //Sort filteredSpecialsObjects by Breakfast, Lunch, Dinner, Happy Hour
                filteredSpecialsObjects.sort( function(a, b) {
                    return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                });      
                console.log("Sorted - establishment specials");
                console.log(filteredSpecialsObjects);


                // //Convert special objectIds to special objects
                // //For every special in the establishment store the special
                // for(var s=0;s<estSpecialLen;s++){

                //     //For all the special objectIds
                //     for(var t=0;t<filteredSpecials.length;t++){
                //         if(filteredSpecials[t] == masterEstablishments[i].establishmentSpecials[s].objectId){
                //             //console.log(filteredSpecials[t]);
                //             console.log(masterEstablishments[i].establishmentSpecials[s]);
                //             filteredSpecialsObjects.push(masterEstablishments[i].establishmentSpecials[s]);
                //         }
                //     }
                // }

                // //Sort filteredSpecialsObjects by Breakfast, Lunch, Dinner, Happy Hour
                // filteredSpecialsObjects.sort( function(a, b) {
                //     return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                // });        

                //Print filtered special objects
                // console.log(filteredSpecialsObjects);

                //Filter the Establishment's Specials, leaving only those that are not in the filtered list
                // var otherEstSpecials = establishementSpecials.filter(e => !filteredSpecials.includes(e.objectId));
                //Print the other establishment special objects
                //console.log(otherEstSpecials);

                // //Order 'otherEstSpecials' by Start time within Category
                // var ordering = {}, // map for efficient lookup of sortIndex
                // sortOrder = ['Breakfast Special','Lunch Special','Dinner Special', 'Happy Hour'];
                // for (var z=0; z<sortOrder.length; z++)
                //     ordering[sortOrder[z]] = z;

                // //Sort otherEstSpecials by Breakfast, Lunch, Dinner, Happy Hour
                // otherEstSpecials.sort( function(a, b) {
                //     return (ordering[a.Category] - ordering[b.Category]) || a.Start_Time.localeCompare(b.Start_Time); //Description
                // });          

                // //Add the otherEstSpecials array elements to the filteredSpecialsObjects
                // for(var y=0;y<otherEstSpecials.length;y++){
                //     //Add identifier to the first element
                //     if(y==0){
                //         otherEstSpecials[y].identify = 'yes';
                //     }
                //     //Identify the other establishment's specials
                //     //Push each element to the filteredSpecials array
                //     filteredSpecialsObjects.push(otherEstSpecials[y]);
                // }

                // //Print all the establishment's specials with the filtered special objects display first
                // console.log(filteredSpecialsObjects);

                // //For every special in the filteredSpecialsObjects array
                // for(var j=0;j<filteredSpecialsObjects.length;j++){
                //     //Get the table
                //     var tbl = document.getElementById('myTable' + i);

                //     //Covert days of week to MTWTFSS
                //     var days = [];
                //     days = filteredSpecialsObjects[j].Days_Of_Week.split(', ');

                //     var daysM = "M ";
                //     var daysT= "T ";
                //     var daysW = "W ";
                //     var daysTh = "T ";
                //     var daysF = "F ";
                //     var daysS = "S ";
                //     var daysSu = "S";

                //     //For every letter in the form 0,1,2,3,4,5,6, e.g 2, 5 and 6 (Wednesday, Saturday and Sunday)
                //     //daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu);
                //     for(var g=0; g<days.length; g++){
                //         //If monday
                //         if(days[g] == "Monday"){
                //             // $('#M' + i).addClass('daysAbbreviated');
                //             // var div = $("#M")
                //             // div.classList.add("daysAbbreviated");
                //             daysM  = daysM.fontcolor("#FF3399");
                //             // daysM = "<b>" + daysM  + " " + "</b>";
                //         }else if(days[g] == "Tuesday"){//If tuesday
                //             daysT  = daysT.fontcolor("#FF3399");
                //             // daysT = "<b>" + daysT + " " + "</b>";
                //         }else if(days[g] == "Wednesday"){//If wednesday
                //             daysW  = daysW.fontcolor("#FF3399");
                //             // daysW = "<b>" + daysW + " " + "</b>";
                //         }else if(days[g] == "Thursday"){//If thursday
                //             daysTh  = daysTh.fontcolor("#FF3399");
                //             // daysTh = "<b>" + daysTh + " " + "</b>";
                //         }else if(days[g] == "Friday"){//If friday
                //             daysF  = daysF.fontcolor("#FF3399");
                //             // daysF = "<b>" + daysF + " " + "</b>";
                //         }else if(days[g] == "Saturday"){//If saturday
                //             daysS  = daysS.fontcolor("#FF3399");
                //             // daysS = "<b>" + daysS + " " + "</b>";
                //         }else if(days[g] == "Sunday"){//If sunday
                //             daysSu = daysSu.fontcolor("#FF3399");
                //             // daysSu = "<b>" + daysSu + " " + "</b>";
                //         }
                //     }

                //     //Fill table
                //     //If start displaying the other establishment's specials
                //     if(filteredSpecialsObjects[j].identify == "yes"){
                //         console.log(filteredSpecialsObjects[j].Description);
                //         addRowTop(tbl, "Other specials on offer", filteredSpecialsObjects[j].objectId);
                //         addRow(tbl, "<div class=\"category\">" + filteredSpecialsObjects[j].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredSpecialsObjects[j].Start_Time) + " - " + tConvert(filteredSpecialsObjects[j].End_Time) + "</div>", filteredSpecialsObjects[j].objectId);
                //         addRowBottom(tbl, filteredSpecialsObjects[j].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredSpecialsObjects[j].objectId);    
                //     }else if(j == 0){
                //         addRowTop(tbl, "Specials matching your search criteria", filteredSpecialsObjects[j].objectId);
                //         addRow(tbl, "<div class=\"category\">" + filteredSpecialsObjects[j].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredSpecialsObjects[j].Start_Time) + " - " + tConvert(filteredSpecialsObjects[j].End_Time) + "</div>", filteredSpecialsObjects[j].objectId);
                //         addRowBottom(tbl, filteredSpecialsObjects[j].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredSpecialsObjects[j].objectId);    
                //     }else{
                //         addRow(tbl, "<div class=\"category\">" + filteredSpecialsObjects[j].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(filteredSpecialsObjects[j].Start_Time) + " - " + tConvert(filteredSpecialsObjects[j].End_Time) + "</div>", filteredSpecialsObjects[j].objectId);
                //         addRowBottom(tbl, filteredSpecialsObjects[j].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", filteredSpecialsObjects[j].objectId);    
                    
                //     }
                // }
                
                
                // //For every special
                // for(var a=0;a<masterEstablishments[i].establishmentSpecials.length;a++){

                //     //Get the table
                //     var tbl = document.getElementById('myTable' + i);

                //     //Covert days of week to MTWTFSS
                //     var days = [];
                //     days = masterEstablishments[i].establishmentSpecials[a].Days_Of_Week.split(', ');

                //     var daysM = "M ";
                //     var daysT= "T ";
                //     var daysW = "W ";
                //     var daysTh = "T ";
                //     var daysF = "F ";
                //     var daysS = "S ";
                //     var daysSu = "S";

                //     //For every letter in the form 0,1,2,3,4,5,6, e.g 2, 5 and 6 (Wednesday, Saturday and Sunday)
                //     //daysAbbreviated(days, daysM, daysT, daysW, daysTh, daysF, daysS, daysSu);
                //     for(var g=0; g<days.length; g++){
                //         //If monday
                //         if(days[g] == "Monday"){
                //             // $('#M' + i).addClass('daysAbbreviated');
                //             // var div = $("#M")
                //             // div.classList.add("daysAbbreviated");
                //             daysM  = daysM.fontcolor("#FF3399");
                //             // daysM = "<b>" + daysM  + " " + "</b>";
                //         }else if(days[g] == "Tuesday"){//If tuesday
                //             daysT  = daysT.fontcolor("#FF3399");
                //             // daysT = "<b>" + daysT + " " + "</b>";
                //         }else if(days[g] == "Wednesday"){//If wednesday
                //             daysW  = daysW.fontcolor("#FF3399");
                //             // daysW = "<b>" + daysW + " " + "</b>";
                //         }else if(days[g] == "Thursday"){//If thursday
                //             daysTh  = daysTh.fontcolor("#FF3399");
                //             // daysTh = "<b>" + daysTh + " " + "</b>";
                //         }else if(days[g] == "Friday"){//If friday
                //             daysF  = daysF.fontcolor("#FF3399");
                //             // daysF = "<b>" + daysF + " " + "</b>";
                //         }else if(days[g] == "Saturday"){//If saturday
                //             daysS  = daysS.fontcolor("#FF3399");
                //             // daysS = "<b>" + daysS + " " + "</b>";
                //         }else if(days[g] == "Sunday"){//If sunday
                //             daysSu = daysSu.fontcolor("#FF3399");
                //             // daysSu = "<b>" + daysSu + " " + "</b>";
                //         }
                //     }

                //     //Fill table
                //     addRow(tbl, "<div class=\"category\">" + masterEstablishments[i].establishmentSpecials[a].Category.replace("Special", "") + "</div>", "<div class=\"time-period\">" + tConvert(masterEstablishments[i].establishmentSpecials[a].Start_Time) + " - " + tConvert(masterEstablishments[i].establishmentSpecials[a].End_Time) + "</div>", masterEstablishments[i].establishmentSpecials[a].objectId);
                //     addRowBottom(tbl, masterEstablishments[i].establishmentSpecials[a].Description, "<div class=\"daysAbbreviated\">" + daysM + daysT + daysW + daysTh + daysF + daysS + daysSu + "</div>", masterEstablishments[i].establishmentSpecials[a].objectId);
                // }

                //Display the name of the establishment number of specials found
                document.getElementById('rpNumOfSpecialsFound').innerHTML = masterEstablishments[i].Name;// + "Found " + "'" + numSpecials + "'" + " matching Drink specials";
            }
        }
        //Re-direct to the establishment page
    });

     //Function to research a suburb
     function research(){
        //Set Initial Search as false
        initialSearch = false;
         //Re-assign suburb
         //suburb = document.getElementById('rpReSearchInputDiv').value;
         suburb = document.getElementById("rpReSearchInputDiv").value;

        //Store the suburb in localStorage
        localStorage.setItem("usersSuburb", suburb);

        //Reset the establishments and markers
        masterEstablishments = [];
        masterMarkers = [];

        //Re-load the page
        pageOnLoad();

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

    //Function to test
    function testing(){
        console.log(filteredMarkers);
        setMapOnAll(null);
        //setMapOnAll(null);
        // function setMapOnAll(map1) {
        //     for (var i = 0; i < filteredMarkers.length; i++) {
        //       filteredMarkers[i].setMap(map1);
        //     }
        //   }
        //   setMapOnAll(map);
        // console.log(filteredMarkers);
        //filteredMarkers = [];
    }

      // Sets the map on all markers in the array.
      function setMapOnAll(map) {
        for (var i = 0; i < filteredMarkers.length; i++) {
            console.log(filteredMarkers[i].coords.lat);
            filteredMarkers.setMap(map);
            // filteredMarkers[i].coords.lat.setMap(map);
            // filteredMarkers[i].coords.lng.setMap(map);
        }
      }




