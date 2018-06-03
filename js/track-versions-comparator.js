document.addEventListener("DOMContentLoaded", function(event) {

var originalTrack = document.getElementById('tvc-original-track');
var remasteredTrack = document.getElementById('tvc-remastered-track');
var originalTrackUrl = document.getElementById('tvc-track-version-1').textContent;
var remasteredTrackUrl = document.getElementById('tvc-track-version-2').textContent;
var duration; 
var playButton = document.getElementById('tvc-play-button'); 
var playhead = document.getElementById('tvc-playhead'); 
var timeline = document.getElementById('tvc-timeline'); 
var originalVersionButton = document.getElementById('tvc-original-version-button');
var remasteredVersionButton = document.getElementById('tvc-remastered-version-button');
var currentTime = 0;
var onplayhead = false;

var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

playButton.addEventListener("click", play);
originalVersionButton.addEventListener("click", playOriginalVersion);
remasteredVersionButton.addEventListener("click", playRemasteredVersion);

originalTrack.setAttribute('src', originalTrackUrl);
remasteredTrack.setAttribute('src', remasteredTrackUrl);
remasteredTrack.muted = true;
originalTrack.addEventListener("timeupdate", timeUpdate, false);

timeline.addEventListener("click", function(event) {
    moveplayhead(event);
    originalTrack.currentTime = duration * clickPercent(event);
    remasteredTrack.currentTime = duration * clickPercent(event);
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
        originalTrack.currentTime = duration * clickPercent(event);
        remasteredTrack.currentTime = duration * clickPercent(event);
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
    var playPercent = timelineWidth * (originalTrack.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (originalTrack.currentTime == duration) {
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

originalTrack.addEventListener("canplaythrough", function() {
    duration = originalTrack.duration;
}, false);

function getPosition(el) {
    return el.getBoundingClientRect().left;
}

});
