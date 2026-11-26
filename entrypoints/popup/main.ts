document.getElementById('copy-btn')?.addEventListener('click', async () => {
  const statusEl = document.getElementById('status');

  // Demande le token au background script
  chrome.runtime.sendMessage({ action: 'getToken' }, async (response) => {
    if (response && response.token) {
      try {
        await navigator.clipboard.writeText(response.token);
        if (statusEl) statusEl.textContent = 'clé copiée avec succès !';
      } catch (err) {
        if (statusEl) statusEl.textContent = 'Erreur lors de la copie.';
      }
    } else {
      if (statusEl) statusEl.textContent = 'Aucune clé trouvée, effectue une recherche sur Playiad';
    }
  });
});