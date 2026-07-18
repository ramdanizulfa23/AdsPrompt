// State
const formState = {
    contentType: null,
    category: null,
    title: '',
    description: '',
    tone: '',
    audience: '',
    colors: ''
};

// Dark Mode Management
function initializeDarkMode() {
    // Check localStorage or system preference
    const savedMode = localStorage.getItem('darkMode');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    const isDarkMode = savedMode === 'true' || (savedMode === null && prefersDark);

    if (isDarkMode) {
        document.documentElement.classList.add('dark-mode');
    }
}

function toggleDarkMode() {
    const html = document.documentElement;
    const isDarkMode = html.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    initializeDarkMode();
    initializeEventListeners();
    setupCharCounters();
});

// Setup Event Listeners
function initializeEventListeners() {
    // Content Type Buttons
    document.querySelectorAll('.content-btn').forEach(btn => {
        btn.addEventListener('click', () => selectContentType(btn));
    });

    // Category Radio
    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.addEventListener('change', (e) => {
            formState.category = e.target.value;
        });
    });

    // Form Inputs
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');
    const toneSelect = document.getElementById('tone');
    const audienceSelect = document.getElementById('audience');
    const colorsInput = document.getElementById('colors');

    if (titleInput) {
        titleInput.addEventListener('input', (e) => {
            formState.title = e.target.value;
            updateCharCount('title-count', e.target.value.length);
        });
    }

    if (descInput) {
        descInput.addEventListener('input', (e) => {
            formState.description = e.target.value;
            updateCharCount('desc-count', e.target.value.length);
        });
    }

    if (toneSelect) {
        toneSelect.addEventListener('change', (e) => {
            formState.tone = e.target.value;
        });
    }

    if (audienceSelect) {
        audienceSelect.addEventListener('change', (e) => {
            formState.audience = e.target.value;
        });
    }

    if (colorsInput) {
        colorsInput.addEventListener('input', (e) => {
            formState.colors = e.target.value;
        });
    }
}

function setupCharCounters() {
    const titleInput = document.getElementById('title');
    const descInput = document.getElementById('description');

    if (titleInput) {
        titleInput.addEventListener('input', () => {
            updateCharCount('title-count', titleInput.value.length);
        });
    }

    if (descInput) {
        descInput.addEventListener('input', () => {
            updateCharCount('desc-count', descInput.value.length);
        });
    }
}

function updateCharCount(elementId, count) {
    const element = document.getElementById(elementId);
    if (element) {
        element.textContent = count;
    }
}

// Navigation
function goToStep(stepNumber) {
    // Validate
    if (stepNumber > 1 && !validateStep(stepNumber - 1)) {
        return;
    }

    // Hide all sections
    document.querySelectorAll('.step-content').forEach(section => {
        section.classList.remove('active');
    });

    // Show target section
    const target = document.getElementById(`step-${stepNumber}`);
    if (target) {
        target.classList.add('active');
    }

    // Update step indicator
    updateProgressSteps(stepNumber);

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

function updateProgressSteps(current) {
    document.querySelectorAll('.progress-step').forEach((step, index) => {
        const stepNum = index + 1;
        if (stepNum === current) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

// Validation
function validateStep(stepNumber) {
    switch (stepNumber) {
        case 1:
            if (!formState.contentType) {
                showError('Pilih jenis konten terlebih dahulu');
                return false;
            }
            return true;

        case 2:
            if (!formState.category) {
                showError('Pilih kategori terlebih dahulu');
                return false;
            }
            return true;

        case 3:
            if (!formState.title.trim()) {
                showError('Masukkan judul konten');
                return false;
            }
            if (!formState.description.trim()) {
                showError('Masukkan pesan utama');
                return false;
            }
            return true;

        default:
            return true;
    }
}

// Content Type Selection
function selectContentType(btn) {
    // Remove selection from all buttons
    document.querySelectorAll('.content-btn').forEach(b => {
        b.classList.remove('selected');
    });

    // Add selection to clicked button
    btn.classList.add('selected');

    // Update state
    formState.contentType = btn.dataset.type;
}

// Generate Prompt
function generatePrompt() {
    if (!validateStep(3)) {
        return;
    }

    const prompt = buildPrompt(formState);
    displayResults(prompt);
}

function buildPrompt(state) {
    const contentTypes = {
        image: 'Ilustrasi Digital',
        poster: 'Desain Poster',
        banner: 'Desain Banner',
        brochure: 'Desain Brosur',
        instagram: 'Posting Feed Instagram (1080x1080px)',
        story: 'Instagram Story (1080x1920px)',
        flyer: 'Desain Flyer Promosi',
        thumbnail: 'Thumbnail Video (1280x720px)',
        infographic: 'Desain Infografis',
        product: 'Foto Produk & Product Photography',
        ad: 'Creative Iklan (Ad Creative)',
        hero: 'Hero Section / Landing Page Visual'
    };

    const categoryDescriptions = {
        commercial: 'promosi produk dengan fokus penjualan',
        education: 'konten edukatif dengan elemen informatif',
        entertainment: 'konten visual yang menarik dan menyenangkan',
        inspiration: 'pesan motivasi dan inspiratif',
        community: 'desain yang fokus komunitas dan interaksi'
    };

    const toneDescriptions = {
        professional: 'estetika profesional dan korporat',
        casual: 'gaya santai dan ramah',
        creative: 'ekspresi kreatif dan berani',
        minimalist: 'gaya bersih dan minimalis',
        vibrant: 'penampilan vibrant dan penuh warna'
    };

    const audienceDescriptions = {
        general: 'audiens umum',
        teens: 'audiens remaja (13-19 tahun)',
        'young-adults': 'audiens dewasa muda (18-35 tahun)',
        professionals: 'demografis profesional',
        parents: 'orang tua dan keluarga'
    };

    let prompt = `Buat ${contentTypes[state.contentType] || 'desain khusus'} untuk ${categoryDescriptions[state.category] || 'penggunaan umum'}.

Judul: ${state.title}

Pesan Utama: ${state.description}

Persyaratan Desain:
- Gaya: ${toneDescriptions[state.tone] || 'modern dan bersih'}
- Target Audiens: ${audienceDescriptions[state.audience] || 'audiens umum'}
${state.colors ? `- Skema Warna: ${state.colors}` : ''}

Instruksi Desain:
- Pastikan hierarki visual yang jelas dan keterbacaan optimal
- Gunakan citra atau ilustrasi berkualitas tinggi dan profesional
- Sertakan tipografi yang menarik sesuai dengan tema
- Pertahankan konsistensi dalam jarak dan penyelarasan
- Optimalkan untuk format dan platform yang ditentukan
- Pastikan semua teks mudah dibaca dan terlihat jelas
- Buat desain yang menonjol sambil tetap profesional dan sesuai brand`;

    return prompt;
}

function displayResults(prompt) {
    // Hide all sections
    document.querySelectorAll('.step-content').forEach(section => {
        section.classList.remove('active');
    });

    // Show results
    const resultsSection = document.getElementById('results');
    if (resultsSection) {
        resultsSection.classList.add('active');
    }

    // Display prompt
    const promptOutput = document.getElementById('prompt-output');
    if (promptOutput) {
        promptOutput.textContent = prompt;
    }

    // Scroll top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// Copy Prompt
function copyPrompt() {
    const promptOutput = document.getElementById('prompt-output');
    if (!promptOutput) return;

    const text = promptOutput.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showSuccess('Prompt berhasil disalin');
    }).catch(() => {
        // Fallback
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showSuccess('Prompt berhasil disalin');
    });
}

// Download Prompt
function downloadPrompt() {
    const promptOutput = document.getElementById('prompt-output');
    if (!promptOutput) return;

    const text = promptOutput.textContent;
    const filename = `prompt-${formState.contentType}-${Date.now()}.txt`;

    const element = document.createElement('a');
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);
    element.style.display = 'none';

    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);

    showSuccess('Prompt berhasil diunduh');
}

// Generate New
function generateNew() {
    // Reset state
    formState.contentType = null;
    formState.category = null;
    formState.title = '';
    formState.description = '';
    formState.tone = '';
    formState.audience = '';
    formState.colors = '';

    // Reset UI
    document.querySelectorAll('.content-btn').forEach(btn => {
        btn.classList.remove('selected');
    });

    document.querySelectorAll('input[name="category"]').forEach(radio => {
        radio.checked = false;
    });

    document.getElementById('title').value = '';
    document.getElementById('description').value = '';
    document.getElementById('tone').value = '';
    document.getElementById('audience').value = '';
    document.getElementById('colors').value = '';

    updateCharCount('title-count', 0);
    updateCharCount('desc-count', 0);

    // Back to step 1
    goToStep(1);
}

// Notifications
function showError(message) {
    showNotification(message, 'error');
}

function showSuccess(message) {
    showNotification(message, 'success');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.textContent = message;

    const bgColor = type === 'error' ? 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)' : 'linear-gradient(135deg, #7b9eff 0%, #5b7cfa 100%)';
    const boxShadow = type === 'error' ? '6px 6px 12px #c5586f, -6px -6px 12px #ff7a7f' : '6px 6px 12px #4a5a9e, -6px -6px 12px #8a9fff';

    notification.style.cssText = `
        position: fixed;
        top: 24px;
        right: 24px;
        padding: 14px 20px;
        background: ${bgColor};
        color: white;
        border-radius: 12px;
        box-shadow: ${boxShadow};
        font-size: 14px;
        font-weight: 500;
        z-index: 9999;
        animation: notifSlideIn 300ms ease-out;
        max-width: 360px;
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
    `;

    document.body.appendChild(notification);

    // Add animation if not exists
    if (!document.getElementById('notif-style')) {
        const style = document.createElement('style');
        style.id = 'notif-style';
        style.textContent = `
            @keyframes notifSlideIn {
                from {
                    transform: translateX(400px);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            @keyframes notifSlideOut {
                from {
                    transform: translateX(0);
                    opacity: 1;
                }
                to {
                    transform: translateX(400px);
                    opacity: 0;
                }
            }
        `;
        document.head.appendChild(style);
    }

    // Auto remove
    setTimeout(() => {
        notification.style.animation = 'notifSlideOut 300ms ease-out';
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 4000);
}

// Export
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        formState,
        goToStep,
        validateStep,
        generatePrompt,
        buildPrompt,
        copyPrompt,
        downloadPrompt,
        generateNew
    };
}
