let changes = new Map();

$(() => {
    loadEvents();
});

function loadEvents() {
    elementsEvents();

    $("#save").on("click", function () {
        changes.forEach((value, key) => {
            localStorage.setItem(key, value);
        });
        changes.clear();

        updateSaveButton();
    });

    $("#cancel").on("click", function () {
        changes.clear();

        const element = $(".element");
        element.children(".name").children().first().val(
            localStorage.getItem(element.children(".path").children().first().val())
        )
        console.log(element.children(".name").children().first())
        updateSaveButton();
    });
}

function elementsEvents() {
    $(".actions > .toggle").off("click").on("click", function (e) { 
        e.stopPropagation();
        const menu = $(this)[0].nextElementSibling;
        menu.classList.toggle("active");
        $(document).off("click.actions");
        if (menu.classList.contains("active")) {
            $(document).one("click.actions", function () {
                menu.classList.remove("active");
            });
        }
    });
    
    $(".name > textarea").off("input").on("input", function () {
        // Gets the 2d element of the div
        const path = $(this).parents().children().eq(2).children().eq(0).val();
        const name = $(this).val();
        if (localStorage.getItem(path) !== name)
            changes.set(path, name);
        else
            changes.delete(path);

        updateSaveButton();
    });
}

function updateSaveButton() {
    const saveButton = $(".save");
    if (changes.size > 0)
        saveButton.addClass("active");
    else
        saveButton.removeClass("active");
}