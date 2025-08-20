// Navegación móvil
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Cerrar menú móvil al hacer clic en un enlace
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Scroll suave para navegación
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Header transparente en scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    }
});

// Animaciones en scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observar elementos para animaciones
document.querySelectorAll('.servicio-card, .ventaja-item, .proyecto-item').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(30px)';
    el.style.transition = 'all 0.6s ease';
    observer.observe(el);
});

// Formulario de contacto
const contactForm = document.getElementById('contact-form');

contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Obtener datos del formulario
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simular envío (aquí puedes integrar con tu backend)
    const submitButton = this.querySelector('.submit-button');
    const originalText = submitButton.textContent;
    
    submitButton.textContent = 'Enviando...';
    submitButton.disabled = true;
    
    setTimeout(() => {
        alert('¡Mensaje enviado correctamente! Te contactaremos pronto.');
        this.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
});

// Validación en tiempo real del formulario
const inputs = document.querySelectorAll('input, select, textarea');

inputs.forEach(input => {
    input.addEventListener('blur', function() {
        validateField(this);
    });
    
    input.addEventListener('input', function() {
        if (this.classList.contains('error')) {
            validateField(this);
        }
    });
});

function validateField(field) {
    const value = field.value.trim();
    let isValid = true;
    
    // Remover clases de error previas
    field.classList.remove('error');
    const existingError = field.parentNode.querySelector('.error-message');
    if (existingError) {
        existingError.remove();
    }
    
    // Validaciones específicas
    if (field.hasAttribute('required') && !value) {
        isValid = false;
        showError(field, 'Este campo es obligatorio');
    } else if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            isValid = false;
            showError(field, 'Introduce un email válido');
        }
    } else if (field.type === 'tel' && value) {
        const phoneRegex = /^[+]?[\d\s\-\(\)]{9,}$/;
        if (!phoneRegex.test(value)) {
            isValid = false;
            showError(field, 'Introduce un teléfono válido');
        }
    }
    
    return isValid;
}

function showError(field, message) {
    field.classList.add('error');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = message;
    errorDiv.style.color = '#ef4444';
    errorDiv.style.fontSize = '0.875rem';
    errorDiv.style.marginTop = '0.25rem';
    field.parentNode.appendChild(errorDiv);
}

// Lazy loading para videos
const videos = document.querySelectorAll('video');

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const video = entry.target;
            if (video.hasAttribute('data-src')) {
                video.src = video.getAttribute('data-src');
                video.removeAttribute('data-src');
            }
            videoObserver.unobserve(video);
        }
    });
});

videos.forEach(video => {
    videoObserver.observe(video);
});

// Efecto parallax sutil en hero
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.style.transform = `translateY(${scrolled * 0.5}px)`;
    }
});

// Contador animado (si decides añadir estadísticas)
function animateCounter(element, target, duration = 2000) {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        element.textContent = Math.floor(start);
        
        if (start >= target) {
            element.textContent = target;
            clearInterval(timer);
        }
    }, 16);
}

// Inicializar cuando el DOM esté listo
document.addEventListener('DOMContentLoaded', function() {
    // Precargar el primer video del hero
    const heroVideo = document.querySelector('.hero-video');
    if (heroVideo) {
        heroVideo.load();
    }
    
    // Añadir clase para animaciones CSS
    document.body.classList.add('loaded');
});

// Manejo de errores de video
videos.forEach(video => {
    video.addEventListener('error', function() {
        console.warn('Error cargando video:', this.src);
        // Mostrar imagen de placeholder si el video falla
        const placeholder = document.createElement('div');
        placeholder.className = 'video-placeholder';
        placeholder.innerHTML = '<i class="fas fa-play-circle"></i><p>Video no disponible</p>';
        placeholder.style.cssText = `
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 250px;
            background: #f1f5f9;
            color: #64748b;
            font-size: 1.2rem;
        `;
        this.parentNode.replaceChild(placeholder, this);
    });
});

// Optimización de rendimiento: debounce para scroll
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Aplicar debounce al scroll
const debouncedScroll = debounce(() => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(15, 23, 42, 0.98)';
    } else {
        header.style.background = 'rgba(15, 23, 42, 0.95)';
    }
}, 10);

window.addEventListener('scroll', debouncedScroll);

