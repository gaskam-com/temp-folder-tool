let changes = new Map();

$(() => {
    loadEvents();
});

function genName(path) {
    return (/[\/\\]([^\/\\]*)[\/\\]{0,1}$/d.exec(path) || [null, "Folder unreadable"])[1];
}

function loadEvents() {
    elementsEvents();
    $("textarea").on("keydown", function(e){
        if (e.key === "Enter")
        {
            e.preventDefault();
        }
    });

    var $navbar = $('body sidebar');
    var $root = $(':root');

    if ($navbar.length) {
        function updateNavbarWidth() {
            var navbarWidth = $navbar.outerWidth() + 'px';
            $root.css('--navbar-width', navbarWidth);
        };
        
        $(window).on("load", updateNavbarWidth);

        $(window).on("resize", updateNavbarWidth);
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
            const $element = $(element).children(".infos");
            const path = ($element.children(".path").children().first().val() || "");
            $element.children(".name").children().first().val(
                localStorage.getItem(path) || genName(path)
            )
        });
        updateSaveButton();
    });
}

function elementsEvents() {
    $(".actions > .toggle").off("click").on("click", function (e) { 
        e.stopPropagation();
        const menu = $(this)[0].nextElementSibling;
        if (menu && !menu.classList.contains("active")) {
            $(document).trigger("click.actions");
        }
        if (menu) {
            menu.classList.toggle("active");
        }
        $(document).off("click.actions");
        if (menu && menu.classList.contains("active")) {
            $(document).one("click.actions", function () {
                menu.classList.remove("active");
            });
        }
    });
    
    $(".name > textarea").off("input").on("input", function () {
        const path = $(this).next().children().val();
        const name = $(this).val();
        if (localStorage.getItem(path || "") !== name)
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