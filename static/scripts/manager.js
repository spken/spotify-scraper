async function authorize() {
  try {
    const response = await fetch("/auth");
    const data = await response.json();
    window.location.href = data.auth_url;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTopArtists(timeRange) {
  try {
    const response = await fetch(`/top-artists/${timeRange}`);
    const data = await response.json();

    displayItems(data, "artists");

  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTopTracks(timeRange) {
  try {
    const response = await fetch(`/top-tracks/${timeRange}`);
    const data = await response.json();

    displayItems(data, "tracks");

  } catch (error) {
    console.error("Error:", error);
  }
}

const appendElement = (parentId, elementType, content) => {
  const element = document.createElement(elementType);
  element.textContent = content;
  document.getElementById(parentId).appendChild(element);
}

function displayItems(data, content) {
  if (content === "artists") {
    // TODO: artist data
  }
  else if (content === "tracks") {
    // TODO: track data
    data.tracks.items.forEach((track, index) => {
      const trackName = track.name;
      appendElement("content", "p", `${index + 1}. ${trackName}`);
    });
  }
}

async function logout() {
  try {
    const response = await fetch("/logout");
    const data = await response.json();
    window.location.href = data.logout;
  } catch (error) {
    console.error("Error:", error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const timeRangeButtons = document.querySelectorAll('.btn-group button');

  timeRangeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      timeRangeButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
        this.classList.add('active');
        document.getElementById('selected-time-range').value = this.getAttribute('data-range');
    });
  });
});

// TODO: action listener for onload and selection