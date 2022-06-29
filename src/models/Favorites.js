import escape from 'lodash.escape';

export default class Favorites {
  constructor() {
    this.favoritesSelect = document.querySelector('.favorites__select');
    this.citySection = document.querySelector('.city');
  }

  createCitySection(name, lat, lon) {
    this.citySection.innerHTML = '';

    const cityNameTitle = document.createElement('h2');
    cityNameTitle.classList = 'city__name';
    cityNameTitle.textContent = name;
    this.citySection.append(cityNameTitle);

    const cityButton = document.createElement('button');
    cityButton.classList = 'city__btn';

    this.assignButtonContent(name, cityButton);
    cityButton.addEventListener('click', () => {
      if (!this.isFavorite(name)) {
        this.addToFavorites(name, lat, lon);
      } else {
        this.removeFromFavorites(name);
      }
      this.assignButtonContent(name, cityButton);
    });

    this.citySection.append(cityButton);
  }

  assignButtonContent(name, btn) {
    const isFavorite = this.isFavorite(name)
    btn.textContent = isFavorite ? 'remove' : 'add'
  }

  isFavorite(city) {
    return this.getCity(city) !== undefined
  }

  getCity(cityName) {
    const favorites = this.getFavorites()
    return favorites.find(city => city.name === cityName)
  }

  addToFavorites(name, lat, lon) {
    const favorites = this.getFavorites();

    localStorage.setItem('favorites', JSON.stringify([
      ...favorites,
      { name, lat, lon }
    ]));

    this.createOption(name);
  }

  getFavorites() {
    const favorites = localStorage.getItem('favorites')
    return favorites ? JSON.parse(favorites) : []
  }

  createOption(cityName) {
    const option = document.createElement('option');
    option.classList = `favorites__option`;
    option.textContent = cityName;
    option.value = escape(cityName);
    this.favoritesSelect.append(option);
  }

  removeFromFavorites(name) {
    const favorites = this.getFavorites();

    localStorage.setItem('favorites',
      JSON.stringify(favorites.filter((favorite) => favorite.name !== name)));

    this.removeOption(name);
  }

  removeOption(cityName) {
    document.querySelector(`.favorites__option[value='${escape(cityName)}']`).remove();
  }

  createFavoritesSelect() {
    this.createOption('favorites');
    const favorites = this.getFavorites();

    favorites.map(favorite => {
      this.createOption(favorite.name);
    });
  }

  getCityLocation(cityName) {
    const city = this.getCity(cityName);
    return {
      lat: city.lat,
      lon: city.lon
    }
  }
}
