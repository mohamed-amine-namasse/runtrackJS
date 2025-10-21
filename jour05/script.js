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
