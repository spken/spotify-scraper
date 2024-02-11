const Metrics = {
  Artists: 'artists',
  Tracks: 'tracks',
}

/**
 * Authorizes the user by fetching authentication data from the server and redirecting to the authentication URL
 */
async function authorize() {
  try {
    const response = await fetch('/auth');
    const data = await response.json();
    window.location.href = data.auth_url;
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Fetches and displays the top artists based on the given time range
 * @param {string} timeRange - The time range for which to fetch the top artists
 */
async function getTopArtists(timeRange) {
  try {
    const response = await fetch(`/top-artists/${timeRange}`);
    const data = await response.json();
    displayItems(data, Metrics.Artists);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Fetches and displays the top tracks based on the given time range
 * @param {string} timeRange - The time range for which to fetch the top tracks
 */
async function getTopTracks(timeRange) {
  try {
    const response = await fetch(`/top-tracks/${timeRange}`);
    const data = await response.json();
    displayItems(data, Metrics.Tracks);
  } catch (error) {
    console.error('Error:', error);
  }
}

/**
 * Displays the fetched items on the UI
 * @param {Object} data - The data containing the items to display
 * @param {string} content - The type of content to display (artists or tracks)
 */
function displayItems(data, content) {
  const contentContainer = document.getElementById('content');
  contentContainer.innerHTML = '';

  const itemsPerRow = 5;
  let row;

  if (content === Metrics.Artists) {
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
  } else if (content === Metrics.Tracks) {
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

/**
 * Creates a column for displaying artist information
 * @param {string} artistName - The name of the artist
 * @param {string} artistImage - The URL of the artist's image
 * @returns {HTMLElement} - The created column element
 */
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

/**
 * Creates a column for displaying track information
 * @param {string} trackName - The name of the track
 * @param {string} trackImage - The URL of the track's image
 * @returns {HTMLElement} - The created column element
 */
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

/**
 * Logs out the user by fetching logout data from the server and redirecting to the logout URL
 */
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

  /**
   * Handles the selection of time range buttons
   * Sort of a custom 'radio button'
   */
  function handleButtonClick() {
    timeRangeButtons.forEach(function(btn) {
      btn.classList.remove('active');
    });
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

  timeRangeButtons.forEach(function(button) {
    button.addEventListener('click', handleButtonClick);
  });


  /**
   * Calls content display depending on metric
   */
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

  /**
   * Calls content display on page load
   */
  const initialTimeRange = document.getElementById('selected-time-range').value;
  const initialMetric = metricSelect.value;
  if (initialMetric === Metrics.Artists) {
    getTopArtists(initialTimeRange);
  } else if (initialMetric === Metrics.Tracks) {
    getTopTracks(initialTimeRange);
  }
});

/**
 * Clears the content of the content container
 */
function clearContent() {
  const content = document.getElementById('content');
  content.innerHTML = '';
}