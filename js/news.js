// Noticias actualizadas manualmente - Más confiable que APIs externas
// Puedes editar este archivo para cambiar las noticias cuando quieras
const LATEST_NEWS = [
    {
        title: 'Nuevas rutas de Metro en Medellín facilitan el transporte',
        description: 'El Metro de Medellín anunció la extensión de rutas que beneficiarán a miles de usuarios en el Valle de Aburrá, mejorando la conectividad y reduciendo tiempos de viaje.',
        url: 'https://www.metrodemedellin.gov.co/',
        urlToImage: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800&h=600&fit=crop',
        publishedAt: '2024-11-05T10:00:00Z'
    },
    {
        title: 'Regulación de pico y placa se mantiene en Medellín',
        description: 'La Secretaría de Movilidad confirmó que las restricciones de pico y placa continuarán vigentes para mejorar la calidad del aire y reducir la congestión vehicular en la ciudad.',
        url: 'https://www.medellin.gov.co/movilidad',
        urlToImage: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=800&h=600&fit=crop',
        publishedAt: '2024-11-04T15:30:00Z'
    },
    {
        title: 'Servicio de mensajería crece un 30% en el Valle de Aburrá',
        description: 'El sector de mensajería y domicilios registra un crecimiento significativo debido al aumento del comercio electrónico y la demanda de servicios rápidos y confiables.',
        url: '#',
        urlToImage: 'https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?w=800&h=600&fit=crop',
        publishedAt: '2024-11-03T09:15:00Z'
    }
];

// Function to fetch news - ahora retorna las noticias predefinidas
async function fetchTransportNews() {
    console.log('fetchTransportNews: Cargando noticias predefinidas...');
    
    // Simular un pequeño delay como si fuera una petición real
    await new Promise(resolve => setTimeout(resolve, 500));
    
    console.log('fetchTransportNews: ✓ Retornando', LATEST_NEWS.length, 'noticias');
    return LATEST_NEWS;
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
    console.log('news.js: DOMContentLoaded - Iniciando carga de noticias');
    
    // Show loading state
    const newsSection = document.querySelector('.gtco-news');
    if (newsSection) {
        const h2 = newsSection.querySelector('h2');
        if (h2) {
            h2.innerHTML = 'Noticias y Actualizaciones <span class="news-loading"><i class="fa fa-spinner fa-spin"></i></span>';
            console.log('news.js: Indicador de carga mostrado');
        }
    }
    
    // Fetch and render news
    console.log('news.js: Cargando noticias...');
    const articles = await fetchTransportNews();
    console.log('news.js: Noticias obtenidas:', articles.length, 'artículos');
    renderNewsCards(articles);
    console.log('news.js: Noticias renderizadas');
    
    // Remove loading indicator
    if (newsSection) {
        const h2 = newsSection.querySelector('h2');
        if (h2) {
            h2.textContent = 'Noticias y Actualizaciones';
            console.log('news.js: Indicador de carga removido');
        }
    }
});
