import './css/styles.css';
import debounce from 'lodash.debounce'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from '../fetchCountries';

const DEBOUNCE_DELAY = 300;
const inputCountry = document.querySelector('#search-box'),
      countryList = document.querySelector('.country-list'),
      countryInfo = document.querySelector('.country-info');

inputCountry.addEventListener('input', 
    debounce( () => {
        const name = inputCountry.value.trim();

        if (name === '') {
             countryList.innerHTML = '' 
             countryInfo.innerHTML = ''
          }

        fetchCountries(name)
            .then((countries) => {
                countryList.innerHTML = '' 
                countryInfo.innerHTML = ''

                if (countries.length === 1) {
                    onCountryList(countries)
                    onCountryInfo(countries)
                } else if (countries.length > 10) {
                     Notify.info('Too many matches found. Please enter a more specific name.')
                } else {
                    onCountryList(countries)
                    console.log(countries)
                }
                
            })
            .catch((error) => Notify.failure(`Oops, there is no country with that name`))
        },
    DEBOUNCE_DELAY)
        
)

function onCountryList (countries) {
   return countries.forEach(({name, flags}) => {
        countryList.insertAdjacentHTML('afterbegin', 
                `
                <li class="country-list__item">
                <img class="country-list__flag" src="${flags.svg}" alt="Flag of ${name.official}" width = 30px height = 30px>
                <h2 class="country-list__name">${name.official}</h2>
                </li>
        `)
    })
}

function onCountryInfo (countries) {
    return countries.forEach(({ capital, population, languages }) => {
        
        countryInfo.insertAdjacentHTML('afterbegin', 
                `
                <ul class="country-info__list">
                <li class="country-info__item"><p><b>Capital: </b>${capital}</p></li>
                <li class="country-info__item"><p><b>Population: </b>${population}</p></li>
                <li class="country-info__item"><p><b>Languages: </b>${Object.values(languages).join(', ')}</p></li>
        </ul>
        `)
    })
}

