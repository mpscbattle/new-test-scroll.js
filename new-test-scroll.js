// ------------------- JAVASCRIPT START -------------------
const quizDiv = document.getElementById("quiz");
const timerDiv = document.getElementById("timer");
const submitBtn = document.getElementById("submitBtn");
const resetBtn = document.getElementById("resetBtn");
const reportCard = document.getElementById("reportCard");
const analysisCard = document.getElementById("analysisCard");
const viewAnalysisBtn = document.getElementById("viewAnalysisBtn");

const initialStartScreen = document.getElementById("initialStartScreen");
const centerStartBtn = document.getElementById("centerStartBtn");
const quizBox = document.getElementById("quizBox");
const questionCountDisplay = document.getElementById('questionCountDisplay');
const progressBar = document.getElementById('progressBar'); 

let selectedAnswers = [], quizLocked = [], correctCount = 0;
let timer = 1500, timerStarted = false, timerInterval; 

const questions = [];
document.querySelectorAll(".question-data").forEach(qEl => {
  const q = qEl.querySelector(".q").innerText;
  const opts = Array.from(qEl.querySelectorAll(".opt")).map(el => el.innerText);
  const ans = parseInt(qEl.getAttribute("data-answer"));
  const explanation = qEl.getAttribute("data-explanation") || "";
  questions.push({ question: q, options: opts, answer : ans, explanation: explanation });
});

const qCountInitialEl = document.getElementById('qCountInitial');
if (qCountInitialEl) {
    qCountInitialEl.textContent = questions.length;
}

function renderAllQuestions() {
  let html = "";
  let attemptedCount = 0;
  
  questions.forEach((q, index) => {
    if (selectedAnswers[index] !== undefined) {
        attemptedCount++;
    }

    html += `<div class="question-card">
      <div class="question-number-circle">${index + 1}</div>
      <div class="question">${q.question}</div>
      <div class="options">`;
    q.options.forEach((opt, i) => {
      const isSelected = selectedAnswers[index] === i ? " selected" : "";
      const onClickAttr = quizLocked[index] ? '' : `onclick='selectAnswer(${index}, ${i})'`;
      html += `<div class='option${isSelected}' ${onClickAttr}>${opt}</div>`;
    });
    html += `</div></div>`;
  });
  quizDiv.innerHTML = html;

  const totalQuestions = questions.length;
  
  if (questionCountDisplay) {
      questionCountDisplay.textContent = `Attempted: ${attemptedCount}/${totalQuestions}`;
  }
  
  if (progressBar) {
      const progressPercent = (attemptedCount / totalQuestions) * 100;
      progressBar.style.width = `${progressPercent}%`;
  }
}

function selectAnswer(qIndex, aIndex) {
  if (quizLocked[qIndex]) return;
  selectedAnswers[qIndex] = aIndex;
  renderAllQuestions(); 
}

function updateTimer() {
  let min = Math.floor(timer / 60);
  let sec = timer % 60;
  timerDiv.textContent = `🕛 ${min}:${sec < 10 ? '0' + sec : sec}`;
  timer--;
  if (timer < 0) {
    clearInterval(timerInterval);
    submitResults();
  }
}

function submitResults() {
  clearInterval(timerInterval);

  quizLocked = questions.map(() => true);
  renderAllQuestions(); 

  submitBtn.style.display = 'none';
  resetBtn.style.display = 'none';

  quizBox.style.display = 'block'; 
  reportCard.style.display = 'block';
  analysisCard.style.display = 'none';
  
  if (progressBar) {
      progressBar.style.width = '100%';
  }

  let attempted = selectedAnswers.filter(v => v !== undefined).length;
  correctCount = selectedAnswers.filter((v, i) => v === questions[i].answer).length;

  document.getElementById("total").textContent = questions.length;
  document.getElementById("attempted").textContent = attempted;
  document.getElementById("correct").textContent = correctCount;
  document.getElementById("wrong").textContent = attempted - correctCount;
  document.getElementById("score").textContent = correctCount;
  document.getElementById("totalScore").textContent = questions.length;

  const percent = ((correctCount / questions.length) * 100).toFixed(2);
  document.getElementById("percentage").textContent = percent;

  const msg = percent >= 80 ? "Excellent Work" : percent >= 50 ? "Good Job" : "Keep Practicing";
  document.getElementById("resultMessage").textContent = msg;
  
  setTimeout(() => reportCard.scrollIntoView({ behavior: "smooth" }), 300);
}

function showAnalysis() {
  reportCard.style.display = 'block'; 
  analysisCard.style.display = 'block';
  
  const container = document.getElementById("analysisContent");
  container.innerHTML = "";

  questions.forEach((q, i) => {
    const userAnswer = selectedAnswers[i];
    let feedback = "Question Not Attempted", feedbackClass = "not-attempted-feedback";

    if (userAnswer !== undefined) {
      const isCorrect = userAnswer === q.answer;
      feedback = isCorrect ? "Your Answer is Correct" : "Your Answer is Wrong";
      feedbackClass = isCorrect ? "correct-feedback" : "wrong-feedback";
    }

    let html = `<div class='analysis-box'>
      <div class="question-number-circle">${i + 1}</div>
      <div><b>${q.question}</b></div>`;
    
    q.options.forEach((opt, j) => {
      let cls = "option";
      if (j === q.answer) cls += " correct";
      if (j === userAnswer && j !== q.answer) cls += " wrong"; 
      
      html += `<div class='${cls}' style='margin: 5px 0;'>${opt}</div>`;
    });
    
    html += `<div class='feedback ${feedbackClass}'>${feedback}</div>`;

    if (q.explanation) {
      html += `<div class='explanation-box'><b>📝 स्पष्टीकरण :</b> ${q.explanation}</div>`;
    }

    container.innerHTML += html;
  });

  setTimeout(() => analysisCard.scrollIntoView({ behavior: "smooth" }), 300);
}

// --- Event Listeners ---
document.addEventListener("DOMContentLoaded", () => {
  renderAllQuestions();
  updateTimer();
  timer++; 
  
  initialStartScreen.style.display = 'block';
  quizBox.style.display = 'none';

  initialStartScreen.style.marginTop = '20px'; 
  
  if (questionCountDisplay) {
    questionCountDisplay.textContent = `Attempted: 0/${questions.length}`;
  }
});

// Start Quiz Button handler
centerStartBtn.onclick = () => {
    if (!timerStarted) {
        initialStartScreen.style.display = 'none';
        quizBox.style.display = 'block';
        timerInterval = setInterval(updateTimer, 1000);
        timerStarted = true;
        renderAllQuestions(); 
        quizBox.scrollIntoView({ behavior: "smooth", block: "start" }); // Scroll to top on start
    }
};

submitBtn.onclick = submitResults;
resetBtn.onclick = () => location.reload(); 
viewAnalysisBtn.onclick = showAnalysis;

window.selectAnswer = selectAnswer;
// ------------------- JAVASCRIPT END -------------------

