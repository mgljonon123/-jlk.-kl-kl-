const searchInput = document.querySelector(".zaza");
const resultsContainer = document.querySelector(".new");
const searchResultsSection = document.getElementById("searchResultsSection");
const savedTracksSection = document.getElementById("savedTracksSection");
const favoritesSection = document.getElementById("favoritesSection");
const previewAudio = new Audio();

const playerTitle = document.querySelector(".player-title");
const playerArtist = document.querySelector(".player-artist");
const playerArtwork = document.querySelector(".player-artwork");
const playerPlayPauseBtn = document.getElementById("playerPlayPause");
const playerPlayPauseIcon =
  playerPlayPauseBtn && playerPlayPauseBtn.querySelector("i");
const playerProgressFill = document.querySelector(".player-progress-fill");

let currentPreviewUrl = null;
let currentTrackDurationMs = 0;
const API_BASE = "https://itunes.apple.com/search"; // api data avna itunes

// Storage keys
const SAVED_TRACKS_KEY = "savedTracks";
const FAVORITE_TRACKS_KEY = "favoriteTracks";

// Get saved/favorite tracks from localStorage
function getSavedTracks() {
  return JSON.parse(localStorage.getItem(SAVED_TRACKS_KEY) || "[]");
}

function getFavoriteTracks() {
  return JSON.parse(localStorage.getItem(FAVORITE_TRACKS_KEY) || "[]");
}

function saveTracks(tracks) {
  localStorage.setItem(SAVED_TRACKS_KEY, JSON.stringify(tracks));
}

function saveFavoriteTracks(tracks) {
  localStorage.setItem(FAVORITE_TRACKS_KEY, JSON.stringify(tracks));
}

// Check if track is saved/favorited
function isTrackSaved(trackId) {
  return getSavedTracks().some((track) => track.trackId === trackId);
}

function isTrackFavorited(trackId) {
  return getFavoriteTracks().some((track) => track.trackId === trackId);
}

// Add/remove saved track
function toggleSavedTrack(track) {
  console.log("Toggling saved track:", track);
  const saved = getSavedTracks();
  const index = saved.findIndex((t) => t.trackId === track.trackId);
  if (index > -1) {
    saved.splice(index, 1);
    console.log("Removed from saved");
  } else {
    saved.push(track);
    console.log("Added to saved");
  }
  saveTracks(saved);
  return index === -1; // true if added, false if removed
}

// Add/remove favorite track
function toggleFavoriteTrack(track) {
  console.log("Toggling favorite track:", track);
  const favorites = getFavoriteTracks();
  const index = favorites.findIndex((t) => t.trackId === track.trackId);
  if (index > -1) {
    favorites.splice(index, 1);
    console.log("Removed from favorites");
  } else {
    favorites.push(track);
    console.log("Added to favorites");
  }
  saveFavoriteTracks(favorites);
  return index === -1; // true if added, false if removed
}

// Navigation elements
const navHome = document.querySelector(".haha:nth-child(1)"); // Home
const navSave = document.querySelector(".haha:nth-child(2)"); // Save
const navHeart = document.querySelector(".haha:nth-child(3)"); // Heart

// Update counts in left nav (Save / Heart)
function updateNavCounts() {
  const savedCount = getSavedTracks().length;
  const favoriteCount = getFavoriteTracks().length;

  if (navSave) {
    const label = navSave.querySelector("h1");
    if (label) {
      label.textContent = savedCount > 0 ? `Save (${savedCount})` : "Save";
    }
  }

  if (navHeart) {
    const label = navHeart.querySelector("h1");
    if (label) {
      label.textContent =
        favoriteCount > 0 ? `Heart (${favoriteCount})` : "Heart";
    }
  }
}

// Section elements
const savedTracksContainer = document.querySelector(".saved-tracks-container");
const favoritesContainer = document.querySelector(".favorites-container");

// Show/hide sections
function showSection(section) {
  // Hide all sections
  searchResultsSection.classList.remove("is-visible");
  if (savedTracksSection) savedTracksSection.style.display = "none";
  if (favoritesSection) favoritesSection.style.display = "none";

  // Show the selected section
  if (section === "home") {
    searchResultsSection.classList.add("is-visible");
  } else if (section === "saved") {
    if (savedTracksSection) savedTracksSection.style.display = "block";
    renderSavedTracks();
  } else if (section === "favorites") {
    if (favoritesSection) favoritesSection.style.display = "block";
    renderFavoriteTracks();
  }
}

// Render saved tracks
function renderSavedTracks() {
  const savedTracks = getSavedTracks();
  if (!savedTracksContainer) return;

  if (!savedTracks.length) {
    savedTracksContainer.innerHTML =
      '<p class="empty-message">No saved tracks yet. Save some tracks to see them here.</p>';
    return;
  }

  savedTracksContainer.innerHTML = savedTracks
    .map((track) => {
      const artwork =
        track.artworkUrl100 ||
        "https://via.placeholder.com/100x100?text=No+Image";
      const title = track.trackName || "Unknown Title";
      const artist = track.artistName || "Unknown Artist";
      const album = track.collectionName || "";

      return `
        <div class="duu track-card" data-preview="${track.previewUrl}" data-duration-ms="${track.trackTimeMillis}" data-track-id="${track.trackId}">
          <img class="hiphop" src="${artwork}" alt="${title}">
          <h1>${title}</h1>
          <h2>${artist}${album ? " • " + album : ""}</h2>
          <div class="track-buttons">
            <button class="track-btn save-btn saved" data-action="save" title="Remove from saved">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="track-btn favorite-btn ${isTrackFavorited(track.trackId) ? "favorited" : ""}" data-action="favorite" title="${isTrackFavorited(track.trackId) ? "Remove from favorites" : "Add to favorites"}">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// Render favorite tracks
function renderFavoriteTracks() {
  const favoriteTracks = getFavoriteTracks();
  if (!favoritesContainer) return;

  if (!favoriteTracks.length) {
    favoritesContainer.innerHTML =
      '<p class="empty-message">No favorite tracks yet. Add some tracks to favorites to see them here.</p>';
    return;
  }

  favoritesContainer.innerHTML = favoriteTracks
    .map((track) => {
      const artwork =
        track.artworkUrl100 ||
        "https://via.placeholder.com/100x100?text=No+Image";
      const title = track.trackName || "Unknown Title";
      const artist = track.artistName || "Unknown Artist";
      const album = track.collectionName || "";

      return `
        <div class="duu track-card" data-preview="${track.previewUrl}" data-duration-ms="${track.trackTimeMillis}" data-track-id="${track.trackId}">
          <img class="hiphop" src="${artwork}" alt="${title}">
          <h1>${title}</h1>
          <h2>${artist}${album ? " • " + album : ""}</h2>
          <div class="track-buttons">
            <button class="track-btn save-btn ${isTrackSaved(track.trackId) ? "saved" : ""}" data-action="save" title="${isTrackSaved(track.trackId) ? "Remove from saved" : "Save track"}">
              <i class="fas fa-bookmark"></i>
            </button>
            <button class="track-btn favorite-btn ${isTrackFavorited(track.trackId) ? "favorited" : ""}" data-action="favorite" title="${isTrackFavorited(track.trackId) ? "Remove from favorites" : "Add to favorites"}">
              <i class="fas fa-heart"></i>
            </button>
          </div>
        </div>
      `;
    })
    .join("");
}

// Navigation event listeners
if (navHome) {
  navHome.addEventListener("click", () => showSection("home"));
}

if (navSave) {
  navSave.addEventListener("click", () => showSection("saved"));
}

if (navHeart) {
  navHeart.addEventListener("click", () => showSection("favorites"));
}

if (searchInput && resultsContainer) {
  let debounceTimeout = null;

  searchInput.addEventListener("input", () => {
    const query = searchInput.value.trim(); // yum biched
    clearTimeout(debounceTimeout);

    if (query.length < 2) {
      resultsContainer.innerHTML = "";
      if (searchResultsSection)
        searchResultsSection.classList.remove("is-visible");
      return;
    }

    debounceTimeout = setTimeout(() => fetchMusic(query), 400);
  });

  async function fetchMusic(query) {
    if (searchResultsSection) searchResultsSection.classList.add("is-visible");
    resultsContainer.innerHTML = '<p class="search-loading">Searching…</p>';

    try {
      const res = await fetch(
        `${API_BASE}?term=${encodeURIComponent(query)}&entity=song&limit=20`,
      );
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      renderResults(data.results || []);
    } catch (e) {
      console.error(e);
      resultsContainer.innerHTML =
        '<p class="search-error">Failed to load music. Please try again.</p>';
    }
  }

  // Search using iTunes API and automatically play the first result.
  async function searchAndPlay(query) {
    if (!query) return;

    // Reflect query in the search input for UX
    if (searchInput) {
      searchInput.value = query;
    }

    await fetchMusic(query);

    // Click the first track card to start playing
    const firstCard = resultsContainer.querySelector(".duu.track-card");
    if (firstCard) {
      firstCard.click();
    }
  }

  function renderResults(tracks) {
    if (!tracks.length) {
      resultsContainer.innerHTML =
        '<p class="search-empty">No results found. Try another search.</p>';
      return;
    }

    resultsContainer.innerHTML = tracks
      .map((track) => {
        const artwork =
          track.artworkUrl100 ||
          "https://via.placeholder.com/100x100?text=No+Image";
        const title = track.trackName || "Unknown Title";
        const artist = track.artistName || "Unknown Artist";
        const album = track.collectionName || "";
        const previewUrl = track.previewUrl || "";
        const durationMs = track.trackTimeMillis || 0;
        const trackId =
          track.trackId ||
          track.trackViewUrl ||
          `${track.artistName}-${track.trackName}`.replace(/\s+/g, "-"); // Fallback ID

        console.log("Rendering track:", { trackId, title, artist });

        const isSaved = isTrackSaved(trackId);
        const isFavorited = isTrackFavorited(trackId);

        return `
          <div class="duu track-card" data-preview="${previewUrl}" data-duration-ms="${durationMs}" data-track-id="${trackId}">
            <img class="hiphop" src="${artwork}" alt="${title}">
            <h1>${title}</h1>
            <h2>${artist}${album ? " • " + album : ""}</h2>
            <div class="track-buttons">
              <button class="track-btn save-btn ${isSaved ? "saved" : ""}" data-action="save" title="${isSaved ? "Remove from saved" : "Save track"}">
                <i class="fas fa-bookmark"></i>
              </button>
              <button class="track-btn favorite-btn ${isFavorited ? "favorited" : ""}" data-action="favorite" title="${isFavorited ? "Remove from favorites" : "Add to favorites"}">
                <i class="fas fa-heart"></i>
              </button>
            </div>
          </div>
        `;
      })
      .join("");
  }

  resultsContainer.addEventListener("click", handleTrackClick);

  // Event listeners for saved and favorites sections
  if (savedTracksContainer) {
    savedTracksContainer.addEventListener("click", handleTrackClick);
  }

  if (favoritesContainer) {
    favoritesContainer.addEventListener("click", handleTrackClick);
  }

  // Make static Hip-hop / Emo / Chillout / Popular artists cards playable
  const staticCards = document.querySelectorAll(
    ".Popular .duu, .Hiphop .torol .duu, .bvh .chill, .artists .zee",
  );

  staticCards.forEach((card) => {
    card.addEventListener("click", () => {
      const titleEl = card.querySelector("h1");
      const artistEl = card.querySelector("h2");

      const title = titleEl ? titleEl.textContent.trim() : "";
      const artist = artistEl ? artistEl.textContent.trim() : "";

      const query = artist ? `${title} ${artist}`.trim() : title;
      searchAndPlay(query);
    });
  });

  function handleTrackClick(event) {
    const button = event.target.closest(".track-btn");
    if (button) {
      // Prevent double-handling the same click (e.g. double-clicks)
      if (button.dataset.busy === "1") {
        return;
      }
      button.dataset.busy = "1";

      event.stopPropagation();
      const card = button.closest(".duu");
      const trackId = card.dataset.trackId; // Use the stored trackId from data attribute
      const action = button.dataset.action;

      // Find the track data from the current search results or saved/favorites
      const trackElement = card;
      const imgEl = trackElement.querySelector("img");
      const titleEl = trackElement.querySelector("h1");
      const artistEl = trackElement.querySelector("h2");

      const track = {
        trackId,
        trackName: titleEl ? titleEl.textContent : "Unknown Title",
        artistName: artistEl
          ? artistEl.textContent.split(" • ")[0]
          : "Unknown Artist",
        collectionName:
          artistEl && artistEl.textContent.includes(" • ")
            ? artistEl.textContent.split(" • ")[1]
            : "",
        artworkUrl100: imgEl ? imgEl.getAttribute("src") : "",
        previewUrl: card.dataset.preview,
        trackTimeMillis: parseInt(card.dataset.durationMs, 10) || 0,
      };

      console.log("Button clicked:", action, "for track:", track);

      if (action === "save") {
        const isNowSaved = toggleSavedTrack(track);
        button.classList.toggle("saved", isNowSaved);
        button.title = isNowSaved ? "Remove from saved" : "Save track";
        updateNavCounts();
        // Refresh the current view if in saved section
        if (savedTracksSection && savedTracksSection.style.display !== "none") {
          renderSavedTracks();
        }
      } else if (action === "favorite") {
        const isNowFavorited = toggleFavoriteTrack(track);
        button.classList.toggle("favorited", isNowFavorited);
        button.title = isNowFavorited
          ? "Remove from favorites"
          : "Add to favorites";
        updateNavCounts();
        // Refresh the current view if in favorites section
        if (favoritesSection && favoritesSection.style.display !== "none") {
          renderFavoriteTracks();
        }
      }
      // Small timeout so quick double-clicks don't toggle twice
      setTimeout(() => {
        button.dataset.busy = "0";
      }, 250);
      return;
    }

    const card = event.target.closest(".duu");
    if (!card) return;

    const previewUrl = card.dataset.preview;
    if (!previewUrl) return;

    currentTrackDurationMs = parseInt(card.dataset.durationMs, 10) || 0;

    const imgEl = card.querySelector("img");
    const titleEl = card.querySelector("h1");
    const artistEl = card.querySelector("h2");

    const artworkSrc =
      (imgEl && imgEl.getAttribute("src")) ||
      "https://via.placeholder.com/60x60?text=♪";
    const titleText = (titleEl && titleEl.textContent) || "Unknown Title";
    const artistText = (artistEl && artistEl.textContent) || "Unknown Artist";

    if (currentPreviewUrl === previewUrl && !previewAudio.paused) {
      previewAudio.pause();
      return;
    }

    currentPreviewUrl = previewUrl;
    previewAudio.src = previewUrl;

    if (playerArtwork) playerArtwork.src = artworkSrc;
    if (playerTitle) playerTitle.textContent = titleText;
    if (playerArtist) playerArtist.textContent = artistText;

    previewAudio.play().then(updatePlayPauseIcon).catch(console.error);
  }

  if (playerPlayPauseBtn) {
    playerPlayPauseBtn.addEventListener("click", () => {
      if (!currentPreviewUrl) return;

      if (previewAudio.paused) {
        previewAudio.play().then(updatePlayPauseIcon).catch(console.error);
      } else {
        previewAudio.pause();
        updatePlayPauseIcon();
      }
    });
  }

  previewAudio.addEventListener("timeupdate", () => {
    if (!playerProgressFill) return;
    const fullSec = currentTrackDurationMs / 1000;
    const duration = fullSec > 0 ? fullSec : previewAudio.duration || 0;
    if (!duration || isNaN(duration)) return;
    const percent = Math.min(100, (previewAudio.currentTime / duration) * 100);
    playerProgressFill.style.width = `${percent}%`;
  });

  previewAudio.addEventListener("play", updatePlayPauseIcon);
  previewAudio.addEventListener("pause", updatePlayPauseIcon);
  previewAudio.addEventListener("ended", () => {
    if (playerProgressFill) playerProgressFill.style.width = "0%";
    updatePlayPauseIcon();
  });
}

function updatePlayPauseIcon() {
  if (!playerPlayPauseIcon) return;
  if (previewAudio.paused) {
    playerPlayPauseIcon.classList.remove("fa-pause");
    playerPlayPauseIcon.classList.add("fa-play");
  } else {
    playerPlayPauseIcon.classList.remove("fa-play");
    playerPlayPauseIcon.classList.add("fa-pause");
  }
}

// Helper functions for checking track status
function isTrackSaved(trackId) {
  const savedTracks = getSavedTracks();
  return savedTracks.some((track) => track.trackId === trackId);
}

function isTrackFavorited(trackId) {
  const favoriteTracks = getFavoriteTracks();
  return favoriteTracks.some((track) => track.trackId === trackId);
}

// Function to render saved tracks
function renderSavedTracks() {
  const savedTracks = getSavedTracks();
  const container = document.querySelector(".saved-tracks-container");
  if (!container) return;

  container.innerHTML = "";

  if (savedTracks.length === 0) {
    container.innerHTML =
      '<p class="no-tracks">No saved tracks yet. Search for music and save your favorite tracks!</p>';
    return;
  }

  savedTracks.forEach((track) => {
    const trackElement = createTrackElement(track, true);
    container.appendChild(trackElement);
  });
}

// Function to render favorite tracks
function renderFavoriteTracks() {
  const favoriteTracks = getFavoriteTracks();
  const container = document.querySelector(".favorites-container");
  if (!container) return;

  container.innerHTML = "";

  if (favoriteTracks.length === 0) {
    container.innerHTML =
      '<p class="no-tracks">No favorite tracks yet. Search for music and add tracks to your favorites!</p>';
    return;
  }

  favoriteTracks.forEach((track) => {
    const trackElement = createTrackElement(track, true);
    container.appendChild(trackElement);
  });
}

// Helper function to create track element for saved/favorites
function createTrackElement(track, isFromSavedOrFavorites = false) {
  const duu = document.createElement("div");
  duu.className = "duu";
  duu.dataset.trackId =
    track.trackId || `fallback-${Date.now()}-${Math.random()}`;
  duu.dataset.preview = track.previewUrl || "";
  duu.dataset.durationMs = track.trackTimeMillis || 0;

  const img = document.createElement("img");
  img.src = track.artworkUrl100 || "https://via.placeholder.com/60x60?text=♪";
  img.alt = `${track.trackName} artwork`;

  const h1 = document.createElement("h1");
  h1.textContent = track.trackName || "Unknown Title";

  const h2 = document.createElement("h2");
  h2.textContent = `${track.artistName || "Unknown Artist"}${track.collectionName ? ` • ${track.collectionName}` : ""}`;

  const buttonsDiv = document.createElement("div");
  buttonsDiv.className = "track-buttons";

  // Save button
  const saveBtn = document.createElement("button");
  saveBtn.className = `track-btn save-btn ${isTrackSaved(track.trackId) ? "saved" : ""}`;
  saveBtn.dataset.action = "save";
  saveBtn.title = isTrackSaved(track.trackId)
    ? "Remove from saved"
    : "Save track";
  saveBtn.innerHTML = '<i class="fas fa-bookmark"></i>';

  // Favorite button
  const favoriteBtn = document.createElement("button");
  favoriteBtn.className = `track-btn favorite-btn ${isTrackFavorited(track.trackId) ? "favorited" : ""}`;
  favoriteBtn.dataset.action = "favorite";
  favoriteBtn.title = isTrackFavorited(track.trackId)
    ? "Remove from favorites"
    : "Add to favorites";
  favoriteBtn.innerHTML = '<i class="fas fa-heart"></i>';

  buttonsDiv.appendChild(saveBtn);
  buttonsDiv.appendChild(favoriteBtn);

  duu.appendChild(img);
  duu.appendChild(h1);
  duu.appendChild(h2);
  duu.appendChild(buttonsDiv);

  return duu;
}

// Navigation event listeners
document.addEventListener("DOMContentLoaded", () => {
  // Get navigation items
  const navItems = document.querySelectorAll(".haha");
  const homeNav = navItems[0]; // First .haha is Home
  const savedNav = navItems[1]; // Second .haha is Save
  const favoritesNav = navItems[2]; // Third .haha is Heart (Favorites)

  // Function to show section
  function showSection(sectionName) {
    // Hide all sections
    // For search, we rely on the is-visible class (controlled by search logic),
    // so just remove it instead of forcing inline display styles.
    if (searchResultsSection)
      searchResultsSection.classList.remove("is-visible");
    if (savedTracksSection) savedTracksSection.style.display = "none";
    if (favoritesSection) favoritesSection.style.display = "none";

    // Remove active class from all nav items
    navItems.forEach((item) => item.classList.remove("active"));

    if (sectionName === "home") {
      // On Home we do not force search results visible;
      // Hip-hop / Popular artists static sections remain as main content.
      if (homeNav) homeNav.classList.add("active");
    } else if (sectionName === "saved") {
      if (savedTracksSection) savedTracksSection.style.display = "block";
      if (savedNav) savedNav.classList.add("active");
      renderSavedTracks();
    } else if (sectionName === "favorites") {
      if (favoritesSection) favoritesSection.style.display = "block";
      if (favoritesNav) favoritesNav.classList.add("active");
      renderFavoriteTracks();
    }

    // Keep nav counts in sync whenever section changes
    updateNavCounts();
  }

  // Add click listeners to navigation
  if (homeNav) {
    homeNav.addEventListener("click", () => showSection("home"));
  }
  if (savedNav) {
    savedNav.addEventListener("click", () => showSection("saved"));
  }
  if (favoritesNav) {
    favoritesNav.addEventListener("click", () => showSection("favorites"));
  }

  // Show home section by default
  showSection("home");

  // Initial nav counts on load
  updateNavCounts();
});
