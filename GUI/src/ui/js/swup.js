const swup = new Swup({
    animateHistoryBrowsing: false,
    animationSelector: '[class*="transition-"]',
    animationScope: "html",
    cache: true,
    containers: ["#swup"],
    hooks: {},
    ignoreVisit: (url, { el } = {}) => el?.closest("[data-no-swup]"),
    linkSelector: "button[href]",
    linkToSelf: "scroll",
    native: false,
    plugins: [],
    resolveUrl: (url) => url,
    requestHeaders: {
        "X-Requested-With": "swup",
        Accept: "text/html, application/xhtml+xml",
    },
    skipPopStateHandling: (event) => event.state?.source !== "swup",
    timeout: 0,
    plugins: [
        new SwupFadeTheme()
    ]
});
