let currentSong = new Audio();
let playmain = document.querySelector(".playbar .play")
async function getSongs() {

    let a = await fetch("http://127.0.0.1:5500/songs/");
    let res = await a.text();
    let div = document.createElement("div");
    div.innerHTML = res;
    let elements = div.getElementsByTagName("a");
    let songs = [];
    Array.from(elements).forEach(e => {

        if (e.href.endsWith(".mp3") || e.href.endsWith(".m4a")) {
            songs.push({
                title: extractTitle(e.title),
                href: e.href,
            });
        }

    });
    return songs;
}

async function main() {
    let songs = await getSongs();



    songs.forEach((song) => {
        let li = document.createElement("li");
        li.innerHTML = `<i class="fa-solid fa-music"></i><span class="songtitle">${song.title}</span> <span class="link">${song.href}</span> <span class="play fa-solid fa-play"></span> `;
        document.querySelector(".songlist").appendChild(li);
    })

    Array.from(document.querySelector(".songlist").getElementsByTagName("li")).forEach((i) => {
        i.querySelector(".play").addEventListener("click", (e) => {
            document.querySelector(".playbar").style.display = "grid"
            playMusic(i.querySelector(".link").innerHTML);
            playmain.classList.add("fa-pause");
            playmain.classList.remove("fa-play");
            if (currentSong.paused) {
                e.target.classList.add("fa-pause");
                e.target.classList.remove("fa-play");
            }
            else {
                e.target.classList.add("fa-play");
                e.target.classList.remove("fa-pause");
            }
            document.querySelector(".songinfo").textContent = i.querySelector(".songtitle").textContent;


        })
    })

    playmain.addEventListener("click", function (e) {
        if (currentSong.paused) {
            currentSong.play();
            e.target.classList.add("fa-pause");
            e.target.classList.remove("fa-play");
        }
        else {
            currentSong.pause();
            e.target.classList.add("fa-play");
            e.target.classList.remove("fa-pause");

        }
    })

    currentSong.addEventListener("timeupdate", () => {
        let currentTime = formatTime(currentSong.currentTime);
        let duration = formatTime(currentSong.duration);
        document.querySelector(".songtime").innerText = (`${currentTime}/${duration}`);
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%"



    });

    document.querySelector(".seekbar").addEventListener("click", (e) => {
        console.log(e.offsetX)
        document.querySelector(".circle").style.left = (e.offsetX / e.target.getBoundingClientRect().width) * 100 + "%";
        currentSong.currentTime = (currentSong.duration / e.target.getBoundingClientRect().width) * e.offsetX;

    });

    document.querySelector(".openlibrary").addEventListener("click", () => {
        document.querySelector(".left").style.left = "0%";
        document.querySelector(".left").style.opacity = "1";
        document.querySelector(".right").style.gridColumn = "span 9";
        document.querySelector(".left").style.position = "relative";
        document.querySelector(".sidebar").style.display = "none";
    })

    document.querySelector(".librarymob").addEventListener("click", (e) => {
        document.querySelector(".left").style.left = "0%";
        document.querySelector(".left").style.zIndex = "10"
        document.querySelector(".left").style.opacity = "1";

        document.querySelector(".left").style.position = "absolute";
    })

    document.querySelector(".collapse-lib").addEventListener("click", () => {
        console.log("clicked");
        if (window.innerWidth > 467) { document.querySelector(".sidebar").style.display = "grid"; }
        document.querySelector(".left").style.left = "-100%";
        document.querySelector(".left").style.opacity = "0";
        document.querySelector(".right").style.gridColumn = "span 11";
        document.querySelector(".left").style.position = "absolute";

    })

    function formatTime(seconds) {
        if (isNaN(seconds)) return "00:00";
        let minutes = Math.floor(seconds / 60);
        let secs = Math.floor(seconds % 60);
        return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
    }
}


main();

function extractTitle(ogtitle) {
    let step1 = ogtitle.split(".")[0];
    return step1.split("-").join(" ");
}

function playMusic(track) {
    currentSong.src = track;
    currentSong.play();

}