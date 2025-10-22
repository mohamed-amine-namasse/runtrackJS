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

function changePageContent(pageIndex) {
  const data = pageContent[pageIndex];

  if (data) {
    // Met à jour le titre (h2)
    document.getElementById("jumbotron-title").textContent = data.title;

    // Met à jour le contenu (div#jumbotron-content)
    document.getElementById("jumbotron-content").innerHTML = data.content;
  }
}
