

function loadHtml(path: string) {
    
    let xhr = new XMLHttpRequest()
    xhr.open('GET', path, true)

    document.getElementById('dynamic-target').innerHTML = `<div class="loader">Loading ...</div>`;

    xhr.onreadystatechange = function() {
        if (this.readyState !== 4) { return }
        if (this.status !== 200) { return }

        document.getElementById('dynamic-target').innerHTML = this.responseText
    }
}