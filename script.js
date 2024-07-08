
document.addEventListener("DOMContentLoaded", () => {
    const content = document.getElementById('content');
    const searchInput = document.getElementById('search');
    const charactersLink = document.getElementById('characters-link');
    const locationsLink = document.getElementById('locations-link');
    const episodesLink = document.getElementById('episodes-link');

    // Fetch Characters
    const fetchCharacters = async (query = '', page = 1) => {
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/character/?name=${query}&page=${page}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data;
        } catch (error) {
            console.error('Error fetching characters:', error);
            return null;
        }
    };

    // affiche tout les personnages 
    const fetchAllCharacters = async (query = '') => {
        let characters = [];
        let page = 1;
        let data;

        do {
            data = await fetchCharacters(query, page);
            if (data) {
                characters = characters.concat(data.results);
                page++;
            }
        } while (data && data.info && data.info.next);

        return characters;
    };

    // donne les localisation
    const fetchLocations = async (query = '') => {
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/location/?name=${query}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data.results;
        } catch (error) {
            console.error('Error fetching locations:', error);
            return [];
        }
    };

    // affiche les episodes 
    const fetchEpisodes = async (query = '') => {
        try {
            const response = await fetch(`https://rickandmortyapi.com/api/episode/?name=${query}`);
            const data = await response.json();
            if (data.error) {
                throw new Error(data.error);
            }
            return data.results;
        } catch (error) {
            console.error('Error fetching episodes:', error);
            return [];
        }
    };

    // affiche les personnage 
    const renderCharacters = (characters) => {
        content.innerHTML = '';
        if (characters.length === 0) {
            content.innerHTML = '<p>No characters found.</p>';
        } else {
            characters.forEach(character => {
                const characterCard = document.createElement('div');
                characterCard.className = 'character-card';
                characterCard.innerHTML = `
                    <img src="${character.image}" alt="${character.name}">
                    <h2>${character.name}</h2>
                    <p>Status: ${character.status}</p>
                    <p>Species: ${character.species}</p>
                `;
                content.appendChild(characterCard);
            });
        }
    };

    // Render Locations
    const renderLocations = (locations) => {
        content.innerHTML = '';
        if (locations.length === 0) {
            content.innerHTML = '<p>No locations found.</p>';
        } else {
            locations.forEach(location => {
                const locationCard = document.createElement('div');
                locationCard.className = 'location-card';
                locationCard.innerHTML = `
                    <h2>${location.name}</h2>
                    <p>Type: ${location.type}</p>
                    <p>Dimension: ${location.dimension}</p>
                `;
                content.appendChild(locationCard);
            });
        }
    };

    // Render Episodes
    const renderEpisodes = (episodes) => {
        content.innerHTML = '';
        if (episodes.length === 0) {
            content.innerHTML = '<p>No episodes found.</p>';
        } else {
            episodes.forEach(episode => {
                const episodeCard = document.createElement('div');
                episodeCard.className = 'episode-card';
                episodeCard.innerHTML = `
                    <h2>${episode.name}</h2>
                    <p>Air Date: ${episode.air_date}</p>
                    <p>Episode: ${episode.episode}</p>
                `;
                content.appendChild(episodeCard);
            });
        }
    };

    // Load Characters
    const loadCharacters = async (query = '') => {
        const characters = await fetchAllCharacters(query);
        renderCharacters(characters);
    };

    // Load Locations
    const loadLocations = async (query = '') => {
        const locations = await fetchLocations(query);
        renderLocations(locations);
    };

    // Load Episodes
    const loadEpisodes = async (query = '') => {
        const episodes = await fetchEpisodes(query);
        renderEpisodes(episodes);
    };

    // Event Listeners for Navigation
    charactersLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadCharacters();
    });

    locationsLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadLocations();
    });

    episodesLink.addEventListener('click', (e) => {
        e.preventDefault();
        loadEpisodes();
    });

    // Search Event
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value;
        const activeLink = document.querySelector('nav ul li a.active');
        if (activeLink.id === 'characters-link') {
            loadCharacters(query);
        } else if (activeLink.id === 'locations-link') {
            loadLocations(query);
        } else if (activeLink.id === 'episodes-link') {
            loadEpisodes(query);
        }
    });

    // Set active class on click
    const navLinks = document.querySelectorAll('nav ul li a');
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            navLinks.forEach(l => l.classList.remove('active'));
            e.target.classList.add('active');
        });
    });

    // Initial Load
    loadCharacters();
});

