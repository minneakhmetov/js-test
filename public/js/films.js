let filmSize = 0;
let favouriteSize = 0;
let iterator = 10;
let tags = [];
let prev = null;
let unsearched = true;

function films() {
    filmSize = 0;
    getFilms();
    $('#tags').empty();
    $('#search').empty();
    getTags();
    $('<div>', {
        class: "input-group-prepend",
        append: $('<span>', {
            class: "input-group-text",
            id: "addon-wrapping",
            append: $('<i>', {
                class: "fa fa-search"
            })
        })
    }).add($('<input>', {
        type: 'text',
        class: 'form-control',
        id: 'region',
        placeholder: 'Поиск'
    }))
        .appendTo("#search")

}

function searchInput() {
    let value = $("#region").val();
    if(unsearched || value != prev) {
        filmSize = 0;
        unsearched = false;
    }
    filmSize += iterator;
    $.ajax({
        type: "post",
        url: 'http://spinachnow.com:8081/search',
        data: {
            size: filmSize,
            query: value
        }
    }).done(function (data) {
        showFilms(data, "searchInput()")
        prev = value;
    })
}

function favourites() {
    favouriteSize = 0;
    getFavourites();
    $('#tags').empty();
    $('#search').empty();
    prev = null;
    unsearched = true;
}

function getTags() {
    $.ajax({
        type: 'get',
        url: 'http://spinachnow.com:8081/tags'
        //data: {}
    }).done(function (data) {
        for (let i = 0; i < data.length; i++) {
            tags[i] = false;
            $('<button>', {
                class: randomClass(),
                type: "button",
                text: data[i],
                id: 'tag' + i,
                onclick: 'clickTag(' + i + ')',
                css: {
                    marginLeft: '5px',
                    marginBottom: '5px'
                }
            }).appendTo('#tags');
        }
    });
}


function sendTags() {
    filmSize += iterator;
    $.ajax({
        type: 'post',
        url: 'http://spinachnow.com:8081/searchTags',
        data: {
            tags: tags,
            size: filmSize
        }
    }).done(function (data) {
        showFilms(data, "sendTags()");
    })
}

function clickTag(id) {
    unsearched = true;
    prev = null;
    $('#region').val('');
    tags[id] = !tags[id];
    let check = checkAllTags();
    filmSize = 0;
    if (check === 0) {
        for (let i = 0; i < tags.length; i++)
            if (i != id) {
                let obj = $("#tag" + i);
                obj.toggleClass("btn-secondary " + randomClass());
                obj.addClass('btn shadow');
            }
        getFilms();
    } else {
        if (check === 1) {
            if (!sumAllTags(id)) {
                for (let i = 0; i < tags.length; i++)
                    if (i != id) {
                        let obj = $('#tag' + i);
                        classes.forEach(function (v) {
                            if (obj.hasClass(v))
                                obj.toggleClass(v + ' btn-secondary')
                        });
                    }
            } else {
                let obj = $('#tag' + id);
                classes.forEach(function (v) {
                    if (obj.hasClass(v))
                        obj.toggleClass(v + ' btn-secondary')
                });
            }
        } else {
            let obj = $("#tag" + id);
            if (tags[id]) {
                obj.toggleClass("btn-secondary " + randomClass());
                obj.addClass('btn shadow');
            } else {
                classes.forEach(function (v) {
                    if (obj.hasClass(v))
                        obj.toggleClass(v + ' btn-secondary')
                });
            }
        }
        sendTags();
    }
}

function checkAllTags() {
    let i = 0;
    tags.forEach(function (v) {
        if (v) i++;
    });
    return i;
}

function sumAllTags(id) {
    let result = false;
    for (let i = 0; i < tags.length; i++) {
        if (i === id) result |= !tags[i];
        else result |= tags[i];
    }
    return result;
}

function getFilms() {
    filmSize += iterator;
    $.ajax({
        type: 'get',
        url: 'http://spinachnow.com:8081/filmsAndFavourites',
        data: {
            size: filmSize
        }
    }).done(function (data) {
        showFilms(data, "getFilms()");
    });
}

function showFilms(data, func) {
    $("#films").empty();
    if (data.films.length === 0) {
        $('<li>', {
            class: "list-group-item",
            text: 'Список пуст'
        }).appendTo('#films');
        size = 0;
        $("#butt").empty();
    } else {
        for (let i = 0; i < data.films.length; i++) {
            $('<li>', {
                class: "list-group-item",
                append: $('<div>', {
                    class: "container",
                    append: $("<div>", {
                        class: "row",
                        append: $('<div>', {
                            class: "col-md-11",
                            text: data.films[i].title
                        }).add(star(i, data.favourites[i].state))
                    })
                })
            }).appendTo('#films');
        }
        if (data.hasNext) {
            $("#butt").empty();
            $('<button>', {
                class: 'btn btn-primary btn-block',
                type: 'button',
                text: 'Загрузить еще',
                onclick: func,
            }).appendTo('#butt');
        } else {
            $("#butt").empty();
        }
    }
}


function getFavourites() {
    favouriteSize += iterator;
    $.ajax({
        type: 'get',
        url: 'http://spinachnow.com:8081/filmsAndOnlyFavourites',
        data: {
            size: favouriteSize
        }
    }).done(function (data) {
        let i = 0;
        $("#films").empty();
        if (data.films.length === 0) {
            $('<li>', {
                class: "list-group-item",
                text: 'Список пуст'
            }).appendTo('#films');
            $("#butt").empty();
            size = 0;
        } else {
            for (let i = 0; i < data.films.length; i++) {
                $('<li>', {
                    class: "list-group-item",
                    id: 'film' + data.favourites[i].index,
                    append: $('<div>', {
                        class: "container",
                        append: $("<div>", {
                            class: "row",
                            append: $('<div>', {
                                class: "col-md-11",
                                text: data.films[i].title
                            }).add($('<div>', {
                                class: "col-md-1 clickable",
                                onclick: 'deleteStar(' + data.favourites[i].index + ')',
                                append: $('<i>', {
                                    class: "fa fa-star",
                                })
                            }))
                        })
                    })
                }).appendTo('#films');
            }
            if (data.hasNext) {
                $("#butt").empty();
                $('<button>', {
                    class: 'btn btn-primary btn-block',
                    type: 'button',
                    text: 'Загрузить еще',
                    onclick: 'getFavourites()'
                }).appendTo("#butt");
            } else {
                $("#butt").empty();
            }
        }
    });
}