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
      document.getElementById("currentTrack").textContent = data.current_track.item.name;
    })
    .catch((error) => {
      console.error("Error:", error);
    });
}
