var queryString = document.location.search;
var currentWeatherEl = document.querySelector("#current-weather");

//get location, needs to be city comma state (only US right now)
var getLocationName = function () {
  var queryString = document.location.search;
  var locationName = queryString.split("=")[1];

  if (locationName) {
    currentWeatherEl.textContent = locationName;
    getLocationWeather(locationName); //not defined yet
    //   } else {
    //     document.location.replace("./index.html");
    //   } //endless loop
  }
};

//take city and state from input and add to api url
//error handling for state?
var getLocationWeather = function (location) {
  var apiUrl = "api.openweathermap.org/data/2.5/weather?q=" + location + "&appid=8b56b9813dea6c61e27469e004a1b484";

  fetch(apiUrl).then(function (response){
      if (response.ok) {
          console.log(response.json());
      }
  })
}
getLocationName();
