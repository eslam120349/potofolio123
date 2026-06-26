// ============================================
// العناصر
// ============================================
const split = document.getElementById('splitContainer');
const panelLeft = document.getElementById('panelLeft');
const panelRight = document.getElementById('panelRight');
const imgLeft = document.getElementById('imgLeft');
const imgRight = document.getElementById('imgRight');
const divider = document.getElementById('divider');
const textLeft = document.getElementById('textLeft');
const textRight = document.getElementById('textRight');

// ============================================
// الحالة
// ============================================
let currentProgress = 0.5; // يبدأ في النص
let targetProgress = 0.5;

// ============================================
// دالة التمويه (Lerp) عشان الحركة الناعمة
// ============================================
function lerp(a, b, t) {
    return a + (b - a) * t;
}

// ============================================
// حركة الماوس
// ============================================
document.addEventListener('mousemove', (e) => {
    const rect = split.getBoundingClientRect();

    // حساب موقع الماوس بالنسبة لعرض الـ split
    let x = e.clientX - rect.left;
    let raw = x / rect.width;

    // منع الخروج عن النطاق
    raw = Math.max(0, Math.min(1, raw));

    // الحد الأقصى 75% (يعني عند 75% من عرض الـ container، يختفي اليسار تماماً)
    targetProgress = Math.min(raw / 0.75, 1);
});

// ============================================
// لو الماوس طلع برا الصفحة، يرجع للنص
// ============================================
document.addEventListener('mouseleave', () => {
    targetProgress = 0.5;
});

// ============================================
// حلقة الحركة (60 إطار في الثانية)
// ============================================
function animate() {
    // التمويه لجعل الحركة ناعمة
    currentProgress = lerp(currentProgress, targetProgress, 0.09);

    const p = currentProgress;
    const percent = p * 100;

    // 1. قص الصور (clip-path)
    // اليسار: percent% من اليمين (يختفي تدريجياً)
    panelLeft.style.clipPath = `inset(0 ${percent}% 0 0)`;
    // اليمين: (100 - percent)% من اليسار (يظهر تدريجياً)
    panelRight.style.clipPath = `inset(0 0 0 ${100 - percent}%)`;

    // 2. تحريك الخط الفاصل
    divider.style.left = `${100-percent}%`;

    // 3. النصوص: اختفاء + حركة جانبية خفيفة
    textLeft.style.opacity = 1 - p;
    textRight.style.opacity = p;

    textLeft.style.transform = `translateX(${-p * 30}px)`;
    textRight.style.transform = `translateX(${p * 30}px)`;

    // 4. حركة Parallax (الصور تتحرك جوه الإطار)
    // الصورة اليسرى تتحرك يمين، واليمنى تتحرك شمال
    imgLeft.style.objectPosition = `${45 + p * 12}% center`;
    imgRight.style.objectPosition = `${55 - p * 12}% center`;

    requestAnimationFrame(animate);
}

// ============================================
// التشغيل
// ============================================
animate();