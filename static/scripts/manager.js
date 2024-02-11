const Metrics = { Artists: 'artists', Tracks: 'tracks' };

async function authorize() {
  try {
    const response = await fetch('/auth');
    const data = await response.json();
    window.location.href = data.auth_url;
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getTopArtists(timeRange) {
  try {
    const response = await fetch(`/top-artists/${timeRange}`);
    const data = await response.json();
    displayItems(data, Metrics.Artists);
  } catch (error) {
    console.error('Error:', error);
  }
}

async function getTopTracks(timeRange) {
  try {
    const response = await fetch(`/top-tracks/${timeRange}`);
    const data = await response.json();
    displayItems(data, Metrics.Tracks);
  } catch (error) {
    console.error('Error:', error);
  }
}

function displayItems(data, content) {
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';
  const itemsPerRow = 5;

  const items = content === Metrics.Artists ? data.artists.items : data.tracks.items;

  let row;
  items.forEach((item, index) => {
    if (index % itemsPerRow === 0) {
      row = document.createElement('div');
      row.classList.add('row');
      contentContainer.appendChild(row);
    }
    const itemName = item.name;
    const itemImage = content === Metrics.Artists ? (item.images.length > 0 ? item.images[0].url : '') : (item.album.images.length > 0 ? item.album.images[0].url : '');
    const itemColumn = content === Metrics.Artists ? createArtistColumn(`${index + 1}. ${itemName}`, itemImage) : createTrackColumn(`${index + 1}. ${itemName}`, itemImage);
    row.appendChild(itemColumn);
  });
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
    const response = await fetch('/logout');
    const data = await response.json();
    window.location.href = data.logout;
  } catch (error) {
    console.error('Error:', error);
  }
}

document.addEventListener('DOMContentLoaded', function () {
  const timeRangeButtons = document.querySelectorAll('.btn-group button');
  const metricSelect = document.getElementById('metric-select');

  function handleButtonClick() {
    timeRangeButtons.forEach(btn => btn.classList.remove('active'));
    this.classList.add('active');
    document.getElementById('selected-time-range').value = this.getAttribute('data-range');
    const selectedTimeRange = document.getElementById('selected-time-range').value;
    const selectedMetric = metricSelect.value;
    clearContent();
    if (selectedMetric === Metrics.Artists) {
      getTopArtists(selectedTimeRange);
    } else if (selectedMetric === Metrics.Tracks) {
      getTopTracks(selectedTimeRange);
    }
  }

  timeRangeButtons.forEach(btn => btn.addEventListener('click', handleButtonClick));
  metricSelect.addEventListener('change', function() {
    const selectedTimeRange = document.getElementById('selected-time-range').value;
    const selectedMetric = metricSelect.value;
    clearContent();
    if (selectedMetric === Metrics.Artists) {
      getTopArtists(selectedTimeRange);
    } else if (selectedMetric === Metrics.Tracks) {
      getTopTracks(selectedTimeRange);
    }
  });

  const initialTimeRange = document.getElementById('selected-time-range').value;
  const initialMetric = metricSelect.value;
  if (initialMetric === Metrics.Artists) getTopArtists(initialTimeRange);
  else if (initialMetric === Metrics.Tracks) getTopTracks(initialTimeRange);
});

function clearContent() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}