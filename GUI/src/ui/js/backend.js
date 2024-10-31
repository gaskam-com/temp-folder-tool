function getName(path) {
    const folder = config.tempFolders.find((folder) => folder.path === path);
    if (folder.name !== undefined) return folder.name;
    const item = localStorage.getItem(path);
    if (item !== null) return item;
    const value = genName(path);
    localStorage.setItem(path, value);
    return value;
}

function formatTime(time) {
    if (time < 60) return time + "s";
    else if (time < 3600) return Math.floor(time / 60) + "m";
    else if (time < 86400) return Math.floor(time / 3600) + "h";
    else if (time < 2592000) return Math.floor(time / 86400) + "d";
    else if (time < 31536000) return Math.floor(time / 2592000) + "M";
    else return Math.floor(time / 31536000) + "y";
}

$(function () {
    initFolders();
});

swup.hooks.on('page:view', () => {
    // This runs after every page change by swup
    if (location.pathname.endsWith("/index.html")) {
        initFolders();
    }
});

let updateFoldersBridge = () => {};
let config = {
    tempFolders: [],
};
  

function initFolders() {
    // DOM is loaded. Check if `webui` object is available
    if (typeof webui !== "undefined") {
        // Set events callback
        webui.setEventCallback(async (e) => {
            if (e == webui.event.CONNECTED) {
                // Connection to the backend is established
                // Do something
                updateFoldersBridge = update_folders;
                console.log("Connected to the backend");
                const result = await update_folders();
                const folders = JSON.parse(result);
                config = folders;
                const folderContainer = document.getElementById("elements");
                folders["tempFolders"].forEach((folder) => {
                    var template = document.createElement("template");
                    template.innerHTML = `<div class="element">
                        <div class="time">
                            <textarea id="time" maxlength="5" readonly>${formatTime(
                                folder.retention
                            )}</textarea>
                        </div>
                        <div class="infos">
                            <div class="name">
                                <textarea id="name" maxlength="40">${getName(
                                    folder.path
                                )}</textarea>
                            </div>
                            <div class="path">
                                <textarea id="path" readonly>${
                                    folder.path
                                }</textarea>
                            </div>
                        </div>
                        <div class="actions">
                            <button class="toggle"><img src="img/more.svg"></button>
                            <div class="menu">
                                <button id="open">Open in explorer</button>
                                <button id="edit">Edit</button>
                                <button class="delete" id="delete">
                                    Delete
                                </button>
                            </div>
                        </div>
                    </div>`;
                    folderContainer.appendChild(template.content.firstChild);
                });
                // Add event listeners
                elementsEvents();
            } else if (e == webui.event.DISCONNECTED) {
                // Connection to the backend is lost
                // window.close();
            }
        });
    }
}
