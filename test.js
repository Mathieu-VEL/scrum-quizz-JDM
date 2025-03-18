let currentQuestion = 1;
const totalQuestions = 2;
const tempsParQuestion = 15; // Durée en secondes pour chaque question
let timerInterval;

// Objet pour stocker les réponses utilisateur
const reponses = {};

// Objet contenant les bonnes réponses pour chaque question
const correctAnswers = {
  1: "Pomme, Orange",  // Par exemple, les bonnes réponses pour la question 1
  2: "Football"        // Par exemple, la bonne réponse pour la question 2
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
    const fruits = Array.from(document.querySelectorAll('input[name="fruit"]:checked'))
                        .map(el => el.value);
    reponses.fruits = fruits;
  } else if (currentQuestion === 2) {
    const sports = Array.from(document.querySelectorAll('input[name="sport"]:checked'))
                        .map(el => el.value);
    reponses.sports = sports;
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
  contenu += "Fruits: " + (reponses.fruits && reponses.fruits.length ? reponses.fruits.join(", ") : "Aucun choix") + "\n";
  contenu += "Sports: " + (reponses.sports && reponses.sports.length ? reponses.sports.join(", ") : "Aucun choix") + "\n";

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