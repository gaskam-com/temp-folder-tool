const getId = document.getElementById;

(async () => {
    const folders = await fetch("/api/getFolders");
    const data = await folders.json();
})();