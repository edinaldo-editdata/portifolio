// Mobile Navigation Toggle
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');

navToggle.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-menu a').forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        navToggle.classList.remove('active');
    });
});

// Smooth scrolling for anchor links
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

// Header background on scroll
window.addEventListener('scroll', () => {
    const header = document.querySelector('.header');
    if (window.scrollY > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.boxShadow = 'none';
    }
});

// Configuração da API do Coda
const CODA_CONFIG = {
    apiKey: '399bd9c9-7302-43be-8afb-40e39560127d',
    docId: 'YOUR_DOC_ID', // Você precisa fornecer o ID do documento
    tableId: 'grid-J79qoOx9Kq'
};

// Form handling
const quoteForm = document.getElementById('quoteForm');

quoteForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Add timestamp and source
    data.timestamp = new Date().toLocaleString('pt-BR');
    data.source = 'EditData Website';
    
    // Show loading state
    const submitBtn = this.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;
    
    try {
        // Send to Coda
        await submitToCoda(data);
        
        // Show success message
        showNotification('Solicitação enviada com sucesso! Entraremos em contato em breve.', 'success');
        
        // Reset form
        this.reset();
        
        // Optional: Redirect to WhatsApp
        setTimeout(() => {
            const message = encodeURIComponent(
                `Olá! Acabei de enviar uma solicitação de orçamento pelo site para: ${data.service}. ` +
                `Meu nome é ${data.name} e meu email é ${data.email}.`
            );
            window.open(`https://wa.me/5511982354531?text=${message}`, '_blank');
        }, 2000);
        
    } catch (error) {
        console.error('Error submitting form:', error);
        showNotification('Erro ao enviar solicitação. Tente novamente ou entre em contato via WhatsApp.', 'error');
    } finally {
        // Restore button
        submitBtn.innerHTML = originalText;
        submitBtn.disabled = false;
    }
});

// Função para enviar dados para o Coda
async function submitToCoda(data) {
    const url = `https://coda.io/apis/v1/docs/${CODA_CONFIG.docId}/tables/${CODA_CONFIG.tableId}/rows`;
    
    const payload = {
        rows: [{
            cells: [
                { column: 'Nome', value: data.name },
                { column: 'Email', value: data.email },
                { column: 'Empresa', value: data.company || 'Não informado' },
                { column: 'Telefone', value: data.phone || 'Não informado' },
                { column: 'Serviço', value: data.service },
                { column: 'Orçamento', value: data.budget || 'Não informado' },
                { column: 'Prazo', value: data.timeline || 'Não informado' },
                { column: 'Descrição', value: data.description },
                { column: 'Solução Atual', value: data['current-solution'] || 'Não informado' },
                { column: 'Data', value: data.timestamp },
                { column: 'Origem', value: data.source },
                { column: 'Status', value: 'Novo Lead' }
            ]
        }]
    };
    
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${CODA_CONFIG.apiKey}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    });
    
    if (!response.ok) {
        const errorData = await response.json();
        console.error('Coda API Error:', errorData);
        throw new Error(`Erro na API do Coda: ${response.status} - ${errorData.message || 'Erro desconhecido'}`);
    }
    
    return response.json();
}

// Notification system
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notification => notification.remove());
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">&times;</button>
        </div>
    `;
    
    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : '#ef4444'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 10000;
        max-width: 400px;
        animation: slideIn 0.3s ease-out;
    `;
    
    // Add to page
    document.body.appendChild(notification);
    
    // Close button functionality
    const closeBtn = notification.querySelector('.notification-close');
    closeBtn.addEventListener('click', () => {
        notification.style.animation = 'slideOut 0.3s ease-in';
        setTimeout(() => notification.remove(), 300);
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOut 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Add notification animations to CSS
const notificationStyles = document.createElement('style');
notificationStyles.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
    
    .notification-content {
        display: flex;
        align-items: center;
        gap: 0.75rem;
    }
    
    .notification-close {
        background: none;
        border: none;
        color: white;
        font-size: 1.2rem;
        cursor: pointer;
        margin-left: auto;
        padding: 0;
        width: 20px;
        height: 20px;
        display: flex;
        align-items: center;
        justify-content: center;
    }
`;
document.head.appendChild(notificationStyles);

// Form validation enhancements
const formInputs = document.querySelectorAll('#quoteForm input, #quoteForm select, #quoteForm textarea');

formInputs.forEach(input => {
    input.addEventListener('blur', validateField);
    input.addEventListener('input', clearFieldError);
});

function validateField(e) {
    const field = e.target;
    const value = field.value.trim();
    
    // Remove existing error
    clearFieldError(e);
    
    // Check if required field is empty
    if (field.hasAttribute('required') && !value) {
        showFieldError(field, 'Este campo é obrigatório');
        return false;
    }
    
    // Email validation
    if (field.type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Digite um email válido');
            return false;
        }
    }
    
    // Phone validation (Brazilian format)
    if (field.type === 'tel' && value) {
        const phoneRegex = /^\(?\d{2}\)?[\s-]?\d{4,5}[\s-]?\d{4}$/;
        if (!phoneRegex.test(value.replace(/\D/g, ''))) {
            showFieldError(field, 'Digite um telefone válido');
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    const formGroup = field.closest('.form-group');
    const errorElement = document.createElement('span');
    errorElement.className = 'field-error';
    errorElement.textContent = message;
    errorElement.style.cssText = 'color: #ef4444; font-size: 0.875rem; margin-top: 0.25rem; display: block;';
    
    formGroup.appendChild(errorElement);
    field.style.borderColor = '#ef4444';
}

function clearFieldError(e) {
    const field = e.target;
    const formGroup = field.closest('.form-group');
    const existingError = formGroup.querySelector('.field-error');
    
    if (existingError) {
        existingError.remove();
        field.style.borderColor = '#e5e7eb';
    }
}

// Phone number formatting
const phoneInput = document.getElementById('phone');
if (phoneInput) {
    phoneInput.addEventListener('input', function(e) {
        let value = e.target.value.replace(/\D/g, '');
        
        if (value.length >= 11) {
            value = value.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3');
        } else if (value.length >= 7) {
            value = value.replace(/(\d{2})(\d{4})(\d{0,4})/, '($1) $2-$3');
        } else if (value.length >= 3) {
            value = value.replace(/(\d{2})(\d{0,5})/, '($1) $2');
        }
        
        e.target.value = value;
    });
}

// Intersection Observer for animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('loading');
        }
    });
}, observerOptions);

// Observe elements for animation
document.querySelectorAll('.service-card, .stat, .contact-method').forEach(el => {
    observer.observe(el);
});

// Console message for developers
console.log('%cEditData Soluções Inteligentes', 'color: #2563eb; font-size: 24px; font-weight: bold;');
console.log('%cSite desenvolvido para automações Google Sheets, APIs e tratamento de dados', 'color: #64748b; font-size: 14px;');
console.log('%cContato: contato@editdata.com.br | WhatsApp: +55 11 98235 4531', 'color: #10b981; font-size: 12px;');