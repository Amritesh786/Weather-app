const userTab=document.querySelector("#userWeather");
const searchTab=document.querySelector("#searchWeather");
const weathercontainer=document.querySelector(".weathercontainer");
const grantlocationcontainer=document.querySelector(".grant-location-container");
const searchform=document.querySelector("#searchForm");
const loadingscreen=document.querySelector(".loading-screen-container");
const weatherinfo=document.querySelector(".weather-info-container");

//API Key aur Current Tab ki need hogi

let currentTab=userTab;
const API_KEY="d1845658f92b31c64bd94f06f7188c9c";
currentTab.classList.add("current-tab"); //Added Bg Color
getfromSessionStorage(); //Jab bhi application load hoga to ho skta h latitude longitude already present ho to initially ek baar fn call karni padegi agar nahi honge coordinates to current location find krega.

//Switch Tab Function-> Jis tab pe hum click karenge usko pass kar denge is function mein

function switchTab(clickedTab){
    if(clickedTab != currentTab){ //Jis tab pe ho usipe click kiya to kuch karne ki need nahi hai.
        currentTab.classList.remove("current-tab"); //Current Tab se Bg Color hatao
        currentTab = clickedTab; //Current Tab ko Clicked Tab ke equal karo
        currentTab.classList.add("current-tab"); //Current Tab mein Bg Color lagao
        
        if(!searchform.classList.contains("active")){  //Agar search form ke andar active nahi hai mtlb isko visible karvana h agar ispe click hua h bcoz jo bhi element visible ho raha h usme active vali class added hai.
            weatherinfo.classList.remove("active");
            grantlocationcontainer.classList.remove("active");
            searchform.classList.add("active");
        }
        else{
            //Pehle "Search weather" vale tab par the ab "Your weather" vale tab par jaana h.
            weatherinfo.classList.remove("active"); //Isse active class hatayi hai because search krne k baad weather info generate hota hai.
            searchform.classList.remove("active"); 
            //Ab main Your Weather pe aa gya hu to weather bhi display karna padega.
            getfromSessionStorage();  //Your Weather pe click karne pe weather apne aap aa rha mtlb coordinates mil rahe isko jo is session(humne jo tab ya window khol rakhi hai) ke storage mein stored h.
    }
}
}

userTab.addEventListener('click',()=>{
    switchTab(userTab);  //Clicked Tab ko pass karo as input parameter switchTab Function mein.
})

searchTab.addEventListener('click', ()=>{
    switchTab(searchTab);  //Clicked Tab ko pass karo as input parameter switchTab
})

function getfromSessionStorage(){ //Checks if coordinates are already present in session storage
    const localCoordinates = sessionStorage.getItem("user-coordinates"); //Session Storage mein kya koi user-coordinates naam ka item h.
    if(!localCoordinates){ //Agar coordinates nahi milte mtlb location access nahi diya
        grantlocationcontainer.classList.add("active");
    }
    else{
        const coordinates = JSON.parse(localCoordinates); //local coordinates ko json format m convert kardo
        fetchUserWeatherInfo(coordinates);
    }
}

async function fetchUserWeatherInfo(coordinates){
    const {lat,lon} = coordinates; //Fetching latitude and longitude from coordinates
     
    //make grant location container invisible
    grantlocationcontainer.classList.remove("active");

    //Loader ko visible karo
    loadingscreen.classList.add("active");

    //API Call
    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`); 
        const data= await response.json();

        //Data aa gya ab loader screen ko hata do

        loadingscreen.classList.remove("active");
        weatherinfo.classList.add("active");

        //Abhi values nahi daali hai UI mein

        renderWeatherInfo(data);
    }
    catch(error){
        loadingscreen.classList.remove("active");
        console.log("Error -> ", error);
    }
}

function renderWeatherInfo(weatherInfo){

    //Values daalne se pehle elements ko fetch karna padega

    const cityName = document.querySelector("#cityName");
    const countryIcon = document.querySelector("#countryIcon");
    const weatherDescription = document.querySelector("#weatherDescription");
    const weatherIcon = document.querySelector("#weatherIcon");
    const temperature = document.querySelector("#temperature");
    const windspeed = document.querySelector("#WindSpeed");
    const humidity = document.querySelector("#Humidity");
    const cloudiness = document.querySelector("#Cloudiness");

    //put the fetched value in UI elements

    cityName.innerText = weatherInfo?.name;
    countryIcon.src = `https://flagcdn.com/144x108/${weatherInfo?.sys?.country.toLowerCase()}.png`;
    weatherDescription.innerText = weatherInfo?.weather?.[0]?.description;
    weatherIcon.src = `http://openweathermap.org/img/w/${weatherInfo?.weather?.[0]?.icon}.png`;
    temperature.innerText = weatherInfo?.main?.temp;
    windspeed.innerText = weatherInfo?.wind?.speed;
    humidity.innerText = weatherInfo?.main?.humidity;
    cloudiness.innerText = weatherInfo?.clouds?.all;    

}

function getLocation(){
    if(navigator.geolocation){ //Checking that wether humare browser m geolocation feature supported hai ya nahi hai.
        navigator.geolocation.getCurrentPosition(showPosition); //showPosition->Callback Function
    }
    else{
        alert("No geolocation support");
    }
}

function showPosition(position){ //position coordinates as input parameter
    const userCoordinates = {
    lat:position.coords.latitude,
    lon:position.coords.longitude,
    }
    sessionStorage.setItem("user-coordinates", JSON.stringify(userCoordinates));
    fetchUserWeatherInfo(userCoordinates);
}

const grantAccessButton = document.querySelector("#grantAccess-btn");
grantAccessButton.addEventListener("click", getLocation);

const searchInput=document.querySelector("#SearchInput"); //Jo bhi input ki value denge uske liye API Call ho jayegi to humein input value nikalni h.
searchform.addEventListener("submit", (e) => {
    e.preventDefault();
    let cityName = searchInput.value;

    if(cityName === "") return;
    else SearchWeatherInfo(cityName);
})

async function SearchWeatherInfo(city) {
    loadingscreen.classList.add("active");
    weatherinfo.classList.remove("active");
    grantlocationcontainer.classList.remove("active");

    try{
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`); //API Call
        const data = await response.json();
        loadingscreen.classList.remove("active");
        weatherinfo.classList.add("active");
        renderWeatherInfo(data);
    }
    catch(error){
        console.log("error -> ", error); 
    }
}

//Optional Chaining Operator -> this operator makes easier to safely access nested properties. 
//Like humare paas ek json object hai jiske andar multiple levels mein aur json objects hai. Hum kisi json object ke andar kisi particular property ko access karna chahte hain to hum optional chaining operator ki help se kr skte h. Agar property hui to uski value mil jayegi aur agar nhi hogi to undefined dega.

//Grant Access vale button pe click karne par 2 kaam hone hain-> jis location pe ho vo find kro by using Geolocation API and then jo lat aur longi mile unhe session storage mein store kar lena.