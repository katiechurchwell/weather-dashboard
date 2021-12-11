var queryString = document.location.search;
var currentWeatherEl = document.querySelector('#current-weather');

//get location
var getLocationName = function() {
    var queryString = document.location.search;
    var locationName = queryString.split("=")[1];
    
    if (locationName) {
        currentWeatherEl.textContent = locationName;
        getLocationWeather(locationName); //not defined yet
      } else {
        document.location.replace("./index.html");
      }
}

//take city and state from input and add to api url
//error handling for state?
// var apiUrl = "https://api.openweathermap.org/geo/1.0/direct?q=" + City "," + State ",USA&limit=1&appid=8b56b9813dea6c61e27469e004a1b484";


//make fetch request to url

getLocationName();