// --- Fonction Utilitaire pour Afficher/Effacer les Erreurs ---
function displayError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  errorElement.textContent = message;
}

// --- 1. Validation Générique (Nom, Prénom, Adresse) ---
function validateField(fieldName, value) {
  displayError(fieldName, ""); // Efface les erreurs précédentes

  const cleanedValue = value.trim();

  if (cleanedValue.length === 0) {
    displayError(
      fieldName,
      `Le champ ${
        fieldName.charAt(0).toUpperCase() + fieldName.slice(1)
      } est obligatoire.`
    );
    return false;
  }

  // A. Validation pour Nom/Prénom (Rejette les chiffres et la plupart des symboles)
  if (fieldName === "nom" || fieldName === "prenom") {
    // Nouvelle Regex : Accepte lettres, espaces, apostrophes, traits d'union. Rejette les chiffres.
    const nameRegex = /^[A-Za-zÀ-ÿ\s'-]+$/;

    if (cleanedValue.length < 2 || cleanedValue.length > 50) {
      displayError(
        fieldName,
        `Le ${fieldName} doit contenir entre 2 et 50 caractères.`
      );
      return false;
    }

    if (!nameRegex.test(cleanedValue)) {
      displayError(
        fieldName,
        `Le ${fieldName} ne doit contenir que des lettres, espaces, traits d'union et apostrophes.`
      );
      return false;
    }
  }

  return true;
}
//2. Validation Email (Client + Asynchrone Serveur) ---
function validateEmail(email) {
  const errorElement = document.getElementById("email-error");
  errorElement.textContent = ""; // Efface les erreurs précédentes
  const requiredDomain = "@laplateforme.io"; // Le domaine requis

  // 1. Validation de format CÔTÉ CLIENT (rapide)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorElement.textContent = "Veuillez entrer une adresse e-mail valide.";
    return;
  }

  if (!email.endsWith(requiredDomain)) {
    errorElement.textContent = `Nom de domaine incorrect, l'adresse e-mail doit se terminer par ${requiredDomain}.`;
    return;
  }
}

// --- Validation Mot de Passe (Feedback en temps réel - oninput) ---
function validatePassword(password) {
  displayError("password", ""); // Efface les erreurs précédentes

  // 1. VÉRIFICATION DU CHAMP VIDE
  if (password.length === 0) {
    displayError("password", "Le mot de passe est obligatoire.");
    return false;
  }

  // 2. VÉRIFICATION DE LA COMPLEXITÉ
  let errors = [];

  // Longueur minimale
  if (password.length < 8) {
    errors.push("8 caractères minimum");
  }
  // Majuscule
  if (!/[A-Z]/.test(password)) {
    errors.push("une majuscule");
  }
  // Chiffre
  if (!/[0-9]/.test(password)) {
    errors.push("un chiffre");
  }
  // Symbole/Caractère spécial
  // Rejette les lettres, chiffres et espaces pour identifier un caractère spécial
  if (!/[^A-Za-z0-9\s]/.test(password)) {
    errors.push("un caractère spécial");
  }

  if (errors.length > 0) {
    // Affiche un message d'erreur clair si des règles ne sont pas respectées
    const required = errors.join(", ");
    displayError("password", `Le mot de passe doit contenir : ${required}.`);
    return false;
  }

  return true;
}
// --- Validation Mot de Passe (Feedback en temps réel - oninput) ---
function validateConfirmPassword(confirmPassword) {
  displayError("confirm_password", ""); // Efface les erreurs précédentes

  // 1. VÉRIFICATION DU CHAMP VIDE
  if (confirmPassword.length === 0) {
    displayError(
      "confirm_password",
      "La confirmation de mot de passe est obligatoire."
    );
    return false;
  }

  // 2. VÉRIFICATION DE LA COMPLEXITÉ
  let errors = [];

  // Longueur minimale
  if (confirmPassword.length < 8) {
    errors.push("8 caractères minimum");
  }
  // Majuscule
  if (!/[A-Z]/.test(confirmPassword)) {
    errors.push("une majuscule");
  }
  // Chiffre
  if (!/[0-9]/.test(confirmPassword)) {
    errors.push("un chiffre");
  }
  // Symbole/Caractère spécial
  // Rejette les lettres, chiffres et espaces pour identifier un caractère spécial
  if (!/[^A-Za-z0-9\s]/.test(confirmPassword)) {
    errors.push("un caractère spécial");
  }

  if (errors.length > 0) {
    // Affiche un message d'erreur clair si des règles ne sont pas respectées
    const required = errors.join(", ");
    displayError(
      "confirm_password",
      `Le mot de passe doit contenir : ${required}.`
    );
    return false;
  }

  return true;
}

document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupérer le formulaire de connexion (seulement sur la page connexion.html)
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }
});

// Fonction pour gérer la connexion
async function handleLogin(event) {
  event.preventDefault(); // Empêche l'envoi du formulaire par défaut

  const emailInput = document.getElementById("email").value;
  const passwordInput = document.getElementById("password").value;
  const errorDisplay = document.getElementById("loginError");

  // Cacher l'erreur précédente
  errorDisplay.classList.add("d-none");

  try {
    // 2. Tenter de charger les utilisateurs depuis le fichier JSON
    const response = await fetch("./users.json");

    // Vérifier si le fichier a été trouvé et lu
    if (!response.ok) {
      throw new Error(`Erreur de chargement des données : ${response.status}`);
    }

    const users = await response.json();

    // 3. Chercher l'utilisateur correspondant (email et mot de passe)
    const userFound = users.find(
      (user) => user.email === emailInput && user.password === passwordInput
    );

    if (userFound) {
      // 4. CONNEXION RÉUSSIE : Redirection
      console.log("Connexion réussie pour:", userFound.email);

      // Stocker l'information de succès dans sessionStorage
      sessionStorage.setItem("loginSuccess", "true");
      sessionStorage.setItem("userEmail", userFound.email); // Optionnel: stocker l'email pour le message

      // Redirection vers la page calendrier
      window.location.href = "calendrier.html";
    } else {
      // 5. CONNEXION ÉCHOUÉE : Afficher un message d'erreur
      errorDisplay.textContent = "Email ou mot de passe incorrect.";
      errorDisplay.classList.remove("d-none");
    }
  } catch (error) {
    // Gérer les erreurs de réseau ou de parsing JSON
    console.error("Erreur de connexion:", error);
    errorDisplay.textContent =
      "Une erreur est survenue lors de la vérification. Veuillez réessayer.";
    errorDisplay.classList.remove("d-none");
  }
}

// ===================================
// FONCTION GLOBALE D'AFFICHAGE D'ALERTE
// ===================================

/**
 * Affiche un message d'alerte temporaire sur la page.
 * Nécessite un div <div id="alert-message"></div> dans le HTML.
 * @param {string} message - Le texte de l'alerte.
 * @param {number} duration - La durée d'affichage en millisecondes (par défaut 3000ms).
 */
function displayAlert(message, duration = 3000) {
  const alertDiv = document.getElementById("alert-message");

  // Si l'élément n'existe pas, on log l'erreur pour le développeur
  if (!alertDiv) {
    console.error(
      "L'élément #alert-message n'existe pas. Veuillez l'ajouter au HTML."
    );
    return;
  }

  // Assurez-vous que le message est visible
  alertDiv.textContent = message;
  alertDiv.style.opacity = 1;
  alertDiv.style.visibility = "visible";

  // Masquer le message après la durée spécifiée
  setTimeout(() => {
    alertDiv.style.opacity = 0;
    // On attend la fin de la transition CSS pour cacher complètement
    setTimeout(() => {
      alertDiv.style.visibility = "hidden";
      alertDiv.textContent = "";
    }, 500);
  }, duration);
}

function checkLoginAlert() {
  const loginSuccess = sessionStorage.getItem("loginSuccess");
  const userEmail = sessionStorage.getItem("userEmail"); // Récupère l'email stocké

  if (loginSuccess === "true") {
    // 1. IMPORTANT : Effacer la variable pour que l'alerte ne s'affiche qu'une seule fois
    sessionStorage.removeItem("loginSuccess");
    sessionStorage.removeItem("userEmail");

    // 2. Préparer le message
    const message = userEmail
      ? `Connexion réussie ! Bienvenue, ${userEmail}.`
      : "Connexion réussie !";

    // 3. Afficher l'alerte (avec votre fonction displayAlert)
    displayAlert(message, 4000); //
  }
}
// ===================================
// ÉCOUTEUR GLOBAL DOMContentLoaded
// ===================================

document.addEventListener("DOMContentLoaded", () => {
  // 1. Récupérer le formulaire de connexion (seulement sur la page connexion.html)
  const loginForm = document.getElementById("loginForm");

  if (loginForm) {
    loginForm.addEventListener("submit", handleLogin);
  }

  // 2. Vérifier si on est sur la page calendrier.html et si une connexion a eu lieu
  // Cette fonction s'exécutera sur TOUTES les pages, mais agira seulement sur calendrier.html
  // après une connexion, grâce à la vérification de sessionStorage.
  checkLoginAlert();
  // ===============================================
  // *** NOUVEAU : Initialisation du Calendrier ***
  // ===============================================
  const container = document.querySelector(".container");
  // On assume que le calendrier est la fonctionnalité principale de cette page
  if (container && window.location.pathname.includes("calendrier.html")) {
    // Afficher le calendrier pour le mois en cours
    renderCalendar(new Date());

    // Mise à jour du titre
    const h1Title = document.querySelector("h1");
    if (h1Title) {
      h1Title.textContent = "Calendrier des Présences";
    }
  }
});

// Clé pour stocker les demandes de présence dans localStorage
const PRESENCE_STORAGE_KEY = "userPresenceRequests";

// Récupère les demandes stockées ou initialise un objet vide.
function getPresenceRequests() {
  const storedRequests = localStorage.getItem(PRESENCE_STORAGE_KEY);
  return storedRequests ? JSON.parse(storedRequests) : {};
}

// Sauvegarde l'état actuel des demandes.
function savePresenceRequests(requests) {
  localStorage.setItem(PRESENCE_STORAGE_KEY, JSON.stringify(requests));
}
/**
 * Génère le calendrier pour le mois et l'année en cours.
 * @param {Date} targetDate - Le mois et l'année à afficher.
 */
function renderCalendar(targetDate) {
  const container = document.querySelector(".container");
  if (!container) return;

  // Réinitialiser le conteneur
  container.innerHTML = "";

  // Initialiser les dates
  const today = new Date();
  const currentMonth = targetDate.getMonth();
  const currentYear = targetDate.getFullYear();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay(); // 0=Dim, 1=Lun...
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();

  // Récupérer l'état actuel de l'utilisateur
  const presenceRequests = getPresenceRequests();

  // Titre du mois
  const monthName = targetDate.toLocaleString("fr-FR", {
    month: "long",
    year: "numeric",
  });
  const calendarHTML = `
        <h2 class="text-center text-primary mb-3">${
          monthName.charAt(0).toUpperCase() + monthName.slice(1)
        }</h2>
        <div class="calendar-grid">
            <div class="day-name">Lun</div>
            <div class="day-name">Mar</div>
            <div class="day-name">Mer</div>
            <div class="day-name">Jeu</div>
            <div class="day-name">Ven</div>
            <div class="day-name">Sam</div>
            <div class="day-name">Dim</div>
        </div>
        <div class="calendar-grid" id="calendarDays">
            </div>
    `;
  container.innerHTML = calendarHTML;
  const daysGrid = document.getElementById("calendarDays");

  // Ajustement du décalage (Débuter à Lundi)
  // getDay() donne 0 pour Dimanche. Nous voulons 0 pour Lundi.
  let startDayIndex = firstDay === 0 ? 6 : firstDay - 1;

  // Ajouter les jours vides pour le décalage
  for (let i = 0; i < startDayIndex; i++) {
    daysGrid.innerHTML += `<div class="day empty-day"></div>`;
  }

  // Ajouter les jours du mois
  for (let day = 1; day <= daysInMonth; day++) {
    const fullDate = `${currentYear}-${String(currentMonth + 1).padStart(
      2,
      "0"
    )}-${String(day).padStart(2, "0")}`;
    const dayDate = new Date(currentYear, currentMonth, day);

    const isPast =
      dayDate < today && dayDate.toDateString() !== today.toDateString();
    const requestState = presenceRequests[fullDate] || "none"; // 'none', 'requested'

    let buttonClass = "btn-secondary";
    let buttonText = "Demander";
    let cellClass = "";

    if (isPast) {
      buttonClass = "btn-dark disabled";
      buttonText = "Passé";
      cellClass = "day-past";
    } else if (requestState === "requested") {
      buttonClass = "btn-warning";
      buttonText = "Annuler";
    }

    // Structure de la cellule du jour
    daysGrid.innerHTML += `
            <div class="day ${cellClass} ${
      dayDate.toDateString() === today.toDateString() ? "day-today" : ""
    }">
                <div class="day-number">${day}</div>
                <button 
                    class="btn btn-sm ${buttonClass} presence-toggle" 
                    data-date="${fullDate}" 
                    ${isPast ? "disabled" : ""}
                >
                    ${buttonText}
                </button>
            </div>
        `;
  }

  // Ajouter l'écouteur d'événement après la génération
  attachCalendarListeners();
}

/**
 * Attache l'écouteur d'événement à tous les boutons de présence.
 */
function attachCalendarListeners() {
  document.querySelectorAll(".presence-toggle").forEach((button) => {
    button.addEventListener("click", handlePresenceToggle);
  });
}

/**
 * Gère le clic sur le bouton de demande/annulation.
 * @param {Event} event
 */
function handlePresenceToggle(event) {
  const button = event.target;
  const date = button.getAttribute("data-date");
  let requests = getPresenceRequests();
  let message = "";

  // Toggle l'état de la demande
  if (requests[date] === "requested") {
    delete requests[date]; // Annuler la demande
    message = `Demande de présence annulée pour le ${date}.`;
    button.className = "btn btn-sm btn-secondary presence-toggle";
    button.textContent = "Demander";
  } else {
    requests[date] = "requested"; // Faire une demande
    message = `Demande de présence envoyée pour le ${date}.`;
    button.className = "btn btn-sm btn-warning presence-toggle";
    button.textContent = "Annuler";
  }

  savePresenceRequests(requests);
  displayAlert(message, 4000);
}
