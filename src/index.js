import { API_URL, API_KEY, GOOGLE_KEY } from '@models/constants.js';
import Forecast from '@models/Forecast.js';
import Favorites from '@models/Favorites.js';
import 'normalize.css';
import "@/styles/styles.scss";
import axios from 'axios';
import unescape from 'lodash.unescape';
import queryString from 'query-string';

class App {
  constructor() {
    this.elements = {
      input: document.querySelector('.search__input'),
      clearButton: document.querySelector('.search__input-delete'),
      favoritesSelect: document.querySelector('.favorites__select')
    };

    this.forecast = new Forecast();
    this.favorites = new Favorites();

    this.autocomplete = new google.maps.places.Autocomplete(this.elements.input);
    this.favorites.createFavoritesSelect();

    this.checkUrl();
    this.addListeners();
  }

  checkUrl() {
    if (window.location.search) {
      const search = queryString.parse(window.location.search);
      const params = { lat: search.lat, lon: search.lon };
      this.buildPageByQuery(params, search.name)
    } else {
      this.searchUserGeolocation();
    }
  }

  searchUserGeolocation() {
    navigator.geolocation.getCurrentPosition(
      place => {
        this.successSearch(place);
      }, () => {
        this.buildPageByQuery({ lat: "50.3944662", lon: "30.4911014" }, "Kyiv")
      });
  }

  successSearch(place) {
    const location = {
      lat: place.coords.latitude,
      lon: place.coords.longitude
    }

    this.getCityName(location.lat, location.lon)
      .then(name => this.buildPageByQuery(location, name))
  }


  addListeners() {
    this.autocomplete.addListener("place_changed", () => {
      this.handlePlaceChange();
    })

    this.elements.clearButton.addEventListener('click', () => {
      this.handleClearSearch();
    })


    this.elements.favoritesSelect.addEventListener('change', (e) => {
      const name = unescape(e.target.value);

      if (name !== 'favorites') {
        const location = this.favorites.getCityLocation(name);

        if (location) {
          this.buildPageByQuery(location, name);
        }
      }
    })
  }

  handlePlaceChange() {
    const place = this.autocomplete.getPlace();

    if (!place.geometry || !place.geometry.location) {
      window.alert("No details available for input: '" + place.name + "'");
      return;
    }

    const name = place.name;

    const location = {
      lat: place.geometry.location.lat(),
      lon: place.geometry.location.lng()
    }

    this.buildPageByQuery(location, name);
  }

  handleClearSearch() {
    this.elements.input.value = '';
    this.elements.input.focus();
  }

  buildPageByQuery(params, name) {
    axios.get(API_URL, { params: { ...params, key: API_KEY } })
      .then(response => {
        const data = {
          forecast: response.data.data,
          lat: response.data.lat,
          lon: response.data.lon,
        }

        this.forecast.createForecast(data.forecast);
        this.favorites.createCitySection(name, data.lat, data.lon);

        const search = queryString.stringify({ ...params, name })
        window.history.pushState({}, '', `?${search}`);

      }).catch(error => {
        window.alert(error);
      });

  }

  async getCityName(lat, lon) {
    const response = await axios.get(`https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lon}&result_type=locality&key=${GOOGLE_KEY}`);
    return response.data.results[0].address_components[0].long_name;
  }
}

window.searchForecast = () => {
  new App();
}


