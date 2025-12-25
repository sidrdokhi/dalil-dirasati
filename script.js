// البيانات الأساسية للمواد حسب المرحلة الدراسية مع المعاملات الافتراضية
const subjectsData = {
  primary: [
    { name: "اللغة العربية", id: "arabic", coefficient: 2 },
    { name: "الرياضيات", id: "math", coefficient: 2 },
    { name: "اللغة الفرنسية", id: "french", coefficient: 1 },
    { name: "اللغة الإنجليزية", id: "english", coefficient: 1 },
    { name: "التربية الإسلامية", id: "islamic", coefficient: 1 },
    { name: "الاجتماعيات", id: "social", coefficient: 1 },
    { name: "العلوم", id: "science", coefficient: 1 },
    { name: "النشاط العلمي", id: "activity", coefficient: 1 },
  ],
  middle: [
    { name: "اللغة العربية", id: "arabic", coefficient: 3 },
    { name: "اللغة الفرنسية", id: "french", coefficient: 2 },
    { name: "اللغة الإنجليزية", id: "english", coefficient: 2 },
    { name: "الرياضيات", id: "math", coefficient: 3 },
    { name: "الفيزياء والكيمياء", id: "physics", coefficient: 2 },
    { name: "علوم الحياة والأرض", id: "life_science", coefficient: 2 },
    { name: "التربية الإسلامية", id: "islamic", coefficient: 1 },
    { name: "الاجتماعيات", id: "social", coefficient: 1 },
    { name: "التربية الفنية", id: "art", coefficient: 1 },
    { name: "التربية البدنية", id: "sport", coefficient: 1 },
  ],
  secondary: [
    { name: "اللغة العربية", id: "arabic", coefficient: 3 },
    { name: "اللغة الفرنسية", id: "french", coefficient: 2 },
    { name: "اللغة الإنجليزية", id: "english", coefficient: 2 },
    { name: "الرياضيات", id: "math", coefficient: 4 },
    { name: "الفيزياء", id: "physics", coefficient: 3 },
    { name: "الكيمياء", id: "chemistry", coefficient: 3 },
    { name: "علوم الحياة والأرض", id: "life_science", coefficient: 3 },
    { name: "الفلسفة", id: "philosophy", coefficient: 1 },
    { name: "التاريخ والجغرافيا", id: "history", coefficient: 1 },
    { name: "التربية الإسلامية", id: "islamic", coefficient: 1 },
  ],
};

// الأوصاف للمراحل الدراسية
const levelDescriptions = {
  primary: "المرحلة الابتدائية: من الصف الأول إلى السادس الابتدائي",
  middle: "المرحلة الإعدادية: من الصف الأول إلى الثالث الإعدادي",
  secondary: "المرحلة الثانوية: من الصف الأول إلى الثالث الثانوي",
};

// النصائح حسب النتيجة
const adviceData = {
  excellent: [
    "ممتاز! استمر في هذا التميز واجتهد للحفاظ على مستواك",
    "حاول التركيز على المواد التي تحتاج تحسين ولو قليلاً",
    "شارك أسرار نجاحك مع زملائك لتعم الفائدة",
  ],
  good: [
    "أحسنت! معدلك جيد لكن يمكنك التحسن أكثر",
    "ركز على المواد ذات المعاملات العالية لرفع معدلك",
    "ضع خطة دراسية منظمة لتحقيق نتائج أفضل",
  ],
  need_improvement: [
    "تحتاج لبذل المزيد من الجهد والتركيز",
    "ابدأ بالمواد الأساسية ذات المعاملات العالية",
    "حدد نقاط ضعفك واعمل على تحسينها",
  ],
};

// العناصر الرئيسية في الصفحة
const pages = {
  home: document.getElementById("home"),
  grades: document.getElementById("grades"),
  result: document.getElementById("result"),
};

// عناصر التحكم
const progressSteps = document.querySelectorAll(".progress-step");
const themeToggle = document.querySelector(".theme-toggle");
const themeIcon = document.getElementById("themeIcon");
const showCoefficientToggle = document.getElementById("showCoefficientToggle");
const levelSelectionSection = document.querySelector(
  ".level-selection-section"
);
const gradesInputSection = document.getElementById("gradesInputSection");

// المتغيرات لتخزين البيانات
let currentLevel = "";
let grades = {};
let coefficients = {};
let currentTheme = "light";

// تهيئة الموقع عند تحميل الصفحة
document.addEventListener("DOMContentLoaded", function () {
  // إضافة مستمعي الأحداث للأزرار الرئيسية
  document.getElementById("startBtn").addEventListener("click", showGradesPage);
  document.getElementById("backToHome").addEventListener("click", showHomePage);
  document
    .getElementById("backToGrades")
    .addEventListener("click", showGradesPage);
  document
    .getElementById("calculateBtn")
    .addEventListener("click", calculateResult);
  document.getElementById("resetBtn").addEventListener("click", resetGrades);
  document
    .getElementById("newCalculation")
    .addEventListener("click", newCalculation);
  document
    .getElementById("autoFillBtn")
    .addEventListener("click", autoFillGrades);
  document.getElementById("shareBtn").addEventListener("click", shareResult);
  document.getElementById("printBtn").addEventListener("click", printResult);
  document
    .getElementById("contactBtn")
    .addEventListener("click", showContactModal);
  document
    .getElementById("aboutBtn")
    .addEventListener("click", showContactModal);

  // إضافة مستمعي الأحداث لأزرار اختيار المستوى السريع
  document.querySelectorAll(".quick-level").forEach((button) => {
    button.addEventListener("click", function () {
      const level = this.getAttribute("data-level");
      selectLevel(level);
    });
  });

  // إضافة مستمعي الأحداث لأزرار اختيار المستوى في صفحة الدرجات
  document.querySelectorAll(".btn-select-level").forEach((button) => {
    button.addEventListener("click", function () {
      const levelCard = this.closest(".level-card");
      const level = levelCard.getAttribute("data-level");
      selectLevel(level);
    });
  });

  // تبديل السمة (فاتح/غامق)
  themeToggle.addEventListener("click", toggleTheme);

  // التحكم في إظهار/إخفاء المعاملات
  if (showCoefficientToggle) {
    showCoefficientToggle.addEventListener(
      "change",
      toggleCoefficientsVisibility
    );
  }

  // إغلاق النافذة المنبثقة
  document.querySelector(".close-modal").addEventListener("click", closeModal);

  // إغلاق النافذة المنبثقة بالنقر خارجها
  window.addEventListener("click", function (event) {
    const modal = document.getElementById("contactModal");
    if (event.target === modal) {
      closeModal();
    }
  });

  // تحديث الملخص عند إدخال الدرجات
  document.addEventListener("input", updateSummary);

  // تهيئة الرسوم البيانية
  initChart();

  // تعيين السمة من التخزين المحلي
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    currentTheme = savedTheme;
    applyTheme();
  }

  // تحديث شريط التقدم
  updateProgressBar(1);
});

// تحديث شريط التقدم
function updateProgressBar(step) {
  progressSteps.forEach((stepEl, index) => {
    if (index < step) {
      stepEl.classList.add("active");
    } else {
      stepEl.classList.remove("active");
    }
  });
}

// اختيار المستوى الدراسي
function selectLevel(level) {
  currentLevel = level;

  // إخفاء قسم اختيار المستوى وإظهار قسم إدخال الدرجات
  if (levelSelectionSection && gradesInputSection) {
    levelSelectionSection.style.display = "none";
    gradesInputSection.style.display = "block";

    // تحديث وصف المستوى
    document.getElementById("levelDescription").textContent =
      levelDescriptions[currentLevel];

    // توليد حقول إدخال الدرجات
    generateGradeInputs();

    // التمرير إلى قسم إدخال الدرجات
    gradesInputSection.scrollIntoView({ behavior: "smooth" });
  }
}

// عرض صفحة إدخال الدرجات
function showGradesPage() {
  // إعادة تعيين قسم اختيار المستوى ليكون ظاهراً
  if (levelSelectionSection && gradesInputSection) {
    levelSelectionSection.style.display = "block";
    gradesInputSection.style.display = "none";
  }

  setActivePage("grades");
  updateProgressBar(2);
}

// عرض الصفحة الرئيسية
function showHomePage() {
  setActivePage("home");
  updateProgressBar(1);
}

// عرض صفحة النتيجة
function showResultPage() {
  setActivePage("result");
  updateProgressBar(3);
}

// تعيين الصفحة النشطة وإخفاء الباقي
function setActivePage(pageName) {
  // إخفاء جميع الصفحات
  Object.values(pages).forEach((page) => {
    page.classList.remove("active");
  });

  // إظهار الصفحة المطلوبة
  pages[pageName].classList.add("active");

  // التمرير إلى أعلى الصفحة
  window.scrollTo(0, 0);
}

// توليد حقول إدخال الدرجات حسب المستوى
function generateGradeInputs() {
  const subjectsList = document.getElementById("subjectsList");
  if (!subjectsList) return;

  subjectsList.innerHTML = "";

  // الحصول على المواد الخاصة بالمستوى الحالي
  const subjects = subjectsData[currentLevel];

  // إنشاء عنصر إدخال لكل مادة
  subjects.forEach((subject) => {
    const subjectItem = document.createElement("div");
    subjectItem.className = "subject-item";

    // الحصول على المعامل المحفوظ أو استخدام الافتراضي
    const coefficient = coefficients[subject.id] || subject.coefficient;
    coefficients[subject.id] = coefficient;

    subjectItem.innerHTML = `
            <div class="subject-name">${subject.name}</div>
            <input type="number" 
                   id="grade_${subject.id}" 
                   class="grade-input" 
                   min="0" 
                   max="20" 
                   step="0.25" 
                   placeholder="0-20"
                   value="${grades[subject.id] || ""}">
            <div class="coefficient-container" id="coeff_${subject.id}">
                <input type="number" 
                       id="coefficient_${subject.id}" 
                       class="coefficient-input" 
                       min="1" 
                       max="10" 
                       step="1" 
                       value="${coefficient}">
                <span class="coefficient-label">معامل</span>
            </div>
        `;

    subjectsList.appendChild(subjectItem);

    // إضافة مستمع الحدث لحقل الدرجة
    const gradeInput = document.getElementById(`grade_${subject.id}`);
    gradeInput.addEventListener("input", function () {
      validateGrade(subject.id, this.value);
    });

    // إضافة مستمع الحدث لحقل المعامل
    const coefficientInput = document.getElementById(
      `coefficient_${subject.id}`
    );
    coefficientInput.addEventListener("input", function () {
      updateCoefficient(subject.id, this.value);
    });

    // إذا كانت هناك قيمة محفوظة مسبقاً، التحقق منها
    if (grades[subject.id]) {
      validateGrade(subject.id, grades[subject.id]);
    }
  });

  // تحديث الملخص
  updateSummary();

  // تطبيق حالة إظهار/إخفاء المعاملات
  toggleCoefficientsVisibility();
}

// التحقق من صحة الدرجة المدخلة
function validateGrade(subjectId, value) {
  const input = document.getElementById(`grade_${subjectId}`);
  if (!input) return false;

  const numValue = parseFloat(value);

  if (value === "") {
    delete grades[subjectId];
    input.classList.remove("invalid");
    updateSummary();
    return false;
  }

  // إذا كانت القيمة غير رقمية أو خارج النطاق
  if (isNaN(numValue) || numValue < 0 || numValue > 20) {
    input.classList.add("invalid");
    return false;
  } else {
    grades[subjectId] = numValue;
    input.classList.remove("invalid");
    updateSummary();
    return true;
  }
}

// تحديث المعامل
function updateCoefficient(subjectId, value) {
  const numValue = parseInt(value);

  if (!isNaN(numValue) && numValue >= 1 && numValue <= 10) {
    coefficients[subjectId] = numValue;
    updateSummary();
  }
}

// إعادة تعيين جميع الدرجات
function resetGrades() {
  if (confirm("هل تريد مسح جميع الدرجات والمعاملات؟")) {
    grades = {};

    // إعادة تعيين المعاملات إلى الافتراضي
    if (currentLevel) {
      subjectsData[currentLevel].forEach((subject) => {
        coefficients[subject.id] = subject.coefficient;
      });
    }

    // إعادة توليد حقول الإدخال
    generateGradeInputs();
  }
}

// تعبئة تلقائية بالدرجات
function autoFillGrades() {
  if (!currentLevel) return;

  const subjects = subjectsData[currentLevel];

  subjects.forEach((subject) => {
    // توليد درجة عشوائية واقعية بين 10 و 18
    const randomGrade = (Math.random() * 8 + 10).toFixed(1);
    grades[subject.id] = parseFloat(randomGrade);

    // تحديث قيمة الحقل
    const gradeInput = document.getElementById(`grade_${subject.id}`);
    if (gradeInput) {
      gradeInput.value = randomGrade;
      gradeInput.classList.remove("invalid");
    }
  });

  updateSummary();
}

// تحديث ملخص الإدخال
function updateSummary() {
  const totalSubjectsEl = document.getElementById("totalSubjects");
  const totalCoefficientsEl = document.getElementById("totalCoefficients");
  const currentAverageEl = document.getElementById("currentAverage");

  if (!totalSubjectsEl || !totalCoefficientsEl || !currentAverageEl) return;

  const totalSubjects = Object.keys(grades).length;
  const totalCoefficients = Object.values(coefficients).reduce(
    (a, b) => a + b,
    0
  );

  totalSubjectsEl.textContent = totalSubjects;
  totalCoefficientsEl.textContent = totalCoefficients;

  // حساب المعدل الحالي
  let weightedSum = 0;
  let coefficientsSum = 0;

  for (const subjectId in grades) {
    const grade = grades[subjectId];
    const coefficient = coefficients[subjectId] || 1;

    if (!isNaN(grade)) {
      weightedSum += grade * coefficient;
      coefficientsSum += coefficient;
    }
  }

  const currentAverage =
    coefficientsSum > 0 ? (weightedSum / coefficientsSum).toFixed(2) : "0.00";
  currentAverageEl.textContent = currentAverage;
}

// حساب النتيجة
function calculateResult() {
  if (!currentLevel) {
    alert("الرجاء اختيار مستوى دراسي أولاً");
    return;
  }

  // التحقق من إدخال جميع الدرجات
  const subjects = subjectsData[currentLevel];
  let isValid = true;
  let missingSubjects = [];

  subjects.forEach((subject) => {
    const grade = grades[subject.id];
    if (grade === undefined || isNaN(grade)) {
      isValid = false;
      missingSubjects.push(subject.name);
    }
  });

  // إذا كان هناك خطأ في الإدخال
  if (!isValid) {
    if (missingSubjects.length > 0) {
      alert(
        `الرجاء إدخال درجات المواد التالية:\n${missingSubjects.join("\n")}`
      );
    } else {
      alert("الرجاء إدخال درجات صحيحة لجميع المواد (بين 0 و 20)");
    }
    return;
  }

  // حساب المعدل النهائي مع المعاملات
  let weightedSum = 0;
  let coefficientsSum = 0;
  let calculationDetails =
    "<table><tr><th>المادة</th><th>الدرجة</th><th>المعامل</th><th>الدرجة × المعامل</th></tr>";

  subjects.forEach((subject) => {
    const grade = grades[subject.id];
    const coefficient = coefficients[subject.id] || subject.coefficient;
    const weightedGrade = grade * coefficient;

    weightedSum += weightedGrade;
    coefficientsSum += coefficient;

    calculationDetails += `<tr>
            <td>${subject.name}</td>
            <td>${grade}/20</td>
            <td>${coefficient}</td>
            <td>${weightedGrade.toFixed(2)}</td>
        </tr>`;
  });

  calculationDetails += `<tr class="total-row">
        <td colspan="3"><strong>المجموع</strong></td>
        <td><strong>${weightedSum.toFixed(2)}</strong></td>
    </tr>`;
  calculationDetails += "</table>";

  const average = weightedSum / coefficientsSum;

  // حفظ تفاصيل الحساب
  document.getElementById("calculationDetails").innerHTML = calculationDetails;

  // عرض النتيجة
  displayResult(average);

  // تحديث الرسم البياني
  updateChart();

  // الانتقال إلى صفحة النتيجة
  showResultPage();
}

// عرض النتيجة
function displayResult(average) {
  const resultContent = document.getElementById("resultContent");
  const adviceCard = document.getElementById("adviceCard");

  if (!resultContent || !adviceCard) return;

  // تحديد التصنيف بناءً على المعدل
  let rating, message, iconClass, icon, colorClass, adviceList;

  if (average >= 15) {
    rating = "ممتاز 🔥";
    message = "أحسنت! أنت في قمة التميز الأكاديمي";
    iconClass = "excellent";
    icon = "fas fa-trophy";
    colorClass = "success";
    adviceList = adviceData.excellent;
  } else if (average >= 10) {
    rating = "جيد 👍";
    message = "أداؤك جيد، يمكنك التحسن أكثر ببعض الجهد الإضافي";
    iconClass = "good";
    icon = "fas fa-thumbs-up";
    colorClass = "warning";
    adviceList = adviceData.good;
  } else {
    rating = "يحتاج إلى تحسين ⚠️";
    message = "تحتاج لبذل المزيد من الجهد والتركيز على دراستك";
    iconClass = "need-improvement";
    icon = "fas fa-exclamation-triangle";
    colorClass = "danger";
    adviceList = adviceData.need_improvement;
  }

  // حالة النجاح/الرسوب
  const isPassing = average >= 10;
  const statusText = isPassing ? "ناجح 🎉" : "راسب 😔";
  const statusClass = isPassing ? "pass" : "fail";

  // إنشاء HTML لعرض النتيجة
  resultContent.innerHTML = `
        <div class="result-icon ${iconClass}">
            <i class="${icon}"></i>
        </div>
        
        <div class="result-average ${colorClass}">
            ${average.toFixed(2)}<span>/20</span>
        </div>
        
        <div class="result-rating">
            <h3>${rating}</h3>
            <p class="result-message">${message}</p>
        </div>
        
        <div class="result-status ${statusClass}">
            <i class="fas fa-${
              isPassing ? "check-circle" : "times-circle"
            }"></i>
            <span>${statusText}</span>
        </div>
        
        <div class="result-stats">
            <div class="stat">
                <span>مجموع الدرجات</span>
                <strong>${Object.values(grades)
                  .reduce((a, b) => a + b, 0)
                  .toFixed(2)}</strong>
            </div>
            <div class="stat">
                <span>مجموع المعاملات</span>
                <strong>${Object.values(coefficients).reduce(
                  (a, b) => a + b,
                  0
                )}</strong>
            </div>
            <div class="stat">
                <span>المعدل بالمعاملات</span>
                <strong>${average.toFixed(2)}</strong>
            </div>
        </div>
    `;

  // إنشاء HTML للنصائح
  adviceCard.innerHTML = `
        <h4><i class="fas fa-lightbulb"></i> نصائح لتحسين أدائك</h4>
        <ul class="advice-list">
            ${adviceList
              .map(
                (advice) => `<li><i class="fas fa-check"></i> ${advice}</li>`
              )
              .join("")}
        </ul>
    `;
}

// إخفاء/إظهار المعاملات
function toggleCoefficientsVisibility() {
  const isVisible = showCoefficientToggle.checked;
  const coefficientContainers = document.querySelectorAll(
    ".coefficient-container"
  );

  coefficientContainers.forEach((container) => {
    container.style.display = isVisible ? "flex" : "none";
  });
}

// بدء حساب جديد
function newCalculation() {
  // إعادة تعيين جميع البيانات
  currentLevel = "";
  grades = {};
  coefficients = {};

  // العودة إلى الصفحة الرئيسية
  showHomePage();

  // إعادة تعيين شريط التقدم
  updateProgressBar(1);
}

// مشاركة النتيجة
function shareResult() {
  const averageEl = document.querySelector(".result-average");
  const ratingEl = document.querySelector(".result-rating h3");

  if (!averageEl || !ratingEl) return;

  const average = averageEl.textContent;
  const rating = ratingEl.textContent;

  const text = `حصلت على معدل ${average} - ${rating}\nجرب حاسبة المعدل الدراسي: ${window.location.href}`;

  if (navigator.share) {
    navigator.share({
      title: "نتيجة حساب المعدل الدراسي",
      text: text,
      url: window.location.href,
    });
  } else {
    // نسخ النص إلى الحافظة
    navigator.clipboard.writeText(text).then(() => {
      alert("تم نسخ النتيجة إلى الحافظة، يمكنك مشاركتها الآن");
    });
  }
}

// طباعة النتيجة
function printResult() {
  window.print();
}

// عرض نافذة التواصل
function showContactModal() {
  document.getElementById("contactModal").classList.add("active");
}

// إغلاق النافذة المنبثقة
function closeModal() {
  document.getElementById("contactModal").classList.remove("active");
}

// تبديل السمة (فاتح/غامق)
function toggleTheme() {
  currentTheme = currentTheme === "light" ? "dark" : "light";
  applyTheme();
  localStorage.setItem("theme", currentTheme);
}

// تطبيق السمة
function applyTheme() {
  document.body.setAttribute("data-theme", currentTheme);
  themeIcon.className = currentTheme === "light" ? "fas fa-moon" : "fas fa-sun";
}

// الرسم البياني
let gradesChart = null;

function initChart() {
  const canvas = document.getElementById("gradesChart");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  gradesChart = new Chart(ctx, {
    type: "bar",
    data: {
      labels: [],
      datasets: [
        {
          label: "الدرجات",
          data: [],
          backgroundColor: "rgba(67, 97, 238, 0.7)",
          borderColor: "rgba(67, 97, 238, 1)",
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          max: 20,
          ticks: {
            callback: function (value) {
              return value + "/20";
            },
          },
        },
      },
      plugins: {
        legend: {
          display: false,
        },
      },
    },
  });
}

function updateChart() {
  if (!currentLevel || !gradesChart) return;

  const subjects = subjectsData[currentLevel];
  const labels = [];
  const data = [];

  subjects.forEach((subject) => {
    const grade = grades[subject.id];
    if (grade !== undefined) {
      labels.push(subject.name);
      data.push(grade);
    }
  });

  gradesChart.data.labels = labels;
  gradesChart.data.datasets[0].data = data;
  gradesChart.update();
}
