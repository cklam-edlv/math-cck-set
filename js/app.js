import { initNavigation, toggleSidebar, getSectionDuration } from './core/router.js';
import { startLogin, handleLogout } from './core/auth.js';
import { adminLogin, exportToExcel, importFromExcel, downloadTemplate } from './core/admin.js';
import { closeLeaderboard, recordCompletion, getGameCorrectCount, getGameWrongCount } from './core/leaderboard.js';
import { currentUser } from './core/auth.js';

// 初始化導覽
initNavigation();

// 綁定全域事件
document.getElementById('start-login-btn').addEventListener('click', startLogin);
document.getElementById('logout-btn').addEventListener('click', handleLogout);
document.getElementById('toggle-sidebar-btn').addEventListener('click', toggleSidebar);
document.getElementById('show-admin-login').addEventListener('click', () => {
    document.getElementById('admin-login-modal').classList.add('active');
});
document.getElementById('admin-login-btn').addEventListener('click', adminLogin);
document.getElementById('cancel-admin-login').addEventListener('click', () => {
    document.getElementById('admin-login-modal').classList.remove('active');
});
document.getElementById('close-admin-panel').addEventListener('click', () => {
    document.getElementById('admin-panel-modal').classList.remove('active');
});
document.getElementById('close-leaderboard-btn').addEventListener('click', closeLeaderboard);
document.querySelector('#right-rank-sidebar .rank-trigger').addEventListener('click', () => {
    document.getElementById('right-rank-sidebar').classList.toggle('active');
});
document.querySelector('#right-rank-sidebar .rank-close-btn').addEventListener('click', () => {
    document.getElementById('right-rank-sidebar').classList.remove('active');
});

// 模態框關閉
document.querySelectorAll('.modal-close').forEach(btn => {
    btn.addEventListener('click', () => {
        const modalId = btn.dataset.modal;
        if (modalId) document.getElementById(modalId).classList.remove('active');
    });
});
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal-overlay')) {
        e.target.classList.remove('active');
    }
});

// 完成模態框觀察者
const completionModals = ['basicModal', 'notationCompleteModal', 'intersectionCompleteModal', 'unionCompleteModal', 'subsetBasicModal', 'properSubsetModal', 'differenceCompleteModal'];
completionModals.forEach(id => {
    const modal = document.getElementById(id);
    if (!modal) return;
    const observer = new MutationObserver(mutations => {
        if (modal.classList.contains('active')) {
            const duration = getSectionDuration();
            if (currentUser && duration > 0) {
                recordCompletion(duration, getGameCorrectCount(), getGameWrongCount());
            }
        }
    });
    observer.observe(modal, { attributes: true });
});

// 匯出/匯入按鈕
document.getElementById('export-excel-btn').addEventListener('click', exportToExcel);
document.getElementById('excel-file-input').addEventListener('change', importFromExcel);
document.getElementById('download-template-btn').addEventListener('click', downloadTemplate);

console.log('集合樂園模組化版本已載入');