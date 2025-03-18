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

// Affiche le feedback après validation
// Seules les cases cochées dont la valeur correspond à la bonne réponse seront mises en évidence en vert.
function afficherFeedback() {
  const inputs = document.querySelectorAll(`#question${currentQuestion} input[type="checkbox"]`);
  inputs.forEach(input => {
    const label = input.parentElement;
    // Réinitialiser les classes existantes
    label.classList.remove("correctAnswer", "wrongAnswer");
    if (input.checked && input.value === correctAnswers[currentQuestion]) {
      label.classList.add("correctAnswer");
    }
  });
}

// Passe à la question suivante après validation
function nextQuestion() {
  clearInterval(timerInterval);
  // Enregistrer la réponse de la question en cours
  enregistrerReponses();

  // Récupérer le conteneur de la question actuelle
  const currentDiv = document.getElementById("question" + currentQuestion);

  // Afficher la correction sous forme de texte (celle-ci est déjà stylée en vert via la classe "correction")
  const correctionDiv = document.createElement("div");
  correctionDiv.className = "correction";
  correctionDiv.innerHTML = "Réponse correcte : " + correctAnswers[currentQuestion];
  currentDiv.appendChild(correctionDiv);

  // Afficher le feedback sur les choix après validation
  afficherFeedback();

  // Désactiver le bouton pour éviter plusieurs clics
  const btn = currentDiv.querySelector("button");
  btn.disabled = true;

  // Attendre 5 secondes pour laisser le temps de consulter la correction et le feedback
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

// Affiche la page finale avec le récapitulatif des réponses et corrections,
// puis déclenche l'enregistrement automatique des réponses dans un fichier.
function afficherResultats() {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";
  
  let summary = "<h2>Récapitulatif du Quiz</h2>";
  summary += "<ul>";
  summary += "<li>Question 1 : Votre réponse: " + (reponses.mots && reponses.mots.length ? reponses.mots.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[1] + "</li>";
  summary += "<li>Question 2 : Votre réponse: " + (reponses.securites && reponses.securites.length ? reponses.securites.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[2] + "</li>";
  summary += "<li>Question 3 : Votre réponse: " + (reponses.sites && reponses.sites.length ? reponses.sites.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[3] + "</li>";
  summary += "<li>Question 4 : Votre réponse: " + (reponses.cybers && reponses.cybers.length ? reponses.cybers.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[4] + "</li>";
  summary += "<li>Question 5 : Votre réponse: " + (reponses.wifis && reponses.wifis.length ? reponses.wifis.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[5] + "</li>";
  summary += "<li>Question 6 : Votre réponse: " + (reponses.protects && reponses.protects.length ? reponses.protects.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[6] + "</li>";
  summary += "<li>Question 7 : Votre réponse: " + (reponses.hackers && reponses.hackers.length ? reponses.hackers.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[7] + "</li>";
  summary += "</ul>";
  
  resultDiv.innerHTML = summary;
  
  // Générer et télécharger le fichier contenant le récapitulatif (texte brut)
  genererEtTelechargerFichier();
}

// Génère un fichier texte avec le récapitulatif et déclenche le téléchargement automatique
function genererEtTelechargerFichier() {
  let contenuText = "Récapitulatif du Quiz:\n\n";
  contenuText += "Question 1 : Votre réponse: " + ((reponses.mots && reponses.mots.length) ? reponses.mots.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[1] + "\n";
  contenuText += "Question 2 : Votre réponse: " + ((reponses.securites && reponses.securites.length) ? reponses.securites.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[2] + "\n";
  contenuText += "Question 3 : Votre réponse: " + ((reponses.sites && reponses.sites.length) ? reponses.sites.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[3] + "\n";
  contenuText += "Question 4 : Votre réponse: " + ((reponses.cybers && reponses.cybers.length) ? reponses.cybers.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[4] + "\n";
  contenuText += "Question 5 : Votre réponse: " + ((reponses.wifis && reponses.wifis.length) ? reponses.wifis.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[5] + "\n";
  contenuText += "Question 6 : Votre réponse: " + ((reponses.protects && reponses.protects.length) ? reponses.protects.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[6] + "\n";
  contenuText += "Question 7 : Votre réponse: " + ((reponses.hackers && reponses.hackers.length) ? reponses.hackers.join(", ") : "Aucun choix") + " | Correction: " + correctAnswers[7] + "\n";

  const blob = new Blob([contenuText], { type: "text/plain" });
  const url = URL.createObjectURL(blob);
  
  const a = document.createElement("a");
  a.href = url;
  a.download = "reponses.txt";
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  
  URL.revokeObjectURL(url);
}

// Au chargement de la page, affiche la première question et démarre le timer.
window.onload = function() {
  document.getElementById("question" + currentQuestion).style.display = "block";
  startTimer();
}
