$('#form').on('submit', function (e) {
    console.log(e);

    // отменяю дефолтную отправку формы
    e.preventDefault();
    searchInput();
});