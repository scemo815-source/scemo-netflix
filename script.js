const BASE_URL = 'https://api.themoviedb.org/3';
const IMAGE_BASE_URL = 'https://image.tmdb.org/t/p/w500';

const moviesContainer = document.getElementById('movies-container');
const loadingElement = document.getElementById('loading');
const sectionTitle = document.getElementById('section-title');
const navLinks = document.querySelectorAll('.nav-link');

const modal = document.getElementById('movie-modal');
const modalOverlay = document.querySelector('.modal-overlay');
const modalClose = document.querySelector('.modal-close');
const modalPosterImg = document.getElementById('modal-poster-img');
const modalTitle = document.getElementById('modal-title');
const modalRating = document.getElementById('modal-rating');
const modalViewers = document.getElementById('modal-viewers');
const modalDate = document.getElementById('modal-date');
const modalOverview = document.getElementById('modal-overview');
const modalTrailer = document.getElementById('modal-trailer');
const trailerContainer = document.getElementById('trailer-container');

const API_ENDPOINTS = {
    trending: `${BASE_URL}/trending/movie/week`,
    now_playing: `${BASE_URL}/movie/now_playing`,
    popular: `${BASE_URL}/movie/popular`
};

const SECTION_TITLES = {
    trending: '트렌딩 영화',
    now_playing: '현재 상영 중인 영화',
    popular: '인기 영화'
};

let currentCategory = 'trending';

async function fetchMovies(category) {
    try {
        loadingElement.style.display = 'block';
        moviesContainer.innerHTML = '';
        
        const endpoint = API_ENDPOINTS[category];
        const response = await fetch(`${endpoint}?api_key=${API_KEY}&language=ko-KR&page=1`);
        
        if (!response.ok) {
            throw new Error('영화 데이터를 가져오는데 실패했습니다.');
        }
        
        const data = await response.json();
        currentCategory = category;
        sectionTitle.textContent = SECTION_TITLES[category];
        displayMovies(data.results);
    } catch (error) {
        console.error('Error:', error);
        showError('영화를 불러오는 중 오류가 발생했습니다. 잠시 후 다시 시도해주세요.');
    }
}

function initNavigation() {
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            navLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            
            const category = link.dataset.category;
            fetchMovies(category);
        });
    });
}

function displayMovies(movies) {
    loadingElement.style.display = 'none';
    
    if (!movies || movies.length === 0) {
        showError('현재 상영 중인 영화가 없습니다.');
        return;
    }
    
    moviesContainer.innerHTML = '';
    
    movies.forEach(movie => {
        const movieCard = createMovieCard(movie);
        moviesContainer.appendChild(movieCard);
    });
}

function createMovieCard(movie) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : null;
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const voteCount = movie.vote_count ? formatNumber(movie.vote_count) : '0';
    
    card.innerHTML = `
        ${posterPath 
            ? `<img src="${posterPath}" alt="${movie.title}" class="movie-poster">` 
            : `<div class="movie-poster no-image">포스터 없음</div>`
        }
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-stats">
                <div class="movie-rating">
                    ⭐ <span>${rating}</span>
                </div>
                <div class="movie-viewers">
                    👥 <span>누적 ${voteCount}명</span>
                </div>
            </div>
        </div>
    `;
    
    card.addEventListener('click', () => {
        showMovieDetails(movie);
    });
    
    return card;
}

function formatNumber(num) {
    if (num >= 1000000) {
        return (num / 1000000).toFixed(1) + '백만';
    } else if (num >= 10000) {
        return (num / 10000).toFixed(1) + '만';
    } else if (num >= 1000) {
        return (num / 1000).toFixed(1) + '천';
    }
    return num.toString();
}

async function fetchMovieVideos(movieId) {
    try {
        const response = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=ko-KR`);
        if (!response.ok) {
            throw new Error('비디오 데이터를 가져오는데 실패했습니다.');
        }
        const data = await response.json();
        
        if (!data.results || data.results.length === 0) {
            const responseEn = await fetch(`${BASE_URL}/movie/${movieId}/videos?api_key=${API_KEY}&language=en-US`);
            if (responseEn.ok) {
                const dataEn = await responseEn.json();
                return dataEn.results;
            }
        }
        
        return data.results;
    } catch (error) {
        console.error('Error fetching videos:', error);
        return [];
    }
}

async function showMovieDetails(movie) {
    const posterPath = movie.poster_path 
        ? `${IMAGE_BASE_URL}${movie.poster_path}` 
        : null;
    
    const posterContainer = document.querySelector('.modal-poster');
    if (posterPath) {
        posterContainer.innerHTML = `<img src="${posterPath}" alt="${movie.title}">`;
    } else {
        posterContainer.innerHTML = `<div class="no-image">포스터 없음</div>`;
        posterContainer.classList.add('no-image');
    }
    
    modalTitle.textContent = movie.title;
    modalRating.textContent = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    modalViewers.textContent = movie.vote_count ? movie.vote_count.toLocaleString() + '명' : '0명';
    modalDate.textContent = movie.release_date || '정보 없음';
    modalOverview.textContent = movie.overview || '줄거리 정보가 없습니다.';
    
    modalTrailer.style.display = 'none';
    trailerContainer.innerHTML = '<div class="loading">예고편을 불러오는 중...</div>';
    
    const videos = await fetchMovieVideos(movie.id);
    const trailer = videos.find(video => 
        video.type === 'Trailer' && video.site === 'YouTube'
    ) || videos.find(video => video.site === 'YouTube');
    
    if (trailer) {
        modalTrailer.style.display = 'block';
        trailerContainer.innerHTML = `
            <iframe 
                src="https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0&mute=0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
    } else {
        modalTrailer.style.display = 'block';
        trailerContainer.innerHTML = '<div class="no-trailer">예고편이 없습니다.</div>';
    }
    
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeModal() {
    modal.classList.remove('active');
    document.body.style.overflow = 'auto';
    
    trailerContainer.innerHTML = '';
}

function initModal() {
    modalClose.addEventListener('click', closeModal);
    modalOverlay.addEventListener('click', closeModal);
    
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            closeModal();
        }
    });
}

function showError(message) {
    loadingElement.style.display = 'none';
    moviesContainer.innerHTML = `<div class="error-message">${message}</div>`;
}

initNavigation();
initModal();
fetchMovies('trending');
