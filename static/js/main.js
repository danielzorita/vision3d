document.addEventListener('DOMContentLoaded', () => {
    // UI Elements
    const dropzone = document.getElementById('dropzone');
    const fileInput = document.getElementById('file-input');
    const generateBtn = document.getElementById('generate-btn');
    const viewer = document.getElementById('3d-viewer');
    const statusOverlay = document.getElementById('status-overlay');
    const statusTitle = document.getElementById('status-title');
    const statusDesc = document.getElementById('status-desc');
    const systemStatus = document.getElementById('system-status');
    const progressIndicator = document.getElementById('progress-indicator');

    let progressInterval;

    function startProgress() {
        let width = 0;
        progressIndicator.style.width = '0%';
        progressInterval = setInterval(() => {
            if (width >= 90) {
                clearInterval(progressInterval);
            } else {
                width += Math.random() * 5;
                progressIndicator.style.width = Math.min(width, 95) + '%';
            }
        }, 800);
    }

    // Handle File Selection
    fileInput.addEventListener('change', (e) => {
        if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const reader = new FileReader();
            reader.onload = (e) => {
                // Remove background images from previous attempts
                dropzone.style.backgroundImage = `url(${e.target.result})`;
                dropzone.style.backgroundSize = 'cover';
                dropzone.style.backgroundPosition = 'center';
                document.getElementById('upload-idle').style.opacity = '0';
            };
            reader.readAsDataURL(file);
            generateBtn.disabled = false;
        }
    });

    // Generate 3D Model
    const loadingMessages = [
        "Iniciando reconstrucción neural...",
        "Analizando nubes de puntos...",
        "Generando topología de malla...",
        "Sintetizando mapas de texturas...",
        "Refinando geometría y vértices...",
        "Finalizando exportación .GLB..."
    ];

    let messageInterval;

    function updateStatusMessage() {
        let index = 0;
        statusTitle.textContent = "GENERATING MESH";
        statusDesc.textContent = loadingMessages[0];
        
        messageInterval = setInterval(() => {
            index = (index + 1) % loadingMessages.length;
            statusDesc.textContent = loadingMessages[index];
        }, 5000); // Cambio cada 5 segundos
    }

    generateBtn.addEventListener('click', async () => {
        const file = fileInput.files[0];
        if (!file) return;

        const formData = new FormData();
        formData.append('image', file);

        // Update UI State
        generateBtn.disabled = true;
        generateBtn.textContent = 'SYNTHESIZING...';
        systemStatus.textContent = 'SYSTEM ACTIVE';
        systemStatus.style.color = '#fff';
        
        // Show Overlay and Loading Elements
        statusOverlay.classList.remove('hidden');
        document.getElementById('loading-spinner').classList.remove('hidden');
        document.getElementById('status-icon-container').classList.add('hidden');
        
        updateStatusMessage();
        startProgress();

        try {
            const response = await fetch('/generate', {
                method: 'POST',
                body: formData
            });

            const data = await response.json();

            if (!response.ok) {
                // If the server returned an error message in JSON
                throw new Error(data.error || 'Generation failed');
            }

            // Load 3D Model
            viewer.src = data.model_url;
            viewer.classList.remove('hidden');
            statusOverlay.classList.add('hidden');
            
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            progressIndicator.style.width = '100%';
            
            setTimeout(() => {
                systemStatus.textContent = 'SYSTEM IDLE';
                systemStatus.style.color = '#ff3b3b';
                progressIndicator.style.width = '0%';
            }, 1000);

        } catch (error) {
            console.error(error);
            clearInterval(progressInterval);
            clearInterval(messageInterval);
            
            statusTitle.textContent = 'ERROR';
            statusTitle.style.color = '#ff3b3b';
            statusDesc.textContent = error.message;
            statusDesc.style.color = '#fff';
            
            systemStatus.textContent = 'SYSTEM ERROR';
            systemStatus.style.color = '#ff3b3b';
            
            // Hide spinner, show error icon
            document.getElementById('loading-spinner').classList.add('hidden');
            document.getElementById('status-icon-container').classList.remove('hidden');
            document.getElementById('status-icon-container').innerHTML = `
                <svg class="w-20 h-20 text-[#ff3b3b]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
            `;
            
            progressIndicator.style.width = '0%';
        } finally {
            generateBtn.disabled = false;
            generateBtn.textContent = 'SYNTHESIZE MODEL';
        }
    });

    // Handle Drag & Drop
    dropzone.addEventListener('dragover', (e) => {
        e.preventDefault();
        dropzone.classList.add('border-white/40');
    });

    dropzone.addEventListener('dragleave', () => {
        dropzone.classList.remove('border-white/40');
    });

    dropzone.addEventListener('drop', (e) => {
        e.preventDefault();
        dropzone.classList.remove('border-white/40');
        if (e.dataTransfer.files.length > 0) {
            fileInput.files = e.dataTransfer.files;
            const event = new Event('change');
            fileInput.dispatchEvent(event);
        }
    });
});
