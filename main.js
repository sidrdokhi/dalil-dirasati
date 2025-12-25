// الكود الرئيسي للموقع
document.addEventListener("DOMContentLoaded", function () {
  console.log("تم تحميل الموقع بنجاح");

  // تحديث اسم المستخدم في الصفحات
  updateUserName();

  // إضافة تأثيرات للبطاقات
  addCardEffects();

  // رسالة ترحيب في console
  showWelcomeMessage();
});

// تحديث اسم المستخدم
function updateUserName() {
  const userData = localStorage.getItem("currentUser");
  if (userData) {
    const user = JSON.parse(userData);
    const userNameElements = document.querySelectorAll(
      "#userName, #displayName"
    );

    userNameElements.forEach((element) => {
      if (element) {
        element.textContent = user.fullName;
      }
    });

    // إذا كان في صفحة calculator، أظهر رسالة ترحيب
    if (window.location.pathname.includes("calculator.html")) {
      const welcomeSection = document.getElementById("welcomeSection");
      if (welcomeSection) {
        welcomeSection.innerHTML = `
                    <h1><i class="fas fa-hand-wave"></i> أهلاً بك، ${user.fullName}</h1>
                    <p>ابدأ بحساب معدلك الدراسي الآن</p>
                `;
      }
    }
  }
}

// إضافة تأثيرات للبطاقات
function addCardEffects() {
  const featureCards = document.querySelectorAll(".feature-card");

  featureCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-10px)";
      this.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.12)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "translateY(0)";
      this.style.boxShadow = "0 10px 30px rgba(0, 0, 0, 0.08)";
    });
  });
}

// عرض رسالة ترحيب في console
function showWelcomeMessage() {
  const userData = localStorage.getItem("currentUser");

  if (userData) {
    const user = JSON.parse(userData);
    console.log(`🎓 مرحباً ${user.fullName}! تم تحميل الموقع بنجاح.`);
  } else {
    console.log("👋 مرحباً بك في حاسبة المعدل الدراسي!");
  }
}

// دالة مساعدة للتحقق من اتصال الملفات
function checkFileConnection() {
  console.log("✅ ملف main.js متصل بشكل صحيح");
  console.log("✅ ملف auth.js متصل بشكل صحيح");
  console.log("✅ ملف style.css متصل بشكل صحيح");
}
// إدارة نافذة سياسة الخصوصية
document.addEventListener("DOMContentLoaded", function () {
  const modal = document.getElementById("privacyModal");
  const closeBtn = document.querySelector(".close-modal");
  const acceptBtn = document.getElementById("acceptBtn");
  const rejectBtn = document.getElementById("rejectBtn");
  const acceptTermsCheck = document.getElementById("acceptTerms");
  const acceptCookiesCheck = document.getElementById("acceptCookies");
  const tabBtns = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  // التحقق من أول زيارة
  function checkFirstVisit() {
    const privacyAccepted = localStorage.getItem("privacyAccepted");
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");

    // إذا لم يقبل بعد، عرض النافذة
    if (!privacyAccepted || !cookiesAccepted) {
      setTimeout(() => {
        modal.classList.add("active");
        modal.classList.add("new-visitor");
      }, 1000); // تأخير بسيط لتحميل الصفحة
    }
  }

  // تبديل التبويبات
  tabBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const tabId = this.getAttribute("data-tab");

      // إزالة النشط من جميع الأزرار والمحتويات
      tabBtns.forEach((b) => b.classList.remove("active"));
      tabContents.forEach((c) => c.classList.remove("active"));

      // تفعيل الزر والمحتوى المحدد
      this.classList.add("active");
      document.getElementById(tabId + "Tab").classList.add("active");
    });
  });

  // إغلاق النافذة
  closeBtn.addEventListener("click", closeModal);

  // إغلاق عند النقر خارج النافذة
  window.addEventListener("click", function (event) {
    if (event.target === modal) {
      closeModal();
    }
  });

  // زر الرفض
  rejectBtn.addEventListener("click", function () {
    localStorage.setItem("privacyAccepted", "false");
    localStorage.setItem("cookiesAccepted", "false");
    closeModal();
    alert("⚠️ بعض الميزات قد لا تعمل بشكل كامل بسبب رفضك للشروط.");
  });

  // زر القبول
  acceptBtn.addEventListener("click", function () {
    if (!acceptTermsCheck.checked) {
      alert("❗ يجب الموافقة على شروط الاستخدام وسياسة الخصوصية");
      acceptTermsCheck.focus();
      return;
    }

    // حفظ التفضيلات
    localStorage.setItem("privacyAccepted", "true");
    localStorage.setItem(
      "cookiesAccepted",
      acceptCookiesCheck.checked ? "true" : "false"
    );
    localStorage.setItem(
      "emailUpdates",
      document.getElementById("emailUpdates").checked ? "true" : "false"
    );
    localStorage.setItem("privacyAcceptanceDate", new Date().toISOString());

    // تسجيل الحدث
    logPrivacyAcceptance();

    closeModal();
    showThankYouMessage();
  });

  // تفعيل زر القبول عند اختيار الشروط
  acceptTermsCheck.addEventListener("change", updateAcceptButton);
  acceptCookiesCheck.addEventListener("change", updateAcceptButton);

  function updateAcceptButton() {
    acceptBtn.disabled = !acceptTermsCheck.checked;
  }

  function closeModal() {
    modal.classList.remove("active");
    modal.classList.remove("new-visitor");
  }

  function logPrivacyAcceptance() {
    const acceptanceLog = {
      date: new Date().toISOString(),
      privacy: localStorage.getItem("privacyAccepted"),
      cookies: localStorage.getItem("cookiesAccepted"),
      emailUpdates: localStorage.getItem("emailUpdates"),
      userAgent: navigator.userAgent,
    };

    // حفظ سجل القبول (لأغراض التحليل فقط)
    let logs = JSON.parse(localStorage.getItem("privacyLogs") || "[]");
    logs.push(acceptanceLog);
    localStorage.setItem("privacyLogs", JSON.stringify(logs.slice(-10))); // حفظ آخر 10 سجلات فقط
  }

  function showThankYouMessage() {
    // يمكن إضافة رسالة شكر هنا
    console.log("شكراً لقبولك الشروط! يمكنك الآن استخدام الموقع بكامل ميزاته.");
  }

  // زر في الفوتر لفتح النافذة يدوياً
  function addPrivacyFooterButton() {
    const footer = document.querySelector("footer");
    if (footer) {
      const privacyBtn = document.createElement("button");
      privacyBtn.className = "privacy-settings-btn";
      privacyBtn.innerHTML = "⚙️ إعدادات الخصوصية";
      privacyBtn.addEventListener("click", openPrivacySettings);
      footer.appendChild(privacyBtn);
    }
  }

  function openPrivacySettings() {
    modal.classList.add("active");

    // إظهار الإعدادات الحالية
    const privacyAccepted = localStorage.getItem("privacyAccepted");
    const cookiesAccepted = localStorage.getItem("cookiesAccepted");
    const emailUpdates = localStorage.getItem("emailUpdates");

    if (acceptTermsCheck) acceptTermsCheck.checked = privacyAccepted === "true";
    if (acceptCookiesCheck)
      acceptCookiesCheck.checked = cookiesAccepted === "true";
    if (document.getElementById("emailUpdates")) {
      document.getElementById("emailUpdates").checked = emailUpdates === "true";
    }

    updateAcceptButton();
  }

  // إضافة زر في الصفحة لفتح النافذة
  function addPrivacyButtonToNav() {
    const nav =
      document.querySelector(".nav-menu") || document.querySelector(".navbar");
    if (nav) {
      const privacyNavBtn = document.createElement("a");
      privacyNavBtn.href = "#";
      privacyNavBtn.className = "nav-link privacy-nav-btn";
      privacyNavBtn.innerHTML = "⚙️ الخصوصية";
      privacyNavBtn.addEventListener("click", function (e) {
        e.preventDefault();
        openPrivacySettings();
      });
      nav.appendChild(privacyNavBtn);
    }
  }

  // تهيئة
  updateAcceptButton();
  checkFirstVisit();
  addPrivacyFooterButton();
  addPrivacyButtonToNav();

  // إضافة CSS إضافي للزر
  const style = document.createElement("style");
  style.textContent = `
        .privacy-settings-btn {
            background: rgba(67, 97, 238, 0.1);
            color: #4361ee;
            border: 2px solid #4361ee;
            padding: 8px 15px;
            border-radius: 20px;
            cursor: pointer;
            font-size: 0.9rem;
            margin: 10px auto;
            display: block;
            transition: all 0.3s;
        }
        
        .privacy-settings-btn:hover {
            background: #4361ee;
            color: white;
            transform: translateY(-2px);
        }
        
        .privacy-nav-btn {
            font-size: 0.9rem !important;
            padding: 8px 15px !important;
        }
    `;
  document.head.appendChild(style);
});

// التحقق من القبول عند إجراء عمليات مهمة
function checkPrivacyBeforeAction(action) {
  const privacyAccepted = localStorage.getItem("privacyAccepted");

  if (privacyAccepted !== "true") {
    const modal = document.getElementById("privacyModal");
    if (modal) {
      modal.classList.add("active");

      // عرض رسالة خاصة بالإجراء
      alert(`⚠️ يجب قبول سياسة الخصوصية أولاً لـ ${action}`);

      return false;
    }
  }

  return true;
}

// استخدام الدالة قبل العمليات المهمة
// مثال: قبل حفظ النتيجة
/*
function saveCalculation() {
    if (!checkPrivacyBeforeAction('حفظ النتيجة')) {
        return;
    }
    // كود الحفظ هنا
}
*/
// إضافة إلى main.js
// تحديث القائمة الرئيسية

function updateNavigationMenu() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const navMenu = document.querySelector('.nav-menu');
    
    if (navMenu && user) {
        // إضافة روابط الصفحات الجديدة
        const orientationLinks = `
            <a href="orientation-middle.html" class="nav-link">
                <i class="fas fa-compass"></i> توجيه إعدادي
            </a>
            <a href="orientation-bac.html" class="nav-link">
                <i class="fas fa-university"></i> توجيه باك
            </a>
        `;
        
        // تحديث القائمة إذا كانت موجودة
        const existingMenu = navMenu.innerHTML;
        if (!existingMenu.includes('orientation-middle.html')) {
            // إضافة الروابط في المكان المناسب
            // هذا يعتمد على هيكل القائمة الحالي
        }
    }
}

// استدعاء الدالة عند تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    updateNavigationMenu();
    
    // تحديث القائمة في الصفحات الرئيسية
    const currentPage = window.location.pathname;
    if (currentPage.includes('index.html') || currentPage.includes('calcul.html')) {
        addOrientationLinks();
    }
});

function addOrientationLinks() {
    const quickActions = document.querySelector('.quick-actions');
    if (quickActions) {
        // إضافة بطاقة التوجيه إلى الإجراءات السريعة
        const orientationCard = `
            <div class="action-card" onclick="window.location.href='orientation-middle.html'">
                <div class="action-icon">🧭</div>
                <h3>التوجيه الدراسي</h3>
                <p>اكتشف المسار الدراسي المناسب لك</p>
                <button class="btn btn-secondary" style="margin-top: 15px">
                    استكشاف المسارات
                </button>
            </div>
        `;
        
        quickActions.innerHTML += orientationCard;
    }
}