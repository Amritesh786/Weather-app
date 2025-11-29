const API_KEY="d1845658f92b31c64bd94f06f7188c9c";

function renderWeatherInfo(data){
     let newPara=document.createElement('p');
     newPara.textContent=`${data?.main?.temp.toFixed(2)} °C`;
     document.body.appendChild(newPara);
}

async function getWeather(){
    try{
    let city="goa";
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`); //API Call
    const data= await response.json(); //API se jo response aayega usko json format mein convert karenge
    console.log("Weather data-> ",data);
    
    //UI update
    renderWeatherInfo(data); 
    }
    catch(error){
        console.error("Error-> ",error);
    }
}
 
async function getCustomWeatherDetails(){
    try{
    let lat=15.6333;
    let lon=18.3333;
    let result=await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`);
    let data=await result.json();
    console.log("Weather data-> ", data);
    }
    catch(error){
        console.error("Error-> ",error);
    }
}