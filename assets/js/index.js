var queryString = document.location.search;
var currentWeatherEl = document.querySelector("#current-weather");
var previousCitiesEl = document.querySelector("#previous-cities");

//current weather elements
var cityTitleEl = document.querySelector("#cityTitleEl");
var tempEl = document.querySelector("#tempEl");
var windEl = document.querySelector("#windEl");
var humidityEl = document.querySelector("#humidityEl");
var uvEl = document.querySelector("#uvEl");
var iconEl = document.querySelector("#iconEl");

//get location, needs to be city comma state (only US right now)
var getLocationName = function () {
  var queryString = document.location.search;
  var locationName = queryString.split("=")[1];

  if (locationName) {
    previousCitiesEl.textContent = locationName;
    getLocationWeather(locationName);
  }
};

//take city and state from input and add to api url
//error handling for state?
var getLocationWeather = function (location) {
  //imperial units
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&units=imperial&appid=8b56b9813dea6c61e27469e004a1b484";
  //need the following info: temp (main.temp), wind(wind.speed), humidity(main.humidity), UV index?, icon (weather.icon)
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data);
    });
  });
};

var displayWeather = function (weather) {
var icon = document.createElement('img');
icon.src = "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png"
iconEl.appendChild(icon);

cityTitleEl.textContent = weather.name;
tempEl.innerHTML = "Temp: " + weather.main.temp + " &#8457;";
windEl.innerHTML = "Wind: " + weather.wind.speed + " MPH";
humidityEl.innerHTML = "Humidity: " + weather.main.humidity + "%";
//need to get UV index
console.log(weather.weather[0].icon);
}
getLocationName();
