var BOTTOM_SHEET_HASH = "#bottom-sheet";
// Shim onhashchange if browser doesn't support
;
(function (window) {
    // exit if the browser implements that event
    if ("onhashchange" in window) {
        return;
    }
    var location = window.location, oldURL = location.href, oldHash = location.hash;
    // check the location hash on a 100ms interval
    setInterval(function () {
        var newURL = location.href, newHash = location.hash;
        // if the hash has changed and a handler has been bound...
        if (newHash != oldHash && typeof window.onhashchange === "function") {
            // execute the handler
            window.onhashchange({
                type: "hashchange",
                oldURL: oldURL,
                newURL: newURL
            });
            oldURL = newURL;
            oldHash = newHash;
        }
    }, 100);
})(window);
window.onhashchange = function (event) {
    var newUrl = new URL(event.newURL);
    attemptLoadBottomSheet(newUrl);
};

function attemptLoadBottomSheet(url) {
    if (url.hash === BOTTOM_SHEET_HASH) {
        var newpathencoded = url.searchParams.get("path");
        loadOverlayHtml(decodeURIComponent(newpathencoded));
    }
}

function loadOverlayHtml(path) {
    var xhr = new XMLHttpRequest();
    xhr.open('GET', path, true);
    document.getElementById('dynamic-target').innerHTML = "<div class=\"loader\">Loading ...</div>";
    xhr.onreadystatechange = function () {
        if (this.readyState !== 4) {
            return;
        }
        if (this.status !== 200) {
            return;
        }
        document.getElementById('dynamic-target').innerHTML = this.responseText;
    };
    xhr.send();
    console.log("Loading new file into bottom sheet: " + path);
}

attemptLoadBottomSheet(new URL(window.location.href));