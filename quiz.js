let currentQuestion = 0;
let score = 0;
let questions = [];
let timer;           // le setInterval
let timeLeft = 10;   // secondes par question

const quizContainer = document.getElementById("quiz-container");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");
const feedback = document.getElementById("feedback");
const progressBar = document.getElementById("progress-bar");
const difficultySelector = document.getElementById("difficulty-selector");

fetch("quiz.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    afficherQuestion();
});
function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = progress + "%";
  const progressPercentage = document.getElementById("progress-percentage");
  progressPercentage.textContent = `${Math.round(progress)}%`;  // Affiche le pourcentage
}


function startQuiz(difficulty) {
  selectedDifficulty = difficulty; // Store the selected difficulty
  currentQuestion = 0; // Reset the question index
  score = 0; // Reset the score
  result.classList.add("hidden");
  nextBtn.classList.remove("hidden");

  // Filter questions based on selected difficulty
  const filteredQuestions = questions.filter(q => q.difficulty === selectedDifficulty);

  // Start the quiz
  displayQuestion(filteredQuestions);
}

function startTimer() {
  timeLeft = 10;
  timerDisplay.textContent = `⏱️ Temps restant : ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ Temps restant : ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      checkAnswer(-1); // -1 = aucune réponse choisie
    }
  }, 1000);
}

function afficherQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <h2 class="text-xl font-medium">${q.question}</h2>
    ${q.options.map((option, index) => `
      <button onclick="checkAnswer(${index})" 
              class="option-btn w-full text-left border px-4 py-2 rounded-lg hover:bg-gray-200">
        ${option}
      </button>
    `).join("")}
  `;
  nextBtn.classList.add("hidden");
  feedback.classList.add("hidden");
  startTimer();
  updateProgressBar();
}

function checkAnswer(index) {
  clearInterval(timer);

  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".option-btn");

  // On désactive tous les boutons
  buttons.forEach((btn, i) => {
    btn.disabled = true;
    // Ajout de la couleur pour les bonnes réponses
    if (i === q.answer) {
      btn.classList.add("bg-green-100", "border-green-500");
    }
    // Ajout de la couleur pour les mauvaises réponses
    if (i === index && i !== q.answer) {
      btn.classList.add("bg-red-100", "border-red-500");
    }
  });

  // Si la réponse est correcte, on ajoute au score
  if (index === q.answer) {
    score++;
    feedback.textContent = "✅ Bonne réponse !";
    feedback.classList.remove("text-red-500");
    feedback.classList.add("text-green-500");
  } else {
    feedback.textContent = "❌ Mauvaise réponse !";
    feedback.classList.remove("text-green-500");
    feedback.classList.add("text-red-500");
  }

  feedback.classList.remove("hidden");
  nextBtn.classList.remove("hidden");
  timerDisplay.textContent = `⏱️ Temps écoulé ou réponse donnée`;
}

function updateProgressBar() {
  const progress = ((currentQuestion + 1) / questions.length) * 100;
  progressBar.style.width = progress + "%";
}

nextBtn.addEventListener("click", () => {
  currentQuestion++;
  if (currentQuestion < questions.length) {
    afficherQuestion();
  } else {
    quizContainer.innerHTML = "";
    result.classList.remove("hidden");
    result.textContent = `✅ Vous avez obtenu ${score} / ${questions.length}`;
    nextBtn.classList.add("hidden");
    timerDisplay.textContent = "";
  }
});




