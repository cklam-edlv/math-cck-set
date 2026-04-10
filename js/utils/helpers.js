// 通用輔助函數
export function shuffleArray(arr) {
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}

export function formatTime(ms) {
    if (!ms && ms !== 0) return "00:00";
    let s = Math.floor(ms / 1000);
    return String(Math.floor(s / 60)).padStart(2, '0') + ":" + String(s % 60).padStart(2, '0');
}

export function startGameTimer(timerElement, stopCondition) {
    let start = Date.now();
    let interval = setInterval(() => {
        if (stopCondition()) {
            clearInterval(interval);
            return;
        }
        timerElement.innerText = `⏱️ ${formatTime(Date.now() - start)}`;
    }, 1000);
    return interval;
}

export const MAX_ERRORS = 3;