let currentQuestion = 0;
let score = 0;
let questions = [];
let timer;           // le setInterval
let timeLeft = 10;   // secondes par question

const quizContainer = document.getElementById("quiz-container");
const result = document.getElementById("result");
const nextBtn = document.getElementById("next-btn");
const timerDisplay = document.getElementById("timer");

fetch("quiz.json")
  .then(res => res.json())
  .then(data => {
    questions = data;
    afficherQuestion();
  });

function startTimer() {
  timeLeft = 10;
  timerDisplay.textContent = `⏱️ Temps restant : ${timeLeft}s`;

  timer = setInterval(() => {
    timeLeft--;
    timerDisplay.textContent = `⏱️ Temps restant : ${timeLeft}s`;

    if (timeLeft <= 0) {
      clearInterval(timer);
      verifierReponse(-1); // -1 = aucune réponse choisie
    }
  }, 1000);
}

function afficherQuestion() {
  const q = questions[currentQuestion];
  quizContainer.innerHTML = `
    <h2 class="text-xl font-medium">${q.question}</h2>
    ${q.options.map((option, index) => `
      <button onclick="verifierReponse(${index})" 
              class="option-btn w-full text-left border px-4 py-2 rounded-lg hover:bg-gray-200">
        ${option}
      </button>
    `).join("")}
  `;
  nextBtn.classList.add("hidden");
  startTimer();
}

function verifierReponse(index) {
  clearInterval(timer);

  const q = questions[currentQuestion];
  const buttons = document.querySelectorAll(".option-btn");

  buttons.forEach((btn, i) => {
    btn.disabled = true;
    if (i === q.answer) {
      btn.classList.add("bg-green-100", "border-green-500");
    }
    if (i === index && i !== q.answer) {
      btn.classList.add("bg-red-100", "border-red-500");
    }
  });

  if (index === q.answer) {
    score++;
  }

  nextBtn.classList.remove("hidden");
  timerDisplay.textContent = `⏱️ Temps écoulé ou réponse donnée`;
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

