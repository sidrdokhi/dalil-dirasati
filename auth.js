// نظام تسجيل الدخول والتسجيل
document.addEventListener("DOMContentLoaded", function () {
  console.log("تم تحميل نظام التسجيل");

  // === المتغيرات العامة ===
  let currentUser = null;

  // === تحميل المستخدم الحالي ===
  function loadCurrentUser() {
    const userData = localStorage.getItem("currentUser");
    if (userData) {
      currentUser = JSON.parse(userData);
      console.log("المستخدم الحالي:", currentUser);
      updateNavigation();
    }
  }

  // === تحديث شريط التنقل ===
  function updateNavigation() {
    const navUser = document.getElementById("navUser");
    const userName = document.getElementById("userName");
    const displayName = document.getElementById("displayName");

    if (currentUser && navUser) {
      navUser.style.display = "flex";
      if (userName) userName.textContent = currentUser.fullName;
      if (displayName) displayName.textContent = currentUser.fullName;
    }
  }

  // === تسجيل مستخدم جديد ===
  function register(userData) {
    try {
      // التحقق من البيانات
      if (
        !userData.fullName ||
        !userData.email ||
        !userData.password ||
        !userData.confirmPassword ||
        !userData.level
      ) {
        return { success: false, message: "الرجاء تعبئة جميع الحقول" };
      }

      if (userData.password.length < 8) {
        return {
          success: false,
          message: "كلمة المرور يجب أن تكون 8 أحرف على الأقل",
        };
      }

      if (userData.password !== userData.confirmPassword) {
        return { success: false, message: "كلمتا المرور غير متطابقتين" };
      }

      if (!userData.terms) {
        return { success: false, message: "يجب الموافقة على الشروط" };
      }

      // الحصول على المستخدمين الحاليين
      const users = getUsers();

      // التحقق من عدم وجود حساب بنفس البريد
      if (users.some((user) => user.email === userData.email)) {
        return { success: false, message: "هذا البريد الإلكتروني مسجل بالفعل" };
      }

      // إنشاء المستخدم الجديد
      const newUser = {
        id: Date.now(),
        fullName: userData.fullName,
        email: userData.email,
        password: userData.password,
        level: userData.level,
        createdAt: new Date().toISOString(),
        calculations: [],
      };

      // إضافة المستخدم
      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      // تسجيل الدخول تلقائياً
      currentUser = newUser;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      return {
        success: true,
        message: "تم إنشاء الحساب بنجاح!",
        redirectTo: "calculator.html",
      };
    } catch (error) {
      console.error("خطأ في التسجيل:", error);
      return { success: false, message: "حدث خطأ غير متوقع" };
    }
  }

  // === تسجيل الدخول ===
  function login(email, password, rememberMe = false) {
    try {
      if (!email || !password) {
        return {
          success: false,
          message: "الرجاء إدخال البريد الإلكتروني وكلمة المرور",
        };
      }

      const users = getUsers();
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (!user) {
        return {
          success: false,
          message: "البريد الإلكتروني أو كلمة المرور غير صحيحة",
        };
      }

      // تسجيل الدخول
      currentUser = user;
      localStorage.setItem("currentUser", JSON.stringify(currentUser));

      // حفظ تذكرني
      if (rememberMe) {
        localStorage.setItem("rememberMe", "true");
      }

      return {
        success: true,
        message: "تم تسجيل الدخول بنجاح!",
        redirectTo: "calculator.html",
      };
    } catch (error) {
      console.error("خطأ في تسجيل الدخول:", error);
      return { success: false, message: "حدث خطأ غير متوقع" };
    }
  }

  // === تسجيل الخروج ===
  function logout() {
    currentUser = null;
    localStorage.removeItem("currentUser");
    window.location.href = "index.html";
  }

  // === الحصول على جميع المستخدمين ===
  function getUsers() {
    const users = localStorage.getItem("users");
    return users ? JSON.parse(users) : [];
  }

  // === التحقق مما إذا كان المستخدم مسجلاً ===
  function isAuthenticated() {
    return currentUser !== null;
  }

  // === معالجة نموذج التسجيل ===
  async function handleRegistration() {
    const form = document.getElementById("registerForm");
    if (!form) return;

    const formData = {
      fullName: form.fullName.value.trim(),
      email: form.email.value.trim().toLowerCase(),
      password: form.password.value,
      confirmPassword: form.confirmPassword.value,
      level: form.level.value,
      terms: form.terms.checked,
    };

    const result = register(formData);

    if (result.success) {
      alert("✅ " + result.message);
      setTimeout(() => {
        window.location.href = result.redirectTo;
      }, 1500);
    } else {
      alert("❌ " + result.message);
    }
  }

  // === معالجة نموذج تسجيل الدخول ===
  async function handleLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return;

    const email = form.email.value.trim().toLowerCase();
    const password = form.password.value;
    const rememberMe = form.remember ? form.remember.checked : false;

    const result = login(email, password, rememberMe);

    if (result.success) {
      alert("✅ " + result.message);
      setTimeout(() => {
        window.location.href = result.redirectTo;
      }, 1500);
    } else {
      alert("❌ " + result.message);
    }
  }

  // === إعداد إظهار/إخفاء كلمة المرور ===
  function setupPasswordVisibility() {
    const showPasswordBtns = document.querySelectorAll(".show-password");

    showPasswordBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        const input = this.parentElement.querySelector("input");
        const icon = this.querySelector("i");

        if (input.type === "password") {
          input.type = "text";
          icon.classList.remove("fa-eye");
          icon.classList.add("fa-eye-slash");
        } else {
          input.type = "password";
          icon.classList.remove("fa-eye-slash");
          icon.classList.add("fa-eye");
        }
      });
    });
  }

  // === إعداد مستمعي الأحداث ===
  function setupEventListeners() {
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById("logoutBtn");
    if (logoutBtn) {
      logoutBtn.addEventListener("click", logout);
    }

    // نموذج التسجيل
    const registerForm = document.getElementById("registerForm");
    if (registerForm) {
      registerForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleRegistration();
      });
    }

    // نموذج تسجيل الدخول
    const loginForm = document.getElementById("loginForm");
    if (loginForm) {
      loginForm.addEventListener("submit", function (e) {
        e.preventDefault();
        handleLogin();
      });
    }

    // إعداد إظهار/إخفاء كلمة المرور
    setupPasswordVisibility();
  }

  // === التحقق من الصفحات المحمية ===
  function checkProtectedPages() {
    const currentPage = window.location.pathname;

    // الصفحات التي تتطلب تسجيل دخول
    const protectedPages = ["calcul.html", "profile.html", "history.html"];

    // إذا كانت الصفحة الحالية محمية والمستخدم غير مسجل
    if (protectedPages.some((page) => currentPage.includes(page))) {
      if (!isAuthenticated()) {
        window.location.href = "login.html";
        return false;
      }
    }

    // إذا كان المستخدم مسجلاً ويحاول الوصول لصفحات التسجيل
    if (
      currentPage.includes("login.html") ||
      currentPage.includes("register.html")
    ) {
      if (isAuthenticated()) {
        window.location.href = "calcul.html";
        return false;
      }
    }

    return true;
  }

  // === تهيئة النظام ===
  function init() {
    loadCurrentUser();
    setupEventListeners();

    if (checkProtectedPages()) {
      updateNavigation();
    }

    console.log("تم تهيئة نظام المصادقة بنجاح");
  }

  // === تهيئة النظام عند تحميل الصفحة ===
  init();

  // === جعل الدوال متاحة عالمياً ===
  window.authSystem = {
    getCurrentUser: () => currentUser,
    isAuthenticated: isAuthenticated,
    logout: logout,
  };
});
