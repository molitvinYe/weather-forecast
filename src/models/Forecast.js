const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

export default class Forecast {
  constructor() {
    this.forecastCardSection = document.querySelector('.forecast-card');
    this.forecastSection = document.querySelector('.forecast');
  }

  createForecast(data) {
    this.forecastSection.innerHTML = '';

    data.map((dayForecast, index) => {
      const block = document.createElement('div');
      block.classList = 'forecast-block';
      this.forecastSection.append(block);

      const content = document.createElement('div');
      content.classList = 'forecast-block__content';
      block.append(content);

      const date = document.createElement('h3');
      date.classList = 'forecast-block__date';
      const datetime = new Date(dayForecast.datetime);
      date.textContent = `${days[datetime.getDay()]} ${datetime.getDate()}`
      content.append(date);

      const iconContainer = document.createElement('div');
      iconContainer.classList = 'forecast-block__icon-container';
      content.append(iconContainer);

      const icon = document.createElement('img');
      icon.classList = 'forecast-block__icon';
      icon.src = require(`../images/weather-icons/${dayForecast.weather.icon}.png`);
      iconContainer.append(icon);

      const temp = document.createElement('span');
      temp.classList = 'forecast-block__temp';
      temp.textContent = `${dayForecast.min_temp}°C - ${dayForecast.max_temp}°C`;
      content.append(temp);

      block.addEventListener('click', () => {
        this.addActiveContent(content);
        this.createForecastCard(dayForecast, datetime);
      })

      if (index === 0) {
        this.addActiveContent(content);
        this.createForecastCard(dayForecast, datetime);
      }
    });


  }

  addActiveContent(forecastContent) {
    document.querySelectorAll('.forecast-block__content--active').forEach(content => {
      content.classList.remove('forecast-block__content--active');
    })

    forecastContent.classList.add('forecast-block__content--active');
  }

  createForecastCard(forecast, date) {
    const forecastCardHtml = `
    <h3 class="forecast-card__date">${days[date.getDay()]} ${date.getDate()}</h3>
    <div class="forecast-card__icon-container">
      <img class="forecast-card__icon"'>
      <span class="forecast-card__icon-decription">
        ${forecast.weather.description}
      </span>
    </div>
    <ul class="forecast-card__list">
      <li class="forecast-card__item">
        Temperature: ${forecast.min_temp}°C - ${forecast.max_temp}°C
      </li>
      <li class="forecast-card__item">
        Feels Like: ${forecast.app_min_temp}°C - ${forecast.app_max_temp}°C
      </li>
      <li class="forecast-card__item">
        Wind speed: ${forecast.wind_spd}m/s
      </li>
      <li class="forecast-card__item">
        Verbal wind direction: ${forecast.wind_cdir_full}
      </li>
      <li class="forecast-card__item">
        Probability of Precipitation: ${forecast.pop}%
      </li>
      <li class="forecast-card__item">
        Average pressure: ${forecast.pres}mb
      </li>
      <li class="forecast-card__item">
        Average relative humidity: ${forecast.rh}%
      </li>
    </ul>`
    this.forecastCardSection.innerHTML = forecastCardHtml;

    const forecastIcon = document.querySelector('.forecast-card__icon');
    forecastIcon.src = require(`../images/weather-icons/${forecast.weather.icon}.png`);
  }
}
