// ==================== 集合樂園題庫資料庫 (各單元15題) ====================

// ---------- 1. 基礎集合概念 (15題) ----------
const BASIC_BANK = [
    { title: "🧴 圓柱體家族", desc: "找出所有「圓柱體」形狀的物品", items: [
        { emoji: "🥫", name: "易開罐", member: true }, { emoji: "🧻", name: "廁紙筒芯", member: true }, { emoji: "🕯️", name: "蠟燭", member: true },
        { emoji: "🔋", name: "電池", member: true }, { emoji: "🥤", name: "紙杯", member: true }, { emoji: "🏀", name: "籃球", member: false },
        { emoji: "📚", name: "課本", member: false }, { emoji: "🍎", name: "蘋果", member: false }, { emoji: "🧸", name: "小熊玩偶", member: false }
    ] },
    { title: "❤️ 紅色物品大集合", desc: "把「紅色的物品」全部找出來！", items: [
        { emoji: "🍎", name: "紅蘋果", member: true }, { emoji: "🌹", name: "紅玫瑰", member: true }, { emoji: "🚗", name: "紅色玩具車", member: true },
        { emoji: "🎈", name: "紅色氣球", member: true }, { emoji: "🍓", name: "草莓", member: true }, { emoji: "🍌", name: "香蕉", member: false },
        { emoji: "🐧", name: "企鵝公仔", member: false }, { emoji: "📘", name: "藍色筆記本", member: false }, { emoji: "🥝", name: "奇異果", member: false }
    ] },
    { title: "✏️ 文具小隊", desc: "選出屬於「文具」的物品", items: [
        { emoji: "✏️", name: "鉛筆", member: true }, { emoji: "📏", name: "尺子", member: true }, { emoji: "🧽", name: "擦膠", member: true },
        { emoji: "📓", name: "筆記本", member: true }, { emoji: "✂️", name: "安全剪刀", member: true }, { emoji: "🍪", name: "餅乾", member: false },
        { emoji: "⚽", name: "足球", member: false }, { emoji: "📱", name: "手機", member: false }, { emoji: "🧸", name: "泰迪熊", member: false }
    ] },
    { title: "🍎 水果樂園", desc: "把「水果」全部找出來！", items: [
        { emoji: "🍎", name: "蘋果", member: true }, { emoji: "🍌", name: "香蕉", member: true }, { emoji: "🍊", name: "橘子", member: true },
        { emoji: "🍓", name: "草莓", member: true }, { emoji: "🥝", name: "奇異果", member: true }, { emoji: "🥕", name: "紅蘿蔔", member: false },
        { emoji: "🍞", name: "麵包", member: false }, { emoji: "🥦", name: "西蘭花", member: false }, { emoji: "🍪", name: "餅乾", member: false }
    ] },
    { title: "⚽ 圓形物品", desc: "找出所有「圓形」的物品", items: [
        { emoji: "⚽", name: "足球", member: true }, { emoji: "🍊", name: "橙子", member: true }, { emoji: "🎈", name: "氣球", member: true },
        { emoji: "🔴", name: "紅色圓貼紙", member: true }, { emoji: "🎾", name: "網球", member: true }, { emoji: "📘", name: "書本", member: false },
        { emoji: "✏️", name: "鉛筆", member: false }, { emoji: "🧦", name: "襪子", member: false }, { emoji: "📏", name: "尺子", member: false }
    ] },
    { title: "🧸 玩具總動員", desc: "哪些是「玩具」？", items: [
        { emoji: "🧸", name: "泰迪熊", member: true }, { emoji: "🚗", name: "玩具車", member: true }, { emoji: "🪀", name: "溜溜球", member: true },
        { emoji: "🎮", name: "遊戲手把", member: true }, { emoji: "🧩", name: "拼圖", member: true }, { emoji: "📏", name: "尺子", member: false },
        { emoji: "🍎", name: "蘋果", member: false }, { emoji: "📓", name: "筆記本", member: false }
    ] },
    { title: "👕 可以穿在身上的", desc: "找出「衣物/服飾」", items: [
        { emoji: "👕", name: "T恤", member: true }, { emoji: "👖", name: "牛仔褲", member: true }, { emoji: "🧦", name: "襪子", member: true },
        { emoji: "🧢", name: "帽子", member: true }, { emoji: "🧤", name: "手套", member: true }, { emoji: "📱", name: "手機", member: false },
        { emoji: "🍌", name: "香蕉", member: false }, { emoji: "⚽", name: "足球", member: false }
    ] },
    { title: "🚗 交通工具", desc: "哪些是「交通工具」？", items: [
        { emoji: "🚗", name: "汽車", member: true }, { emoji: "🚲", name: "自行車", member: true }, { emoji: "✈️", name: "飛機", member: true },
        { emoji: "🚢", name: "輪船", member: true }, { emoji: "🚁", name: "直升機", member: true }, { emoji: "🐎", name: "馬", member: false },
        { emoji: "🛴", name: "滑板車", member: true }, { emoji: "🚀", name: "火箭", member: true }, { emoji: "🏠", name: "房子", member: false }
    ] },
    { title: "🐾 四隻腳的動物", desc: "找出有四隻腳的動物", items: [
        { emoji: "🐶", name: "狗", member: true }, { emoji: "🐱", name: "貓", member: true }, { emoji: "🐮", name: "牛", member: true },
        { emoji: "🐷", name: "豬", member: true }, { emoji: "🐸", name: "青蛙", member: true }, { emoji: "🐦", name: "鳥", member: false },
        { emoji: "🐟", name: "魚", member: false }, { emoji: "🐍", name: "蛇", member: false }
    ] },
    { title: "🍕 可以吃的東西", desc: "選出所有可以吃的物品", items: [
        { emoji: "🍎", name: "蘋果", member: true }, { emoji: "🍕", name: "披薩", member: true }, { emoji: "🍦", name: "冰淇淋", member: true },
        { emoji: "🥦", name: "西蘭花", member: true }, { emoji: "🍪", name: "餅乾", member: true }, { emoji: "📚", name: "課本", member: false },
        { emoji: "✏️", name: "鉛筆", member: false }, { emoji: "⚽", name: "足球", member: false }
    ] },
    { title: "🔊 會發出聲音的", desc: "哪些東西通常會發出聲音？", items: [
        { emoji: "📱", name: "手機", member: true }, { emoji: "⏰", name: "鬧鐘", member: true }, { emoji: "🎸", name: "吉他", member: true },
        { emoji: "🐶", name: "狗", member: true }, { emoji: "🚗", name: "汽車", member: true }, { emoji: "📏", name: "尺子", member: false },
        { emoji: "📓", name: "筆記本", member: false }, { emoji: "🍎", name: "蘋果", member: false }
    ] },
    { title: "💡 需要用電的物品", desc: "哪些物品需要使用電力？", items: [
        { emoji: "💻", name: "電腦", member: true }, { emoji: "📱", name: "手機", member: true }, { emoji: "📺", name: "電視", member: true },
        { emoji: "🔦", name: "手電筒", member: true }, { emoji: "🧊", name: "冰箱", member: true }, { emoji: "🕯️", name: "蠟燭", member: false },
        { emoji: "📖", name: "書本", member: false }, { emoji: "✏️", name: "鉛筆", member: false }
    ] },
    { title: "🧊 冰冰涼涼的物品", desc: "哪些東西摸起來通常是冷的？", items: [
        { emoji: "🍦", name: "冰淇淋", member: true }, { emoji: "🧊", name: "冰塊", member: true }, { emoji: "🥤", name: "冰飲料", member: true },
        { emoji: "❄️", name: "雪花", member: true }, { emoji: "🍉", name: "冰西瓜", member: true }, { emoji: "☕", name: "熱咖啡", member: false },
        { emoji: "🍲", name: "火鍋", member: false }, { emoji: "🕯️", name: "蠟燭", member: false }
    ] },
    { title: "📚 學習用品", desc: "哪些是學習時會用到的？", items: [
        { emoji: "📓", name: "筆記本", member: true }, { emoji: "✏️", name: "鉛筆", member: true }, { emoji: "📏", name: "尺子", member: true },
        { emoji: "📚", name: "課本", member: true }, { emoji: "💻", name: "電腦", member: true }, { emoji: "🍪", name: "餅乾", member: false },
        { emoji: "🧸", name: "玩偶", member: false }, { emoji: "⚽", name: "足球", member: false }
    ] },
    { title: "🧹 清潔用品", desc: "哪些是用來打掃或清潔的？", items: [
        { emoji: "🧹", name: "掃帚", member: true }, { emoji: "🧽", name: "海綿", member: true }, { emoji: "🧴", name: "清潔劑", member: true },
        { emoji: "🧻", name: "紙巾", member: true }, { emoji: "🪣", name: "水桶", member: true }, { emoji: "🍎", name: "蘋果", member: false },
        { emoji: "📱", name: "手機", member: false }, { emoji: "🧸", name: "玩偶", member: false }
    ] }
];

// ---------- 2. 列舉法與描述法 (15題) ----------
const NOTATION_BANK = [
    { desc: "以下哪個是集合 { 🍎, 🍌, 🍓 } 的正確描述？", options: ["A. { x | x 是紅色水果 }", "B. { x | x 是水果 }", "C. { x | x 是黃色水果 }", "D. { x | x 是蔬菜 }"], answer: 1 },
    { desc: "以下哪個是集合 { 🐶, 🐱, 🐮, 🐷 } 的正確描述？", options: ["A. { x | x 是寵物 }", "B. { x | x 是會飛的動物 }", "C. { x | x 是四隻腳的動物 }", "D. { x | x 是昆蟲 }"], answer: 2 },
    { desc: "以下哪個是描述法「{ x | x 是交通工具且可以在天上飛 }」的列舉法？", options: ["A. { 🚗, 🚲, 🚢 }", "B. { ✈️, 🚁 }", "C. { 🚗, ✈️, 🚁 }", "D. { 🚀, 🛸 }"], answer: 1 },
    { desc: "集合 { ⚽, 🏀, 🎾 } 的描述法是什麼？", options: ["A. { x | x 是圓形的 }", "B. { x | x 是運動用品 }", "C. { x | x 是球類運動用品 }", "D. { x | x 是玩具 }"], answer: 2 },
    { desc: "描述法「{ x | x 是偶數且 1 < x < 9 }」的列舉法是？", options: ["A. { 2, 4, 6, 8 }", "B. { 1, 3, 5, 7 }", "C. { 2, 3, 4, 5 }", "D. { 0, 2, 4, 6 }"], answer: 0 },
    { desc: "以下哪個集合與描述「紅色的水果」相符？", options: ["A. { 🍎, 🍓, 🌶️ }", "B. { 🍎, 🍓, 🍒 }", "C. { 🍎, 🍌, 🍓 }", "D. { 🌹, 🚗, 🎈 }"], answer: 1 },
    { desc: "集合 { 2, 3, 5, 7 } 的最佳描述是？", options: ["A. { x | x 是奇數 }", "B. { x | x 是質數且 x < 10 }", "C. { x | x 是小於 10 的整數 }", "D. { x | x 是偶數 }"], answer: 1 },
    { desc: "描述法「{ x | x 是飲料且是冰的 }」對應哪個集合？", options: ["A. { 🥤, 🧃, ☕ }", "B. { 🥤, 🧊, 🍦 }", "C. { 🥤, 🧃, 🥛 } (冰的)", "D. { 🍺, 🍾, 🥂 }"], answer: 2 },
    { desc: "集合 { ✏️, 📏, 📓, ✂️ } 的描述法是什麼？", options: ["A. { x | x 是文具 }", "B. { x | x 是學習用品 }", "C. { x | x 是書桌用品 }", "D. 以上皆是"], answer: 3 },
    { desc: "以下哪個是描述法「{ x | x 是家電且會發熱 }」的列舉法？", options: ["A. { 📺, 💻, 📱 }", "B. { 🍞, ☕, 🔥 }", "C. { 🍞, ☕, 🧊 }", "D. { 🧊, ❄️, 🌬️ }"], answer: 1 },
    { desc: "集合 { 🐟, 🐬, 🐠 } 的描述法是什麼？", options: ["A. { x | x 是海洋生物 }", "B. { x | x 是魚類 }", "C. { x | x 是水生動物 }", "D. 以上皆是"], answer: 3 },
    { desc: "描述法「{ x | x 是衣物且是藍色的 }」對應哪個集合？", options: ["A. { 👕, 👖, 🧢 } (藍色)", "B. { 👕, 🧦, 🧤 } (紅色)", "C. { 👗, 👚, 🩳 }", "D. { 🧥, 🧣, 🧤 }"], answer: 0 },
    { desc: "集合 { 🚗, 🚌, 🚚 } 的描述法是什麼？", options: ["A. { x | x 是有輪子的 }", "B. { x | x 是陸地交通工具 }", "C. { x | x 是汽車 }", "D. { x | x 是機動車輛 }"], answer: 1 },
    { desc: "以下哪個集合符合描述「黃色的水果」？", options: ["A. { 🍌, 🍋, 🍍 }", "B. { 🍌, 🍎, 🍓 }", "C. { 🍊, 🍋, 🍌 }", "D. { 🍍, 🥝, 🍈 }"], answer: 0 },
    { desc: "描述法「{ x | x 是數字且 x² < 30 }」的列舉法（正整數）是？", options: ["A. { 1, 2, 3, 4, 5 }", "B. { 0, 1, 2, 3, 4 }", "C. { 1, 2, 3, 4 }", "D. { 2, 4, 6, 8 }"], answer: 0 }
];

// ---------- 3. 交集遊戲 (15題) ----------
const INTER_BANK = [
    { setA: "紅色物品", setAemoji: "❤️", setB: "水果", setBemoji: "🍎", items: [{ emoji: "🍎", name: "蘋果", inA: true, inB: true },{ emoji: "🍓", name: "草莓", inA: true, inB: true },{ emoji: "🌹", name: "紅玫瑰", inA: true, inB: false },{ emoji: "🚗", name: "紅色玩具車", inA: true, inB: false },{ emoji: "🍌", name: "香蕉", inA: false, inB: true },{ emoji: "🍊", name: "橘子", inA: false, inB: true }] },
    { setA: "有四隻腳的動物", setAemoji: "🐾", setB: "會叫的動物", setBemoji: "🔊", items: [{ emoji: "🐶", name: "狗", inA: true, inB: true },{ emoji: "🐱", name: "貓", inA: true, inB: true },{ emoji: "🐮", name: "牛", inA: true, inB: true },{ emoji: "🐴", name: "馬", inA: true, inB: true },{ emoji: "🐦", name: "小鳥", inA: false, inB: true },{ emoji: "🐟", name: "魚", inA: false, inB: false }] },
    { setA: "圓形物品", setAemoji: "⚪", setB: "可以吃的", setBemoji: "🍽️", items: [{ emoji: "🍊", name: "橙子", inA: true, inB: true },{ emoji: "🍒", name: "櫻桃", inA: true, inB: true },{ emoji: "⚽", name: "足球", inA: true, inB: false },{ emoji: "🎈", name: "氣球", inA: true, inB: false },{ emoji: "🍔", name: "漢堡", inA: false, inB: true },{ emoji: "🍕", name: "披薩", inA: false, inB: true }] },
    { setA: "交通工具", setAemoji: "🚗", setB: "有輪子的", setBemoji: "🛞", items: [{ emoji: "🚗", name: "汽車", inA: true, inB: true },{ emoji: "🚲", name: "自行車", inA: true, inB: true },{ emoji: "✈️", name: "飛機", inA: true, inB: true },{ emoji: "🚢", name: "輪船", inA: true, inB: false },{ emoji: "🛴", name: "滑板車", inA: false, inB: true },{ emoji: "🐎", name: "馬", inA: false, inB: false }] },
    { setA: "水果", setAemoji: "🍎", setB: "黃色的", setBemoji: "🟡", items: [{ emoji: "🍌", name: "香蕉", inA: true, inB: true },{ emoji: "🍋", name: "檸檬", inA: true, inB: true },{ emoji: "🍍", name: "鳳梨", inA: true, inB: true },{ emoji: "🍎", name: "蘋果", inA: true, inB: false },{ emoji: "🌻", name: "向日葵", inA: false, inB: true },{ emoji: "⭐", name: "星星", inA: false, inB: true }] },
    { setA: "動物", setAemoji: "🐘", setB: "生活在水中", setBemoji: "💧", items: [{ emoji: "🐟", name: "魚", inA: true, inB: true },{ emoji: "🐬", name: "海豚", inA: true, inB: true },{ emoji: "🐧", name: "企鵝", inA: true, inB: false },{ emoji: "🐱", name: "貓", inA: true, inB: false },{ emoji: "🐸", name: "青蛙", inA: true, inB: false },{ emoji: "🦆", name: "鴨子", inA: true, inB: false }] },
    { setA: "可以寫字的", setAemoji: "✍️", setB: "木頭做的", setBemoji: "🪵", items: [{ emoji: "✏️", name: "鉛筆", inA: true, inB: true },{ emoji: "📏", name: "木尺", inA: false, inB: true },{ emoji: "🖊️", name: "原子筆", inA: true, inB: false },{ emoji: "📱", name: "手機", inA: false, inB: false },{ emoji: "🪑", name: "木椅", inA: false, inB: true },{ emoji: "📓", name: "筆記本", inA: true, inB: false }] },
    { setA: "需要用電力", setAemoji: "⚡", setB: "有螢幕", setBemoji: "📺", items: [{ emoji: "📱", name: "手機", inA: true, inB: true },{ emoji: "💻", name: "筆電", inA: true, inB: true },{ emoji: "🕹️", name: "遊戲機", inA: true, inB: true },{ emoji: "🔦", name: "手電筒", inA: true, inB: false },{ emoji: "📺", name: "電視", inA: true, inB: true },{ emoji: "🧸", name: "玩偶", inA: false, inB: false }] },
    { setA: "玩具", setAemoji: "🧸", setB: "可以動的", setBemoji: "🏃", items: [{ emoji: "🚗", name: "玩具車", inA: true, inB: true },{ emoji: "🪀", name: "溜溜球", inA: true, inB: true },{ emoji: "🧸", name: "泰迪熊", inA: true, inB: false },{ emoji: "🎮", name: "遊戲手把", inA: true, inB: false },{ emoji: "🤖", name: "機器人", inA: true, inB: true },{ emoji: "📏", name: "尺子", inA: false, inB: false }] },
    { setA: "衣物", setAemoji: "👕", setB: "紅色的", setBemoji: "❤️", items: [{ emoji: "👕", name: "紅T恤", inA: true, inB: true },{ emoji: "🧦", name: "紅襪子", inA: true, inB: true },{ emoji: "🧢", name: "藍帽子", inA: true, inB: false },{ emoji: "🧤", name: "紅手套", inA: true, inB: true },{ emoji: "🍎", name: "蘋果", inA: false, inB: true },{ emoji: "🚗", name: "紅車", inA: false, inB: true }] },
    { setA: "昆蟲", setAemoji: "🐞", setB: "會飛的", setBemoji: "🪽", items: [{ emoji: "🐝", name: "蜜蜂", inA: true, inB: true },{ emoji: "🦋", name: "蝴蝶", inA: true, inB: true },{ emoji: "🐞", name: "瓢蟲", inA: true, inB: true },{ emoji: "🐜", name: "螞蟻", inA: true, inB: false },{ emoji: "🕷️", name: "蜘蛛", inA: true, inB: false },{ emoji: "🦅", name: "老鷹", inA: false, inB: true }] },
    { setA: "家具", setAemoji: "🪑", setB: "木製的", setBemoji: "🪵", items: [{ emoji: "🪑", name: "木椅", inA: true, inB: true },{ emoji: "🛏️", name: "木床", inA: true, inB: true },{ emoji: "📺", name: "電視", inA: true, inB: false },{ emoji: "🛋️", name: "沙發", inA: true, inB: false },{ emoji: "🚪", name: "木門", inA: true, inB: true },{ emoji: "📏", name: "木尺", inA: false, inB: true }] },
    { setA: "水果", setAemoji: "🍎", setB: "有籽的", setBemoji: "🌱", items: [{ emoji: "🍎", name: "蘋果", inA: true, inB: true },{ emoji: "🍉", name: "西瓜", inA: true, inB: true },{ emoji: "🍌", name: "香蕉", inA: true, inB: false },{ emoji: "🍓", name: "草莓", inA: true, inB: true },{ emoji: "🍊", name: "橘子", inA: true, inB: true },{ emoji: "🥝", name: "奇異果", inA: true, inB: true }] },
    { setA: "家電", setAemoji: "🏠", setB: "會發熱的", setBemoji: "🔥", items: [{ emoji: "🍞", name: "烤麵包機", inA: true, inB: true },{ emoji: "☕", name: "咖啡機", inA: true, inB: true },{ emoji: "🧊", name: "冰箱", inA: true, inB: false },{ emoji: "💻", name: "筆電", inA: true, inB: true },{ emoji: "📺", name: "電視", inA: true, inB: true },{ emoji: "🔦", name: "手電筒", inA: true, inB: false }] },
    { setA: "飲料", setAemoji: "🥤", setB: "有氣的", setBemoji: "🫧", items: [{ emoji: "🥤", name: "可樂", inA: true, inB: true },{ emoji: "🧃", name: "果汁", inA: true, inB: false },{ emoji: "🍾", name: "汽水", inA: true, inB: true },{ emoji: "🥛", name: "牛奶", inA: true, inB: false },{ emoji: "🧊", name: "冰塊", inA: false, inB: false },{ emoji: "🍺", name: "啤酒", inA: true, inB: true }] }
];

// ---------- 4. 併集遊戲 (15題) ----------
const UNION_BANK = [
    { setA: "有輪子的交通工具", setAemoji: "🚗", setB: "可以在天上飛的", setBemoji: "✈️", items: [{ emoji: "🚗", name: "汽車", inA: true, inB: false },{ emoji: "🚲", name: "自行車", inA: true, inB: false },{ emoji: "✈️", name: "飛機", inA: true, inB: true },{ emoji: "🚁", name: "直升機", inA: true, inB: true },{ emoji: "🦅", name: "老鷹", inA: false, inB: true },{ emoji: "🐟", name: "魚", inA: false, inB: false }] },
    { setA: "水果", setAemoji: "🍎", setB: "黃色的", setBemoji: "🟡", items: [{ emoji: "🍌", name: "香蕉", inA: true, inB: true },{ emoji: "🍋", name: "檸檬", inA: true, inB: true },{ emoji: "🍎", name: "蘋果", inA: true, inB: false },{ emoji: "🌻", name: "向日葵", inA: false, inB: true },{ emoji: "⭐", name: "星星", inA: false, inB: true },{ emoji: "🍓", name: "草莓", inA: true, inB: false }] },
    { setA: "動物", setAemoji: "🐘", setB: "有四隻腳", setBemoji: "🦵", items: [{ emoji: "🐶", name: "狗", inA: true, inB: true },{ emoji: "🐱", name: "貓", inA: true, inB: true },{ emoji: "🐦", name: "小鳥", inA: true, inB: false },{ emoji: "🐟", name: "魚", inA: true, inB: false },{ emoji: "🐸", name: "青蛙", inA: true, inB: false },{ emoji: "🦎", name: "蜥蜴", inA: true, inB: true }] },
    { setA: "紅色物品", setAemoji: "❤️", setB: "可以吃的", setBemoji: "🍽️", items: [{ emoji: "🍎", name: "蘋果", inA: true, inB: true },{ emoji: "🍓", name: "草莓", inA: true, inB: true },{ emoji: "🌹", name: "紅玫瑰", inA: true, inB: false },{ emoji: "🚗", name: "紅色汽車", inA: true, inB: false },{ emoji: "🍌", name: "香蕉", inA: false, inB: true },{ emoji: "🍪", name: "餅乾", inA: false, inB: true }] },
    { setA: "需要電力", setAemoji: "⚡", setB: "有螢幕", setBemoji: "📺", items: [{ emoji: "📱", name: "手機", inA: true, inB: true },{ emoji: "💻", name: "筆電", inA: true, inB: true },{ emoji: "🔦", name: "手電筒", inA: true, inB: false },{ emoji: "📺", name: "電視", inA: true, inB: true },{ emoji: "📖", name: "書本", inA: false, inB: false },{ emoji: "🕯️", name: "蠟燭", inA: false, inB: false }] },
    { setA: "圓形物品", setAemoji: "⚪", setB: "運動用品", setBemoji: "⚽", items: [{ emoji: "⚽", name: "足球", inA: true, inB: true },{ emoji: "🎾", name: "網球", inA: true, inB: true },{ emoji: "🍊", name: "橙子", inA: true, inB: false },{ emoji: "🏀", name: "籃球", inA: true, inB: true },{ emoji: "🏸", name: "羽毛球", inA: false, inB: true },{ emoji: "🎈", name: "氣球", inA: true, inB: false }] },
    { setA: "玩具", setAemoji: "🧸", setB: "電子產品", setBemoji: "📱", items: [{ emoji: "🎮", name: "遊戲機", inA: true, inB: true },{ emoji: "🤖", name: "機器人", inA: true, inB: true },{ emoji: "🧸", name: "泰迪熊", inA: true, inB: false },{ emoji: "🪀", name: "溜溜球", inA: true, inB: false },{ emoji: "📱", name: "手機", inA: false, inB: true },{ emoji: "💻", name: "筆電", inA: false, inB: true }] },
    { setA: "衣物", setAemoji: "👕", setB: "藍色的", setBemoji: "🔵", items: [{ emoji: "👖", name: "牛仔褲", inA: true, inB: true },{ emoji: "🧢", name: "藍帽子", inA: true, inB: true },{ emoji: "🧦", name: "白襪子", inA: true, inB: false },{ emoji: "👕", name: "藍T恤", inA: true, inB: true },{ emoji: "🧤", name: "藍手套", inA: true, inB: true },{ emoji: "🍎", name: "紅蘋果", inA: false, inB: false }] },
    { setA: "家具", setAemoji: "🪑", setB: "可以坐的", setBemoji: "🪑", items: [{ emoji: "🪑", name: "椅子", inA: true, inB: true },{ emoji: "🛋️", name: "沙發", inA: true, inB: true },{ emoji: "🛏️", name: "床", inA: true, inB: false },{ emoji: "📺", name: "電視", inA: true, inB: false },{ emoji: "🚽", name: "馬桶", inA: true, inB: true },{ emoji: "🪑", name: "凳子", inA: true, inB: true }] },
    { setA: "飲料", setAemoji: "🥤", setB: "冰的", setBemoji: "🧊", items: [{ emoji: "🥤", name: "冰可樂", inA: true, inB: true },{ emoji: "🧃", name: "冰果汁", inA: true, inB: true },{ emoji: "☕", name: "熱咖啡", inA: true, inB: false },{ emoji: "🥛", name: "冰牛奶", inA: true, inB: true },{ emoji: "🍦", name: "冰淇淋", inA: true, inB: true },{ emoji: "🧊", name: "冰塊", inA: false, inB: true }] },
    { setA: "文具", setAemoji: "✏️", setB: "塑膠製的", setBemoji: "🧴", items: [{ emoji: "📏", name: "塑膠尺", inA: true, inB: true },{ emoji: "✂️", name: "剪刀", inA: true, inB: false },{ emoji: "✏️", name: "鉛筆", inA: true, inB: false },{ emoji: "📓", name: "筆記本", inA: true, inB: false },{ emoji: "🧽", name: "擦膠", inA: true, inB: true },{ emoji: "🖊️", name: "原子筆", inA: true, inB: true }] },
    { setA: "水果", setAemoji: "🍎", setB: "綠色的", setBemoji: "🟢", items: [{ emoji: "🍏", name: "青蘋果", inA: true, inB: true },{ emoji: "🍐", name: "梨子", inA: true, inB: true },{ emoji: "🍉", name: "西瓜", inA: true, inB: true },{ emoji: "🍌", name: "香蕉", inA: true, inB: false },{ emoji: "🥝", name: "奇異果", inA: true, inB: true },{ emoji: "🥦", name: "西蘭花", inA: false, inB: true }] },
    { setA: "交通工具", setAemoji: "🚗", setB: "大眾運輸", setBemoji: "🚌", items: [{ emoji: "🚌", name: "公車", inA: true, inB: true },{ emoji: "🚆", name: "火車", inA: true, inB: true },{ emoji: "🚗", name: "汽車", inA: true, inB: false },{ emoji: "🚲", name: "自行車", inA: true, inB: false },{ emoji: "✈️", name: "飛機", inA: true, inB: true },{ emoji: "🚢", name: "渡輪", inA: true, inB: true }] },
    { setA: "寵物", setAemoji: "🐱", setB: "會游泳的", setBemoji: "🏊", items: [{ emoji: "🐟", name: "魚", inA: true, inB: true },{ emoji: "🐶", name: "狗", inA: true, inB: true },{ emoji: "🐱", name: "貓", inA: true, inB: false },{ emoji: "🐹", name: "倉鼠", inA: true, inB: false },{ emoji: "🐢", name: "烏龜", inA: true, inB: true },{ emoji: "🐦", name: "鳥", inA: true, inB: false }] },
    { setA: "家電", setAemoji: "🏠", setB: "廚房用", setBemoji: "🍳", items: [{ emoji: "🍞", name: "烤麵包機", inA: true, inB: true },{ emoji: "☕", name: "咖啡機", inA: true, inB: true },{ emoji: "🧊", name: "冰箱", inA: true, inB: true },{ emoji: "📺", name: "電視", inA: true, inB: false },{ emoji: "💻", name: "筆電", inA: true, inB: false },{ emoji: "🍚", name: "電鍋", inA: true, inB: true }] }
];

// ---------- 5. 子集判斷 (15題) ----------
const SUBSET_BANK = [
    { setA: { name: "紅色水果", items: ["🍎", "🍓"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊"] }, isSubset: true },
    { setA: { name: "交通工具", items: ["🚗", "✈️"] }, setB: { name: "有輪子的物品", items: ["🚗", "🚲", "✈️", "🛴"] }, isSubset: true },
    { setA: { name: "動物", items: ["🐱", "🐶", "🐦"] }, setB: { name: "有四隻腳的動物", items: ["🐱", "🐶", "🐮"] }, isSubset: false },
    { setA: { name: "鉛筆", items: ["✏️"] }, setB: { name: "文具", items: ["✏️", "📏", "✂️", "📓"] }, isSubset: true },
    { setA: { name: "圓形物品", items: ["⚽", "🍊"] }, setB: { name: "可以吃的", items: ["🍎", "🍌", "🍊"] }, isSubset: false },
    { setA: { name: "需要電池的物品", items: ["📱", "🔦"] }, setB: { name: "電子產品", items: ["📱", "💻", "📺"] }, isSubset: false },
    { setA: { name: "紅色物品", items: ["🍎", "🌹"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓"] }, isSubset: false },
    { setA: { name: "汽車", items: ["🚗"] }, setB: { name: "交通工具", items: ["🚗", "🚲", "✈️", "🚢"] }, isSubset: true },
    { setA: { name: "黃色水果", items: ["🍌", "🍋"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊", "🍋"] }, isSubset: true },
    { setA: { name: "鳥類", items: ["🐦", "🐧"] }, setB: { name: "動物", items: ["🐶", "🐱", "🐦", "🐟", "🐧"] }, isSubset: true },
    { setA: { name: "甜點", items: ["🍦", "🍰"] }, setB: { name: "可以吃的", items: ["🍎", "🍕", "🍦", "🍰", "🍪"] }, isSubset: true },
    { setA: { name: "家具", items: ["🪑", "🛏️"] }, setB: { name: "木製品", items: ["🪑", "📏", "🚪"] }, isSubset: false },
    { setA: { name: "偶數", items: ["2", "4"] }, setB: { name: "數字", items: ["1", "2", "3", "4", "5"] }, isSubset: true },
    { setA: { name: "哺乳動物", items: ["🐶", "🐱"] }, setB: { name: "寵物", items: ["🐶", "🐱", "🐹", "🐦"] }, isSubset: true },
    { setA: { name: "冬季服飾", items: ["🧣", "🧤"] }, setB: { name: "衣物", items: ["👕", "👖", "🧣", "🧤", "🧢"] }, isSubset: true }
];

// ---------- 6. 真子集判斷 (15題) ----------
const PROPER_BANK = [
    { setA: { name: "紅色水果", items: ["🍎", "🍓"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊"] }, isProper: true },
    { setA: { name: "交通工具", items: ["🚗", "✈️"] }, setB: { name: "有輪子的物品", items: ["🚗", "🚲", "✈️", "🛴"] }, isProper: true },
    { setA: { name: "鉛筆", items: ["✏️"] }, setB: { name: "文具", items: ["✏️", "📏", "✂️", "📓"] }, isProper: true },
    { setA: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊"] }, isProper: false },
    { setA: { name: "需要電池的物品", items: ["📱", "🔦"] }, setB: { name: "電子產品", items: ["📱", "💻", "📺"] }, isProper: false },
    { setA: { name: "汽車", items: ["🚗"] }, setB: { name: "交通工具", items: ["🚗", "🚲", "✈️", "🚢"] }, isProper: true },
    { setA: { name: "動物", items: ["🐱", "🐶", "🐦"] }, setB: { name: "有四隻腳的動物", items: ["🐱", "🐶", "🐮"] }, isProper: false },
    { setA: { name: "文具", items: ["✏️", "📏", "✂️"] }, setB: { name: "文具", items: ["✏️", "📏", "✂️", "📓"] }, isProper: true },
    { setA: { name: "黃色水果", items: ["🍌", "🍋"] }, setB: { name: "水果", items: ["🍎", "🍌", "🍓", "🍊", "🍋"] }, isProper: true },
    { setA: { name: "鳥類", items: ["🐦", "🐧"] }, setB: { name: "動物", items: ["🐶", "🐱", "🐦", "🐟", "🐧"] }, isProper: true },
    { setA: { name: "數字", items: ["1", "2", "3"] }, setB: { name: "數字", items: ["1", "2", "3"] }, isProper: false },
    { setA: { name: "偶數", items: ["2", "4"] }, setB: { name: "數字", items: ["1", "2", "3", "4", "5"] }, isProper: true },
    { setA: { name: "哺乳動物", items: ["🐶", "🐱"] }, setB: { name: "寵物", items: ["🐶", "🐱", "🐹", "🐦"] }, isProper: true },
    { setA: { name: "冬季服飾", items: ["🧣", "🧤"] }, setB: { name: "衣物", items: ["👕", "👖", "🧣", "🧤", "🧢"] }, isProper: true },
    { setA: { name: "甜點", items: ["🍦", "🍰"] }, setB: { name: "食物", items: ["🍎", "🍕", "🍦", "🍰", "🍪"] }, isProper: true }
];

// ---------- 7. 全集與差集 (15題) ----------
const DIFFERENCE_BANK = [
    { U: "所有動物", A: { name: "動物", emoji: "🐘", items: ["🐶","🐱","🐦","🐟","🐸","🐮"] }, B: { name: "有四隻腳的動物", emoji: "🐾", items: ["🐶","🐱","🐮"] }, diffItems: ["🐦","🐟","🐸"] },
    { U: "所有物品", A: { name: "紅色物品", emoji: "❤️", items: ["🍎","🍓","🌹","🚗","🎈"] }, B: { name: "水果", emoji: "🍎", items: ["🍎","🍓","🍌","🍊"] }, diffItems: ["🌹","🚗","🎈"] },
    { U: "所有交通工具", A: { name: "交通工具", emoji: "🚗", items: ["🚗","🚲","✈️","🚢","🚁"] }, B: { name: "有輪子的交通工具", emoji: "🛞", items: ["🚗","🚲","✈️"] }, diffItems: ["🚢","🚁"] },
    { U: "所有文具", A: { name: "文具", emoji: "✏️", items: ["✏️","📏","✂️","📓","🧽"] }, B: { name: "可以寫字的文具", emoji: "✍️", items: ["✏️","🖊️"] }, diffItems: ["📏","✂️","📓","🧽"] },
    { U: "所有物品", A: { name: "圓形物品", emoji: "⚪", items: ["⚽","🍊","🎈","🔴","🍎"] }, B: { name: "可以吃的", emoji: "🍽️", items: ["🍊","🍎","🍌"] }, diffItems: ["⚽","🎈","🔴"] },
    { U: "所有電子產品", A: { name: "電子產品", emoji: "💻", items: ["📱","💻","📺","🔦","🎧"] }, B: { name: "有螢幕的電子產品", emoji: "📺", items: ["📱","💻","📺"] }, diffItems: ["🔦","🎧"] },
    { U: "所有物品", A: { name: "需要電池的物品", emoji: "🔋", items: ["📱","🔦","🕹️","📺"] }, B: { name: "有螢幕的物品", emoji: "📺", items: ["📱","📺","💻"] }, diffItems: ["🔦","🕹️"] },
    { U: "所有動物", A: { name: "動物", emoji: "🐘", items: ["🐱","🐶","🐦","🐟","🐬","🐸"] }, B: { name: "生活在水中", emoji: "💧", items: ["🐟","🐬","🐸"] }, diffItems: ["🐱","🐶","🐦"] },
    { U: "所有玩具", A: { name: "玩具", emoji: "🧸", items: ["🧸","🚗","🪀","🎮","🤖"] }, B: { name: "電子玩具", emoji: "🔌", items: ["🎮","🤖"] }, diffItems: ["🧸","🚗","🪀"] },
    { U: "所有飲料", A: { name: "飲料", emoji: "🥤", items: ["🥤","🧃","☕","🥛","🍺"] }, B: { name: "有氣的飲料", emoji: "🫧", items: ["🥤","🍺"] }, diffItems: ["🧃","☕","🥛"] },
    { U: "所有衣物", A: { name: "衣物", emoji: "👕", items: ["👕","👖","🧦","🧢","🧤"] }, B: { name: "紅色的衣物", emoji: "❤️", items: ["👕","🧤"] }, diffItems: ["👖","🧦","🧢"] },
    { U: "所有水果", A: { name: "水果", emoji: "🍎", items: ["🍎","🍌","🍓","🍊","🥝"] }, B: { name: "熱帶水果", emoji: "🌴", items: ["🍌","🥝"] }, diffItems: ["🍎","🍓","🍊"] },
    { U: "所有家具", A: { name: "家具", emoji: "🪑", items: ["🪑","🛏️","📺","🛋️","🚪"] }, B: { name: "木製家具", emoji: "🪵", items: ["🪑","🛏️","🚪"] }, diffItems: ["📺","🛋️"] },
    { U: "所有昆蟲", A: { name: "昆蟲", emoji: "🐞", items: ["🐝","🦋","🐞","🐜","🕷️"] }, B: { name: "會飛的昆蟲", emoji: "🪽", items: ["🐝","🦋","🐞"] }, diffItems: ["🐜","🕷️"] },
    { U: "所有家電", A: { name: "家電", emoji: "🏠", items: ["🍞","☕","🧊","📺","💻"] }, B: { name: "廚房家電", emoji: "🍳", items: ["🍞","☕","🧊"] }, diffItems: ["📺","💻"] }
];

// 差集物品名稱對照表 (擴充)
const nameMapDiff = {
    "🐶":"狗","🐱":"貓","🐦":"鳥","🐟":"魚","🐸":"青蛙","🐮":"牛","🍎":"蘋果","🍓":"草莓","🌹":"紅玫瑰","🚗":"紅色玩具車","🎈":"紅色氣球","🍌":"香蕉","🍊":"橘子","🚲":"自行車","✈️":"飛機","🚢":"輪船","🚁":"直升機","✏️":"鉛筆","📏":"尺子","✂️":"剪刀","📓":"筆記本","🧽":"擦膠","🖊️":"原子筆","⚽":"足球","🔴":"紅色圓貼紙","🎾":"網球","💻":"筆電","📺":"電視","🔦":"手電筒","🎧":"耳機","🕹️":"遊戲機","🐬":"海豚","📱":"手機",
    "🧸":"泰迪熊","🪀":"溜溜球","🎮":"遊戲手把","🤖":"機器人","👕":"T恤","👖":"牛仔褲","🧦":"襪子","🧢":"帽子","🧤":"手套","☕":"咖啡","🥤":"可樂","🧃":"果汁","🥛":"牛奶","🍺":"啤酒","🪑":"椅子","🛏️":"床","🛋️":"沙發","🚪":"門","🐝":"蜜蜂","🦋":"蝴蝶","🐞":"瓢蟲","🐜":"螞蟻","🕷️":"蜘蛛","🍞":"烤麵包機","🧊":"冰箱","🍚":"電鍋"
};

// ====================== 【重要】暴露給全域 window ======================
window.BASIC_BANK = BASIC_BANK;
window.NOTATION_BANK = NOTATION_BANK;
window.INTER_BANK = INTER_BANK;
window.UNION_BANK = UNION_BANK;
window.SUBSET_BANK = SUBSET_BANK;
window.PROPER_BANK = PROPER_BANK;
window.DIFFERENCE_BANK = DIFFERENCE_BANK;
window.nameMapDiff = nameMapDiff;

console.log('✅ 集合樂園題庫載入成功！共', 
    BASIC_BANK.length + NOTATION_BANK.length + INTER_BANK.length + 
    UNION_BANK.length + SUBSET_BANK.length + PROPER_BANK.length + 
    DIFFERENCE_BANK.length, '題已準備就緒');