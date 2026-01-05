        async function shortenUrl() {
            const urlInput = document.getElementById('urlInput');
            const shortenBtn = document.getElementById('shortenBtn');
            const resultBox = document.getElementById('resultBox');
            const errorMessage = document.getElementById('errorMessage');
            const url = urlInput.value.trim();
            
            // Esconder mensagens anteriores
            resultBox.classList.remove('show');
            errorMessage.classList.remove('show');
            
            if (!url) {
                showError('Por favor, insira uma URL válida');
                return;
            }

            // Validar URL
            try {
                new URL(url);
            } catch (e) {
                showError('URL inválida. Certifique-se de incluir http:// ou https://');
                return;
            }

            // Desabilitar botão durante o processamento
            shortenBtn.disabled = true;
            shortenBtn.textContent = 'Encurtando...';

            try {
                const response = await fetch('http://140.238.190.44/shorten', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'text/plain'
                    },
                    mode: 'cors',
                    body: JSON.stringify(url)
                });

                if (!response.ok) {
                    throw new Error('Erro na resposta do servidor');
                }

                const shortUrl = await response.text();
                
                document.getElementById('shortenedUrl').textContent = shortUrl;
                resultBox.classList.add('show');
                
            } catch (error) {
                console.error('Erro:', error);
                if (error.message.includes('CORS') || error.message.includes('fetch')) {
                    showError('⚠️ Erro de CORS: Sua API precisa permitir requisições do navegador. Configure os headers CORS no servidor.');
                } else {
                    showError('Erro ao encurtar URL. Verifique sua conexão e tente novamente.');
                }
            } finally {
                // Reabilitar botão
                shortenBtn.disabled = false;
                shortenBtn.textContent = 'Encurtar';
            }
        }

        function showError(message) {
            const errorMessage = document.getElementById('errorMessage');
            errorMessage.textContent = message;
            errorMessage.classList.add('show');
        }

        function copyToClipboard() {
            const shortUrl = document.getElementById('shortenedUrl').textContent;
            navigator.clipboard.writeText(shortUrl).then(() => {
                const btn = document.querySelector('.btn-copy');
                const originalText = btn.textContent;
                btn.textContent = '✓ Copiado!';
                setTimeout(() => {
                    btn.textContent = originalText;
                }, 2000);
            }).catch(err => {
                console.error('Erro ao copiar:', err);
                alert('Não foi possível copiar. Tente selecionar e copiar manualmente.');
            });
        }

        // Permitir encurtar com Enter
        document.getElementById('urlInput').addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                shortenUrl();
            }
        });