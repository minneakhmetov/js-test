let classes = ['btn-primary', 'btn-success', 'btn-danger', 'btn-warning', 'btn-info'];


function randomClass() {
    let id = -1;
    while (id <= 0){
        id = Math.round(Math.random() * classes.length) - 1;
    }
    return 'btn ' + classes[id] + ' shadow';
}

function clickStar(id) {
    let obj = $("#star" + id);
    if(obj.hasClass('fa-star')){
        sendStar(id, false);
        obj.toggleClass('fa-star fa-star-o')
    } else {
        if(obj.hasClass('fa-star-o')){
            sendStar(id, true);
            obj.toggleClass('fa-star-o fa-star')
        }
    }
}
function sendStar(id, state) {
    $.ajax({
        type: 'post',
        url: 'http://spinachnow.com:8081/favourites',
        data: {
            index: id,
            state: state
        }
    }).done(function (data) {

    });
}
function star(id, state) {
    if(state){
        return generateStar(id, 'fa-star');
    } else {
        return generateStar(id, 'fa-star-o');
    }
}
function generateStar(id, faClass) {
    return $('<div>', {
        class: "col-md-1 clickable",
        onclick: 'clickStar(' + id + ')',
        append: $('<i>', {
            class: 'fa ' + faClass,
            id: 'star' + id
        })
    });
}
function deleteStar(id) {
    sendStar(id, false);
    $("#film" + id).remove();
    favouriteSize--;
    if(favouriteSize === 0){
        $('<li>',{
            class: "list-group-item",
            text: 'Список пуст'
        }).appendTo('#films');
        $("#butt").empty();
    }

}

