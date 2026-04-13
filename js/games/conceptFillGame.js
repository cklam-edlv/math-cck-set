/**
 * 溫習區遊戲模塊（多模式支持）
 * - fill: 填空下拉（ws1）
 * - belong: 雙按鈕屬於/不屬於（ws2）
 * - choice: 四選一選擇題（ws3）
 * 修正：手機切換工作紙後事件綁定問題
 */

const db = window.rdb?.db;
const ref = window.rdb?.ref;
const get = window.rdb?.get;

let currentMode = 'fill';
let worksheetData = null;
let questions = [];
let selectedQuestions = [];
let currentIndex = 0;
let correctCount = 0;
let wrongCount = 0;
let currentContainer = null;
let timerInterval = null;
let timerSeconds = 0;
let gameCompleted = false;
let currentWorksheetId = 'ws1';
let worksheetList = [];

let allSelects = [];

const incrementCorrect = window.incrementCorrect || (() => {});
const incrementWrong = window.incrementWrong || (() => {});
const fetchLeaderboard = window.fetchLeaderboard || (() => {});
const recordCompletion = window.recordCompletion || (() => {});

export async function init(options = {}) {
    const { worksheetId = 'ws1', container } = options;
    if (!container) return;
    currentContainer = container;
    currentWorksheetId = worksheetId;

    if (!db) {
        container.innerHTML = '<p class="error">Firebase 未初始化，請重新整理</p>';
        return;
    }

    container.innerHTML = '<div class="loading">載入題目中...</div>';

    await loadWorksheetList();

    const success = await loadWorksheet(worksheetId);
    if (!success) {
        container.innerHTML = '<p class="error">無法載入工作紙</p>';
        return;
    }

    if (currentMode === 'belong') {
        selectRandomQuestions(8);
        renderBelongUI();
    } else if (currentMode === 'choice') {
        selectRandomQuestions(8);
        renderChoiceUI();
    } else {
        renderFillUI();
    }
    startTimer();

    window.addEventListener('worksheetsUpdated', async () => {
        if (currentContainer) {
            await loadWorksheetList();
            const selector = document.getElementById('worksheetSelector');
            if (selector) {
                const newOptions = worksheetList.map(ws => 
                    `<option value="${ws.id}" ${ws.id === currentWorksheetId ? 'selected' : ''}>${ws.title}</option>`
                ).join('');
                selector.innerHTML = newOptions;
            }
        }
    });
}

async function loadWorksheetList() {
    try {
        const snapshot = await get(ref(db, 'examRevision/worksheets'));
        if (snapshot.exists()) {
            const sheets = snapshot.val();
            worksheetList = Object.keys(sheets).map(key => ({
                id: key,
                title: sheets[key].title || key,
                type: sheets[key].type || 'fill'
            }));
        } else {
            worksheetList = [{ id: 'ws1', title: '工作紙1 (集合概念填充)', type: 'fill' }];
        }
    } catch (e) {
        console.warn('加載工作紙列表失敗', e);
    }
}

async function loadWorksheet(worksheetId) {
    try {
        const path = `examRevision/worksheets/${worksheetId}`;
        const snapshot = await get(ref(db, path));
        if (snapshot.exists()) {
            worksheetData = snapshot.val();
            currentMode = worksheetData.type || 'fill';
            questions = worksheetData.questions || [];
            if (!Array.isArray(questions)) questions = [];
            return true;
        } else {
            return false;
        }
    } catch (error) {
        console.error('加載失敗:', error);
        return false;
    }
}

function selectRandomQuestions(count) {
    const shuffled = [...questions].sort(() => Math.random() - 0.5);
    selectedQuestions = shuffled.slice(0, Math.min(count, questions.length));
}

function startTimer() {
    stopTimer(); // 确保清除旧计时器
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

// ========== 填空模式 ==========
function renderFillUI() {
    stopTimer();
    const worksheetOptions = worksheetList.map(ws => 
        `<option value="${ws.id}" ${ws.id === currentWorksheetId ? 'selected' : ''}>${ws.title}</option>`
    ).join('');

    const html = `
        <div class="concept-fill-container">
            <div class="game-header">
                <h2>📚 測考溫習區 · 概念填充</h2>
                <div class="timer-display" id="timerDisplay">00:00</div>
            </div>
            <div class="worksheet-selector">
                <label>📋 選擇工作紙：</label>
                <select id="worksheetSelector">${worksheetOptions}</select>
            </div>
            <div class="questions-panel" id="questionsPanel"></div>
            <div class="game-footer">
                <button class="btn btn-outline" id="resetAllBtn">🔄 清除</button>
                <button class="btn btn-primary" id="submitAllBtn">✅ 提交</button>
            </div>
            <div class="result-panel" id="resultPanel" style="display: none;"></div>
        </div>
    `;
    currentContainer.innerHTML = html;
    renderQuestionsList();
    document.getElementById('resetAllBtn').addEventListener('click', resetAllSelections);
    document.getElementById('submitAllBtn').addEventListener('click', submitAll);
    document.getElementById('worksheetSelector').addEventListener('change', onWorksheetChange);
    addFillStyles();
    startTimer();
}

function renderQuestionsList() {
    const panel = document.getElementById('questionsPanel');
    if (!panel) return;
    if (questions.length === 0) {
        panel.innerHTML = '<p style="text-align:center; padding:40px;">📭 暫無題目</p>';
        return;
    }
    let listHtml = '';
    allSelects = [];
    questions.forEach((q, qIdx) => {
        const blanks = q.blanks;
        let questionText = q.q;
        let parts = [];
        let lastIdx = 0;
        const regex = /______/g;
        let match;
        while ((match = regex.exec(questionText)) !== null) {
            parts.push(questionText.slice(lastIdx, match.index));
            parts.push(`__BLANK_${qIdx}_${parts.length / 2}__`);
            lastIdx = match.index + match[0].length;
        }
        parts.push(questionText.slice(lastIdx));
        let finalHtml = '';
        let blankCounter = 0;
        parts.forEach(part => {
            if (part.startsWith('__BLANK_')) {
                const blankData = blanks[blankCounter];
                let opts = blankData.options;
                if (!opts || !Array.isArray(opts) || opts.length === 0) opts = [blankData.correct];
                const shuffled = [...opts].sort(() => Math.random() - 0.5);
                let optionsHtml = `<option value="" disabled selected>--- 請選擇 ---</option>`;
                shuffled.forEach(opt => { optionsHtml += `<option value="${opt}">${opt}</option>`; });
                finalHtml += `<span class="inline-select"><select data-q="${qIdx}" data-blank="${blankCounter}" data-correct="${blankData.correct}">${optionsHtml}</select></span>`;
                blankCounter++;
            } else { finalHtml += part; }
        });
        listHtml += `<div class="question-item"><div class="q-num">${qIdx+1}.</div><div class="q-content">${finalHtml}</div></div>`;
    });
    panel.innerHTML = listHtml;
    const selects = panel.querySelectorAll('select');
    selects.forEach(select => {
        const qIdx = parseInt(select.dataset.q);
        const bIdx = parseInt(select.dataset.blank);
        if (!allSelects[qIdx]) allSelects[qIdx] = [];
        allSelects[qIdx][bIdx] = select;
    });
}

function resetAllSelections() {
    allSelects.forEach(row => { row.forEach(select => { if (select) select.value = ''; }); });
    document.querySelectorAll('select').forEach(s => s.style.borderColor = '#cbd5e1');
    document.getElementById('resultPanel').style.display = 'none';
    timerSeconds = 0; updateTimerDisplay();
}

function submitAll() {
    let totalBlanks = 0, correctBlanks = 0;
    document.querySelectorAll('select').forEach(s => s.style.borderColor = '#cbd5e1');
    questions.forEach((q, qIdx) => {
        q.blanks.forEach((blank, bIdx) => {
            totalBlanks++;
            const select = allSelects[qIdx]?.[bIdx];
            if (!select) return;
            if (select.value === blank.correct) { correctBlanks++; select.style.borderColor = '#22c55e'; }
            else { select.style.borderColor = '#ef4444'; }
        });
    });
    const rp = document.getElementById('resultPanel');
    rp.innerHTML = `<span class="score">${correctBlanks} / ${totalBlanks}</span><span class="message">${correctBlanks===totalBlanks?'🎉 全對！':'📝 繼續加油'}</span>`;
    rp.style.display = 'flex';
    stopTimer();
    for (let i=0; i<correctBlanks; i++) incrementCorrect();
    for (let i=0; i<(totalBlanks-correctBlanks); i++) incrementWrong();
    if (recordCompletion) recordCompletion(timerSeconds*1000, correctBlanks, totalBlanks-correctBlanks);
    fetchLeaderboard();
    document.getElementById('submitAllBtn').disabled = true;
}

// ========== Belong 模式 ==========
function renderBelongUI() {
    stopTimer();
    const worksheetOptions = worksheetList.map(ws => 
        `<option value="${ws.id}" ${ws.id === currentWorksheetId ? 'selected' : ''}>${ws.title}</option>`
    ).join('');

    const html = `
        <div class="belong-game-container">
            <div class="game-header"><h2>🔷 屬於與不屬於</h2><div class="timer-display" id="timerDisplay">00:00</div></div>
            <div class="worksheet-selector"><label>📋 選擇工作紙：</label><select id="worksheetSelector">${worksheetOptions}</select></div>
            <div class="progress-indicator"><span id="progressText">第 1 / ${selectedQuestions.length} 題</span></div>
            <div class="question-card">
                <div class="question-text" id="questionText"></div>
                <div class="button-group">
                    <button class="belong-btn belong-true" id="belongBtn">∈ 屬於</button>
                    <button class="belong-btn belong-false" id="notBelongBtn">∉ 不屬於</button>
                </div>
                <div class="feedback-area" id="feedbackArea"></div>
            </div>
            <div class="game-footer"><button class="btn btn-outline" id="nextBtn" disabled>下一題 ➡️</button></div>
            <div class="result-panel" id="resultPanel" style="display: none;"></div>
        </div>
    `;
    currentContainer.innerHTML = html;
    renderBelongQuestion(0);
    bindBelongEvents();
    addBelongStyles();
    startTimer();
}

function renderBelongQuestion(index) {
    if (index >= selectedQuestions.length) { finishBelongGame(); return; }
    const q = selectedQuestions[index];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('progressText').textContent = `第 ${index+1} / ${selectedQuestions.length} 題`;
    document.getElementById('feedbackArea').innerHTML = '';
    document.getElementById('belongBtn').disabled = false;
    document.getElementById('notBelongBtn').disabled = false;
    document.getElementById('nextBtn').disabled = true;
}

function bindBelongEvents() {
    const belongBtn = document.getElementById('belongBtn');
    const notBelongBtn = document.getElementById('notBelongBtn');
    const nextBtn = document.getElementById('nextBtn');
    const selector = document.getElementById('worksheetSelector');
    
    // 移除旧监听器（通过替换DOM已自动清除，这里直接绑定新监听器）
    belongBtn.addEventListener('click', () => handleBelongAnswer('∈'));
    notBelongBtn.addEventListener('click', () => handleBelongAnswer('∉'));
    nextBtn.addEventListener('click', goToNextBelongQuestion);
    selector.addEventListener('change', onWorksheetChange);
}

function handleBelongAnswer(selected) {
    if (gameCompleted) return;
    const q = selectedQuestions[currentIndex];
    const isCorrect = (selected === q.a);
    document.getElementById('belongBtn').disabled = true;
    document.getElementById('notBelongBtn').disabled = true;
    const fb = document.getElementById('feedbackArea');
    if (isCorrect) {
        correctCount++; incrementCorrect();
        fb.innerHTML = '✅ 正確！'; fb.className = 'feedback-area correct';
    } else {
        wrongCount++; incrementWrong();
        fb.innerHTML = `❌ 答錯了，正確答案是 ${q.a}`; fb.className = 'feedback-area wrong';
    }
    document.getElementById('nextBtn').disabled = false;
}

function goToNextBelongQuestion() {
    currentIndex++;
    if (currentIndex < selectedQuestions.length) renderBelongQuestion(currentIndex);
    else finishBelongGame();
}

function finishBelongGame() {
    gameCompleted = true; stopTimer();
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.progress-indicator').style.display = 'none';
    document.querySelector('.game-footer').style.display = 'none';
    const rp = document.getElementById('resultPanel');
    rp.innerHTML = `<span class="final-score">${correctCount} / ${selectedQuestions.length}</span><span class="final-message">${correctCount===selectedQuestions.length?'🎉 滿分！':'👍 繼續加油'}</span><button class="btn btn-primary" id="playAgainBtn">🔄 再玩一次</button>`;
    rp.style.display = 'block';
    document.getElementById('playAgainBtn').addEventListener('click', resetBelongGame);
    if (recordCompletion) recordCompletion(timerSeconds*1000, correctCount, wrongCount);
    fetchLeaderboard();
}

function resetBelongGame() {
    currentIndex = 0; correctCount = 0; wrongCount = 0; gameCompleted = false;
    selectRandomQuestions(8);
    renderBelongUI();
    startTimer();
}

// ========== Choice 模式 ==========
function renderChoiceUI() {
    stopTimer();
    const worksheetOptions = worksheetList.map(ws => 
        `<option value="${ws.id}" ${ws.id === currentWorksheetId ? 'selected' : ''}>${ws.title}</option>`
    ).join('');

    const html = `
        <div class="choice-game-container">
            <div class="game-header"><h2>📝 列舉法與描述法</h2><div class="timer-display" id="timerDisplay">00:00</div></div>
            <div class="worksheet-selector"><label>📋 選擇工作紙：</label><select id="worksheetSelector">${worksheetOptions}</select></div>
            <div class="progress-indicator"><span id="progressText">第 1 / ${selectedQuestions.length} 題</span></div>
            <div class="question-card">
                <div class="question-text" id="questionText"></div>
                <div class="options-group" id="optionsGroup"></div>
                <div class="feedback-area" id="feedbackArea"></div>
            </div>
            <div class="game-footer"><button class="btn btn-outline" id="nextBtn" disabled>下一題 ➡️</button></div>
            <div class="result-panel" id="resultPanel" style="display: none;"></div>
        </div>
    `;
    currentContainer.innerHTML = html;
    renderChoiceQuestion(0);
    bindChoiceEvents();
    addChoiceStyles();
    startTimer();
}

function renderChoiceQuestion(index) {
    if (index >= selectedQuestions.length) { finishChoiceGame(); return; }
    const q = selectedQuestions[index];
    document.getElementById('questionText').textContent = q.q;
    document.getElementById('progressText').textContent = `第 ${index+1} / ${selectedQuestions.length} 題`;
    const optionsGroup = document.getElementById('optionsGroup');
    optionsGroup.innerHTML = q.options.map((opt, i) => 
        `<button class="choice-option" data-opt-index="${i}">${String.fromCharCode(65+i)}. ${opt}</button>`
    ).join('');
    document.getElementById('feedbackArea').innerHTML = '';
    document.getElementById('feedbackArea').className = 'feedback-area';
    document.getElementById('nextBtn').disabled = true;
    gameCompleted = false;
}

function bindChoiceEvents() {
    const optionsGroup = document.getElementById('optionsGroup');
    const nextBtn = document.getElementById('nextBtn');
    const selector = document.getElementById('worksheetSelector');
    
    optionsGroup.addEventListener('click', (e) => {
        const btn = e.target.closest('.choice-option');
        if (!btn || gameCompleted) return;
        const selectedIdx = parseInt(btn.dataset.optIndex);
        handleChoiceAnswer(selectedIdx);
    });
    nextBtn.addEventListener('click', goToNextChoiceQuestion);
    selector.addEventListener('change', onWorksheetChange);
}

function handleChoiceAnswer(selectedIdx) {
    if (gameCompleted) return;
    const q = selectedQuestions[currentIndex];
    const isCorrect = (selectedIdx === q.a);
    const btns = document.querySelectorAll('.choice-option');
    btns.forEach(btn => btn.disabled = true);
    const fb = document.getElementById('feedbackArea');
    if (isCorrect) {
        correctCount++; incrementCorrect();
        fb.innerHTML = '✅ 正確！'; fb.className = 'feedback-area correct';
        btns[selectedIdx].classList.add('correct');
    } else {
        wrongCount++; incrementWrong();
        fb.innerHTML = `❌ 答錯了，正確答案是 ${String.fromCharCode(65+q.a)}. ${q.options[q.a]}`;
        fb.className = 'feedback-area wrong';
        btns[selectedIdx].classList.add('wrong');
        btns[q.a].classList.add('correct');
    }
    document.getElementById('nextBtn').disabled = false;
    gameCompleted = true;
}

function goToNextChoiceQuestion() {
    currentIndex++;
    if (currentIndex < selectedQuestions.length) renderChoiceQuestion(currentIndex);
    else finishChoiceGame();
}

function finishChoiceGame() {
    stopTimer();
    document.querySelector('.question-card').style.display = 'none';
    document.querySelector('.progress-indicator').style.display = 'none';
    document.querySelector('.game-footer').style.display = 'none';
    const rp = document.getElementById('resultPanel');
    rp.innerHTML = `<span class="final-score">${correctCount} / ${selectedQuestions.length}</span><span class="final-message">${correctCount===selectedQuestions.length?'🎉 滿分！':'👍 繼續加油'}</span><button class="btn btn-primary" id="playAgainBtn">🔄 再玩一次</button>`;
    rp.style.display = 'block';
    document.getElementById('playAgainBtn').addEventListener('click', resetChoiceGame);
    if (recordCompletion) recordCompletion(timerSeconds*1000, correctCount, wrongCount);
    fetchLeaderboard();
}

function resetChoiceGame() {
    currentIndex = 0; correctCount = 0; wrongCount = 0; gameCompleted = false;
    selectRandomQuestions(8);
    renderChoiceUI();
    startTimer();
}

async function onWorksheetChange(e) {
    const newId = e.target.value;
    if (newId === currentWorksheetId) return;
    currentWorksheetId = newId;
    
    // 清理旧状态
    stopTimer();
    currentContainer.innerHTML = '<div class="loading">載入中...</div>';
    
    const success = await loadWorksheet(newId);
    if (!success) { currentContainer.innerHTML = '<p class="error">載入失敗</p>'; return; }
    
    // 重置游戏状态
    currentIndex = 0;
    correctCount = 0;
    wrongCount = 0;
    gameCompleted = false;
    
    if (currentMode === 'belong') {
        selectRandomQuestions(8);
        renderBelongUI();
    } else if (currentMode === 'choice') {
        selectRandomQuestions(8);
        renderChoiceUI();
    } else {
        renderFillUI();
    }
}

// ========== 樣式 ==========
function addFillStyles() {
    if (document.getElementById('fillStyles')) return;
    const style = document.createElement('style');
    style.id = 'fillStyles';
    style.textContent = `.concept-fill-container{max-width:900px;margin:0 auto;}.question-item{background:#f8fafc;border-radius:20px;padding:16px;margin-bottom:12px;display:flex;gap:16px;}.inline-select select{font-size:1.1rem;padding:6px 12px;border-radius:24px;border:2px solid #cbd5e1;}.btn{padding:12px 28px;border-radius:40px;border:1px solid #cbd5e1;background:white;cursor:pointer;}.btn-primary{background:#3b82f6;color:white;}.result-panel{margin-top:24px;padding:16px 24px;background:#f1f5f9;border-radius:40px;display:flex;gap:24px;}.score{font-size:2rem;font-weight:700;}`;
    document.head.appendChild(style);
}

function addBelongStyles() {
    if (document.getElementById('belongStyles')) return;
    const style = document.createElement('style');
    style.id = 'belongStyles';
    style.textContent = `.belong-game-container{max-width:700px;margin:0 auto;}.progress-indicator{text-align:center;margin:20px 0;}.question-card{background:#fff;border-radius:32px;padding:40px;text-align:center;box-shadow:0 10px 30px rgba(0,0,0,0.05);}.question-text{font-size:2.2rem;margin-bottom:40px;}.button-group{display:flex;gap:20px;justify-content:center;}.belong-btn{flex:1;max-width:200px;padding:20px;font-size:2rem;border:none;border-radius:60px;cursor:pointer;}.belong-true{background:#22c55e;color:#fff;}.belong-false{background:#ef4444;color:#fff;}.belong-btn:disabled{opacity:0.5;}.feedback-area{min-height:60px;padding:15px;margin-top:20px;border-radius:20px;font-size:1.5rem;}.feedback-area.correct{background:#dcfce7;color:#166534;}.feedback-area.wrong{background:#fee2e2;color:#991b1b;}.final-score{font-size:4rem;font-weight:700;}.worksheet-selector{margin-bottom:20px;}`;
    document.head.appendChild(style);
}

function addChoiceStyles() {
    if (document.getElementById('choiceStyles')) return;
    const style = document.createElement('style');
    style.id = 'choiceStyles';
    style.textContent = `.choice-game-container{max-width:800px;margin:0 auto;}.options-group{display:flex;flex-direction:column;gap:12px;margin:20px 0;}.choice-option{padding:16px 20px;background:#f1f5f9;border:2px solid #e2e8f0;border-radius:16px;font-size:1.2rem;text-align:left;cursor:pointer;transition:0.2s;}.choice-option:hover{background:#e2e8f0;}.choice-option.correct{background:#dcfce7;border-color:#22c55e;color:#166534;}.choice-option.wrong{background:#fee2e2;border-color:#ef4444;color:#991b1b;}.choice-option:disabled{cursor:not-allowed;opacity:0.7;}.feedback-area{min-height:60px;padding:15px;border-radius:20px;font-size:1.5rem;}.feedback-area.correct{background:#dcfce7;color:#166534;}.feedback-area.wrong{background:#fee2e2;color:#991b1b;}`;
    document.head.appendChild(style);
}