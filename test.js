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

// Mapping du numéro de question à la clé dans l'objet reponses
const responseKeys = {
  1: "mots",
  2: "securites",
  3: "sites",
  4: "cybers",
  5: "wifis",
  6: "protects",
  7: "hackers"
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

// Enregistre les réponses de la question courante dans l'objet reponses
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

// Affiche le feedback après validation : seules les cases cochées dont la valeur correspond à la bonne réponse seront mises en évidence en vert.
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

  // Afficher la correction sous forme de texte (la classe "correction" affiche le texte en vert)
  const correctionDiv = document.createElement("div");
  correctionDiv.className = "correction";
  correctionDiv.innerHTML = "Réponse correcte : " + correctAnswers[currentQuestion];
  currentDiv.appendChild(correctionDiv);

  // Afficher le feedback sur les choix après validation
  afficherFeedback();

  // Désactiver le bouton pour éviter plusieurs clics
  const btn = currentDiv.querySelector("button");
  btn.disabled = true;

  // Attendre 5 secondes avant de passer à la question suivante
  setTimeout(() => {
    currentDiv.style.display = "none";
    currentQuestion++;
    if (currentQuestion <= totalQuestions) {
      const nextDiv = document.getElementById("question" + currentQuestion);
      nextDiv.style.display = "block";
      startTimer();
    } else {
      afficherResultats();
    }
  }, 5000);
}

// Affiche la page finale avec le récapitulatif du quiz et la note totale obtenue
function afficherResultats() {
  const resultDiv = document.getElementById("result");
  resultDiv.style.display = "block";

  // Calcul de la note : la réponse est correcte si l'utilisateur a sélectionné exactement la bonne réponse (aucune autre)
  let score = 0;
  for (let i = 1; i <= totalQuestions; i++) {
    const responses = reponses[responseKeys[i]];
    if (responses && responses.length === 1 && responses[0] === correctAnswers[i]) {
      score++;
    }
  }

  let summary = "<h2>Récapitulatif du Quiz</h2>";
  summary += `<h3>Votre note : ${score} sur ${totalQuestions}</h3>`;

  // Récapitulatif de chaque question
  for (let i = 1; i <= totalQuestions; i++) {
    const questionDiv = document.getElementById("question" + i);
    const questionText = questionDiv.querySelector("p").innerText;
    summary += `<div class="result-question"><h3>${questionText}</h3>`;
    summary += "<ul>";
    const labels = questionDiv.querySelectorAll("label");
    labels.forEach(label => {
      const input = label.querySelector("input[type='checkbox']");
      if (input && input.checked) {
        summary += `<li><input type="checkbox" checked disabled> ${label.innerText}</li>`;
      }
    });
    summary += "</ul>";
    summary += `<div class="correction">Réponse correcte : ${correctAnswers[i]}</div>`;
    summary += `</div>`;
  }
  resultDiv.innerHTML = summary;

  // Générer et télécharger le fichier contenant le récapitulatif (texte brut) en passant le score
  genererEtTelechargerFichier(score);
}

// Génère un fichier texte avec le récapitulatif et déclenche son téléchargement
function genererEtTelechargerFichier(score) {
  let contenuText = "Récapitulatif du Quiz:\n\n";
  for (let i = 1; i <= totalQuestions; i++) {
    const questionDiv = document.getElementById("question" + i);
    const questionText = questionDiv.querySelector("p").innerText;
    contenuText += questionText + "\n";
    const labels = questionDiv.querySelectorAll("label");
    labels.forEach(label => {
      const input = label.querySelector("input[type='checkbox']");
      if (input && input.checked) {
        contenuText += "  [X] " + label.innerText + "\n";
      }
    });
    contenuText += "Réponse correcte : " + correctAnswers[i] + "\n\n";
  }
  contenuText += `Note : ${score} sur ${totalQuestions}\n`;

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
