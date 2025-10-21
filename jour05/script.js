// --- Fonction Utilitaire pour Afficher/Effacer les Erreurs ---
function displayError(fieldId, message) {
  const errorElement = document.getElementById(fieldId + "-error");
  errorElement.textContent = message;
}

// --- 1. Validation Générique (Nom, Prénom, Adresse, Code Postal) ---
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

  // B. Validation pour Adresse (longueur minimale)
  if (fieldName === "adresse") {
    if (cleanedValue.length < 5) {
      displayError(
        fieldName,
        "L'adresse est trop courte. Veuillez entrer l'adresse complète."
      );
      return false;
    }
  }

  // C. Validation pour Code Postal
  if (fieldName === "code_postal") {
    const postalCodeRegex = /^\d{5}$/; // 5 chiffres exactement
    if (!postalCodeRegex.test(cleanedValue)) {
      displayError(
        fieldName,
        "Le code postal doit être composé de 5 chiffres."
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

  // 1. Validation de format CÔTÉ CLIENT (rapide)
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    errorElement.textContent = "Veuillez entrer une adresse e-mail valide.";
    return;
  }

  // 2. Validation d'unicité CÔTÉ SERVEUR (asynchrone)
  fetch("/api/check-email", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: email }),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.is_unique === false) {
        errorElement.textContent = "Cet email est déjà utilisé.";
      }
    })
    .catch((error) => {
      console.error("Erreur lors de la vérification asynchrone:", error);
      // Afficher une erreur générique si le serveur est injoignable
      errorElement.textContent = "Erreur de connexion, veuillez réessayer.";
    });
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
