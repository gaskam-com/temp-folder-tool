let changes = new Map();

$(() => {
    loadEvents();
});

function loadEvents() {
    elementsEvents();
    $("textarea").keydown(function(e){
        if (e.keyCode == 13)
        {
            e.preventDefault();
        }
    });

    var $navbar = $('body sidebar');
    var $root = $(':root');

    if ($navbar.length) {
        var updateNavbarWidth = function() {
            var navbarWidth = $navbar.outerWidth() + 'px';
            $root.css('--navbar-width', navbarWidth);
        };

        updateNavbarWidth();

        $(window).resize(updateNavbarWidth);
    }

    $("#fold").on("click", function () {
        const sidebar = $("sidebar");
        sidebar.toggleClass("folded");
        updateNavbarWidth();
        $(this).children()[0].src = 
            $(sidebar).hasClass("folded")
                ? "img/arrow_forward.svg"
                : "img/arrow_back.svg";
    });

    $("#button-folders").on("classchange", function(){
        $(this).children(".image").children()[0].src = 
            $(this).hasClass("active") || $(this).hasClass("hover") ? 
            "img/folder_open.svg" : 
            "img/folder.svg";
    })

    $("#button-folders").on("mouseover", function () {
        $(this).addClass("hover").trigger("classchange");
    });

    $("#button-folders").on("mouseout", function () {
        $(this).removeClass("hover").trigger("classchange");
    });

    $("#button-menu > :not([id=button-folders])").one("click", function () {
        $("#button-folders").removeClass(["active", "hover"]).trigger("classchange");
    });

    $("#button-menu").children().on("click", function () {
        const element = $(this);
        element.addClass(["active", "hover"]).trigger("classchange");
        element.siblings().one("click", function () {
            element.removeClass(["active", "hover"]).trigger("classchange");
        });
    });

    $("#save").on("click", function () {
        changes.forEach((value, key) => {
            localStorage.setItem(key, value);
        });
        changes.clear();

        updateSaveButton();
    });

    $("#cancel").on("click", function () {
        changes.clear();

        $(".element").each((_, element) =>{
            element = $(element).children(".infos");
            element.children(".name").children().first().val(
                localStorage.getItem(element.children(".path").children().first().val())
            )
        });
        updateSaveButton();
    });
}

function elementsEvents() {
    $(".actions > .toggle").off("click").on("click", function (e) { 
        e.stopPropagation();
        const menu = $(this)[0].nextElementSibling;
        if (!menu.classList.contains("active")) {
            $(document).trigger("click.actions");
        }
        menu.classList.toggle("active");
        $(document).off("click.actions");
        if (menu.classList.contains("active")) {
            $(document).one("click.actions", function () {
                menu.classList.remove("active");
            });
        }
    });
    
    $(".name > textarea").off("input").on("input", function () {
        const path = $(this).next().children().val();
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