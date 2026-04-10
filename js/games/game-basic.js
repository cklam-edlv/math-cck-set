import { shuffleArray, startGameTimer, MAX_ERRORS } from '../utils/helpers.js';
import { incrementCorrect, incrementWrong } from '../core/leaderboard.js';
import { startSectionTimer } from '../core/router.js';

export function renderSectionBasic() {
    const div = document.createElement('div'); div.className = 'section-card';
    div.innerHTML = `<div class="concept-area"><div class="concept-title">📦 基礎集合概念</div><div class="concept-def">✨ <strong>集合</strong>：把具有相同特徵的東西放在一起。</div><div class="concept-def">✅ <strong>屬於</strong>：記作 ∈。</div><div class="example-box">📌 例如：{ 🍎, 🍌, 🍓 } 就是「水果集合」。</div></div>`;
    const startBtn = document.createElement('button'); startBtn.className = 'start-game-btn'; startBtn.innerText = '🎮 開始挑戰';
    const wrapper = document.createElement('div'); wrapper.className = 'game-wrapper';
    startBtn.addEventListener('click', () => {
        startSectionTimer();
        if (!wrapper.children.length) wrapper.appendChild(createBasicGame());
        wrapper.classList.add('active-game');
        startBtn.style.display = 'none';
    });
    div.appendChild(startBtn); div.appendChild(wrapper);
    return div;
}

function createBasicGame() {
    let missions = [], index = 0, score = 0, selected = [], completed = false, allDone = false, elements = {}, timerInterval = null;
    let errorCount = 0;
    function init() { let shuffled = shuffleArray([...window.BASIC_BANK]); missions = shuffled.slice(0, 5); missions = missions.map(m => { m.items = shuffleArray(m.items); return m; }); index = 0; score = 0; selected = []; completed = false; allDone = false; errorCount = 0; }
    function getMission() { return missions[index]; }
    function getTotalCorrect() { return getMission().items.filter(i => i.member).length; }
    function stopTimerCondition() { return allDone || completed; }
    function updateUI() {
        elements.totalScore.innerText = score;
        elements.progress.innerText = `${selected.length} / ${getTotalCorrect()}`;
        elements.missionCounter.innerText = `第${index+1}關 / 共${missions.length}關`;
        elements.errorDisplay.innerText = `❌ ${errorCount}/${MAX_ERRORS}`;
        elements.nextBtn.disabled = !completed;
        elements.submitBtn.disabled = (selected.length === 0);
        if (completed) elements.nextBtn.innerText = (index === missions.length-1) ? "🏁 完成挑戰 🎉" : "🌟 下一關 ➡️";
    }
    function forceNewQuestion() {
        let newMission; do { newMission = shuffleArray([...window.BASIC_BANK])[0]; } while (newMission.title === getMission().title);
        missions[index] = { ...newMission, items: shuffleArray(newMission.items) };
        selected = []; completed = false; errorCount = 0; score = 0;
        elements.gameContainer.classList.remove('game-complete');
        if (timerInterval) clearInterval(timerInterval);
        timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition);
        renderItems(); updateUI(); updateMissionDisplay();
        showFeedback(`⚠️ 錯誤次數過多，分數歸零並更換新題目！`, false);
    }
    function showFeedback(msg, isErr=false) { elements.feedback.innerHTML = `<span>${isErr ? '❌' : '💡'}</span> ${msg}`; }
    function checkComplete() { if (selected.length === getTotalCorrect() && !completed) { completed = true; showFeedback(`🎉 完成「${getMission().title}」！`, false); elements.gameContainer.classList.add('game-complete'); updateUI(); if (index === missions.length-1 && !allDone) { allDone = true; setTimeout(() => document.getElementById('basicModal').classList.add('active'), 400); } } }
    function handleSubmit() {
        if (completed || allDone) return;
        const mission = getMission();
        const correctIndices = mission.items.reduce((arr, item, idx) => item.member ? arr.concat(idx) : arr, []);
        const isCorrect = selected.length === correctIndices.length && selected.every(idx => correctIndices.includes(idx));
        if (isCorrect) {
            score += 10; incrementCorrect();
            showFeedback(`✅ 正確！ +10分`, false);
            completed = true; elements.gameContainer.classList.add('game-complete');
            updateUI(); checkComplete();
        } else {
            errorCount++; incrementWrong(); updateUI();
            if (errorCount >= MAX_ERRORS) { showFeedback(`❌ 答錯了！已達 ${MAX_ERRORS} 次錯誤。`, true); forceNewQuestion(); }
            else { showFeedback(`❌ 答案不正確，再試試看 (剩餘錯誤: ${MAX_ERRORS - errorCount})`, true); selected = []; renderItems(); updateUI(); }
        }
    }
    function toggleSelect(idx) { if (completed || allDone) return; if (selected.includes(idx)) selected = selected.filter(i => i !== idx); else selected.push(idx); renderItems(); elements.submitBtn.disabled = (selected.length === 0); }
    function renderItems() { const mission = getMission(); elements.grid.innerHTML = ''; mission.items.forEach((item, idx) => { const card = document.createElement('div'); card.className = 'item-card' + (selected.includes(idx) ? ' selected' : ''); card.innerHTML = `<div class="item-emoji">${item.emoji}</div><div class="item-name">${item.name}</div>`; card.addEventListener('click', () => toggleSelect(idx)); elements.grid.appendChild(card); }); }
    function resetGame(keepScore=false) { if (timerInterval) clearInterval(timerInterval); selected = []; completed = false; errorCount = 0; if (!keepScore) score = 0; elements.gameContainer.classList.remove('game-complete'); updateUI(); renderItems(); elements.feedback.innerHTML = `<span>🎯</span> 新挑戰！點擊物品選擇，再按「確定」提交。`; timerInterval = startGameTimer(elements.timerDisplay, stopTimerCondition); }
    function nextMission() { if (!completed) { showFeedback(`⚠️ 請先完成當前關卡`, true); return; } if (index === missions.length-1) return; index++; resetGame(false); updateMissionDisplay(); renderItems(); updateUI(); showFeedback(`🚀 進入新關卡：「${getMission().title}」`, false); }
    function updateMissionDisplay() { const m = getMission(); elements.missionTitle.innerText = `📌 ${m.title}`; elements.missionDesc.innerText = m.desc; }
    function resetFull() { if (timerInterval) clearInterval(timerInterval); init(); resetGame(true); updateMissionDisplay(); renderItems(); updateUI(); showFeedback(`🔄 遊戲已重置！`, false); }
    init();
    const container = document.createElement('div'); container.className = 'game-container';
    container.innerHTML = `<div class="status-bar"><div class="score-box"><span>🏆 總分</span> <span id="basicScore">0</span></div><div class="progress-badge">📦 分類進度 <span id="basicProgress">0 / 0</span> <span id="basicMissionCounter">第1關 / 共5關</span></div><div class="timer-badge" id="basicTimer">⏱️ 00:00</div><div class="error-counter" id="basicErrors">❌ 0/3</div></div><div class="mission-card"><div class="mission-title" id="basicTitle">📌 集合挑戰</div><div class="mission-desc" id="basicDesc">點擊屬於「這個家族」的物品</div></div><div class="items-grid" id="basicGrid"></div><div class="feedback-area" id="basicFeedback"><span>✨</span> 點擊物品選擇，再按「確定」提交。</div><div class="buttons-panel"><button class="btn" id="basicResetBtn">🔄 重新開始</button><button class="btn btn-primary" id="basicSubmitBtn" disabled>✅ 確定</button><button class="btn btn-primary" id="basicNextBtn" disabled>🌟 下一關 ➡️</button></div>`;
    elements = { totalScore: container.querySelector('#basicScore'), progress: container.querySelector('#basicProgress'), missionCounter: container.querySelector('#basicMissionCounter'), missionTitle: container.querySelector('#basicTitle'), missionDesc: container.querySelector('#basicDesc'), grid: container.querySelector('#basicGrid'), feedback: container.querySelector('#basicFeedback'), nextBtn: container.querySelector('#basicNextBtn'), resetBtn: container.querySelector('#basicResetBtn'), submitBtn: container.querySelector('#basicSubmitBtn'), gameContainer: container, timerDisplay: container.querySelector('#basicTimer'), errorDisplay: container.querySelector('#basicErrors') };
    elements.nextBtn.addEventListener('click', nextMission); elements.resetBtn.addEventListener('click', resetFull); elements.submitBtn.addEventListener('click', handleSubmit);
    resetGame(true); updateMissionDisplay(); renderItems(); updateUI();
    return container;
}