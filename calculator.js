// نظام حساب المعدل
class GradeCalculator {
  constructor() {
    this.subjects = [];
    this.currentLevel = "middle";
    this.init();
  }

  init() {
    this.setupEventListeners();
    this.generateDefaultSubjects();
    this.updateSummary();
  }

  setupEventListeners() {
    // اختيار المستوى
    document.querySelectorAll(".level-btn").forEach((btn) => {
      btn.addEventListener("click", (e) => {
        this.changeLevel(e.currentTarget.dataset.level);
      });
    });

    // إضافة مادة
    document.getElementById("addSubjectBtn")?.addEventListener("click", () => {
      this.addSubject();
    });

    // تعبئة عشوائية
    document.getElementById("autoFillBtn")?.addEventListener("click", () => {
      this.autoFillGrades();
    });

    // حساب المعدل
    document.getElementById("calculateBtn")?.addEventListener("click", () => {
      this.calculateAverage();
    });

    // حفظ النتيجة
    document.getElementById("saveResultBtn")?.addEventListener("click", () => {
      this.saveCalculation();
    });

    // حساب جديد
    document
      .getElementById("newCalculationBtn")
      ?.addEventListener("click", () => {
        this.resetCalculator();
      });

    // طباعة
    document.getElementById("printBtn")?.addEventListener("click", () => {
      window.print();
    });
  }

  changeLevel(level) {
    this.currentLevel = level;

    // تحديث الأزرار
    document.querySelectorAll(".level-btn").forEach((btn) => {
      btn.classList.toggle("active", btn.dataset.level === level);
    });

    this.generateDefaultSubjects();
  }

  generateDefaultSubjects() {
    this.subjects = [];

    const subjectsData = {
      primary: [
        { name: "اللغة العربية", coefficient: 2 },
        { name: "الرياضيات", coefficient: 2 },
        { name: "اللغة الفرنسية", coefficient: 1 },
        { name: "اللغة الإنجليزية", coefficient: 1 },
        { name: "التربية الإسلامية", coefficient: 1 },
        { name: "الاجتماعيات", coefficient: 1 },
        { name: "العلوم", coefficient: 1 },
        { name: "النشاط العلمي", coefficient: 1 },
      ],
      middle: [
        { name: "اللغة العربية", coefficient: 3 },
        { name: "اللغة الفرنسية", coefficient: 2 },
        { name: "اللغة الإنجليزية", coefficient: 2 },
        { name: "الرياضيات", coefficient: 3 },
        { name: "الفيزياء والكيمياء", coefficient: 2 },
        { name: "علوم الحياة والأرض", coefficient: 2 },
        { name: "التربية الإسلامية", coefficient: 1 },
        { name: "الاجتماعيات", coefficient: 1 },
        { name: "التربية الفنية", coefficient: 1 },
        { name: "التربية البدنية", coefficient: 1 },
      ],
      secondary: [
        { name: "اللغة العربية", coefficient: 3 },
        { name: "اللغة الفرنسية", coefficient: 2 },
        { name: "اللغة الإنجليزية", coefficient: 2 },
        { name: "الرياضيات", coefficient: 4 },
        { name: "الفيزياء", coefficient: 3 },
        { name: "الكيمياء", coefficient: 3 },
        { name: "علوم الحياة والأرض", coefficient: 3 },
        { name: "الفلسفة", coefficient: 1 },
        { name: "التاريخ والجغرافيا", coefficient: 1 },
        { name: "التربية الإسلامية", coefficient: 1 },
      ],
    };

    const subjects = subjectsData[this.currentLevel] || subjectsData.middle;

    subjects.forEach((subject, index) => {
      this.subjects.push({
        id: index + 1,
        name: subject.name,
        grade: "",
        coefficient: subject.coefficient,
      });
    });

    this.renderSubjects();
  }

  renderSubjects() {
    const container = document.getElementById("subjectsList");
    if (!container) return;

    container.innerHTML = "";

    this.subjects.forEach((subject) => {
      const subjectElement = this.createSubjectElement(subject);
      container.appendChild(subjectElement);
    });

    this.updateSummary();
  }

  createSubjectElement(subject) {
    const div = document.createElement("div");
    div.className = "subject-item";
    div.innerHTML = `
            <div class="subject-name">${subject.name}</div>
            <input type="number" 
                   class="grade-input" 
                   value="${subject.grade || ""}" 
                   min="0" 
                   max="20" 
                   step="0.25" 
                   placeholder="0-20"
                   data-id="${subject.id}">
            <div class="subject-actions">
                <button class="btn-remove" data-id="${subject.id}">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

    // مستمع الحدث لحقل الدرجة
    const input = div.querySelector(".grade-input");
    input.addEventListener("input", (e) => {
      this.updateSubjectGrade(subject.id, e.target.value);
    });

    // مستمع الحدث لزر الحذف
    const removeBtn = div.querySelector(".btn-remove");
    removeBtn.addEventListener("click", () => {
      this.removeSubject(subject.id);
    });

    return div;
  }

  updateSubjectGrade(id, grade) {
    const subject = this.subjects.find((s) => s.id === id);
    if (subject) {
      subject.grade = grade;
      this.updateSummary();
    }
  }

  addSubject() {
    const newId =
      this.subjects.length > 0
        ? Math.max(...this.subjects.map((s) => s.id)) + 1
        : 1;

    this.subjects.push({
      id: newId,
      name: `مادة جديدة ${newId}`,
      grade: "",
      coefficient: 1,
    });

    this.renderSubjects();
  }

  removeSubject(id) {
    if (this.subjects.length > 1) {
      this.subjects = this.subjects.filter((s) => s.id !== id);
      this.renderSubjects();
    } else {
      alert("يجب أن يكون هناك مادة واحدة على الأقل");
    }
  }

  autoFillGrades() {
    this.subjects.forEach((subject) => {
      const randomGrade = (Math.random() * 10 + 10).toFixed(2);
      subject.grade = randomGrade;
    });

    this.renderSubjects();
  }

  updateSummary() {
    const totalSubjects = this.subjects.length;
    const average = this.calculateCurrentAverage();

    document.getElementById("totalSubjects").textContent = totalSubjects;
    document.getElementById("currentAverage").textContent = average.toFixed(2);

    const statusElement = document.getElementById("currentStatus");
    if (statusElement) {
      statusElement.textContent = this.getStatusText(average);
      statusElement.className = "status " + (average >= 10 ? "pass" : "fail");
    }
  }

  calculateCurrentAverage() {
    let totalWeightedGrade = 0;
    let totalCoefficient = 0;
    let gradedSubjects = 0;

    this.subjects.forEach((subject) => {
      const grade = parseFloat(subject.grade);
      if (!isNaN(grade) && grade >= 0 && grade <= 20) {
        totalWeightedGrade += grade * subject.coefficient;
        totalCoefficient += subject.coefficient;
        gradedSubjects++;
      }
    });

    if (totalCoefficient === 0 || gradedSubjects === 0) {
      return 0;
    }

    return totalWeightedGrade / totalCoefficient;
  }

  calculateAverage() {
    const invalidSubjects = this.subjects.filter((subject) => {
      const grade = parseFloat(subject.grade);
      return isNaN(grade) || grade < 0 || grade > 20;
    });

    if (invalidSubjects.length > 0) {
      alert("الرجاء إدخال درجات صحيحة لجميع المواد (بين 0 و 20)");
      return;
    }

    const average = this.calculateCurrentAverage();
    const status = this.getStatusText(average);
    const gradeText = this.getGradeText(average);

    this.displayResult(average, status, gradeText);
  }

  displayResult(average, status, gradeText) {
    const resultSection = document.getElementById("resultSection");
    const finalAverage = document.getElementById("finalAverage");
    const resultGrade = document.getElementById("resultGrade");
    const finalStatus = document.getElementById("finalStatus");
    const resultDate = document.getElementById("resultDate");
    const subjectsDetails = document.getElementById("subjectsDetails");

    if (!resultSection || !finalAverage) return;

    finalAverage.textContent = average.toFixed(2);
    resultGrade.textContent = gradeText;
    finalStatus.textContent = status;
    finalStatus.className =
      "result-status " + (average >= 10 ? "pass" : "fail");
    resultDate.textContent = new Date().toLocaleDateString("ar-SA");

    subjectsDetails.innerHTML = "";
    this.subjects.forEach((subject) => {
      const grade = parseFloat(subject.grade);
      const div = document.createElement("div");
      div.className = "subject-detail";
      div.innerHTML = `
                <span>${subject.name}</span>
                <span>${grade.toFixed(2)} / 20 (معامل: ${
        subject.coefficient
      })</span>
            `;
      subjectsDetails.appendChild(div);
    });

    resultSection.style.display = "block";
    resultSection.scrollIntoView({ behavior: "smooth" });
  }

  saveCalculation() {
    const average = this.calculateCurrentAverage();
    const status = this.getStatusText(average);

    const calculation = {
      id: Date.now(),
      date: new Date().toISOString(),
      level: this.currentLevel,
      subjects: [...this.subjects],
      average: average,
      status: status,
    };

    let calculations = JSON.parse(localStorage.getItem("calculations")) || [];
    calculations.unshift(calculation);
    localStorage.setItem("calculations", JSON.stringify(calculations));

    alert("✅ تم حفظ الحساب بنجاح");
  }

  resetCalculator() {
    this.subjects.forEach((subject) => {
      subject.grade = "";
    });

    this.renderSubjects();

    const resultSection = document.getElementById("resultSection");
    if (resultSection) {
      resultSection.style.display = "none";
    }
  }

  getStatusText(average) {
    if (average >= 15) return "ممتاز";
    if (average >= 10) return "ناجح";
    return "راسب";
  }

  getGradeText(average) {
    if (average >= 18) return "امتياز 🏆";
    if (average >= 16) return "جيد جداً 🥈";
    if (average >= 14) return "جيد 👍";
    if (average >= 12) return "مقبول 😊";
    if (average >= 10) return "ضعيف ⚠️";
    return "ضعيف جداً ❌";
  }
}

// تهيئة الحاسبة
document.addEventListener("DOMContentLoaded", () => {
  if (window.location.pathname.includes("calculator.html")) {
    window.calculator = new GradeCalculator();
  }
});
