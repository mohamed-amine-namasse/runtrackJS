function rebootMonde() {
  // Citations aléatoires du film "Blade Runner" (1982)
  const citations = [
    {
      titre: "Blade Runner",
      texte:
        "<p>I've seen things you people wouldn't believe. Attack ships on fire off the shoulder of Orion. I watched C-beams glitter in the dark near the Tannhäuser Gate. All those moments will be lost in time, like tears in rain. Time to die.</p><p class='fw-bold'>— Roy Batty</p>",
    },
    {
      titre: "Blade Runner",
      texte:
        "<p>It's too bad she won't live! But then again, who does?</p><p class='fw-bold'>— Gaff</p>",
    },
    {
      titre: "Blade Runner",
      texte:
        "<p>If only you could see what I've seen with your eyes.</p><p class='fw-bold'>— Roy Batty</p>",
    },
    {
      titre: "Blade Runner",
      texte:
        "<p>I don't know why he saved my life. Maybe in those last moments, he loved life more than he ever had before. Not just his life, anybody's life, my life. All he'd wanted were the same answers the rest of us want. Where did I come from? Where am I going? How long have I got? All I could do was sit there and watch him die.</p><p class='fw-bold'>— Rick Deckard</p>",
    },
  ];

  // Sélectionne une citation aléatoire
  const citationAleatoire =
    citations[Math.floor(Math.random() * citations.length)];

  // Met à jour le titre (h2)
  const titreElement = document.getElementById("jumbotron-title");
  titreElement.textContent = citationAleatoire.titre;

  // Met à jour le contenu (div#jumbotron-content)
  const contenuElement = document.getElementById("jumbotron-content");
  contenuElement.innerHTML = citationAleatoire.texte;
}
const TOTAL_PAGES = 3;

// Initialisation de la page actuelle (commence à 1)
let currentPageIndex = 1;
// Fonction pour la pagination
const pageContent = {
  1: {
    title: "Vue Globale du Monde (Page 1)",
    content: `
                    <p>Ceci est la première page de notre documentation. Elle présente une vue d'ensemble, 
                    avec des définitions classiques sur le concept de "Monde" et son environnement. 
                    C'est l'état initial, le point de départ avant toute exploration ou modification.</p>
                    
                `,
  },
  2: {
    title: "La Question Existentielle (Page 2)",
    content: `
                    <p>Le monde n'est peut-être pas seulement ce que nous percevons. 
                    Cette section explore les théories alternatives, les simulations et les univers parallèles. 
                    Sommes-nous réels ? La réponse est dans la documentation, quelque part entre les pages 2 et 3.</p>
                    
                `,
  },
  3: {
    title: "Le Futur (Page 3)",
    content: `
                    <p>Projections sur le 'Monde' dans 50 ans. Développement de l'IA, colonisation spatiale, 
                    et le triomphe des DogeCoins. Tout ce que vous devez savoir pour préparer 
                    votre diplôme de web-designer de l'an 2077.</p>
                   
                `,
  },
};

// Fonction principale pour changer de page et mettre à jour l'état
function changePageContent(pageIndex) {
  // S'assurer que l'index est valide
  if (pageIndex < 1 || pageIndex > TOTAL_PAGES) {
    return;
  }

  // 1. Mettre à jour l'index global
  currentPageIndex = pageIndex;

  // 2. Mise à jour du contenu du Jumbotron
  const data = pageContent[pageIndex];
  if (data) {
    document.getElementById("jumbotron-title").textContent = data.title;
    document.getElementById("jumbotron-content").innerHTML = data.content;
  }

  // 3. Mise à jour de l'état "actif" des numéros de page
  // On sélectionne tous les <li> qui ne sont ni le premier ni le dernier enfant
  const pageNumberItems = document.querySelectorAll(
    "#pagination-list .page-item:not(:first-child):not(:last-child)"
  );

  pageNumberItems.forEach((item, index) => {
    // index + 1 correspond au numéro de la page (1, 2, 3...)
    if (index + 1 === pageIndex) {
      item.classList.add("active");
    } else {
      item.classList.remove("active");
    }
  });

  // 4. Mise à jour de l'état "disabled" des boutons Précédent et Suivant
  const prevButtonLi = document.querySelector(
    "#pagination-list li:first-child"
  );
  const nextButtonLi = document.querySelector("#pagination-list li:last-child");

  // Précédent
  if (currentPageIndex <= 1) {
    prevButtonLi.classList.add("disabled");
  } else {
    prevButtonLi.classList.remove("disabled");
  }

  // Suivant
  if (currentPageIndex >= TOTAL_PAGES) {
    nextButtonLi.classList.add("disabled");
  } else {
    nextButtonLi.classList.remove("disabled");
  }
}

// Fonction Gestion du bouton Précédent
function previousPage() {
  // Utilise l'index global stocké
  if (currentPageIndex > 1) {
    changePageContent(currentPageIndex - 1);
  }
}

// Fonction Gestion du bouton Suivant
function nextPage() {
  // Utilise l'index global stocké
  if (currentPageIndex < TOTAL_PAGES) {
    changePageContent(currentPageIndex + 1);
  }
}
// Gestion de l'état actif dans la liste groupée
function setActiveItem(clickedElement) {
  // 1. Désactiver l'élément actuellement actif
  // Sélectionne tous les éléments avec la classe 'active' à l'intérieur de la liste
  const activeItems = document.querySelectorAll("#hell-list .active");

  // Pour chaque élément actif trouvé, retire la classe 'active' et 'aria-current'
  activeItems.forEach((item) => {
    item.classList.remove("active");
    item.removeAttribute("aria-current");
  });

  // 2. Activer l'élément cliqué
  // Ajoute la classe 'active' à l'élément qui vient d'être cliqué (passé en argument)
  clickedElement.classList.add("active");

  // Ajoute l'attribut aria-current pour l'accessibilité
  clickedElement.setAttribute("aria-current", "true");
}

// --- Fonctions pour la Barre de Progression  ---

/**
 * Augmente ou diminue la barre de progression.
 * @param {number} amount - La valeur à ajouter (positif) ou à soustraire (négatif), ex: 10 ou -10.
 */
function changeProgressBar(amount) {
  const progressBar = document.getElementById("mainProgressBar");
  const progressBarInner = document.getElementById("progressBarInner");

  if (!progressBar || !progressBarInner) return;

  // Récupérer la valeur actuelle
  let currentValue = parseInt(progressBar.getAttribute("aria-valuenow"));

  // Calculer la nouvelle valeur
  let newValue = currentValue + amount;

  // Limiter entre 0 et 100
  newValue = Math.max(0, Math.min(100, newValue));

  // Appliquer la nouvelle valeur
  progressBar.setAttribute("aria-valuenow", newValue);
  progressBarInner.style.width = newValue + "%";
}

// Séquence de touches pour l'Easter Egg
const KONAMI_CODE = ["d", "g", "c"];
let pressedKeys = [];

// --- Fonctions de l'Easter Egg  ---

/**
 * Collecte les données du formulaire et les affiche dans la modale.
 */
function showRecapModal() {
  // Récupérer les valeurs des champs du formulaire de gauche
  const login = document.getElementById("inputLogin").value || "Non renseigné";
  const password =
    document.getElementById("inputPassword").value || "Non renseigné";
  const url = document.getElementById("inputURL").value || "Non renseigné";
  const amount =
    document.getElementById("inputAmount").value || "Non renseigné";

  // Construire le contenu HTML
  const recapHtml = `
                <ul class="list-group">
                    <li class="list-group-item"><strong>Login:</strong> ${login}</li>
                    <li class="list-group-item"><strong>Mot de Passe:</strong> ${password}</li>
                    <li class="list-group-item"><strong>URL (DogeCoin):</strong> ${url}</li>
                    <li class="list-group-item"><strong>Amount:</strong> ${amount}</li>
                </ul>
            `;

  // Insérer le contenu dans la modale
  document.getElementById("recapModalContent").innerHTML = recapHtml;

  // Afficher la modale
  const recapModal = new bootstrap.Modal(document.getElementById("recapModal"));
  recapModal.show();

  // Réinitialiser la séquence de touches après l'affichage
  pressedKeys = [];
}

/**
 * Écouteur d'événement pour le raccourci clavier.
 * @param {KeyboardEvent} event
 */
document.addEventListener("keydown", (event) => {
  const key = event.key.toLowerCase();

  // 1. Ajouter la touche pressée à la séquence
  pressedKeys.push(key);

  // 2. Maintenir uniquement les 3 dernières touches
  if (pressedKeys.length > KONAMI_CODE.length) {
    pressedKeys.shift();
  }

  // 3. Vérifier si la séquence correspond
  if (
    pressedKeys.length === KONAMI_CODE.length &&
    pressedKeys.every((value, index) => value === KONAMI_CODE[index])
  ) {
    showRecapModal();
  }
});
