document.addEventListener("DOMContentLoaded", function(event) {

var tvcMusic = document.getElementById('tvc-music'); // id for audio element
var trackVersion1 = document.getElementById('tvc-track-version-1');
var trackVersion2 = document.getElementById('tvc-track-version-2');
var duration; // Duration of audio clip
var playButton = document.getElementById('tvc-play-button'); // play button
var playhead = document.getElementById('tvc-playhead'); // playhead
var timeline = document.getElementById('tvc-timeline'); // timeline

// timeline width adjusted for playhead
var timelineWidth = timeline.offsetWidth - playhead.offsetWidth;

// play button event listenter
playButton.addEventListener("click", play);

// timeupdate event listener
tvcMusic.setAttribute('src', trackVersion1.textContent);
tvcMusic.addEventListener("timeupdate", timeUpdate, false);

// makes timeline clickable
timeline.addEventListener("click", function(event) {
    moveplayhead(event);
    tvcMusic.currentTime = duration * clickPercent(event);
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

//Play and Pause
function play() {
    // start tvcMusic
    if (tvcMusic.paused) {
        tvcMusic.play();
        // remove play, add pause
        playButton.className = "";
        playButton.className = "pause";
    } else { // pause tvcMusic
        tvcMusic.pause();
        // remove pause, add play
        playButton.className = "";
        playButton.className = "play";
    }
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
