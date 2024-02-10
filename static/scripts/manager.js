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

    // TODO: do something with the data

  } catch (error) {
    console.error("Error:", error);
  }
}

async function getTopTracks(timeRange) {
  try {
    const response = await fetch(`/top-tracks/${timeRange}`);
    const data = await response.json();

    // TODO: do something with the data

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
