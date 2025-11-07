// NewsAPI configuration
const NEWS_API_KEY = '122077c3be054d5aac176a4c64940938';
const NEWS_API_URL = 'https://newsapi.org/v2/everything';

// Function to fetch news from NewsAPI
async function fetchTransportNews() {
    try {
        // Search queries related to transport and laws in Medellin, Colombia
        const queries = [
            'Medellín transporte',
            'Medellín movilidad',
            'Colombia mensajería regulación',
            'Medellín tránsito leyes'
        ];
        
        // Use the first query for better results
        const query = queries[0];
        
        // Calculate date range (last 30 days)
        const toDate = new Date();
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - 30);
        
        const params = new URLSearchParams({
            q: query,
            language: 'es',
            sortBy: 'publishedAt',
            pageSize: 6,
            from: fromDate.toISOString().split('T')[0],
            to: toDate.toISOString().split('T')[0],
            apiKey: NEWS_API_KEY
        });
        
        const response = await fetch(`${NEWS_API_URL}?${params}`);
        const data = await response.json();
        
        if (data.status === 'ok' && data.articles && data.articles.length > 0) {
            return data.articles.slice(0, 3); // Get top 3 articles
        } else {
            // Fallback to default news if no results
            return getDefaultNews();
        }
    } catch (error) {
        console.error('Error fetching news:', error);
        return getDefaultNews();
    }
}

// Default news in case API fails or no results
function getDefaultNews() {
    return [
        {
            title: 'Ampliamos nuestra cobertura en el Valle de Aburrá',
            description: 'Ahora ofrecemos servicio de mensajería en todos los municipios del área metropolitana. Mayor cobertura para servir mejor a nuestros clientes.',
            url: '#',
            urlToImage: 'images/news1.jpg',
            publishedAt: new Date().toISOString()
        },
        {
            title: 'Nuevo servicio de domicilios express en 60 minutos',
            description: 'Lanzamos nuestro servicio más rápido. Entregas garantizadas en menos de una hora dentro del perímetro urbano de Medellín.',
            url: '#',
            urlToImage: 'images/news2.jpg',
            publishedAt: new Date().toISOString()
        },
        {
            title: 'Mandados recibe certificación de calidad',
            description: 'Orgullosos de recibir la certificación ISO 9001 por nuestros procesos de calidad en servicios de mensajería y logística.',
            url: '#',
            urlToImage: 'images/news3.jpg',
            publishedAt: new Date().toISOString()
        }
    ];
}

// Function to format date in Spanish
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('es-ES', options);
}

// Function to truncate text
function truncateText(text, maxLength) {
    if (!text) return '';
    if (text.length <= maxLength) return text;
    return text.substr(0, maxLength) + '...';
}

// Function to render news cards
function renderNewsCards(articles) {
    const newsContainer = document.querySelector('.owl-carousel2');
    
    if (!newsContainer) {
        console.error('News container not found');
        return;
    }
    
    // Clear existing content
    newsContainer.innerHTML = '';
    
    // Add news cards
    articles.forEach(article => {
        const card = document.createElement('div');
        
        // Use placeholder image if urlToImage is not available
        const imageUrl = article.urlToImage || 'images/news1.jpg';
        const title = truncateText(article.title, 80);
        const description = truncateText(article.description, 150);
        const articleUrl = article.url || '#';
        
        card.innerHTML = `
            <div class="card text-center">
                <img class="card-img-top" src="${imageUrl}" alt="${title}" onerror="this.src='images/news1.jpg'">
                <div class="card-body text-left pr-0 pl-0">
                    <h5>${title}</h5>
                    <p class="card-text">${description}</p>
                    ${articleUrl !== '#' ? `<a href="${articleUrl}" target="_blank" rel="noopener noreferrer">LEER MÁS <i class="fa fa-angle-right" aria-hidden="true"></i></a>` : `<a href="#">LEER MÁS <i class="fa fa-angle-right" aria-hidden="true"></i></a>`}
                </div>
            </div>
        `;
        
        newsContainer.appendChild(card);
    });
    
    // Wait for jQuery to be available and reinitialize carousel
    setTimeout(() => {
        if (typeof $ !== 'undefined' && $.fn.owlCarousel) {
            const $carousel = $(newsContainer);
            
            // Destroy existing carousel if it exists
            if ($carousel.data('owl.carousel')) {
                $carousel.data('owl.carousel').destroy();
            }
            
            // Initialize new carousel
            $carousel.owlCarousel({
                loop: true,
                center: false,
                margin: 0,
                responsiveClass: true,
                nav: true,
                responsive: {
                    0: {
                        items: 1,
                        nav: false
                    },
                    600: {
                        items: 2,
                        nav: false
                    },
                    1000: {
                        items: 3,
                        nav: true,
                        loop: true
                    }
                }
            });
        }
    }, 100);
}

// Load news when page loads
document.addEventListener('DOMContentLoaded', async function() {
    // Show loading state
    const newsSection = document.querySelector('.gtco-news');
    if (newsSection) {
        const h2 = newsSection.querySelector('h2');
        if (h2) {
            h2.innerHTML = 'Noticias y Actualizaciones <span class="news-loading"><i class="fa fa-spinner fa-spin"></i></span>';
        }
    }
    
    // Fetch and render news
    const articles = await fetchTransportNews();
    renderNewsCards(articles);
    
    // Remove loading indicator
    if (newsSection) {
        const h2 = newsSection.querySelector('h2');
        if (h2) {
            h2.textContent = 'Noticias y Actualizaciones';
        }
    }
});

// Refresh news every 30 minutes
setInterval(async function() {
    const articles = await fetchTransportNews();
    renderNewsCards(articles);
}, 30 * 60 * 1000);
