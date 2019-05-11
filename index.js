const express = require('express');
const app = express();
const fs = require('fs');
const bodyParser = require('body-parser');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

app.get('/tags', function (req, res){
    return res.send(JSON.parse(fs.readFileSync('jsons/tags.json')));
});
app.get('/films', function (req, res){
    return res.send(JSON.parse(fs.readFileSync('jsons/films.json')));
});
app.get('/favourites', function (req, res){
    return res.send(JSON.parse(fs.readFileSync('jsons/favourites.json')));
});
app.get('/filmsAndFavourites',  function (req, res) {
    let films = JSON.parse(fs.readFileSync('jsons/films.json'));
    let favourites = JSON.parse(fs.readFileSync('jsons/favourites.json'));
    let filmsResult = [];
    let favouritesResult = [];
    let size = req.query.size;
    for(let i = 0; i < size; i++){
        if(films.length > i) {
            filmsResult[i] = films[i];
            favouritesResult[i] = favourites[i];
        }
    }
    let result = {
        films: filmsResult,
        favourites: favouritesResult,
        hasNext: films.length >= size
    };
    return res.send(result);
});
app.post('/favourites', function (req, res){
    var body = req.body;
    let result = JSON.parse(fs.readFileSync('jsons/favourites.json'));
    result[body.index] = {
        index: Number(body.index),
        state: body.state === 'true'
    };
    let data = JSON.stringify(result);
    fs.writeFileSync('jsons/favourites.json', data);
    return res.end();
});
app.get('/filmsAndOnlyFavourites', function (req, res){
    let films = JSON.parse(fs.readFileSync('jsons/films.json'));
    let favourites = JSON.parse(fs.readFileSync('jsons/favourites.json'));
    let filmsResult = [];
    let favouritesResult = [];
    let iterator = 0;
    let size = req.query.size;
    let hasNext = false;
    for (let i = 0; i < films.length; i++) {
        if (favourites[i].state) {
            if (filmsResult.length <= size) {
                filmsResult[iterator] = films[i];
                favouritesResult[iterator++] = favourites[i];
            } else {
                hasNext = true;
                break;
            }
        }
    }
    let result = {
        films: filmsResult,
        favourites: favouritesResult,
        hasNext: hasNext
    };
    res.send(result);
});
app.post('/searchTags', function (req, res) {
    let films = JSON.parse(fs.readFileSync('jsons/films.json'));
    let favourites = JSON.parse(fs.readFileSync('jsons/favourites.json'));
    let filmsResult = [];
    let favouritesResult = [];
    let iterator = 0;
    let size = req.body.size - 1;
    let tags = tagsConverter(JSON.parse(fs.readFileSync('jsons/tags.json')), JSON.parse('[' + req.body.tags + ']'));
    console.log(tags + ' ' + size);
    let hasNext = false;
    for (let i = 0; i < films.length; i++) {
        if (contains(films[i].tags, tags)) {
            if (filmsResult.length <= size) {
                filmsResult[iterator] = films[i];
                favouritesResult[iterator++] = favourites[i];
            } else {
                hasNext = true;
                break;
            }
        }
    }
    let result = {
        films: filmsResult,
        favourites: favouritesResult,
        hasNext: hasNext
    };
    res.send(result);
});
function contains(tags, query){
    let result = false;
    query.forEach(function (v) {
        if(tags.includes(v)) {
            result |= true;
        }
    });

    return result;
}
function tagsConverter(tags, query){
    let result = [];
    for(let i = 0; i < query.length; i++){
        if(query[i]) result.push(tags[i]);
    }
    return result;
}
app.post('/search', function (req, res) {
    let films = JSON.parse(fs.readFileSync('jsons/films.json'));
    let favourites = JSON.parse(fs.readFileSync('jsons/favourites.json'));
    let filmsResult = [];
    let favouritesResult = [];
    let iterator = 0;
    let size = req.body.size - 1;
    let query = req.body.query;
    console.log(size + ' ' + query);
    let hasNext = false;
    for (let i = 0; i < films.length; i++) {
        if (films[i].title.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
            if (filmsResult.length <= size) {
                filmsResult[iterator] = films[i];
                favouritesResult[iterator++] = favourites[i];
            } else {
                hasNext = true;
                break;
            }
        }
    }
    let result = {
        films: filmsResult,
        favourites: favouritesResult,
        hasNext: hasNext
    };
    res.send(result);
});

app.listen(8081);
console.log("server started");