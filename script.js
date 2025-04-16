let audioControls = document.querySelectorAll('.audio-control');
    
audioControls.forEach((control, index) => {
    const audio = new Audio();
    audio.style.display = 'none';
    control.appendChild(audio);
    const addTrackBtn = control.querySelector('.add-track-btn');
    const fileInput = control.querySelector('.file-input');
    const trackNameSpan = control.querySelector('.track-name');
    const [shuffleBtn, prevBtn, playBtn, nextBtn, repeatBtn] = control.querySelectorAll('.control-btn');
    const progressBar = control.querySelector('.progress-bar');
    const progressFill = control.querySelector('.progress-fill');
    const progressKnob = control.querySelector('.progress-knob');

    // Add Track logic
    addTrackBtn.addEventListener('click', () => fileInput.click());
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            audio.src = URL.createObjectURL(file);
            audio.load();
            playBtn.innerHTML = '&#9654;'; // Reset to play icon
            trackNameSpan.textContent = file.name;
        }
    });

    playBtn.addEventListener('click', () => {
        if (audio.src) {
            if (audio.paused) {
                audio.play();
                playBtn.innerHTML = '&#10073;&#10073;'; // Pause icon
            } else {
                audio.pause();
                playBtn.innerHTML = '&#9654;'; // Play icon
            }
        } else {
            addTrackBtn.click(); // Prompt to add track if none loaded
        }
    });

    audio.addEventListener('timeupdate', () => {
        if (audio.duration) {
            const percent = (audio.currentTime / audio.duration) * 100;
            progressFill.style.width = `${percent}%`;
            progressKnob.style.left = `${percent}%`;
            console.log('Progress:', audio.currentTime, '/', audio.duration, percent);
        }
    });

    progressBar.addEventListener('click', (e) => {
        const rect = progressBar.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const percent = Math.max(0, Math.min(1, x / rect.width));
        if (audio.duration) {
            audio.currentTime = percent * audio.duration;
        }
    });

    prevBtn.addEventListener('click', () => {
        audio.currentTime = 0;
    });
    nextBtn.addEventListener('click', () => {
        audio.currentTime = audio.duration;
    });
    repeatBtn.addEventListener('click', () => {
        audio.loop = !audio.loop;
        repeatBtn.style.color = audio.loop ? '#ffd700' : '#fff';
    });

    shuffleBtn.addEventListener('click', () => {
        alert('Shuffle clicked!');
    });
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
