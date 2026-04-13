// Quiz Questions Data
const quizData = [
    {
        question: "Which planet is known as the Red Planet?",
        options: ["Earth", "Mars", "Jupiter", "Venus"],
        correct: 1
    },
    {
        question: "What is the capital city of France?",
        options: ["London", "Berlin", "Madrid", "Paris"],
        correct: 3
    },
    {
        question: "Which is the largest ocean on Earth?",
        options: ["Atlantic Ocean", "Indian Ocean", "Arctic Ocean", "Pacific Ocean"],
        correct: 3
    },
    {
        question: "Who wrote 'Hamlet'?",
        options: ["Charles Dickens", "William Shakespeare", "Mark Twain", "J.K. Rowling"],
        correct: 1
    },
    {
        question: "What is the square root of 64?",
        options: ["6", "7", "8", "9"],
        correct: 2
    }
];

// Variables
let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft = 15;

// DOM Elements
const startScreen = document.getElementById('start-screen');
const quizScreen = document.getElementById('quiz-screen');
const resultScreen = document.getElementById('result-screen');
const questionText = document.getElementById('question-text');
const optionsContainer = document.getElementById('options-container');
const nextBtn = document.getElementById('next-btn');
const startBtn = document.getElementById('start-btn');
const restartBtn = document.getElementById('restart-btn');
const timerDisplay = document.getElementById('timer-sec');
const currentScoreDisplay = document.getElementById('current-score');
const progressBar = document.getElementById('progress-bar');
const highScoreDisplay = document.getElementById('high-score-val');

// Initialize High Score from LocalStorage
highScoreDisplay.innerText = localStorage.getItem('quizHighScore') || 0;

// Start Quiz
startBtn.addEventListener('click', () => {
    startScreen.classList.remove('active');
    quizScreen.classList.add('active');
    loadQuestion();
});

// Load Question
function loadQuestion() {
    resetState();
    const currentQuestion = quizData[currentQuestionIndex];
    questionText.innerText = `${currentQuestionIndex + 1}. ${currentQuestion.question}`;
    
    // Update Progress Bar
    const progress = ((currentQuestionIndex) / quizData.length) * 100;
    progressBar.style.width = `${progress}%`;

    // Create Option Buttons
    currentQuestion.options.forEach((option, index) => {
        const button = document.createElement('div');
        button.innerText = option;
        button.classList.add('option-btn');
        button.addEventListener('click', () => selectOption(index, button));
        optionsContainer.appendChild(button);
    });

    startTimer();
}

// Reset state for new question
function resetState() {
    clearInterval(timer);
    timeLeft = 15;
    timerDisplay.innerText = timeLeft;
    nextBtn.classList.add('hide');
    optionsContainer.innerHTML = '';
}

// Timer Logic
function startTimer() {
    timer = setInterval(() => {
        timeLeft--;
        timerDisplay.innerText = timeLeft;
        if (timeLeft <= 0) {
            clearInterval(timer);
            autoCheck();
        }
    }, 1000);
}

// Handle Option Selection
function selectOption(selectedIndex, selectedBtn) {
    clearInterval(timer);
    const correctIndex = quizData[currentQuestionIndex].correct;
    const allOptions = optionsContainer.children;

    if (selectedIndex === correctIndex) {
        score++;
        selectedBtn.classList.add('correct');
        currentScoreDisplay.innerText = score;
    } else {
        selectedBtn.classList.add('incorrect');
        // Show the correct answer
        allOptions[correctIndex].classList.add('correct');
    }

    // Disable all buttons
    Array.from(allOptions).forEach(btn => {
        btn.style.pointerEvents = 'none';
    });

    nextBtn.classList.remove('hide');
}

// If time runs out
function autoCheck() {
    const correctIndex = quizData[currentQuestionIndex].correct;
    optionsContainer.children[correctIndex].classList.add('correct');
    Array.from(optionsContainer.children).forEach(btn => {
        btn.style.pointerEvents = 'none';
    });
    nextBtn.classList.remove('hide');
}

// Next Button Click
nextBtn.addEventListener('click', () => {
    currentQuestionIndex++;
    if (currentQuestionIndex < quizData.length) {
        loadQuestion();
    } else {
        showResults();
    }
});

// Show Final Results
function showResults() {
    quizScreen.classList.remove('active');
    resultScreen.classList.add('active');
    progressBar.style.width = `100%`;

    const finalScoreDisplay = document.getElementById('final-score');
    const totalQuestionsDisplay = document.getElementById('total-questions');
    const resultMessage = document.getElementById('result-message');

    finalScoreDisplay.innerText = score;
    totalQuestionsDisplay.innerText = quizData.length;

    // Set message based on performance
    if (score === quizData.length) {
        resultMessage.innerText = "Excellent! You are a genius!";
    } else if (score > quizData.length / 2) {
        resultMessage.innerText = "Well Done! Great score.";
    } else {
        resultMessage.innerText = "Keep practicing! Try again.";
    }

    // Save High Score
    const savedHighScore = localStorage.getItem('quizHighScore') || 0;
    if (score > savedHighScore) {
        localStorage.setItem('quizHighScore', score);
        highScoreDisplay.innerText = score;
    }
}

// Restart Quiz
restartBtn.addEventListener('click', () => {
    currentQuestionIndex = 0;
    score = 0;
    currentScoreDisplay.innerText = score;
    resultScreen.classList.remove('active');
    startScreen.classList.add('active');
});