const appendElement = (parentId, elementType, content) => {
  const element = document.createElement(elementType);
  element.textContent = content;
  document.getElementById(parentId).appendChild(element);
}

async function appendCarouselItems(data, containerSelector) {
  try {
    const container = document.querySelector(containerSelector);
    const carouselInner = container.querySelector(".carousel-inner");
    const carouselIndicators = container.querySelector(".carousel-indicators");

    carouselIndicators.innerHTML = "";
    carouselInner.innerHTML = "";

    data.forEach((item, index) => {
      const carouselItem = document.createElement("div");
      carouselItem.classList.add("carousel-item");

      const image = document.createElement("img");
      image.classList.add("d-block");
      image.src = item.images[0].url;
      image.alt = `${index + 1}. ${item.name}`;

      const caption = document.createElement("div");
      caption.classList.add("carousel-caption", "d-none", "d-md-block");

      const heading = document.createElement("h5");
      heading.textContent = `${index + 1}. ${item.name}`;

      // FIXME: caption inside of image (place it below? how?)
      caption.appendChild(heading);
      carouselItem.appendChild(image);
      carouselItem.appendChild(caption);
      carouselInner.appendChild(carouselItem);

      const indicator = document.createElement("button");
      indicator.setAttribute("data-bs-target", containerSelector);
      indicator.setAttribute("data-bs-slide-to", index.toString());
      if (index === 0) {
        indicator.classList.add("active");
        indicator.setAttribute("aria-current", "true");
      }
      carouselIndicators.appendChild(indicator);
    });

    carouselInner.firstChild.classList.add("active");
  } catch (error) {
    console.error("Error:", error);
  }
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

    document.getElementById("topArtistsCarousel").style.display = "block";
    appendCarouselItems(
      data.artists.items,
      "#topArtistsCarousel"
    );    
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
