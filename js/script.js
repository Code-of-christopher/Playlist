const wrapper = document.querySelector(".wrapper"),
musicImg = wrapper.querySelector(".img-area img"),
musicName = wrapper.querySelector(".song-details .name"),
musicArtist = wrapper.querySelector(".song-details .artist"),
mainAudio = wrapper.querySelector("#main-audio"),
playPauseBtn = wrapper.querySelector(".play-pause"),
prevBtn = wrapper.querySelector("#prev"),
nextBtn = wrapper.querySelector("#next"),
progressArea = wrapper.querySelector(".progress-area"),
progressBar = wrapper.querySelector(".progress-bar"),
musicList = wrapper.querySelector(".music-list"),
showMoreBtn = wrapper.querySelector("#more-music"),
hideMusicBtn = wrapper.querySelector("#close");

let musicIndex = "6";

window.addEventListener("load", () => {
    loadMusic(musicIndex); //calling load music function once window loaded
})

//load music function
function loadMusic(indexNumb){
    musicName.innerText = allMusic[indexNumb - 1].name;
    musicArtist.innerText = allMusic[indexNumb - 1].artist;
    musicImg.src = `images/${allMusic[indexNumb - 1].img}.jpg`;
    mainAudio.src = `songs/${allMusic[indexNumb - 1].src}.mp3`;
}

//play Music function
function playMusic(){
    wrapper.classList.add("paused");
    playPauseBtn.querySelector("i").innerText = "pause";
    mainAudio.play();
}

//pause Music function
function pauseMusic(){
    wrapper.classList.remove("paused");
    playPauseBtn.querySelector("i").innerText = "play_arrow"
    mainAudio.pause();
}

//next music function
function nextMusic(){
    //here we'll just increment index by 1
    musicIndex++;
    //If music index is greater than array length, then musicIndex will be 1 so the first song will play
    musicIndex > allMusic.length ? musicIndex = 1:  musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//prev music function
function prevMusic(){
    //here we'll decrement index by 1
    musicIndex--;
    //If music index is less than 1, then musicIndex will be 6 so the last song will play
    musicIndex < 1 ? musicIndex = allMusic.length:  musicIndex = musicIndex;
    loadMusic(musicIndex);
    playMusic();
}

//play or pause music button event
playPauseBtn.addEventListener("click", () => {
    const isMusicPaused = wrapper.classList.contains("paused");
    //if isMusicPaused is true then call pauseMusic else call playMusic
    isMusicPaused ? pauseMusic() : playMusic()
});

//next music btn event
nextBtn.addEventListener("click", () => {
    nextMusic();
});

//prev music btn event
prevBtn.addEventListener("click", () => {
    prevMusic();
});

//update progress bar width according to music current time
mainAudio.addEventListener("timeupdate", (e) => {
    const currentTime = e.target.currentTime; //getting current time of song
    const duration = e.target.duration; //getting total duration of song
    let progressWidth = (currentTime / duration) * 100; //calculating progress bar width
    progressBar.style.width = `${progressWidth}%`; //updating progress bar width

    let musicCurrentTime = wrapper.querySelector(".current"),
    musicDuration = wrapper.querySelector(".duration");

    mainAudio.addEventListener("loadeddata", ()=>{
        //update song total duration
        let audioDuration = mainAudio.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        musicDuration.innerText = `${totalMin}:${totalSec}`;
    });
    //update playing song current time
    let currentMin = Math.floor(currentTime / 60);
    let currentSec = Math.floor(currentTime % 60);
    if(currentSec < 10){ //adding 0 if sec is less than 10
        currentSec = `0${currentSec}`;
    }
    musicCurrentTime.innerText = `${currentMin}:${currentSec}`;
});

//let's update playing song current time according to the progress bar width
progressArea.addEventListener("click", (e) => {
    let progressWidthVal = progressArea.clientWidth;//getting width of progress bar
    let clickedOffsetX = e.offsetX; //getting offset x value
    let songDuration = mainAudio.duration //getting the song total duration

mainAudio.currentTime = (clickedOffsetX / progressWidthVal) * songDuration;
playMusic()
});

//let's work on repeat, shuffle songs according to the icon
const repeatBtn = wrapper.querySelector("#repeat-plist");
repeatBtn.addEventListener("click", () => {
    //first we get the innerText of the icon then we'll change accordingly
    let getText = repeatBtn.innerText; //getting innerText of icon
    // let's do different changes on different icon click using switch
    switch(getText){
        case "repeat"://if this icon is repeat then change it to shuffle
            repeatBtn.innerText = "repeat_one";
            repeatBtn.setAttribute("title", "Song looped")
            break;
        case "repeat_one": //if this icon is repeat_one then change it to shuffle
            repeatBtn.innerText = "shuffle";
            repeatBtn.setAttribute("title", "Playback shuffle")
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            repeatBtn.innerText = "repeat";
            repeatBtn.setAttribute("title", "Playlist looped")
            break;
    }
});

//above we just change the icon, now let's work on what to do
//after the song ended

mainAudio.addEventListener("ended", () => {
    //we'll do according to the icon means if user has set icon to loop song then we'll repeat
    //the current song and will do further accordingly

    let getText = repeatBtn.innerText; //getting innerText of icon
    // let's do different changes on different icon click using switch
    switch(getText){
        case "repeat"://if this icon is repeat then we simply call the nextMusic function so the next song will play
            nextMusic();
            break;
        case "repeat_one": //if this icon is repeat_one then we'll change the current playing song current time to 0 so song will play from beginning
            mainAudio.currentTime = 0;
            loadMusic(musicIndex);
            playMusic() //calling playMusic function
            break;
        case "shuffle": //if icon is shuffle then change it to repeat
            //generating random index between the max range of array length
            let randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            do{
                randIndex = Math.floor((Math.random() * allMusic.length) + 1);
            }while(musicIndex == randIndex) //this loop run until the next random number won't be the same of current music index
            musicIndex = randIndex; //passing randomIndex to musicIndex so the random song will play
            loadMusic(musicIndex); //calling loadMusic function
            playMusic() //calling playMusic function
            break;
    }
})

showMoreBtn.addEventListener("click", () => {
    musicList.classList.toggle("show");
});

hideMusicBtn.addEventListener("click", () => {
    showMoreBtn.click();
});

const ulTag = wrapper.querySelector("ul");

//let's create li according to the array length
for(let i = 0; i < allMusic.length; i++) {
    //let's pass the song name, artist from array to li
    let liTag =`<li li-index="${[i]}">
                   <div class="row">
                       <span>${allMusic[i].name}</span>
                       <p>${allMusic[i].artist}</p>
                   </div>
                   <audio class="audio${i}" src="songs/${allMusic[i].src}.mp3"></audio>
                   <span id="duration${i}" class="audio-duration">4:20</span>
                <li>`;
    ulTag.insertAdjacentHTML("beforeend", liTag);

    let liAudioDuration = ulTag.querySelector(`#duration${i}`);
    liAudioTag = ulTag.querySelector(`.audio${i}`);

    liAudioTag.addEventListener("loadeddata", () => {
        let audioDuration = liAudioTag.duration;
        let totalMin = Math.floor(audioDuration / 60);
        let totalSec = Math.floor(audioDuration % 60);
        if(totalSec < 10){ //adding 0 if sec is less than 10
            totalSec = `0${totalSec}`;
        }
        liAudioTag.innerText = `${totalMin}:${totalSec}`;
    });
console.log("li-index");
};

//let's work on play particular song on click
const allLiTags = ulTag.querySelectorAll("li");
console.log(allLiTags);
for (let j = 0; j < allLiTags.length; j++){

    //if there is a li tag which li-index is equal to musicIndex
    //then this music is playing now and we'll style it
    if(allLiTags[j].getAttribute("li-index") == musicIndex){
        allLiTags[j].classList.add("playing");
    }

    //adding onclick attribute in all li tags
    allLiTags[j].setAttribute("onclick", "clicked(this)");
}
