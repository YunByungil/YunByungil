const WEATHER_API_KEY = '80540e6226e5754431a00a82463e1695'
const WEATHER_API_k = process.env.BYUNGIL_API_KEY;
console.log("check : " + WEATHER_API_k);
const testCode = 'gd';
console.log(WEATHER_API_KEY);
console.log(testCode);
let fs = require('fs')
let formatDistance = require('date-fns/formatDistance')
let weather = require('openweather-apis')
let qty = require('js-quantities')
console.log('weather확인: ' + weather.getExclude());
const emojis = {
    '01d': '☀️',
    '02d': '⛅️',
    '03d': '☁️',
    '04d': '☁️',
    '09d': '🌧',
    '10d': '🌦',
    '11d': '🌩',
    '13d': '❄️',
    '50d': '🌫'
}

// Time working at PlanetScale
function convertTZ(date, tzString) {
    return new Date((typeof date === "string" ? new Date(date) : date).toLocaleString("en-US", {timeZone: tzString}));
}
const today = convertTZ(new Date(), "Asia/Seoul");
const todayDay = new Intl.DateTimeFormat('en-US', { weekday: 'long' }).format(today);

const psTime = formatDistance(new Date(2020, 12, 14), today, {
    addSuffix: false
})

// Today's weather
weather.setLang('en')
weather.setCoordinate(37.517235, 127.047325)
weather.setUnits('imperial')
weather.setAPPID(WEATHER_API_KEY)
console.log("체크 : " + weather.getUnits()); //
console.log(weather.getCoordinate());
console.log(weather.getCityId()); // 체크하는 곳
console.log("api : " + weather.getAPPID());
weather.getWeatherOneCall(function (err, data) {
    console.log(data);
    console.log('------');
    if (err) console.log("이거 무슨 에러야?? : "+err)

    const degF = Math.round(data.main.temp_max)
    const degC = Math.round(qty(`${degF} tempF`).to('tempC').scalar)
    const icon = data.weather[0].icon

    // const degF = 10;
    // const degC = 20;
    // const icon = 30;

    fs.readFile('template.svg', 'utf-8', (error, data) => {
        if (error) {
            console.error('templateError:' + error) // template Error
            return
        }

        data = data.replace('{degF}', degF)
        data = data.replace('{degC}', degC)
        data = data.replace('{weatherEmoji}', emojis[icon])
        data = data.replace('{psTime}', psTime)
        data = data.replace('{todayDay}', todayDay)

        data = fs.writeFile('chat.svg', data, (err) => {
            if (err) {
                console.error('chatError'+err) // chatError
                return
            }
        })
    })
})
