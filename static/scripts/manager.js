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
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const itemsPerRow = 5;
  let row;

  if (content === "artists") {
    data.artists.items.forEach((artist, index) => {
      if (index % itemsPerRow === 0) {
        row = document.createElement('div');
        row.classList.add('row');
        contentContainer.appendChild(row);
      }
      const artistName = artist.name;
      const artistImage = artist.images.length > 0 ? artist.images[0].url : '';
      const artistColumn = createArtistColumn(`${index + 1}. ${artistName}`, artistImage);
      row.appendChild(artistColumn);
    });
  } else if (content === "tracks") {
    data.tracks.items.forEach((track, index) => {
      if (index % itemsPerRow === 0) {
        row = document.createElement('div');
        row.classList.add('row');
        contentContainer.appendChild(row);
      }
      const trackName = track.name;
      const trackImage = track.album.images.length > 0 ? track.album.images[0].url : '';
      const trackColumn = createTrackColumn(`${index + 1}. ${trackName}`, trackImage);
      row.appendChild(trackColumn);
    });
  }
}

function createArtistColumn(artistName, artistImage) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('col-2', 'mb-4');

  const artistDiv = document.createElement('div');
  artistDiv.classList.add('text-center');

  const imageElement = document.createElement('img');
  imageElement.src = artistImage;
  imageElement.classList.add('img-fluid', 'rounded-circle', 'mb-2');
  imageElement.style.maxWidth = '100%';

  const artistNameElement = document.createElement('p');
  artistNameElement.textContent = artistName;

  artistDiv.appendChild(imageElement);
  artistDiv.appendChild(artistNameElement);

  columnDiv.appendChild(artistDiv);
  return columnDiv;
}

function createTrackColumn(trackName, trackImage) {
  const columnDiv = document.createElement('div');
  columnDiv.classList.add('col-2', 'mb-4');

  const trackDiv = document.createElement('div');
  trackDiv.classList.add('text-center');

  const imageElement = document.createElement('img');
  imageElement.src = trackImage;
  imageElement.classList.add('img-fluid', 'mb-2');
  imageElement.style.maxWidth = '100%';

  const trackNameElement = document.createElement('p');
  trackNameElement.textContent = trackName;

  trackDiv.appendChild(imageElement);
  trackDiv.appendChild(trackNameElement);

  columnDiv.appendChild(trackDiv);
  return columnDiv;
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
  const metricSelect = document.getElementById('metric-select');

  timeRangeButtons.forEach(function(button) {
    button.addEventListener('click', function() {
      timeRangeButtons.forEach(function(btn) {
        btn.classList.remove('active');
      });
      this.classList.add('active');
      document.getElementById('selected-time-range').value = this.getAttribute('data-range');
      const selectedTimeRange = document.getElementById('selected-time-range').value;
      const selectedMetric = metricSelect.value;
      clearContent();
      if (selectedMetric === 'artists') {
        getTopArtists(selectedTimeRange);
      } else if (selectedMetric === 'tracks') {
        getTopTracks(selectedTimeRange);
      }
    });
  });

  metricSelect.addEventListener('change', function() {
    const selectedTimeRange = document.getElementById('selected-time-range').value;
    const selectedMetric = metricSelect.value;
    clearContent();
    if (selectedMetric === 'artists') {
      getTopArtists(selectedTimeRange);
    } else if (selectedMetric === 'tracks') {
      getTopTracks(selectedTimeRange);
    }
  });

  const initialTimeRange = document.getElementById('selected-time-range').value;
  const initialMetric = metricSelect.value;
  if (initialMetric === 'artists') {
    getTopArtists(initialTimeRange);
  } else if (initialMetric === 'tracks') {
    getTopTracks(initialTimeRange);
  }
});

function clearContent() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}