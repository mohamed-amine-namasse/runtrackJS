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

      // Stocker l'information de l'utilisateur (facultatif mais recommandé)
      // localStorage.setItem('currentUser', JSON.stringify(userFound));

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
