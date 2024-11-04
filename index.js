// index.js

// Spotify credentials - Replace with your own
const clientID = 'YOUR_SPOTIFY_CLIENT_ID';
const redirectURI = 'http://localhost:3000'; // or your deployed app URL

// Check if the access token is in the URL
const accessToken = new URLSearchParams(window.location.hash).get('#access_token');

// If no token, redirect to Spotify for authentication
if (!accessToken) {
    document.location.href = `https://accounts.spotify.com/authorize?client_id=${clientID}&response_type=token&redirect_uri=${redirectURI}&scope=user-read-private user-read-recently-played playlist-read-private`;
} else {
    // Load user and playlists once authenticated
    fetchUserProfile();
    fetchUserPlaylists();
    fetchRecentlyPlayed();
}

// Fetch user profile information
function fetchUserProfile() {
    fetch('https://api.spotify.com/v1/me', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => {
        const profileHTML = `
            <img src="${data.images[0].url}" alt="User Profile" class="profile-img">
            <span>${data.display_name}</span>
        `;
        document.getElementById('user-profile').innerHTML = profileHTML;
    });
}

// Fetch user playlists
function fetchUserPlaylists() {
    fetch('https://api.spotify.com/v1/me/playlists', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => {
        const playlistHTML = data.items.map(playlist => `
            <a href="${playlist.external_urls.spotify}" target="_blank" class="playlist-item">
                ${playlist.name}
            </a>
        `).join('');
        document.getElementById('playlist-section').innerHTML += playlistHTML;
    });
}

// Fetch recently played tracks
function fetchRecentlyPlayed() {
    fetch('https://api.spotify.com/v1/me/player/recently-played', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => {
        const recentHTML = data.items.map(item => `
            <div class="album">
                <img src="${item.track.album.images[0].url}" alt="${item.track.name}">
                <p>${item.track.name}</p>
            </div>
        `).join('');
        document.getElementById('recent-albums').innerHTML = recentHTML;
    });
}

// Fetch featured playlists
function fetchFeaturedPlaylists() {
    fetch('https://api.spotify.com/v1/browse/featured-playlists', {
        headers: { 'Authorization': 'Bearer ' + accessToken }
    })
    .then(response => response.json())
    .then(data => {
        const featuredHTML = data.playlists.items.map(playlist => `
            <div class="playlist">
                <img src="${playlist.images[0].url}" alt="${playlist.name}">
                <p>${playlist.name}</p>
            </div>
        `).join('');
        document.getElementById('featured-playlists-grid').innerHTML = featuredHTML;
    });
}

fetchFeaturedPlaylists();
