
const express = require('express')
const app = express();
const bodyParser = require('body-parser');
const got = require('got');
require('dotenv').config();

const myAPI = {
    CURRENT_WEATHER_CITY : "https://api.openweathermap.org/data/2.5/weather?q=",
    CURRENT_WEATHER_LAT_LON : "https://api.openweathermap.org/data/2.5/weather?lat=",
    ACCESS_TOKEN_SPOTIFY : 'https://accounts.spotify.com/api/token',
    RECOMMENDATION_SPOTIFY : "https://api.spotify.com/v1/recommendations?"
    // limit=10&seed_artists=&seed_genres=rock
}

// parse application/json
app.use(bodyParser.json())

// Open server on port 3000
app.listen(3000, () => console.log("listen at 3000"));
app.use(express.static('public')); // anything in this directory is public

// /api/open-weather/get-weather/lon-lat
app.post('/api/open-weather/get-weather/lon-lat', async (local_req, local_res) => {
    let openweather_response;
    try
    {
        openweather_response = await got.get(myAPI.CURRENT_WEATHER_LAT_LON + local_req.body.lat + "&lon=" + local_req.body.lon + "&appid=" + process.env.OPENWEATHER_SECRET);
    }
    catch (error)
    {
        return new Promise((resolve, reject) => {
           reject(new Error(error));
        });
    }

    local_res.send(openweather_response.body);
})

// /api/open-weather/get-weather/city
app.post('/api/open-weather/get-weather/city', async (local_req, local_res) => {
    let openweather_response;
    try
    {
        openweather_response = await got.get(myAPI.CURRENT_WEATHER_CITY + local_req.body.city + "&appid=" + process.env.OPENWEATHER_SECRET);
    }
    catch (error)
    {
        return new Promise((resolve, reject) => {
            reject(new Error(error));
        });
    }

    local_res.send(openweather_response.body);
})

// /api/spotify/get-access-token
app.get('/api/spotify/get-access-token', async (local_req, local_res) => {


    const auth_token = btoa(process.env.SPOTIFY_CLIENT_ID + ':' + process.env.SPOTIFY_CLIENT_SECRET);
    const options = {
        headers: {
            'Authorization': `Basic ${auth_token}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: ({
            grant_type: 'client_credentials'
        })

    }

    let spotify_access_token;
    let token_result;
    try
    {
        spotify_access_token = await got.post(myAPI.ACCESS_TOKEN_SPOTIFY, options);
        token_result = JSON.parse(spotify_access_token.body);
    }
    catch (error)
    {
        return new Promise((resolve, reject) => {
            reject(new Error(error));
        });
    }

    local_res.send(token_result);

})

// /api/spotify/get-tracks
app.post('/api/spotify/get-tracks/randomized', async (local_req, local_res) => {

    const weather = local_req.body.weather.weather[0].main;
    const weather_description = local_req.body.weather.weather[0].description;
    const age = local_req.body.age;
    const limit = local_req.body.limit.toString();
    let genres = [];

    /** calculate genres (for now). genre limit is 5
    //  Note: Future features will include where user can select genres (or don't, make an option for these)
    // For now, randomized genre option is the only feature I have below

    // if statements are main weather
    // nested ifs can be description
    **/

    if (weather == 'Clouds' && age < 10)
    {
        genres.push('country');
    }
    else
    {
        genres.push('anime');
    }

    const stringifyGenres = (genres) => {
        if (genres.length < 2) {
            return genres[0];
        }

        if (genres.length > 5)
        {
            // pick out genres[] by random pull, genre limit is 5
        }
    }

    const options = {
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization" : `Bearer ${local_req.body.token}`,
            // make sure to specify .body for response and request
        }
    }
    console.log("tracks: api call");
    console.log(myAPI.RECOMMENDATION_SPOTIFY + "limit=" + limit + "&" + "seed_genres=" + stringifyGenres(genres));

    let spotify_tracks;
    try
    {
        spotify_tracks = await got.get(myAPI.RECOMMENDATION_SPOTIFY + "limit=" + limit + "&" +
            "seed_genres=" + stringifyGenres(genres), options);

    }
    catch (error)
    {
        return new Promise((resolve, reject) => {
            reject(new Error(error));
        });
    }

    local_res.send(JSON.parse(spotify_tracks.body));

})

app.post('/api/spotify/get-tracks/genres-selected', async (local_req, local_res) => {

})

const genres = [
    "acoustic",
    "afrobeat",
    "alt-rock",
    "alternative",
    "ambient",
    "anime",
    "black-metal",
    "bluegrass",
    "blues",
    "bossanova",
    "brazil",
    "breakbeat",
    "british",
    "cantopop",
    "chicago-house",
    "children",
    "chill",
    "classical",
    "club",
    "comedy",
    "country",
    "dance",
    "dancehall",
    "death-metal",
    "deep-house",
    "detroit-techno",
    "disco",
    "disney",
    "drum-and-bass",
    "dub",
    "dubstep",
    "edm",
    "electro",
    "electronic",
    "emo",
    "folk",
    "forro",
    "french",
    "funk",
    "garage",
    "german",
    "gospel",
    "goth",
    "grindcore",
    "groove",
    "grunge",
    "guitar",
    "happy",
    "hard-rock",
    "hardcore",
    "hardstyle",
    "heavy-metal",
    "hip-hop",
    "holidays",
    "honky-tonk",
    "house",
    "idm",
    "indian",
    "indie",
    "indie-pop",
    "industrial",
    "iranian",
    "j-dance",
    "j-idol",
    "j-pop",
    "j-rock",
    "jazz",
    "k-pop",
    "kids",
    "latin",
    "latino",
    "malay",
    "mandopop",
    "metal",
    "metal-misc",
    "metalcore",
    "minimal-techno",
    "movies",
    "mpb",
    "new-age",
    "new-release",
    "opera",
    "pagode",
    "party",
    "philippines-opm",
    "piano",
    "pop",
    "pop-film",
    "post-dubstep",
    "power-pop",
    "progressive-house",
    "psych-rock",
    "punk",
    "punk-rock",
    "r-n-b",
    "rainy-day",
    "reggae",
    "reggaeton",
    "road-trip",
    "rock",
    "rock-n-roll",
    "rockabilly",
    "romance",
    "sad",
    "salsa",
    "samba",
    "sertanejo",
    "show-tunes",
    "singer-songwriter",
    "ska",
    "sleep",
    "songwriter",
    "soul",
    "soundtracks",
    "spanish",
    "study",
    "summer",
    "swedish",
    "synth-pop",
    "tango",
    "techno",
    "trance",
    "trip-hop",
    "turkish",
    "work-out",
    "world-music"
]

// gospel music when their marital status is single age > 24