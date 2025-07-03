(function() {
    'use strict';

    // --- Configuration Options ---
    // Change this to 'Movie,Series' if you want to include both movies and TV shows
    // Set to 'Movie' for movies only, or 'Series' for TV shows only.
    const ITEM_TYPES_TO_INCLUDE = 'Movie';
    // --- End Configuration Options ---

    const getJellyfinServerAddress = () => window.location.origin;

    // Function to inject Material Design Icons stylesheet (Standard)
    const injectMaterialIcons = () => {
        if (!document.getElementById('material-icons-stylesheet')) {
            const link = document.createElement('link');
            link.id = 'material-icons-stylesheet';
            link.rel = 'stylesheet';
            link.href = 'https://fonts.googleapis.com/icon?family=Material+Icons';
            document.head.appendChild(link);
            console.log("Jellyfin Random Button: Material Design Icons stylesheet (Standard) injected.");
        }
    };

    // Function to inject custom CSS rules
    const injectCustomCss = () => {
        if (!document.getElementById('random-movie-button-custom-css')) {
            const style = document.createElement('style');
            style.id = 'random-movie-button-custom-css';
            style.innerHTML = `
                .random-movie-button .md-icon {
                    font-family: 'Material Icons' !important;
                    font-style: normal !important;
                    font-size: 24px !important;
                }
                button#randomMovieButton {
                    padding: 0px !important;
                    margin: 0px 5px 0px 10px !important;
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                }
            `;
            document.head.appendChild(style);
            console.log("Jellyfin Random Button: Custom CSS injected.");
        }
    };

    const getRandomMovie = async () => {
        const userId = ApiClient.getCurrentUserId();

        if (!userId) {
            console.error("Jellyfin Random Button: User ID not found. Are you logged in?");
            alert("Please log in to use the random movie feature.");
            return null;
        }

        const serverAddress = getJellyfinServerAddress();
        const timestamp = Date.now(); // Cache buster
        const fetchLimit = 20; // Fetch 20 random items, then pick one client-side

        // Construct the full API URL using the configurable ITEM_TYPES_TO_INCLUDE
        const apiUrl = `${serverAddress}/Users/${userId}/Items?IncludeItemTypes=${ITEM_TYPES_TO_INCLUDE}&Recursive=true&SortBy=Random&Limit=${fetchLimit}&Fields=ExternalUrls&_=${timestamp}`;
        console.log("Jellyfin Random Button: Fetching random item from:", apiUrl);

        try {
            const response = await ApiClient.ajax({
                type: 'GET',
                url: apiUrl,
                headers: {
                    'Content-Type': 'application/json'
                },
                dataType: 'json'
            });

            const data = response;

            if (data && data.Items && data.Items.length > 0) {
                // Pick a truly random item from the fetched batch client-side
                const randomIndex = Math.floor(Math.random() * data.Items.length);
                return data.Items[randomIndex];
            } else {
                throw new Error("No items found or API returned empty list.");
            }
        } catch (error) {
            console.error("Jellyfin Random Button: Error fetching random item:", error);
            const errorMessage = error.responseJSON && error.responseJSON.Message ? error.responseJSON.Message : error.statusText || error.message || 'Unknown API Error';
            alert(`Error getting random item: ${errorMessage}. Check console for details.`);
            return null;
        }
    };

    const navigateToMovie = (movie) => {
        if (movie && movie.Id) {
            const serverAddress = getJellyfinServerAddress();
            const serverId = ApiClient.serverId();

            const movieUrl = `${serverAddress}/web/index.html#!/details?id=${movie.Id}${serverId ? `&serverId=${serverId}` : ''}`;
            console.log("Jellyfin Random Button: Navigating to:", movieUrl);
            window.location.href = movieUrl;
        } else {
            console.error("Jellyfin Random Button: Invalid item object or ID:", movie);
            alert("Could not navigate to item details. Item ID is missing.");
        }
    };

    const addButton = () => {
        // Find existing container or create a new one
        let buttonContainer = document.getElementById('randomMovieButtonContainer');
        if (!buttonContainer) {
            buttonContainer = document.createElement('div');
            buttonContainer.id = 'randomMovieButtonContainer';
        }

        // Find existing button or create a new one
        let randomButton = document.getElementById('randomMovieButton');
        if (!randomButton) {
            randomButton = document.createElement('button');
            randomButton.id = 'randomMovieButton';
            randomButton.className = 'random-movie-button emby-button button-flat button-flat-hover';
            randomButton.title = 'Play a random item from your library'; // Updated title for clarity
            randomButton.innerHTML = `<i class="md-icon random-icon">casino</i>`;

            // Add event listener for the button click
            randomButton.addEventListener('click', async () => {
                randomButton.disabled = true;
                randomButton.innerHTML = '<i class="md-icon random-icon">hourglass_empty</i>'; // Loading state icon

                try {
                    const item = await getRandomMovie();
                    if (item) {
                        navigateToMovie(item);
                    }
                } catch (error) {
                    console.error("Jellyfin Random Button: Failed to get random item:", error);
                    alert("Failed to find a random item. Check console for details.");
                } finally {
                    randomButton.disabled = false;
                    randomButton.innerHTML = `<i class="md-icon random-icon">casino</i>`;
                }
            });

            // Append the button to its container
            buttonContainer.appendChild(randomButton);
            const headerRight = document.querySelector('.headerRight');
            const searchInputContainer = document.querySelector('.searchInput');

            if (headerRight) {
                // If headerRight exists, prepend the container to it
                headerRight.prepend(buttonContainer);
                console.log("Jellyfin Random Button: Button added to headerRight.");
            } else if (searchInputContainer) {
                // Otherwise, if searchInputContainer exists, insert after it
                searchInputContainer.parentNode.insertBefore(buttonContainer, searchInputContainer.nextSibling);
                console.log("Jellyfin Random Button: Button added after searchInput.");
            } else {
                console.warn("Jellyfin Random Button: Suitable button container not found. Button might not be visible.");
            }
        } else {
            console.log("Jellyfin Random Button: Button already exists, no need to recreate.");
        }
    };

    const waitForApiClient = () => {
        if (typeof ApiClient !== 'undefined' && typeof ApiClient.getCurrentUserId === 'function' && typeof ApiClient.ajax === 'function') {
            console.log("Jellyfin Random Button: ApiClient is available. Starting UI observation.");
            injectMaterialIcons();
            injectCustomCss();
            const observer = new MutationObserver((mutations, obs) => {
                const headerRight = document.querySelector('.headerRight');
                const searchInputContainer = document.querySelector('.searchInput');
                if (headerRight || searchInputContainer) {
                    addButton();
                    obs.disconnect();
                    console.log("Jellyfin Random Button: Observers disconnected.");
                }
            });

            observer.observe(document.body, { childList: true, subtree: true });

            // Also try to add the button immediately if UI is already ready on page load
            const headerRight = document.querySelector('.headerRight');
            const searchInputContainer = document.querySelector('.searchInput');
            if (headerRight || searchInputContainer) {
                 addButton();
                 observer.disconnect();
                 console.log("Jellyfin Random Button: Button added immediately (UI already ready).");
            }

        } else {
            console.log("Jellyfin Random Button: Waiting for ApiClient...");
            setTimeout(waitForApiClient, 200);
        }
    };

    waitForApiClient();

})();