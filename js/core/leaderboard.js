import { rdb } from '../config/firebase.js';
import { currentUser } from './auth.js';

let gameCorrectCount = 0;
let gameWrongCount = 0;
export const sectionIndexMap = { basic: 0, notation: 1, intersection: 2, union: 3, subset: 4, difference: 5 };
let currentSectionId = 'basic';

export function resetGameStats() {
    gameCorrectCount = 0;
    gameWrongCount = 0;
}

export function incrementCorrect() {
    gameCorrectCount++;
}

export function incrementWrong() {
    gameWrongCount++;
}

export function setCurrentSectionId(id) {
    currentSectionId = id;
}

export function getGameCorrectCount() {
    return gameCorrectCount;
}

export function getGameWrongCount() {
    return gameWrongCount;
}

export function getCurrentSectionId() {
    return currentSectionId;
}

export async function recordCompletion(durationMs, correct, wrong) {
    if (!currentUser) return;
    const idx = sectionIndexMap[currentSectionId];
    await rdb.push(rdb.ref(rdb.db, `records/s${idx}/completions`), {
        user: currentUser, duration: durationMs, timestamp: Date.now(), correct, wrong
    });
    await fetchLeaderboard(true);
}

export async function fetchLeaderboard(showModal = false) {
    if (!currentUser) return;
    const idx = sectionIndexMap[currentSectionId];
    const snap = await rdb.get(rdb.ref(rdb.db, `records/s${idx}/completions`));
    let html = "<tr><td colspan='5'>尚無紀錄</td></tr>";
    if (snap.exists()) {
        const recs = Object.values(snap.val());
        recs.sort((a, b) => {
            if ((b.correct || 0) !== (a.correct || 0)) return (b.correct || 0) - (a.correct || 0);
            return a.duration - b.duration;
        });
        const top10 = recs.slice(0, 10);
        html = top10.map((r, i) => `<tr><td><b>${i + 1}</b></td><td>${r.user}</td><td>${r.correct || 0}</td><td>${r.wrong || 0}</td><td>${(r.duration / 1000).toFixed(1)}s</td></tr>`).join('');
    }
    document.getElementById('panel-body').innerHTML = html;
    if (showModal) {
        document.getElementById('lb-body').innerHTML = html;
        document.getElementById('leaderboard-modal').classList.add('active');
    }
}

export function closeLeaderboard() {
    document.getElementById('leaderboard-modal').classList.remove('active');
}

// 暴露到全局，供概念填空等模塊使用
window.incrementCorrect = incrementCorrect;
window.incrementWrong = incrementWrong;
window.fetchLeaderboard = fetchLeaderboard;
window.recordCompletion = recordCompletion;