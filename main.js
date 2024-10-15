'use strict'

// translate month number into complete date with worded month name
function hourlyTranslateMonth(datetime){
  let month = datetime.slice(5, 8);
  let result;
  switch(month){
    case '01-':
      result = datetime.slice(5).replace(month, 'january ');
      break;
    case '02-':
      result = datetime.slice(5).replace(month, 'february ');
      break;
    case '03-':
      result = datetime.slice(5).replace(month, 'march ');
      break;
    case '04-':
      result = datetime.slice(5).replace(month, 'april ');
      break;
    case '05-':
      result = datetime.slice(5).replace(month, 'may ');
      break;
    case '06-':
      result = datetime.slice(5).replace(month, 'june ');
      break;
    case '07-':
      result = datetime.slice(5).replace(month, 'july ');
      break;
    case '08-':
      result = datetime.slice(5).replace(month, 'august ');
      break;
    case '09-':
      result = datetime.slice(5).replace(month, 'september ');
      break;
    case '10-':
      result = datetime.slice(5).replace(month, 'october ');
      break;
    case '11-':
      result = datetime.slice(5).replace(month, 'november ');
      break;
    case '12-':
      result = datetime.slice(5).replace(month, 'december ');
      break;
  }
  return `today, ${result}`;
};

// translate month number into abbreviated month name
function dailyTranslateMonth(datetime){
  let result;
  let month = datetime.slice(5, 7);
  switch(month){
    case '01':
      result = datetime.slice(5).replace(month, 'jan');
      break;
    case '02':
      result = datetime.slice(5).replace(month, 'feb');
      break;
    case '03':
      result = datetime.slice(5).replace(month, 'mar');
      break;
    case '04':
      result = datetime.slice(5).replace(month, 'apr');
      break;
    case '05':
      result = datetime.slice(5).replace(month, 'may');
      break;
    case '06':
      result = datetime.slice(5).replace(month, 'jun');
      break;
    case '07':
      result = datetime.slice(5).replace(month, 'jul');
      break;
    case '08':
      result = datetime.slice(5).replace(month, 'aug');
      break;
    case '09':
      result = datetime.slice(5).replace(month, 'sep');
      break;
    case '10':
      result = datetime.slice(5).replace(month, 'oct');
      break;
    case '11':
      result = datetime.slice(5).replace(month, 'nov');
      break;
    case '12':
      result = datetime.slice(5).replace(month, 'dec');
      break;
  }
  return result;
}

// fetch from API and show data on DOM
async function showMetrics(){
  // Weather Query Selectors
  const searchQUery = document.getElementById('search').value.toLowerCase().replaceAll(',', '%2C').replaceAll(' ', '%20');
  const queryBtn = document.querySelector('.queryBtn');
  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${searchQUery}?unitGroup=metric&include=hours&key=8EUZ343G3E3T67YFRF5249MA4&contentType=json`;

  // DOM Selectors

  try{
    queryBtn.textContent = 'loading...';
    const fetched = await fetch(url);
    if(fetched.status === 200){
      queryBtn.textContent = 'done!';
    };
    const json = await fetched.json();
    console.log(json);

    // Current day's weather
    const hourlyWeather = document.body.querySelector('.hourly-weather');
    const address = document.body.querySelector('.address');
    for(let i = 0; i < 24; i++){
      let hour = hourlyWeather.querySelector(`.hour-${i}`);
      let hourlyTime = hour.querySelector('.time');
      let hourlyConditions = hour.querySelector('.conditions');
      let hourlyTempCurrent = hour.querySelector('.temp-current');
      let hourlyHumidity = hour.querySelector('.humidity');

      let data = json.days[0].hours[i];
      address.textContent = `${json.resolvedAddress}(${hourlyTranslateMonth(json.days[0].datetime)})`;
      hourlyTime.textContent = data.datetime.slice(0, -3);
      hourlyConditions.textContent = data.conditions;
      hourlyTempCurrent.textContent = parseInt(data.temp) + 'º';
      hourlyHumidity.textContent = parseInt(data.humidity) + '%';
    };

    // Rest of the week weather
    const dailyWeather = document.body.querySelector('.daily-weather');
    for(let i = 1; i < 8; i++){
      let day = dailyWeather.querySelector('.day' + i);
      let date = day.querySelector('.date');
      let tempMin = day.querySelector('.temp-min');
      let tempMax = day.querySelector('.temp-max');
      let humidity = day.querySelector('.humidity');
      let sunrise = day.querySelector('.sunrise');
      let sunset = day.querySelector('.sunset');
      let conditions = day.querySelector('.conditions');

      date.textContent = dailyTranslateMonth(json.days[i].datetime);
      conditions.textContent = json.days[i].conditions;
      tempMin.textContent = parseInt(json.days[i].tempmin) + 'º';
      tempMax.textContent = parseInt(json.days[i].tempmax) + 'º';
      humidity.textContent = parseInt(json.days[i].humidity) + '%';
      sunrise.textContent = json.days[i].sunrise.slice(0, -3);
      sunset.textContent = json.days[i].sunset.slice(0, -3);
    };

    // reveal weather results
    const revealResults = () => {
      const results = document.querySelector('.weather-results');

      if(results.classList.contains('hidden')){
        results.classList.remove('hidden');
      }
    };

    revealResults();

    // error handling
    if(fetched.status != 200){
      throw new Error(`Error: ${fetched.status}`);
    }
  } catch(e) {
    console.error(e);
  }
};

// hook showMetrics function to DOM button
const connectAPI = () => {
  const btn = document.querySelector('.queryBtn');
  btn.addEventListener('click', showMetrics);
};

connectAPI();