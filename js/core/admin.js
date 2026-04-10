import { rdb } from '../config/firebase.js';
import { formatTime } from '../utils/helpers.js';

let cachedUsersData = null;
let cachedRecordsData = null;

export async function adminLogin() {
    if (document.getElementById('admin-pass').value !== "28870418") return alert("密碼錯誤");
    document.getElementById('admin-login-modal').classList.remove('active');
    document.getElementById('admin-panel-modal').classList.add('active');

    const uSnap = await rdb.get(rdb.ref(rdb.db, 'users'));
    let uHtml = "";
    if (uSnap.exists()) {
        cachedUsersData = uSnap.val();
        for (let n in cachedUsersData) {
            let d = cachedUsersData[n];
            uHtml += `<tr><td>${n}</td><td>${formatTime(d.totalMs || 0)}</td><td>${d.lastActive ? new Date(d.lastActive).toLocaleString() : '-'}</td></tr>`;
        }
    }
    document.getElementById('admin-usage-body').innerHTML = uHtml || "<tr><td colspan='3'>無資料</td></tr>";

    const rSnap = await rdb.get(rdb.ref(rdb.db, 'records'));
    let rHtml = "";
    if (rSnap.exists()) {
        cachedRecordsData = rSnap.val();
        let flat = [];
        for (let s in cachedRecordsData) {
            for (let k in cachedRecordsData[s].completions) {
                flat.push({ ...cachedRecordsData[s].completions[k], section: s, key: k });
            }
        }
        flat.sort((a, b) => b.timestamp - a.timestamp).slice(0, 25).forEach(r => {
            rHtml += `<tr><td>${r.user}</td><td>單元${parseInt(r.section.slice(1)) + 1}</td><td>${(r.duration / 1000).toFixed(1)}s</td><td>✅${r.correct || 0} ❌${r.wrong || 0}</td><td>${new Date(r.timestamp).toLocaleString()}</td><td><button class="delete-record-btn" data-path="records/${r.section}/completions/${r.key}">刪除</button></td></tr>`;
        });
    }
    document.getElementById('admin-record-body').innerHTML = rHtml || "<tr><td colspan='6'>無紀錄</td></tr>";
    document.querySelectorAll('.delete-record-btn').forEach(btn => {
        btn.addEventListener('click', () => deleteRecord(btn.dataset.path));
    });
}

export async function deleteRecord(path) {
    if (confirm("刪除？")) {
        await rdb.remove(rdb.ref(rdb.db, path));
        adminLogin();
    }
}

export function exportToExcel() {
    if (!cachedUsersData && !cachedRecordsData) return alert("無資料");
    const wb = XLSX.utils.book_new();
    let uSheet = [['姓名', '累積時長(秒)', '格式', '最後活動']];
    if (cachedUsersData) {
        for (let n in cachedUsersData) {
            let d = cachedUsersData[n];
            uSheet.push([n, d.totalMs || 0, formatTime(d.totalMs || 0), d.lastActive ? new Date(d.lastActive).toLocaleString() : '-']);
        }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(uSheet), '學生');
    let rSheet = [['學生', '單元', '耗時(秒)', '答對', '答錯', '時間']];
    if (cachedRecordsData) {
        for (let s in cachedRecordsData) {
            for (let k in cachedRecordsData[s].completions) {
                let r = cachedRecordsData[s].completions[k];
                rSheet.push([r.user, `單元${parseInt(s.slice(1)) + 1}`, (r.duration / 1000).toFixed(1), r.correct || 0, r.wrong || 0, new Date(r.timestamp).toLocaleString()]);
            }
        }
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rSheet), '紀錄');
    XLSX.writeFile(wb, `集合樂園_報表_${new Date().toISOString().slice(0, 10)}.xlsx`);
}

export async function importFromExcel(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = async (ev) => {
        const data = new Uint8Array(ev.target.result);
        const wb = XLSX.read(data, { type: 'array' });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = XLSX.utils.sheet_to_json(ws, { header: 1 });
        if (json.length < 2) return alert("無資料");
        const nameIdx = json[0].findIndex(h => h && (h.includes('姓名') || h.includes('Name')));
        if (nameIdx === -1) return alert("找不到姓名欄位");
        let cnt = 0;
        for (let i = 1; i < json.length; i++) {
            let name = json[i][nameIdx];
            if (!name) continue;
            const userRef = rdb.ref(rdb.db, 'users/' + name);
            const snap = await rdb.get(userRef);
            await rdb.set(userRef, { totalMs: snap.exists() ? snap.val().totalMs : 0, lastActive: Date.now() });
            cnt++;
        }
        alert(`匯入 ${cnt} 筆學生`);
        e.target.value = '';
        adminLogin();
    };
    reader.readAsArrayBuffer(file);
}

export function downloadTemplate() {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet([['姓名'], ['範例學生']]), '匯入範本');
    XLSX.writeFile(wb, '集合系統_匯入範本.xlsx');
}