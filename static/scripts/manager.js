const appendElement = (parentId, elementType, content) => {
  const element = document.createElement(elementType);
  element.textContent = content;
  document.getElementById(parentId).appendChild(element);
}

async function authorize() {
  try {
    const response = await fetch("/auth");
    const data = await response.json();
    window.location.href = data.auth_url;
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getCurrentTrack() {
  try {
    const response = await fetch("/current-track");
    const data = await response.json();

    if (data.current_track.item) {
      const { name, external_urls, album } = data.current_track.item;
    
      document.getElementById("link").textContent = name;
      document.getElementById("link").href = external_urls.spotify;
      document.getElementById("image").src = album.images[0].url;
    }
    else {
      document.getElementById("link").textContent = data.current_track;
    }

  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTopArtists() {
  try {
    const response = await fetch("/top-artists");
    const data = await response.json();

    data.artists.items.forEach((artist, index) => {
      const artistName = artist.name;
      appendElement("artists", "p", `${index + 1}. ${artistName}`);
    });
  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTopTracks() {
  try {
    const response = await fetch("/top-tracks");
    const data = await response.json();

    data.tracks.items.forEach((track, index) => {
      const trackName = track.name;
      appendElement("tracks", "p", `${index + 1}. ${trackName}`);
    });
  } catch (error) {
    console.error("Error:", error);
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
