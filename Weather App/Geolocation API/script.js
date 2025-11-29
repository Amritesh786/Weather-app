function getLocation(){
    if(navigator.geolocation){ //Checking that wether humare browser m geolocation feature supported hai ya nahi hai.
        navigator.geolocation.getCurrentPosition(showPosition); //showPosition->Callback Function
    }
    else{
        console.log("No geolocation support");
    }
}

function showPosition(position){
    let lat=position.coords.latitude;
    let longi=position.coords.longitude;
    console.log(lat);
    console.log(longi);
}