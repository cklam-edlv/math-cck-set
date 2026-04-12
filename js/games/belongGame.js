/**
 * 屬於與不屬於練習模塊
 * 雙按鈕交互，隨機抽8題
 */

const db = window.rdb?.db;
const ref = window.rdb?.ref;
const get = window.rdb?.get;

let allQuestions = [];      // 全部題目
let selectedQuestions = []; // 抽出的8題
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let currentContainer = null;
let timerInterval = null;
let timerSeconds = 0;
let gameCompleted = false;

const incrementCorrect = window.incrementCorrect || (() => {});
const incrementWrong = window.incrementWrong || (() => {});
const fetchLeaderboard = window.fetchLeaderboard || (() => {});
const recordCompletion = window.recordCompletion || (() => {});

export async function init(options = {}) {
    const { container } = options;
    if (!container) return;
    currentContainer = container;

    if (!db) {
        container.innerHTML = '<p class="error">Firebase 未初始化</p>';
        return;
    }

    container.innerHTML = '<div class="loading">載入題目中...</div>';

    const success = await loadQuestions();
    if (!success) {
        container.innerHTML = '<p class="error">無法載入題目</p>';
        return;
    }

    // 隨機抽8題
    selectRandomQuestions(8);
    renderGameUI();
    startTimer();
}

async function loadQuestions() {
    try {
        const snapshot = await get(ref(db, 'examRevision/worksheets/belong/questions'));
        if (snapshot.exists()) {
            allQuestions = snapshot.val();
            return true;
        } else {
            console.error('找不到 belong 題庫');
            return false;
        }
    } catch (error) {
        console.error('加載失敗:', error);
        return false;
    }
}

function selectRandomQuestions(count) {
    const shuffled = [...allQuestions].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, Math.min(count, allQuestions.length));
}

function startTimer() {
    if (timerInterval) clearInterval(timerInterval);
    timerSeconds = 0;
    timerInterval = setInterval(() => {
        timerSeconds++;
        updateTimerDisplay();
    }, 1000);
}

function stopTimer() {
    if (timerInterval) {
        clearInterval(timerInterval);
        timerInterval = null;
    }
}

function updateTimerDisplay() {
    const timerEl = document.getElementById('timerDisplay');
    if (!timerEl) return;
    const mins = Math.floor(timerSeconds / 60).toString().padStart(2, '0');
    const secs = (timerSeconds % 60).toString().padStart(2, '0');
    timerEl.textContent = `${mins}:${secs}`;
}

function renderGameUI() {
    if (!currentContainer) return;

    const html = `
        <div class="belong-game-container">
            <div class="game-header">
                <h2>🔷 屬於與不屬於</h2>
                <div class="timer-display" id="timerDisplay">00:00</div>
            </div>
            <div class="progress-indicator">
                <span id="progressText">第 1 / ${selectedQuestions.length} 題</span>
            </div>
            <div class="question-card" id="questionCard">
                <div class="question-text" id="questionText"></div>
                <div class="button-group">
                    <button class="belong-btn belong-true" id="belongBtn">∈ 屬於</button>
                    <button class="belong-btn belong-false" id="notBelongBtn">∉ 不屬於</button>
                </div>
                <div class="feedback-area" id="feedbackArea"></div>
            </div>
            <div class="game-footer">
                <button class="btn btn-outline" id="nextBtn" disabled>下一題 ➡️</button>
            </div>
            <div class="result-panel" id="resultPanel" style="display: none;">
                <span class="final-score" id="finalScore"></span>
                <span class="final-message" id="finalMessage"></span>
                <button class="btn btn-primary" id="playAgainBtn">🔄 再玩一次</button>
            </div>
        </div>
    `;
    currentContainer.innerHTML = html;

    renderQuestion(0);
    bindEvents();
    addStyles();
}

function renderQuestion(index) {
    if (index >= selectedQuestions.length) {
        finishGame();
        return;
    }

    const q = selectedQuestions[index];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('progressText').textContent = `第 ${index + 1} / ${selectedQuestions.length} 題`;
    document.getElementById('feedbackArea').innerHTML = '';
    document.getElementById('feedbackArea').className = 'feedback-area';
    
    // 啟用按鈕
    document.getElementById('belongBtn').disabled = false;
    document.getElementById('notBelongBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
}

function bindEvents() {
    const belongBtn = document.getElementById('belongBtn');
    const notBelongBtn = document.getElementById('notBelongBtn');
    const nextBtn = document.getElementById('nextBtn');
    const playAgainBtn = document.getElementById('playAgainBtn');

    belongBtn.addEventListener('click', () => handleAnswer('∈'));
    notBelongBtn.addEventListener('click', () => handleAnswer('∉'));
    nextBtn.addEventListener('click', goToNextQuestion);
    if (playAgainBtn) playAgainBtn.addEventListener('click', resetGame);
}

function handleAnswer(selected) {
    if (gameCompleted) return;

    const q = selectedQuestions[currentIndex];
    const isCorrect = (selected === q.a);

    // 禁用按鈕防止重複作答
    document.getElementById('belongBtn').disabled = true;
    document.getElementById('notBelongBtn').disabled = true;

    const feedbackArea = document.getElementById('feedbackArea');
    if (isCorrect) {
        correctCount++;
        incrementCorrect();
        feedbackArea.innerHTML = '✅ 正確！';
        feedbackArea.className = 'feedback-area correct';
    } else {
        wrongCount++;
        incrementWrong();
        feedbackArea.innerHTML = `❌ 答錯了，正確答案是 ${q.a}`;
        feedbackArea.className = 'feedback-area wrong';
    }

    // 啟用下一題按鈕
    document.getElementById('nextBtn').disabled = false;
}

function goToNextQuestion() {
    currentIndex++;
    if (currentIndex < selectedQuestions.length) {
        renderQuestion(currentIndex);
    } else {
        finishGame();
    }
}

function finishGame() {
    gameCompleted = true;
    stopTimer();

    // 隱藏題目卡片，顯示結果面板
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.progress-indicator').style.display = 'none';
    document.querySelector('.game-footer').style.display = 'none';

    const resultPanel = document.getElementById('resultPanel');
    resultPanel.style.display = 'block';
    document.getElementById('finalScore').textContent = `${correctCount} / ${selectedQuestions.length}`;
    document.getElementById('finalMessage').textContent = 
        correctCount === selectedQuestions.length ? '🎉 滿分！太厲害了！' : '👍 繼續加油！';

    // 記錄完成
    if (recordCompletion) {
        recordCompletion(timerSeconds * 1000, correctCount, wrongCount);
    }
    fetchLeaderboard();
}

function resetGame() {
    // 重置狀態
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    gameCompleted = false;
    selectRandomQuestions(8);
    renderGameUI();
    startTimer();
}

function addStyles() {
    if (document.getElementById('belongGameStyles')) return;
    const style = document.createElement('style');
    style.id = 'belongGameStyles';
    style.textContent = `
        .belong-game-container { max-width: 700px; margin: 0 auto; }
        .progress-indicator { text-align: center; margin-bottom: 20px; font-size: 1.2rem; color: #64748b; }
        .question-card { background: white; border-radius: 32px; padding: 40px 30px; box-shadow: 0 10px 30px rgba(0,0,0,0.05); text-align: center; }
        .question-text { font-size: 2.5rem; font-weight: 600; color: #1e293b; margin-bottom: 40px; }
        .button-group { display: flex; gap: 20px; justify-content: center; margin-bottom: 30px; }
        .belong-btn { flex: 1; max-width: 200px; padding: 20px 10px; font-size: 2rem; font-weight: 700; border: none; border-radius: 60px; cursor: pointer; transition: 0.2s; }
        .belong-true { background: #22c55e; color: white; }
        .belong-true:hover { background: #16a34a; transform: scale(1.02); }
        .belong-false { background: #ef4444; color: white; }
        .belong-false:hover { background: #dc2626; transform: scale(1.02); }
        .belong-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }
        .feedback-area { min-height: 60px; padding: 15px; border-radius: 20px; font-size: 1.5rem; }
        .feedback-area.correct { background: #dcfce7; color: #166534; }
        .feedback-area.wrong { background: #fee2e2; color: #991b1b; }
        .game-footer { margin-top: 30px; text-align: right; }
        .result-panel { text-align: center; padding: 40px; background: #f8fafc; border-radius: 32px; margin-top: 30px; }
        .final-score { display: block; font-size: 4rem; font-weight: 700; color: #1e293b; }
        .final-message { display: block; font-size: 1.5rem; margin: 20px 0; }
        .btn { padding: 12px 30px; border-radius: 40px; border: 1px solid #cbd5e1; background: white; font-size: 1.1rem; cursor: pointer; }
        .btn-primary { background: #3b82f6; border-color: #3b82f6; color: white; }
        .btn:disabled { opacity: 0.5; cursor: not-allowed; }
    `;
    document.head.appendChild(style);
}