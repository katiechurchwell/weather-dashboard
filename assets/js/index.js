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

//get location
var getLocationName = function () {
  var queryString = document.location.search;
  var locationName = queryString.split("=")[1];

  if (locationName) {
    previousCitiesEl.textContent = locationName;
    getLocationWeather(locationName);
    //add to local storage
  }
};

//take city for Current Weather API url
var getLocationWeather = function (location) {
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=8b56b9813dea6c61e27469e004a1b484";
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data);
      console.log("original", data);
    });
  });
};

var displayWeather = function (weather) {
  var icon = document.createElement("img");
  icon.src =
    "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
  iconEl.appendChild(icon);
  cityTitleEl.textContent = weather.name;

  //take long and lat for One Call API
  var lat = weather.coord.lat;
  var lon = weather.coord.lon;
  var oneCallApiUrl =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    lon +
    "&units=imperial&appid=8b56b9813dea6c61e27469e004a1b484";

  //fetch data from One Call API for current weather
  fetch(oneCallApiUrl).then(function (response) {
    response.json().then(function (weather) {
      uvEl.innerHTML = "UV Index: " + weather.current.uvi;
      tempEl.innerHTML = "Temp: " + weather.current.temp + " &#8457;";
      windEl.innerHTML = "Wind: " + weather.current.wind_speed + " MPH";
      humidityEl.innerHTML = "Humidity: " + weather.current.humidity + "%";
    });
  });
};
getLocationName();
