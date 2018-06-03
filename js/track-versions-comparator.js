document.addEventListener("DOMContentLoaded", function(event) {

var tvcMusic = document.getElementById('tvc-music');
var tvcMusic2 = document.getElementById('tvc-music2'); // id for audio element
var originalTrackUrl = document.getElementById('tvc-track-version-1').textContent;
var remasteredTrackUrl = document.getElementById('tvc-track-version-2').textContent;
var duration; // Duration of audio clip
var playButton = document.getElementById('tvc-play-button'); // play button
var playhead = document.getElementById('tvc-playhead'); // playhead
var timeline = document.getElementById('tvc-timeline'); // timeline
var originalVersionButton = document.getElementById('tvc-original-version-button');
var remasteredVersionButton = document.getElementById('tvc-remastered-version-button');
var currentTime = 0;
var isPlaying = false;

// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// play button event listenter
playButton.addEventListener("click", play);
originalVersionButton.addEventListener("click", playOriginalVersion);
remasteredVersionButton.addEventListener("click", playRemasteredVersion);

// timeupdate event listener
tvcMusic.setAttribute('src', originalTrackUrl);
tvcMusic2.setAttribute('src', remasteredTrackUrl);
tvcMusic2.muted = true;
tvcMusic.addEventListener("timeupdate", timeUpdate, false);

// makes timeline clickable
timeline.addEventListener("click", function(event) {
    moveplayhead(event);
    tvcMusic.currentTime = duration * clickPercent(event);
    tvcMusic2.currentTime = duration * clickPercent(event);
}, false);

// returns click as decimal (.77) of the total timelineWidth
function clickPercent(event) {
    return (event.clientX - getPosition(timeline)) / timelineWidth;

}

// makes playhead draggable
playhead.addEventListener('mousedown', mouseDown, false);
window.addEventListener('mouseup', mouseUp, false);

// Boolean value so that audio position is updated only when the playhead is released
var onplayhead = false;

// mouseDown EventListener
function mouseDown() {
    onplayhead = true;
    window.addEventListener('mousemove', moveplayhead, true);
    tvcMusic.removeEventListener('timeupdate', timeUpdate, false);
}

// mouseUp EventListener
// getting input from all mouse clicks
function mouseUp(event) {
    if (onplayhead == true) {
        moveplayhead(event);
        window.removeEventListener('mousemove', moveplayhead, true);
        // change current time
        tvcMusic.currentTime = duration * clickPercent(event);
        tvcMusic2.currentTime = duration * clickPercent(event);
        tvcMusic.addEventListener('timeupdate', timeUpdate, false);
    }
    onplayhead = false;
}
// mousemove EventListener
// Moves playhead as user drags
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

// timeUpdate
// Synchronizes playhead position with current point in audio
function timeUpdate() {
    var playPercent = timelineWidth * (tvcMusic.currentTime / duration);
    playhead.style.marginLeft = playPercent + "px";
    if (tvcMusic.currentTime == duration) {
        playButton.className = "";
        playButton.className = "play";
    }
}

var currentPlaying = 'original';
//Play and Pause
function play() {
    // start tvcMusic
    if (tvcMusic.paused) {
        tvcMusic.play();
        tvcMusic2.play();
        // remove play, add pause
        playButton.className = "";
        playButton.className = "pause";
        isPlaying = true;
    } else { // pause tvcMusic
        tvcMusic.pause();
        tvcMusic2.pause();
        // remove pause, add play
        playButton.className = "";
        playButton.className = "play";
        isPlaying = false;
    }
}

function playOriginalVersion() {
    //playTrackVersion(originalTrackUrl);
    tvcMusic2.muted = true;
    tvcMusic.muted = false;
}

function playRemasteredVersion() {
    //playTrackVersion(remasteredTrackUrl);
    tvcMusic2.muted = false;
    tvcMusic.muted = true;
}

function playTrackVersion(trackVersionUrl) {
    tvcMusic.pause();
    currentTime = tvcMusic.currentTime;
    tvcMusic.setAttribute('src', trackVersionUrl);
    tvcMusic.load();
    if (isPlaying) {
        tvcMusic.play();
    }
    tvcMusic.currentTime = currentTime;
}

// Gets audio file duration
tvcMusic.addEventListener("canplaythrough", function() {
    duration = tvcMusic.duration;
}, false);

// getPosition
// Returns elements left position relative to top-left of viewport
function getPosition(el) {
    return el.getBoundingClientRect().left;
}

/* DOMContentLoaded*/
});
