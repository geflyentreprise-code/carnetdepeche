// CarnetPêche - Script principal
// Application de gestion des parcours de pêche

// ========== DONNÉES D'EXEMPLE ==========

const parcoursData = [
    {
        id: 1,
        nom: "Parcours de la Loire",
        departement: "Loire",
        commune: "Roanne",
        type_parcours: "No-Kill",
        categorie_piscicole: "1ère catégorie",
        latitude: 46.0333,
        longitude: 4.0667,
        description: "Magnifique parcours en première catégorie avec truites fario et ombre commun.",
        image_url: "https://images.unsplash.com/photo-1559827260-dc66d52bef19?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 2,
        nom: "Lac de Chalain",
        departement: "Jura",
        commune: "Doucier",
        type_parcours: "Parcours loisirs",
        categorie_piscicole: "2ème catégorie",
        latitude: 46.7667,
        longitude: 5.8667,
        description: "Lac magnifique offrant une pêche variée avec brochets, sandres et gardons.",
        image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=500&q=60"
    },
    {
        id: 3,
        nom: "Rivière de l'Ain",
        departement: "Ain",
        commune: "Bellegarde",
        type_parcours: "Parcours découverte",
        categorie_piscicole: "1ère catégorie",
        latitude: 46.3,
        longitude: 5.8,
        description: "Parcours idéal pour les pêcheurs qui cherchent à découvrir la pêche en rivière.",
        image_url: "https://images.unsplash.com/photo-1511884642898-4c92249e20b6?auto=format&fit=crop&w=500&q=60"
    }
];

let map = null;
let markers = [];

// ========== INITIALISATION ==========

document.addEventListener('DOMContentLoaded', () => {
    afficherParcours();
    initialiserCarte();
});

// ========== AFFICHAGE DES PARCOURS ==========

function afficherParcours() {
    const container = document.getElementById('listeParcours');
    
    if (!parcoursData.length) {
        container.innerHTML = '<div class="empty">Aucun parcours disponible.</div>';
        return;
    }
    
    container.innerHTML = parcoursData.map(p => `
        <article class="card">
            <div class="card-image">
                ${p.image_url ? 
                    `<img src="${p.image_url}" alt="${p.nom}">` :
                    `<div class="placeholder">P</div>`
                }
            </div>
            <div class="card-content">
                ${p.type_parcours ? 
                    `<span class="badge">${p.type_parcours}</span>` :
                    ''
                }
                ${p.categorie_piscicole ?
                    `<span class="badge">${p.categorie_piscicole}</span>` :
                    ''
                }
                <h3>${escapeHtml(p.nom)}</h3>
                <div class="location">
                    ${escapeHtml(p.commune)} • ${escapeHtml(p.departement)}
                </div>
                <p>${escapeHtml(p.description)}</p>
                <div class="card-actions">
                    <button class="btn btn-primary" onclick="voirParcours(${p.id})">
                        Voir le parcours
                    </button>
                </div>
            </div>
        </article>
    `).join('');
}

// ========== AFFICHAGE D'UN PARCOURS ==========

function voirParcours(id) {
    const parcours = parcoursData.find(p => p.id === id);
    if (parcours) {
        alert(`📍 ${parcours.nom}\n\n${parcours.description}\n\n${parcours.commune} (${parcours.departement})`);
    }
}

// ========== INITIALISATION CARTE ==========

function initialiserCarte() {
    map = L.map('map').setView([46.2276, 2.2137], 6);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
    }).addTo(map);
    
    afficherCarte();
}

// ========== AFFICHAGE MARQUEURS CARTE ==========

function afficherCarte() {
    // Supprimer les anciens marqueurs
    markers.forEach(marker => map.removeLayer(marker));
    markers = [];
    
    const positions = [];
    
    parcoursData.forEach(p => {
        if (isFinite(p.latitude) && isFinite(p.longitude)) {
            const marker = L.marker([p.latitude, p.longitude]).addTo(map);
            
            marker.bindPopup(`
                <strong>${escapeHtml(p.nom)}</strong><br>
                ${escapeHtml(p.commune)} • ${escapeHtml(p.departement)}<br>
                <small>${escapeHtml(p.type_parcours || 'Parcours')}</small><br><br>
                <button onclick="voirParcours(${p.id})" style="
                    border: 0;
                    border-radius: 7px;
                    padding: 7px 10px;
                    background: #176b78;
                    color: white;
                    font-weight: 800;
                    cursor: pointer;
                    margin-top: 8px;
                ">
                    Voir le parcours
                </button>
            `);
            
            markers.push(marker);
            positions.push([p.latitude, p.longitude]);
        }
    });
    
    // Ajuster la vue pour voir tous les marqueurs
    if (positions.length) {
        const bounds = L.latLngBounds(positions);
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}

// ========== UTILITAIRES ==========

/**
 * Échappe les caractères HTML pour éviter les injections XSS
 * @param {string} text - Le texte à échapper
 * @returns {string} Le texte échappé
 */
function escapeHtml(text) {
    if (!text) return '';
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return String(text).replace(/[&<>"']/g, m => map[m]);
}

/**
 * Formate une date au format français
 * @param {Date|string} date - La date à formater
 * @returns {string} La date formatée
 */
function formatDate(date) {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

/**
 * Récupère un paramètre d'URL
 * @param {string} param - Le nom du paramètre
 * @returns {string|null} La valeur du paramètre
 */
function getUrlParameter(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
}

// ========== ÉVÉNEMENTS ==========

// Redimensionnement de la carte lors du redimensionnement de la fenêtre
window.addEventListener('resize', () => {
    if (map) {
        setTimeout(() => map.invalidateSize(), 100);
    }
});

// ========== LOGGING (OPTIONNEL) ==========

console.log('CarnetPêche - Application chargée');
console.log(`Nombre de parcours chargés: ${parcoursData.length}`);