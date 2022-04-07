const url = "https://api.playtimetracker.app"

function onload() {
    Object.keys(localStorage).forEach((key) => {
        let arr = localStorage.getItem(key).split(",")
        if (arr.length >= 2) {
            set(key, arr[0], arr[1], (((arr.length > 2) ? arr[2] : "")))
        }
    });
}

function set(key, name, duration, type) {
    fetch(((type != "") ? `${url}/${key}/${name}/${duration}/${type}` : `${url}/${key}/${name}/${duration}`))
        .then(async response => {
            document.getElementById(key + "Response").innerText = JSON.stringify(await response.json())
            window.localStorage.setItem(key, (type) ? [name, duration, type] : [name, duration])
        })
}