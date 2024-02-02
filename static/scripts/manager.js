async function authorize() {
  fetch("/auth")
    .then((response) => response.json())
    .then((data) => {
      // redirect the user to the spotify authorization page
      window.location.href = data.auth_url;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function getCurrentTrack() {
  fetch("/current")
    .then((response) => response.json())
    .then((data) => {
      document.getElementById("link").textContent = data.current_track.item.name;
      document.getElementById("link").href = data.current_track.item.external_urls.spotify;
      document.getElementById("image").src = data.current_track.item.album.images[0].url;
      document.getElementById("image").height = 210;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}

async function logout() {
  fetch("/logout")
    .then((response) => response.json())
    .then((data) => {
      // redirect the user to index page
      window.location.href = data.logout;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}