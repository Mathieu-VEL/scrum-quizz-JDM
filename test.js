let currentQuestion = 1;
const totalQuestions = 7;
const tempsParQuestion = 15; // Durée en secondes pour chaque question
let timerInterval;

// Objet pour stocker les réponses utilisateur
const reponses = {};

// Objet contenant les bonnes réponses pour chaque question
const correctAnswers = {
  1: "Un ensemble d'au moins 12 caractères, de types différents",
  2: "Celui de ta messagerie",
  3: "Que le site utilise un protocole de navigation sécurisé, indispensable pour effectuer des achats",
  4: "Une action malveillante en direction d’un système ou d’un réseau informatique",
  5: "Oui",
  6: "En le mettant à jour régulièrement et en installant un anti-virus",
  7: "Oui : les gars sont très très forts"
};

// Démarre le timer pour la question courante
function startTimer() {
  let timeLeft = tempsParQuestion;
  const timerElement = document.getElementById("timer" + currentQuestion);
  timerElement.textContent = "Temps restant : " + timeLeft + " s";

  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = "Temps restant : " + timeLeft + " s";
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      nextQuestion();
    }
  }, 1000);
}

// Enregistre les réponses de la question courante
function enregistrerReponses() {
  if (currentQuestion === 1) {
    const mots = Array.from(document.querySelectorAll('input[name="mot"]:checked'))
                      .map(el => el.value);
    reponses.mots = mots;
  } else if (currentQuestion === 2) {
    const securites = Array.from(document.querySelectorAll('input[name="securite"]:checked'))
                      .map(el => el.value);
    reponses.securites = securites;
  } else if (currentQuestion === 3) {
    const sites = Array.from(document.querySelectorAll('input[name="site"]:checked'))
                      .map(el => el.value);
    reponses.sites = sites;
  } else if (currentQuestion === 4) {
    const cybers = Array.from(document.querySelectorAll('input[name="cyber"]:checked'))
                      .map(el => el.value);
    reponses.cybers = cybers;
  } else if (currentQuestion === 5) {
    const wifis = Array.from(document.querySelectorAll('input[name="wifi"]:checked'))
                      .map(el => el.value);
    reponses.wifis = wifis;
  } else if (currentQuestion === 6) {
    const protects = Array.from(document.querySelectorAll('input[name="protect"]:checked'))
                      .map(el => el.value);
    reponses.protects = protects;
  } else if (currentQuestion === 7) {
    const hackers = Array.from(document.querySelectorAll('input[name="hacker"]:checked'))
                      .map(el => el.value);
    reponses.hackers = hackers;
  }
}


// Passe à la question suivante après avoir affiché la correction
function nextQuestion() {
  clearInterval(timerInterval);
  // Enregistrer la réponse de la question en cours
  enregistrerReponses();

  // Récupérer le conteneur de la question actuelle
  const currentDiv = document.getElementById("question" + currentQuestion);

  // Créer et afficher le message de correction
  const correctionDiv = document.createElement("div");
  correctionDiv.className = "correction";
  correctionDiv.innerHTML = "Réponse correcte : " + correctAnswers[currentQuestion];
  currentDiv.appendChild(correctionDiv);

  // Désactiver le bouton pour éviter plusieurs clics
  const btn = currentDiv.querySelector("button");
  btn.disabled = true;

  // Attendre 5 secondes pour laisser le temps de consulter la correction
  setTimeout(() => {
    // Masquer la page de la question actuelle
    currentDiv.style.display = "none";
    currentQuestion++;
    if (currentQuestion <= totalQuestions) {
      // Afficher la page suivante et démarrer son timer
      const nextDiv = document.getElementById("question" + currentQuestion);
      nextDiv.style.display = "block";
      startTimer();
    } else {
      afficherResultats();
    }
  }, 5000);
}

// Affiche la page finale et déclenche l'enregistrement automatique des réponses
function afficherResultats() {
  document.getElementById("result").style.display = "block";
  genererEtTelechargerFichier();
}

// Génère un fichier texte avec les réponses et déclenche le téléchargement automatique
function genererEtTelechargerFichier() {
  let contenu = "Réponses du questionnaire:\n\n";
  contenu += "Mot de pass : " + (reponses.mots && reponses.mots.length ? reponses.mots.join(", ") : "Aucun choix") + "\n";
  contenu += "Max de sécurité : " + (reponses.securites && reponses.securites.length ? reponses.securites.join(", ") : "Aucun choix") + "\n";
  contenu += "Https : " + (reponses.sites && reponses.sites.length ? reponses.sites.join(", ") : "Aucun choix") + "\n";
  contenu += "Cyber Attaque : " + (reponses.cybers && reponses.cybers.length ? reponses.cybers.join(", ") : "Aucun choix") + "\n";
  contenu += "Wifi dangereux : " + (reponses.wifis && reponses.wifis.length ? reponses.wifis.join(", ") : "Aucun choix") + "\n";
  contenu += "Protection Smartphone et Ordinateur : " + (reponses.protects && reponses.protects.length ? reponses.protects.join(", ") : "Aucun choix") + "\n";
  contenu += "Cyberhackers utilisent des infos contre toi : " + (reponses.hackers && reponses.hackers.length ? reponses.hackers.join(", ") : "Aucun choix") + "\n";

  const blob = new Blob([contenu], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  
  // Création d'un lien temporaire pour déclencher le téléchargement
  const a = document.createElement("a");
  a.href = url;
  a.download = "reponses.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  // Libération de l'URL créée
  URL.revokeObjectURL(url);
}

// Au chargement de la page, affiche la première question et démarre le timer
window.onload = function() {
  document.getElementById("question" + currentQuestion).style.display = "block";
  startTimer();
}