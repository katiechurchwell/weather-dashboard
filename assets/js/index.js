//containers
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

//search history
var keyCounter = localStorage.length;
var historyArray = [];

//submit city
var input = document.querySelector("#city");
var searchButton = document.querySelector("#search");
searchButton.addEventListener("click", function () {
  if (input.value) {
    forecastEl.innerHTML = "";
    getLocationWeather(input.value);
    searchHistory(input.value);
  } else {
    alert("Invalid entry");
  }
});

//create search history
var searchHistory = function (city) {
  previousCitiesEl.innerHTML = "";

  if (city != null) {
    localStorage.clear();
    historyArray.push(city);
    for (var i = 0; i < historyArray.length; i++) {
      localStorage.setItem(localStorage.length+1, historyArray[i]);
    }
  }

  for (var i = 0; i < 5; i++) {
    if (localStorage[localStorage.length-[i]] != null) {
      var searchHistoryBtn = document.createElement("button");
      previousCitiesEl.prepend(searchHistoryBtn);
      searchHistoryBtn.textContent = localStorage[localStorage.length-[i]];
      searchHistoryBtn.addEventListener("click", function (event) {
        forecastEl.innerHTML = "";
        getLocationWeather(event.target.textContent);
      });
    }
  }
};

//take city for Current Weather API url
var getLocationWeather = function (location) {
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
  keyCounter++;
  //today
  let today = new Date().toLocaleDateString();

  //icon
  icon.src =
    "http://openweathermap.org/img/wn/" + weather.weather[0].icon + "@2x.png";
  iconEl.appendChild(icon);
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

      //five day forecast
      var forecastArray = weather.daily;

      for (var i = 0; i < 5; i++) {
        //get future dates
        Date.prototype.addDays = function (days) {
          var date = new Date(this.valueOf());
          date.setDate(date.getDate() + days);
          return date;
        };
        var date = new Date();
        var dateAddition = date.addDays(i + 1);
        var dateFormat = dateAddition.toLocaleDateString();

        //cards
        var cardContainer = document.createElement("div");
        cardContainer.setAttribute("class", "forecast");
        forecastEl.appendChild(cardContainer);
        cardContainer.innerHTML = dateFormat;

        //temp
        var tempContainer = document.createElement("div");
        cardContainer.appendChild(tempContainer);
        var dailyTemp = forecastArray[i].temp.day;
        tempContainer.innerHTML = "Temp: " + dailyTemp + " &#8457;";

        //icon
        var iconContainer = document.createElement("div");
        cardContainer.appendChild(iconContainer);
        var forecastIcon = document.createElement("img");
        iconContainer.appendChild(forecastIcon);
        forecastIcon.src =
          "http://openweathermap.org/img/wn/" +
          forecastArray[i].weather[0].icon +
          "@2x.png";

        //wind
        var windContainer = document.createElement("div");
        cardContainer.appendChild(windContainer);
        var dailyWind = forecastArray[i].wind_speed;
        windContainer.innerHTML = "Wind: " + dailyWind + " MPH";

        //humidity
        var humidityContainer = document.createElement("div");
        cardContainer.appendChild(humidityContainer);
        var dailyHumidity = forecastArray[i].humidity;
        humidityContainer.innerHTML = "Humidity: " + dailyHumidity + "%";
      }
    });
  });
};

document.onload = searchHistory();
