//Script for when a user inputs their suburb on the landing page

//Test - establish db connection
(function (){
    const APP_ID = '073669A8-CCB7-2AED-FFEC-841A4CE5F400';
    const API_KEY = 'FAFDE171-5308-49CF-9980-AA89E4F28F0C';

    Backendless.serverURL = 'https://api.backendless.com';
    Backendless.initApp(APP_ID, API_KEY);
})();

document.addEventListener('DOMContentLoaded', function() {

        //RETRIEVE SPECIALS FROM THE DB BASED ON USER'S SUBURB
        var queryBuilder = Backendless.DataQueryBuilder.create();

        //Set the relations to get
        queryBuilder.setRelated( [ "establishmentSpecials"] );

        queryBuilder.setWhereClause( "Suburb = 'Rose Bay'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );

        Backendless.Data.of( "Establishment" ).find( queryBuilder )
        .then( function( objectArray ) {
            console.log(objectArray);

            

        })
        .catch( function( error ) {
        });
});

// Function to display the suburb entered by the user
function lpSearchSuburb(){

    //Get user's suburb
    var suburb = document.getElementById('lpInputSearchSuburb').value

    //RETRIEVE SPECIALS FROM THE DB BASED ON USER'S SUBURB
    var queryBuilder = Backendless.DataQueryBuilder.create();
    //Set the relations to get and where clause
    queryBuilder.setRelated( [ "establishmentSpecials"] );
    queryBuilder.setWhereClause( "Suburb = " + "'" + suburb + "'");//, {"suburb": suburb}; //( "Suburb = 'Rose Bay'" );

    return Backendless.Data.of( "Establishment" ).find( queryBuilder )
    .then( function( objectArray ) {
        // console.log(objectArray);
        return sessionStorage.setItem('suburbResults', JSON.stringify(objectArray));
    })
    .then(() => {
        //Store the suburb in localStorage
        localStorage.setItem("usersSuburb", suburb);

        // //Get results from Index instead
        // var objectArrayJSON = sessionStorage.getItem('suburbResults');
        // //console.log(objectArrayJSON);
        // var objectArray = JSON.parse(objectArrayJSON);
        // console.log(objectArray);

        //Simulate a mouse click:
        window.location.href = "results.html";
    })
    .catch( function( error ) {
    });


}

// window.onload = function() {

//    //Retrieve establishments from the db by creating a query
//    var queryBuilder = Backendless.DataQueryBuilder.create();

//    //Set the relations to get
//    queryBuilder.setRelated( [ "establishmentSpecials"] );

// //    //Set the WhereClause, where country is either Australia or New Zealand for the query depending on the country section selected 
// //    if(Australia == true){
// //        queryBuilder.setWhereClause( "Country = 'Australia'");
// //    }else{
// //        queryBuilder.setWhereClause( "Country = 'New Zealand'");
// //    }
   
//    //Execute the query on the Establishment table in the db
//    Backendless.Data.of( "Establishment" ).find( queryBuilder )
//    .then( function( objectArray ) {
//        console.log(objectArray);
//    })    
//   };