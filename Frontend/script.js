function normalizeUrl(url) {
    url = url.trim();

    if (url.startsWith('http://') || url.startsWith('https://')) {
        return url;
    }

    if (!url.includes('.')) {
        throw new Error('URL inválida: domínio não encontrado');
    }

    return 'http://' + url;
}

async function shortenUrl() {
    const urlInput = document.getElementById('urlInput');
    const resultBox = document.getElementById('resultBox');
    const shortenedUrl = document.getElementById('shortenedUrl');
    const errorMessage = document.getElementById('errorMessage');
    const shortenBtn = document.getElementById('shortenBtn');

    errorMessage.textContent = '';
    resultBox.style.display = 'none';

    const url = urlInput.value.trim();

    if (!url) {
        errorMessage.textContent = 'Por favor, insira uma URL';
        return;
    }

    let normalizedUrl;
    try {
        normalizedUrl = normalizeUrl(url);
    } catch (error) {
        errorMessage.textContent = error.message;
        return;
    }

    shortenBtn.disabled = true;
    shortenBtn.textContent = 'Encurtando...';

    try {
        const response = await fetch('https://gabriellauro.space/shorten', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ url: normalizedUrl })
        });

        if (!response.ok) {
            throw new Error('Erro ao encurtar URL');
        }

        const data = await response.json();

        shortenedUrl.textContent = data.shortened_url || data.short_url || data.url;
        resultBox.style.display = 'flex';

    } catch (error) {
        errorMessage.textContent = 'Erro ao encurtar o link. Tente novamente.';
    } finally {
        shortenBtn.disabled = false;
        shortenBtn.textContent = 'Encurtar';
    }
}

function copyToClipboard() {
    const shortenedUrl = document.getElementById('shortenedUrl').textContent;

    navigator.clipboard.writeText(shortenedUrl).then(() => {
        const btn = event.target;
        const originalText = btn.textContent;
        btn.textContent = 'Copiado!';

        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

document.getElementById('urlInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        shortenUrl();
    }
});











