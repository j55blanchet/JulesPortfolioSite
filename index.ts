const BOTTOM_SHEET_HASH = "#bottom-sheet";


// Shim onhashchange if browser doesn't support
;(function(window: Window) {

    // exit if the browser implements that event
    if ("onhashchange" in window) { return; }
    
    var location: Location = (<any> window).location,
        oldURL = location.href,
        oldHash = location.hash;
  
    // check the location hash on a 100ms interval
    setInterval(function() {
      var newURL = location.href,
        newHash = location.hash;
  
      // if the hash has changed and a handler has been bound...
      if (newHash != oldHash && typeof (<any> window).onhashchange === "function") {
        // execute the handler
        (<any> window).onhashchange({
          type: "hashchange",
          oldURL: oldURL,
          newURL: newURL
        });
  
        oldURL = newURL;
        oldHash = newHash;
      }
    }, 100);
  
  })(window);


  window.onhashchange = function(event) {
      let newUrl = new URL(event.newURL);
      reactToLocation(newUrl);
  };

  function reactToLocation(url) {
    if (url.hash === BOTTOM_SHEET_HASH) {
      let newpathencoded = url.searchParams.get("path")
      let newjsencoded = url.searchParams.get("js")
      loadOverlay(decodeURIComponent(newpathencoded),
                  new URL(decodeURIComponent(newjsencoded), window.location.origin));
    }
  }

function loadOverlay(path: string, jsurl: URL) {
    
    let xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)
    document.getElementById('dynamic-target').innerHTML = `<div class="loader">Loading ...</div>`;

    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) { return }
        if (this.status !== 200) { return }

        document.getElementById('dynamic-target').innerHTML = this.responseText
        if (jsurl) {
          var scriptTag = document.createElement('script');
          scriptTag.src = jsurl.href;
          document.getElementById('dynamic-target').appendChild(scriptTag);
        }
    }
    xhr.send();
    console.log(`Loading new file into bottom sheet: ${path}`)
}

reactToLocation(new URL(window.location.href));