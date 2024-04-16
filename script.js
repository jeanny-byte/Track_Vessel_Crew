let audioControls = document.querySelectorAll('.audio-control');
    
audioControls.forEach((control, index) => {
    let audioPlayer = new Audio();
    let playPauseButton = control.querySelector('.play-pause');
    let volumeKnob = control.querySelector('.volume-knob');
    let volumeFill = control.querySelector('.volume-fill');
    let fileName = control.querySelector('.file-name');
    let volumeBar = control.querySelector('.volume-bar');
    let isDragging = false;
    let fileInput = control.querySelector('.file-input');
    
    // Add Track button click event
    control.querySelector('.add-track').addEventListener('click', function() {
        fileInput.click();
    });

    // File input change event
    fileInput.addEventListener('change', function(event) {
        const file = event.target.files[0];
        if (file) {
            const fileURL = URL.createObjectURL(file);
            audioPlayer.src = fileURL;
            fileName.textContent = `File: ${file.name}`;
        }
    });

    // Play/Pause button click event
    playPauseButton.addEventListener('click', function() {
        if (audioPlayer.paused) {
            audioPlayer.play();
            playPauseButton.textContent = 'Pause';
        } else {
            audioPlayer.pause();
            playPauseButton.textContent = 'Play';
        }
    });

    // Volume control
    volumeKnob.addEventListener('mousedown', function(event) {
        isDragging = true;
        updateVolume(event);
    });

    window.addEventListener('mousemove', function(event) {
        if (isDragging) {
            updateVolume(event);
        }
    });

    window.addEventListener('mouseup', function() {
        isDragging = false;
    });

    function updateVolume(event) {
        let boundingRect = volumeBar.getBoundingClientRect();
        let volume = 1 - (event.clientY - boundingRect.top) / boundingRect.height;
        volume = Math.max(0, Math.min(1, volume));
        audioPlayer.volume = volume;
        volumeFill.style.height = (volume * 100) + '%';
        volumeKnob.style.bottom = (volume * 100) + '%';
    }
});

function setCookie(name, value, days) {
  const date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
  const expires = "expires=" + date.toUTCString();
  document.cookie = name + "=" + value + ";" + expires + ";path=/";
}

// Function to get a cookie
function getCookie(name) {
  const cookieName = name + "=";
  const decodedCookie = decodeURIComponent(document.cookie);
  const cookieArray = decodedCookie.split(';');
  for (let i = 0; i < cookieArray.length; i++) {
      let cookie = cookieArray[i];
      while (cookie.charAt(0) == ' ') {
          cookie = cookie.substring(1);
      }
      if (cookie.indexOf(cookieName) == 0) {
          return cookie.substring(cookieName.length, cookie.length);
      }
  }
  return "";
}

// Function to load tracks from cookies
function loadTracksFromCookies() {
  const trackData = getCookie("audio_tracks");
  if (trackData !== "") {
      const tracks = JSON.parse(trackData);
      tracks.forEach(track => {
          addTrack(track);
      });
  }
}

function saveTracksToCookies(tracks) {
  setCookie("audio_tracks", JSON.stringify(tracks), 30); // Cookie expires in 30 days
}

window.onload = function() {
  loadTracksFromCookies();
}
