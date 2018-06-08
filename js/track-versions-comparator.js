var tracks = [
    {
        unmastered: "music/interlude-lq.mp3",
        mastered: "music/interlude-hq.mp3"
    },
    {
        unmastered: "music/bensound-endlessmotion-lq.mp3",
        mastered: "music/bensound-endlessmotion-hq.mp3"
    }
];

var originalUrl;
var masteredUrl;
var originalTrack;
var remasteredTrack
var playButton

document.addEventListener("DOMContentLoaded", function(event) {

originalTrack = document.getElementById('tvc-original-track');
remasteredTrack = document.getElementById('tvc-remastered-track');
playButton = document.getElementById('tvc-play-button'); 
var playhead = document.getElementById('tvc-playhead'); 
var timeline = document.getElementById('tvc-timeline'); 
var originalVersionButton = document.getElementById('tvc-original-version-button');
var remasteredVersionButton = document.getElementById('tvc-remastered-version-button');
var onplayhead = false;

var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

playButton.addEventListener("click", play);
originalVersionButton.addEventListener("click", playOriginalVersion);
remasteredVersionButton.addEventListener("click", playRemasteredVersion);

remasteredTrack.muted = true;
originalTrack.addEventListener("timeupdate", timeUpdate, false);

timeline.addEventListener("click", function(event) {
    moveplayhead(event);
    originalTrack.currentTime = originalTrack.duration * clickPercent(event);
    remasteredTrack.currentTime = originalTrack.duration * clickPercent(event);
}, false);

function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;
}

playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    originalTrack.removeEventListener('timeupdate', timeUpdate, false);
}

function mouseUp(event) {
    if (onplayhead == true) {
        moveplayhead(event);
        window.removeEventListener('mousemove', moveplayhead, true);
        originalTrack.currentTime = originalTrack.duration * clickPercent(event);
        remasteredTrack.currentTime = originalTrack.duration * clickPercent(event);
        originalTrack.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}

function moveplayhead(event) {
    var newMargLeft = event.clientX - getPosition(timeline);

    if (newMargLeft >= 0 && newMargLeft <= timelineWidth) {
        playhead.style.marginLeft = newMargLeft + "px";
    }
    if (newMargLeft < 0) {
        playhead.style.marginLeft = "0px";
    }
    if (newMargLeft > timelineWidth) {
        playhead.style.marginLeft = timelineWidth + "px";
    }
}

function timeUpdate() {
    var playPercent = timelineWidth * (originalTrack.currentTime / originalTrack.duration);
    playhead.style.marginLeft = playPercent + "px";
    if (originalTrack.currentTime == originalTrack.duration) {
        playButton.className = "";
        playButton.className = "play";
    }
}

function play() {
    if (originalTrack.paused) {
        originalTrack.play();
        remasteredTrack.play();
        playButton.className = "";
        playButton.className = "pause";
    } else { 
        originalTrack.pause();
        remasteredTrack.pause();
        playButton.className = "";
        playButton.className = "play";
    }
}

function playOriginalVersion() {
    remasteredTrack.muted = true;
    originalTrack.muted = false;
}

function playRemasteredVersion() {
    remasteredTrack.muted = false;
    originalTrack.muted = true;
}

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

});

function setTrack(element, trackNumber) {
    clearSelected();
    element.className = "";
    element.className = "selected";
    originalTrack.setAttribute("src", tracks[trackNumber].unmastered);
    originalTrack.load();
    remasteredTrack.setAttribute("src", tracks[trackNumber].mastered);
    remasteredTrack.load();
    playButton.className = "";
    playButton.className = "play";
    remasteredTrack.muted = true;
    originalTrack.muted = false;
}

function clearSelected() {
    var elements = document.getElementsByClassName("selected");
    console.log(elements);
    if (elements.length === 0) {
        return;
    }
    for (i = 0; i < elements.length; i++) {
        elements[i].className = "";
    } 
}
