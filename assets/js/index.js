//global variables
var queryString = document.location.search;
var currentWeatherEl = document.querySelector("#current-weather");
var previousCitiesEl = document.querySelector("#previous-cities");
var forecastEl = document.querySelector("#forecast");

//current weather data elements
var cityTitleEl = document.querySelector("#cityTitleEl");
var tempEl = document.querySelector("#tempEl");
var windEl = document.querySelector("#windEl");
var humidityEl = document.querySelector("#humidityEl");
var uvEl = document.querySelector("#uvEl");
var iconEl = document.querySelector("#iconEl");
var icon = document.createElement("img");

//search
var input = document.querySelector("#city");
var searchHistoryArray = [];

//prevent refresh
var form = document.getElementById("search");
form.addEventListener("click", function (event) {
  getLocationWeather(input.value);
});

//take city for Current Weather API url
var getLocationWeather = function (location) {
  //set history to local storage
  searchHistoryArray.push(location);
  for (var i = 0; i < searchHistoryArray.length; i++) {
    localStorage.setItem("city", searchHistoryArray[i]);
  }
  var searchHistoryBtn = document.createElement("button");
  previousCitiesEl.appendChild(searchHistoryBtn);
  searchHistoryBtn.textContent = localStorage.getItem("city");

  //API
  var apiUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    location +
    "&appid=8b56b9813dea6c61e27469e004a1b484";
  fetch(apiUrl).then(function (response) {
    response.json().then(function (data) {
      displayWeather(data);
    });
  });
};

var displayWeather = function (weather) {
  icon.src =
    "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
  iconEl.appendChild(icon);
  let today = new Date().toLocaleDateString();
  cityTitleEl.innerHTML = weather.name + " (" + today + "):";

  //take lon and lat for One Call API
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

      //UV index scale
      if (weather.current.uvi < 3) {
        uvEl.setAttribute("class", "low");
      } else if (weather.current.uvi < 6) {
        uvEl.setAttribute("class", "moderate");
      } else {
        uvEl.setAttribute("class", "severe");
      }

      // five day forecast: need date, icon, temp, wind and humidity
      var forecastArray = weather.daily;

      for (var i = 0; i < 5; i++) {
        //cards
        var cardContainer = document.createElement("div");
        forecastEl.appendChild(cardContainer);

        //temp
        var tempContainer = document.createElement("div");
        cardContainer.appendChild(tempContainer);
        var dailyTemp = forecastArray[i].temp.day;
        tempContainer.innerHTML = "Temp: " + dailyTemp + " &#8457;";

        //wind
        var windContainer = document.createElement("div");
        cardContainer.appendChild(windContainer);
        var dailyWind = forecastArray[i].wind_speed;
        windContainer.innerHTML = "Wind: " + dailyWind + "MPH";

        //humidity
        var humidityContainer = document.createElement("div");
        cardContainer.appendChild(humidityContainer);
        var dailyHumidity = forecastArray[i].humidity;
        humidityContainer.innerHTML = "Humidity: " + dailyHumidity;

        console.log(forecastArray[i]);
      }
    });
  });
};
