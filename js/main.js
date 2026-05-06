/**
 * main.js
 * Lógica principal del quiz: selección de configuración, inicio, preguntas, temporizador y resultados.
 */

const btnStart = document.getElementById('btn-start');
const btnNext = document.getElementById('btn-next');
const btnRetry = document.getElementById('btn-retry');
const btnHome = document.getElementById('btn-home');
const categorySelect = document.getElementById('category-select');
const diffButtons = Array.from(document.querySelectorAll('.diff-btn'));
const qtyButtons = Array.from(document.querySelectorAll('.qty-btn'));
const statTotal = document.getElementById('stat-total');
const statBest = document.getElementById('stat-best');
const screenStart = document.getElementById('screen-start');
const screenQuiz = document.getElementById('screen-quiz');
const screenResults = document.getElementById('screen-results');
const qCurrent = document.getElementById('q-current');
const qTotal = document.getElementById('q-total');
const qCategoryBadge = document.getElementById('q-category-badge');
const questionDifficulty = document.getElementById('q-difficulty');
const questionText = document.getElementById('question-text');
const questionCode = document.getElementById('question-code');
const questionCodeText = document.getElementById('question-code-text');
const optionsGrid = document.getElementById('options-grid');
const feedback = document.getElementById('feedback');
const feedbackIcon = document.getElementById('feedback-icon');
const feedbackVerdict = document.getElementById('feedback-verdict');
const feedbackExplanation = document.getElementById('feedback-explanation');
const streakBar = document.getElementById('streak-bar');
const streakText = document.getElementById('streak-text');
const streakToast = document.getElementById('streak-toast');
const resultsEmoji = document.getElementById('results-emoji');
const resultsTitle = document.getElementById('results-title');
const resultsScore = document.getElementById('results-score');
const resultsScoreMax = document.getElementById('results-score-max');
const resultsGrade = document.getElementById('results-grade');
const resCorrect = document.getElementById('res-correct');
const resWrong = document.getElementById('res-wrong');
const resTime = document.getElementById('res-time');
const resStreak = document.getElementById('res-streak');
const reviewList = document.getElementById('review-list');
const timerWrap = document.getElementById('timer-wrap');
const timerNum = document.getElementById('timer-num');
const timerFill = document.getElementById('timer-ring-fill');

const DEFAULT_TIME = 15;

let currentSettings = {
    category: 'all',
    difficulty: 'all',
    quantity: 10
};

let quizState = {
    questions: [],
    currentIndex: 0,
    score: 0,
    correct: 0,
    wrong: 0,
    totalSeconds: 0,
    currentStreak: 0,
    bestStreak: 0,
    timerId: null,
    timeLeft: DEFAULT_TIME,
    answered: false
};

function init() {
    loadBestScore();
    updateStatTotal();
    attachListeners();
}

function attachListeners() {
    btnStart.addEventListener('click', startQuiz);
    btnNext.addEventListener('click', handleNextQuestion);
    btnRetry.addEventListener('click', () => {
        showScreen(screenStart);
        hideScreen(screenResults);
        resetQuizState();
        updateStatTotal();
    });
    btnHome.addEventListener('click', () => {
        showScreen(screenStart);
        hideScreen(screenResults);
        resetQuizState();
        updateStatTotal();
    });

    categorySelect.addEventListener('change', event => {
        currentSettings.category = event.target.value;
        updateStatTotal();
    });

    diffButtons.forEach(button => {
        button.addEventListener('click', () => {
            diffButtons.forEach(btn => btn.classList.remove('diff-btn--active'));
            button.classList.add('diff-btn--active');
            currentSettings.difficulty = button.dataset.diff;
            updateStatTotal();
        });
    });

    qtyButtons.forEach(button => {
        button.addEventListener('click', () => {
            qtyButtons.forEach(btn => btn.classList.remove('qty-btn--active'));
            button.classList.add('qty-btn--active');
            currentSettings.quantity = Number(button.dataset.qty);
        });
    });
}

function loadBestScore() {
    const best = Number(localStorage.getItem('devquiz-best-score') || 0);
    quizState.bestStreak = Number(localStorage.getItem('devquiz-best-streak') || 0);
    statBest.textContent = best > 0 ? best : '—';
}

function saveBestScore(score) {
    const currentBest = Number(localStorage.getItem('devquiz-best-score') || 0);
    if (score > currentBest) {
        localStorage.setItem('devquiz-best-score', String(score));
        statBest.textContent = score;
    }
}

function updateStatTotal() {
    const available = filterQuestions().length;
    statTotal.textContent = available;
}

function filterQuestions() {
    return QUESTIONS.filter(question => {
        const matchesCategory = currentSettings.category === 'all' || question.category === currentSettings.category;
        const matchesDifficulty = currentSettings.difficulty === 'all' || question.difficulty === currentSettings.difficulty;
        return matchesCategory && matchesDifficulty;
    });
}

function startQuiz() {
    const availableQuestions = filterQuestions();
    if (availableQuestions.length === 0) {
        alert('No hay preguntas disponibles para esa configuración. Elige otra categoría o dificultad.');
        return;
    }

    quizState.questions = shuffleArray(availableQuestions).slice(0, currentSettings.quantity);
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.correct = 0;
    quizState.wrong = 0;
    quizState.currentStreak = 0;
    quizState.totalSeconds = 0;
    quizState.answered = false;

    qTotal.textContent = String(quizState.questions.length);
    qCategoryBadge.textContent = currentSettings.category === 'all' ? 'Todas' : currentSettings.category;
    showScreen(screenQuiz);
    hideScreen(screenStart);
    hideScreen(screenResults);
    hideElement(streakBar);
    updateQuestion();
}

function updateQuestion() {
    clearTimer();
    feedback.hidden = true;
    quizState.answered = false;
    quizState.timeLeft = DEFAULT_TIME;

    const question = quizState.questions[quizState.currentIndex];
    qCurrent.textContent = String(quizState.currentIndex + 1);
    questionDifficulty.textContent = question.difficulty;
    questionText.textContent = question.question;

    if (question.code) {
        questionCodeText.textContent = question.code;
        questionCode.hidden = false;
    } else {
        questionCode.hidden = true;
    }

    optionsGrid.innerHTML = '';
    question.options.forEach((option, index) => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.type = 'button';
        button.textContent = option;
        button.dataset.index = String(index);
        button.addEventListener('click', handleAnswerSelection);
        optionsGrid.appendChild(button);
    });

    updateTimerDisplay();
    startTimer();
}

function handleAnswerSelection(event) {
    if (quizState.answered) {
        return;
    }

    quizState.answered = true;
    const selectedIndex = Number(event.currentTarget.dataset.index);
    showAnswer(selectedIndex);
}

function showAnswer(selectedIndex) {
    const question = quizState.questions[quizState.currentIndex];
    const isCorrect = selectedIndex === question.correct;

    if (isCorrect) {
        quizState.score += 10;
        quizState.correct += 1;
        quizState.currentStreak += 1;
    } else {
        quizState.wrong += 1;
        quizState.currentStreak = 0;
    }

    if (quizState.currentStreak >= 3) {
        showStreak(quizState.currentStreak);
    }

    quizState.totalSeconds += DEFAULT_TIME - quizState.timeLeft;
    clearTimer();

    const buttons = Array.from(optionsGrid.children);
    buttons.forEach(button => {
        const index = Number(button.dataset.index);
        button.disabled = true;
        if (index === question.correct) {
            button.classList.add('option-btn--correct');
        } else if (index === selectedIndex) {
            button.classList.add('option-btn--wrong');
        }
    });

    feedbackIcon.textContent = isCorrect ? '✅' : '❌';
    feedbackVerdict.textContent = isCorrect ? '¡Correcto!' : 'Respuesta incorrecta';
    feedbackExplanation.textContent = question.explanation;
    feedback.hidden = false;
    btnNext.focus();
}

function handleNextQuestion() {
    quizState.currentIndex += 1;
    if (quizState.currentIndex >= quizState.questions.length) {
        finishQuiz();
        return;
    }
    updateQuestion();
}

function finishQuiz() {
    clearTimer();
    showScreen(screenResults);
    hideScreen(screenQuiz);

    const maxScore = quizState.questions.length * 10;
    const percentage = Math.round((quizState.score / maxScore) * 100);
    resultsScore.textContent = String(quizState.score);
    resultsScoreMax.textContent = `/${maxScore}`;
    resCorrect.textContent = String(quizState.correct);
    resWrong.textContent = String(quizState.wrong);
    resTime.textContent = `${quizState.totalSeconds}s`;
    resStreak.textContent = String(Math.max(quizState.currentStreak, quizState.bestStreak));

    resultsGrade.textContent = getGradeText(percentage);
    resultsEmoji.textContent = getGradeEmoji(percentage);
    resultsTitle.textContent = getGradeTitle(percentage);

    reviewList.innerHTML = '';
    quizState.questions.forEach((question, index) => {
        const item = document.createElement('div');
        item.className = 'review-item';
        item.innerHTML = `
      <p><strong>${index + 1}. ${question.question}</strong></p>
      <p>Respuesta correcta: ${question.options[question.correct]}</p>
    `;
        reviewList.appendChild(item);
    });

    saveBestScore(quizState.score);
}

function getGradeText(percentage) {
    if (percentage >= 90) return 'Excelente';
    if (percentage >= 70) return 'Muy bien';
    if (percentage >= 50) return 'Bien';
    return 'Sigue practicando';
}

function getGradeTitle(percentage) {
    if (percentage >= 90) return '¡Nivel pro!';
    if (percentage >= 70) return '¡Buen trabajo!';
    if (percentage >= 50) return 'Casi listo';
    return 'No te rindas';
}

function getGradeEmoji(percentage) {
    if (percentage >= 90) return '🏆';
    if (percentage >= 70) return '🎉';
    if (percentage >= 50) return '👏';
    return '💪';
}

function showStreak(count) {
    streakText.textContent = `Racha de ${count}`;
    streakBar.hidden = false;
    streakToast.hidden = false;
    streakToast.textContent = `¡Racha x${count}!`;
    clearTimeout(quizState.streakToastTimeout);
    quizState.streakToastTimeout = setTimeout(() => {
        streakToast.hidden = true;
    }, 2500);
}

function startTimer() {
    updateTimerDisplay();
    quizState.timerId = setInterval(() => {
        quizState.timeLeft -= 1;
        if (quizState.timeLeft <= 0) {
            quizState.timeLeft = 0;
            updateTimerDisplay();
            clearTimer();
            quizState.answered = true;
            showAnswer(-1);
            return;
        }
        updateTimerDisplay();
    }, 1000);
}

function clearTimer() {
    if (quizState.timerId) {
        clearInterval(quizState.timerId);
        quizState.timerId = null;
    }
}

function updateTimerDisplay() {
    timerNum.textContent = String(quizState.timeLeft);
    const progress = quizState.timeLeft / DEFAULT_TIME;
    timerFill.style.strokeDasharray = `${progress * 107} 107`;
}

function resetQuizState() {
    clearTimer();
    quizState.questions = [];
    quizState.currentIndex = 0;
    quizState.score = 0;
    quizState.correct = 0;
    quizState.wrong = 0;
    quizState.totalSeconds = 0;
    quizState.currentStreak = 0;
    quizState.answered = false;
    feedback.hidden = true;
    streakBar.hidden = true;
    streakToast.hidden = true;
    optionsGrid.innerHTML = '';
}

function showScreen(screen) {
    screen.classList.remove('screen--hidden');
}

function hideScreen(screen) {
    screen.classList.add('screen--hidden');
}

function hideElement(element) {
    element.hidden = true;
}

function shuffleArray(array) {
    const cloned = [...array];
    for (let i = cloned.length - 1; i > 0; i -= 1) {
        const j = Math.floor(Math.random() * (i + 1));
        [cloned[i], cloned[j]] = [cloned[j], cloned[i]];
    }
    return cloned;
}

init();
