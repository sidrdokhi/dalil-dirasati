// نظام التوجيه الدراسي
document.addEventListener("DOMContentLoaded", function () {
    console.log("تم تحميل نظام التوجيه");
    
    // تحميل المستخدم الحالي
    loadCurrentUser();
    
    // إعداد مستمعي الأحداث
    setupOrientationEvents();
    
    // تحميل الأسئلة إذا كانت الصفحة تحتوي على اختبار
    if (document.getElementById('questionContainer')) {
        loadTestQuestions();
    }
});

// تحميل المستخدم الحالي
function loadCurrentUser() {
    const userData = localStorage.getItem('currentUser');
    if (userData) {
        const user = JSON.parse(userData);
        document.getElementById('userName').textContent = user.fullName;
    }
}

// إعداد مستمعي الأحداث
function setupOrientationEvents() {
    // زر تسجيل الخروج
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function() {
            if (confirm('هل تريد تسجيل الخروج؟')) {
                localStorage.removeItem('currentUser');
                window.location.href = 'index.html';
            }
        });
    }
    
    // زر العودة
    const backBtn = document.getElementById('backBtn');
    if (backBtn) {
        backBtn.addEventListener('click', function() {
            window.history.back();
        });
    }
}

// ===== نظام اختبار التوجيه بعد الإعدادي =====
let currentQuestion = 0;
let userAnswers = {};
let testQuestions = [];

// أسئلة اختبار التوجيه
const middleQuestions = [
    {
        id: 1,
        question: "ما هي المواد الدراسية التي تستمتع بدراستها أكثر؟",
        options: [
            { id: 'A', text: "الرياضيات والعلوم", score: { scientific: 3, technical: 2 } },
            { id: 'B', text: "اللغات والأدب", score: { literary: 3, original: 2 } },
            { id: 'C', text: "الرسم والفنون", score: { technical: 3, literary: 1 } },
            { id: 'D', text: "التربية الإسلامية والقرآن", score: { original: 3, literary: 2 } }
        ]
    },
    {
        id: 2,
        question: "كيف تفضل قضاء وقت فراغك؟",
        options: [
            { id: 'A', text: "قراءة الكتب العلمية", score: { scientific: 3 } },
            { id: 'B', text: "الكتابة والتأليف", score: { literary: 3 } },
            { id: 'C', text: "التصميم والبرمجة", score: { technical: 3 } },
            { id: 'D', text: "دراسة العلوم الشرعية", score: { original: 3 } }
        ]
    },
    {
        id: 3,
        question: "ما هي مهاراتك الأقوى؟",
        options: [
            { id: 'A', text: "التحليل والتفكير المنطقي", score: { scientific: 3, technical: 2 } },
            { id: 'B', text: "التعبير والتواصل", score: { literary: 3, original: 1 } },
            { id: 'C', text: "الإبداع والتصميم", score: { technical: 3, literary: 1 } },
            { id: 'D', text: "الحفظ والفهم السريع", score: { original: 3, literary: 2 } }
        ]
    },
    {
        id: 4,
        question: "ما هو حلمك المهني المستقبلي؟",
        options: [
            { id: 'A', text: "طبيب أو مهندس", score: { scientific: 3 } },
            { id: 'B', text: "كاتب أو صحفي", score: { literary: 3 } },
            { id: 'C', text: "تقني أو مصمم", score: { technical: 3 } },
            { id: 'D', text: "عالم دين أو قاضي", score: { original: 3 } }
        ]
    },
    {
        id: 5,
        question: "كيف تتعامل مع المشكلات؟",
        options: [
            { id: 'A', text: "أحللها خطوة بخطوة", score: { scientific: 3, technical: 2 } },
            { id: 'B', text: "أبحث عن حلول إبداعية", score: { literary: 3, technical: 1 } },
            { id: 'C', text: "أستخدم الأدوات والتقنيات", score: { technical: 3 } },
            { id: 'D', text: "أستشير المراجع الموثوقة", score: { original: 3, literary: 1 } }
        ]
    }
];

// تحميل الأسئلة
function loadTestQuestions() {
    testQuestions = middleQuestions;
    showQuestion(currentQuestion);
}

// عرض السؤال
function showQuestion(index) {
    if (index >= testQuestions.length) {
        return;
    }
    
    const question = testQuestions[index];
    const questionContainer = document.getElementById('questionContainer');
    const optionsContainer = document.getElementById('optionsContainer');
    const progressText = document.getElementById('progressText');
    const progressFill = document.getElementById('testProgress');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const resultBtn = document.getElementById('resultBtn');
    
    // تحديث شريط التقدم
    const progressPercent = ((index + 1) / testQuestions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `السؤال ${index + 1}/${testQuestions.length}`;
    
    // عرض السؤال
    questionContainer.innerHTML = `
        <h3>${question.question}</h3>
    `;
    
    // عرض الخيارات
    optionsContainer.innerHTML = '';
    question.options.forEach((option, optionIndex) => {
        const isSelected = userAnswers[question.id] === option.id;
        const optionDiv = document.createElement('div');
        optionDiv.className = `test-option ${isSelected ? 'selected' : ''}`;
        optionDiv.innerHTML = `
            <div class="option-number">${option.id}</div>
            <div class="option-text">${option.text}</div>
        `;
        optionDiv.onclick = () => selectOption(question.id, option.id);
        optionsContainer.appendChild(optionDiv);
    });
    
    // تحديث أزرار التنقل
    prevBtn.disabled = index === 0;
    
    if (index === testQuestions.length - 1) {
        nextBtn.style.display = 'none';
        resultBtn.style.display = 'flex';
    } else {
        nextBtn.style.display = 'flex';
        resultBtn.style.display = 'none';
    }
}

// اختيار خيار
function selectOption(questionId, optionId) {
    userAnswers[questionId] = optionId;
    showQuestion(currentQuestion);
}

// السؤال التالي
function nextQuestion() {
    if (currentQuestion < testQuestions.length - 1) {
        currentQuestion++;
        showQuestion(currentQuestion);
    }
}

// السؤال السابق
function prevQuestion() {
    if (currentQuestion > 0) {
        currentQuestion--;
        showQuestion(currentQuestion);
    }
}

// عرض نتيجة الاختبار
function showTestResult() {
    // حساب النقاط
    const scores = {
        scientific: 0,
        literary: 0,
        technical: 0,
        original: 0
    };
    
    // جمع النقاط من الإجابات
    testQuestions.forEach(question => {
        const answerId = userAnswers[question.id];
        if (answerId) {
            const selectedOption = question.options.find(opt => opt.id === answerId);
            if (selectedOption && selectedOption.score) {
                for (const branch in selectedOption.score) {
                    scores[branch] += selectedOption.score[branch];
                }
            }
        }
    });
    
    // تحديد الفرع المناسب
    let recommendedBranch = '';
    let highestScore = 0;
    
    for (const branch in scores) {
        if (scores[branch] > highestScore) {
            highestScore = scores[branch];
            recommendedBranch = branch;
        }
    }
    
    // تحويل اسم الفرع للعربية
    const branchNames = {
        scientific: 'الشعبة العلمية',
        literary: 'الشعبة الأدبية',
        technical: 'التقني والمهني',
        original: 'تعليم أصلي'
    };
    
    // حساب نسبة التوافق
    const totalPossibleScore = testQuestions.length * 3;
    const matchPercentage = Math.round((highestScore / totalPossibleScore) * 100);
    
    // عرض النتيجة
    document.getElementById('recommendedBranch').textContent = branchNames[recommendedBranch];
    document.getElementById('matchPercentage').textContent = `${matchPercentage}%`;
    
    // عرض نقاط القوة
    displayStrengths(recommendedBranch);
    
    // عرض التوصيات
    displayRecommendations(recommendedBranch);
    
    // عرض المسارات المهنية
    displayCareerPaths(recommendedBranch);
    
    // إظهار قسم النتيجة
    document.getElementById('resultSection').style.display = 'block';
    
    // التمرير إلى النتيجة
    document.getElementById('resultSection').scrollIntoView({ behavior: 'smooth' });
}

// عرض نقاط القوة
function displayStrengths(branch) {
    const strengthsList = document.getElementById('strengthsList');
    const strengths = {
        scientific: [
            'تفكير تحليلي ومنطقي',
            'قدرة على حل المشكلات المعقدة',
            'اهتمام بالتفاصيل الدقيقة',
            'مهارات رياضية وعلمية ممتازة'
        ],
        literary: [
            'قدرة تعبيرية ممتازة',
            'إبداع في الكتابة والتأليف',
            'فهم عميق للغة والأدب',
            'حس نقدي وتحليلي'
        ],
        technical: [
            'مهارات تقنية عالية',
            'قدرة على التعامل مع الأدوات',
            'تفكير إبداعي وتصميمي',
            'مهارات عملية ممتازة'
        ],
        original: [
            'حفظ وفهم سريع',
            'قدرة على الاستنباط',
            'اهتمام بالعلوم الشرعية',
            'أخلاق ومبادق قوية'
        ]
    };
    
    strengthsList.innerHTML = '';
    strengths[branch].forEach(strength => {
        const li = document.createElement('li');
        li.innerHTML = `<i class="fas fa-check"></i> ${strength}`;
        strengthsList.appendChild(li);
    });
}

// عرض التوصيات
function displayRecommendations(branch) {
    const recommendationsGrid = document.getElementById('recommendationsGrid');
    const recommendations = {
        scientific: [
            {
                title: 'التركيز على المواد العلمية',
                description: 'ركز على الرياضيات والفيزياء والكيمياء لتحقيق نتائج ممتازة'
            },
            {
                title: 'المشاركة في المسابقات',
                description: 'شارك في المسابقات العلمية لتنمية مهاراتك'
            },
            {
                title: 'القراءة المستمرة',
                description: 'اقرأ كتب العلوم والاكتشافات العلمية'
            }
        ],
        literary: [
            {
                title: 'تنمية المهارات اللغوية',
                description: 'اقرأ الكتب الأدبية وقم بتلخيصها'
            },
            {
                title: 'الكتابة اليومية',
                description: 'مارس الكتابة بشكل يومي لتحسين أسلوبك'
            },
            {
                title: 'المشاركة في النقاشات',
                description: 'شارك في النقاشات الأدبية والثقافية'
            }
        ],
        technical: [
            {
                title: 'التدريب العملي',
                description: 'احصل على تدريب عملي في ورش أو شركات'
            },
            {
                title: 'تعلم البرمجة',
                description: 'ابدأ في تعلم لغات البرمجة الأساسية'
            },
            {
                title: 'المشاريع العملية',
                description: 'نفذ مشاريع عملية لتنمية مهاراتك'
            }
        ],
        original: [
            {
                title: 'حفظ القرآن الكريم',
                description: 'ابدأ بحفظ القرآن وتلاوته'
            },
            {
                title: 'دراسة العلوم الشرعية',
                description: 'ادرس الفقه والعقيدة والتفسير'
            },
            {
                title: 'الالتحاق بحلقات العلم',
                description: 'انضم إلى حلقات العلم الشرعي'
            }
        ]
    };
    
    recommendationsGrid.innerHTML = '';
    recommendations[branch].forEach(rec => {
        const card = document.createElement('div');
        card.className = 'recommendation-card';
        card.innerHTML = `
            <h5>${rec.title}</h5>
            <p>${rec.description}</p>
        `;
        recommendationsGrid.appendChild(card);
    });
}

// عرض المسارات المهنية
function displayCareerPaths(branch) {
    const careersList = document.getElementById('careersList');
    const careers = {
        scientific: ['طبيب', 'مهندس', 'صيدلي', 'باحث علمي', 'أستاذ جامعي'],
        literary: ['كاتب', 'صحفي', 'مترجم', 'أديب', 'ناقد أدبي'],
        technical: ['تقني مختص', 'مبرمج', 'مصمم جرافيك', 'فني', 'حرفي'],
        original: ['عالم دين', 'قاضي', 'مفتي', 'واعظ', 'مدرس شرعي']
    };
    
    careersList.innerHTML = '';
    careers[branch].forEach(career => {
        const tag = document.createElement('div');
        tag.className = 'career-tag';
        tag.textContent = career;
        careersList.appendChild(tag);
    });
}

// حفظ نتيجة التوجيه
function saveOrientationResult() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    const recommendedBranch = document.getElementById('recommendedBranch').textContent;
    const matchPercentage = document.getElementById('matchPercentage').textContent;
    
    if (!user) {
        alert('يجب تسجيل الدخول أولاً');
        return;
    }
    
    const orientationResult = {
        userId: user.id,
        date: new Date().toISOString(),
        testType: 'middle',
        recommendedBranch: recommendedBranch,
        matchPercentage: matchPercentage,
        answers: userAnswers
    };
    
    // حفظ في localStorage
    let orientationHistory = JSON.parse(localStorage.getItem('orientationHistory')) || [];
    orientationHistory.push(orientationResult);
    localStorage.setItem('orientationHistory', JSON.stringify(orientationHistory));
    
    alert('✅ تم حفظ نتيجة التوجيه بنجاح');
}

// إعادة الاختبار
function retakeTest() {
    currentQuestion = 0;
    userAnswers = {};
    document.getElementById('resultSection').style.display = 'none';
    showQuestion(currentQuestion);
}

// طباعة النتيجة
function printResult() {
    window.print();
}

// ===== نظام التوجيه بعد الباكالوريا =====
let selectedBacStream = '';

// اختيار شعبة الباكالوريا
function selectBacStream(stream) {
    selectedBacStream = stream;
    document.getElementById('majorsSection').style.display = 'block';
    loadMajors(stream);
}

// تحميل التخصصات حسب الشعبة
function loadMajors(stream) {
    const majorsGrid = document.getElementById('majorsGrid');
    
    // التخصصات حسب الشعبة
    const majorsByStream = {
        scientific: [
            {
                id: 1,
                name: 'الطب البشري',
                description: 'دراسة الأمراض وتشخيصها وعلاجها',
                type: 'medical',
                duration: '7 سنوات',
                demand: 'high',
                salary: 'مرتفع',
                universities: ['جامعة القرويين', 'جامعة الحسن الثاني']
            },
            {
                id: 2,
                name: 'هندسة المعلوماتية',
                description: 'تصميم وتطوير الأنظمة البرمجية',
                type: 'engineering',
                duration: '5 سنوات',
                demand: 'very high',
                salary: 'مرتفع جداً',
                universities: ['المدرسة المحمدية للمهندسين', 'جامعة الأخوين']
            },
            {
                id: 3,
                name: 'الصيدلة',
                description: 'دراسة الأدوية وتحضيرها',
                type: 'medical',
                duration: '6 سنوات',
                demand: 'high',
                salary: 'مرتفع',
                universities: ['جامعة محمد الخامس', 'جامعة سيدي محمد بن عبد الله']
            }
        ],
        math: [
            {
                id: 4,
                name: 'الهندسة المدنية',
                description: 'تصميم وتنفيذ المشاريع الإنشائية',
                type: 'engineering',
                duration: '5 سنوات',
                demand: 'high',
                salary: 'مرتفع',
                universities: ['المدرسة الوطنية للعلوم التطبيقية', 'جامعة ابن زهر']
            },
            {
                id: 5,
                name: 'الرياضيات التطبيقية',
                description: 'تطبيقات الرياضيات في مختلف المجالات',
                type: 'engineering',
                duration: '4 سنوات',
                demand: 'medium',
                salary: 'جيد',
                universities: ['جامعة محمد الأول', 'جامعة عبد المالك السعدي']
            }
        ],
        tech: [
            {
                id: 6,
                name: 'التقني المتخصص في المعلوميات',
                description: 'تطوير البرمجيات وإدارة الشبكات',
                type: 'engineering',
                duration: '2 سنوات',
                demand: 'very high',
                salary: 'جيد جداً',
                universities: ['المعاهد المتخصصة في التكنولوجيا']
            },
            {
                id: 7,
                name: 'التقني المتخصص في الميكانيك',
                description: 'صيانة وتصميم الأنظمة الميكانيكية',
                type: 'engineering',
                duration: '2 سنوات',
                demand: 'high',
                salary: 'جيد',
                universities: ['المعاهد المتخصصة في التكنولوجيا']
            }
        ],
        literary: [
            {
                id: 8,
                name: 'اللغات والترجمة',
                description: 'دراسة اللغات الأجنبية والترجمة',
                type: 'arts',
                duration: '4 سنوات',
                demand: 'medium',
                salary: 'متوسط',
                universities: ['جامعة محمد الخامس', 'جامعة الحسن الثاني']
            },
            {
                id: 9,
                name: 'الإعلام والاتصال',
                description: 'الإعلام الرقمي والاتصال المؤسساتي',
                type: 'arts',
                duration: '4 سنوات',
                demand: 'medium',
                salary: 'متوسط',
                universities: ['جامعة ابن طفيل', 'جامعة مولاي إسماعيل']
            }
        ],
        sharia: [
            {
                id: 10,
                name: 'الشريعة والقانون',
                description: 'دراسة التشريع الإسلامي والقوانين',
                type: 'education',
                duration: '4 سنوات',
                demand: 'medium',
                salary: 'متوسط',
                universities: ['جامعة القرويين', 'جامعة سيدي محمد بن عبد الله']
            },
            {
                id: 11,
                name: 'الدراسات الإسلامية',
                description: 'دراسة القرآن والسنة والفقه',
                type: 'education',
                duration: '4 سنوات',
                demand: 'medium',
                salary: 'متوسط',
                universities: ['جامعة القرويين', 'جامعة عبد المالك السعدي']
            }
        ]
    };
    
    majorsGrid.innerHTML = '';
    const majors = majorsByStream[stream] || [];
    
    majors.forEach(major => {
        const card = document.createElement('div');
        card.className = `major-card ${major.type}`;
        card.innerHTML = `
            <h3>${major.name}</h3>
            <p>${major.description}</p>
            
            <div class="major-tags">
                <span class="major-tag">${major.type === 'medical' ? 'طبي' : 
                                         major.type === 'engineering' ? 'هندسي' : 
                                         major.type === 'business' ? 'إداري' : 
                                         major.type === 'education' ? 'تربوي' : 'أدبي'}</span>
                <span class="major-tag">${major.demand === 'very high' ? 'طلبية عالية جداً' :
                                        major.demand === 'high' ? 'طلبية عالية' :
                                        'طلبية متوسطة'}</span>
            </div>
            
            <div class="major-info">
                <div class="info-item">
                    <span class="info-label">مدة الدراسة</span>
                    <span class="info-value">${major.duration}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">متوسط الدخل</span>
                    <span class="info-value">${major.salary}</span>
                </div>
            </div>
            
            <button class="btn-major-details" onclick="showMajorDetails(${major.id})">
                <i class="fas fa-info-circle"></i> التفاصيل
            </button>
        `;
        majorsGrid.appendChild(card);
    });
}

// تصفية التخصصات
function filterMajors() {
    const interest = document.getElementById('interestFilter').value;
    const duration = document.getElementById('durationFilter').value;
    const demand = document.getElementById('demandFilter').value;
    
    // هنا يمكن إضافة منطق التصفية
    console.log('تصفية حسب:', { interest, duration, demand });
}

// عرض تفاصيل التخصص
function showMajorDetails(majorId) {
    // في التطبيق الحقيقي، هنا نسترجع تفاصيل التخصص من قاعدة البيانات
    const modal = document.getElementById('majorModal');
    const modalContent = document.getElementById('majorDetails');
    
    // بيانات وهمية للتوضيح
    const majorDetails = {
        title: 'الطب البشري',
        content: `
            <div class="major-details-content">
                <div class="detail-section">
                    <h4><i class="fas fa-graduation-cap"></i> نظرة عامة</h4>
                    <p>الطب البشري هو علم تشخيص وعلاج الأمراض والإصابات التي تصيب جسم الإنسان.</p>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-calendar-alt"></i> خطة الدراسة</h4>
                    <ul>
                        <li>السنتان الأولى والثانية: علوم أساسية</li>
                        <li>السنتان الثالثة والرابعة: علوم سريرية</li>
                        <li>السنة الخامسة: التدريب السريري</li>
                        <li>السنتان السادسة والسابعة: التخصص والتدريب</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-university"></i> الجامعات</h4>
                    <ul>
                        <li>جامعة القرويين - فاس</li>
                        <li>جامعة الحسن الثاني - الدار البيضاء</li>
                        <li>جامعة محمد الخامس - الرباط</li>
                    </ul>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-briefcase"></i> فرص العمل</h4>
                    <div class="career-opportunities">
                        <span class="career-tag">مستشفيات حكومية</span>
                        <span class="career-tag">عيادات خاصة</span>
                        <span class="career-tag">مراكز البحث العلمي</span>
                        <span class="career-tag">التدريس الجامعي</span>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4><i class="fas fa-chart-line"></i> إحصائيات</h4>
                    <div class="stats-grid">
                        <div class="stat-item">
                            <div class="stat-value">95%</div>
                            <div class="stat-label">نسبة التشغيل</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">7 سنوات</div>
                            <div class="stat-label">متوسط مدة الدراسة</div>
                        </div>
                        <div class="stat-item">
                            <div class="stat-value">مرتفع جداً</div>
                            <div class="stat-label">متوسط الدخل</div>
                        </div>
                    </div>
                </div>
            </div>
        `
    };
    
    document.getElementById('majorTitle').textContent = majorDetails.title;
    modalContent.innerHTML = majorDetails.content;
    modal.classList.add('active');
}

// إغلاق نافذة التفاصيل
function closeMajorModal() {
    document.getElementById('majorModal').classList.remove('active');
}

// بدء اختبار الجامعة
function startUniversityTest() {
    document.getElementById('universityTestContainer').style.display = 'block';
    // هنا يمكن إضافة منطق اختبار الجامعة
}

// عرض المؤسسات التعليمية
function showInstitutions(type) {
    const institutionsList = document.getElementById('institutionsList');
    const tabBtns = document.querySelectorAll('.institutions-tabs .tab-btn');
    
    // تحديث الأزرار النشطة
    tabBtns.forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
    
    // بيانات المؤسسات (وهمية للتوضيح)
    const institutions = {
        public: [
            {
                name: 'جامعة محمد الخامس',
                location: 'الرباط',
                specialties: ['الطب', 'الهندسة', 'القانون', 'الإدارة'],
                rating: 'متميزة'
            },
            {
                name: 'جامعة الحسن الثاني',
                location: 'الدار البيضاء',
                specialties: ['الهندسة', 'التجارة', 'العلوم', 'الآداب'],
                rating: 'متميزة'
            }
        ],
        private: [
            {
                name: 'جامعة الأخوين',
                location: 'إفران',
                specialties: ['إدارة الأعمال', 'الهندسة', 'العلوم الاجتماعية'],
                rating: 'متميزة'
            }
        ],
        institutes: [
            {
                name: 'المعهد المتخصص في التكنولوجيا التطبيقية',
                location: 'الدار البيضاء',
                specialties: ['المعلوميات', 'الميكانيك', 'الكهرباء'],
                rating: 'جيد جداً'
            }
        ]
    };
    
    institutionsList.innerHTML = '';
    institutions[type].forEach(inst => {
        const card = document.createElement('div');
        card.className = 'institution-card';
        card.innerHTML = `
            <div class="institution-header">
                <h3>${inst.name}</h3>
                <span class="institution-type">${inst.rating}</span>
            </div>
            
            <div class="institution-details">
                <div class="detail-item">
                    <i class="fas fa-map-marker-alt"></i>
                    <span>${inst.location}</span>
                </div>
                <div class="detail-item">
                    <i class="fas fa-graduation-cap"></i>
                    <span>${type === 'public' ? 'جامعة حكومية' : 
                           type === 'private' ? 'جامعة خاصة' : 'معهد متخصص'}</span>
                </div>
            </div>
            
            <div class="institution-specialties">
                ${inst.specialties.map(spec => `<span class="specialty-tag">${spec}</span>`).join('')}
            </div>
        `;
        institutionsList.appendChild(card);
    });
}
// نظام التوجيه في الصفحة الرئيسية
document.addEventListener('DOMContentLoaded', function() {
    console.log('تم تحميل نظام التوجيه في الصفحة الرئيسية');
    
    // تهيئة متغيرات اختبار التوجيه السريع
    window.quickTestData = {
        currentQuestion: 0,
        answers: {},
        questions: [
            {
                id: 1,
                question: "ما هو مستوى دراستك الحالي؟",
                options: [
                    { id: 'middle', text: "السنة الثالثة إعدادي" },
                    { id: 'bac', text: "حاصل على الباكالوريا" }
                ]
            },
            {
                id: 2,
                question: "ما هي المواد التي تتفوق فيها؟",
                options: [
                    { id: 'scientific', text: "الرياضيات والعلوم" },
                    { id: 'literary', text: "اللغات والأدب" },
                    { id: 'technical', text: "الرسم والتقنيات" },
                    { id: 'all', text: "جميع المواد بالتساوي" }
                ]
            },
            {
                id: 3,
                question: "ما هو اهتمامك المهني المستقبلي؟",
                options: [
                    { id: 'medical', text: "مجال طبي أو صحي" },
                    { id: 'engineering', text: "مجال هندسي أو تقني" },
                    { id: 'education', text: "مجال تعليمي أو تربوي" },
                    { id: 'business', text: "مجال إداري أو تجاري" }
                ]
            }
        ]
    };
    
    // تحديث الإحصائيات
    updateStatistics();
});

// عرض قسم التوجيه الدراسي
function showOrientationSection() {
    const orientationSection = document.getElementById('orientation');
    if (orientationSection) {
        orientationSection.scrollIntoView({ behavior: 'smooth' });
    }
}

// بدء اختبار التوجيه بعد الإعدادي
function startMiddleOrientation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        if (confirm('يجب تسجيل الدخول أولاً لاستخدام اختبار التوجيه. هل تريد الانتقال إلى صفحة تسجيل الدخول؟')) {
            window.location.href = 'login.html';
        }
        return;
    }
    openOrientationTest('middle');
}

// بدء اختبار التوجيه بعد الباكالوريا
function startBacOrientation() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        if (confirm('يجب تسجيل الدخول أولاً لاستخدام اختبار التوجيه. هل تريد الانتقال إلى صفحة تسجيل الدخول؟')) {
            window.location.href = 'login.html';
        }
        return;
    }
    openOrientationTest('bac');
}

// فتح اختبار التوجيه الكامل
function openOrientationTest(type) {
    const modal = document.getElementById('orientationModal');
    const testContainer = document.getElementById('orientationTestFull');
    
    // تحميل محتوى الاختبار حسب النوع
    if (type === 'middle') {
        testContainer.innerHTML = `
            <div class="test-content">
                <h3>اختبار التوجيه بعد الإعدادي</h3>
                <p>أجب على الأسئلة التالية لمساعدتك في اختيار الفرع المناسب للمرحلة الثانوية</p>
                
                <div class="test-questions">
                    <div class="test-question">
                        <h4>ما هي المواد الدراسية التي تستمتع بدراستها أكثر؟</h4>
                        <div class="options-grid">
                            <button class="option-btn" onclick="selectTestOption('scientific')">
                                الرياضيات والعلوم
                            </button>
                            <button class="option-btn" onclick="selectTestOption('literary')">
                                اللغات والأدب
                            </button>
                            <button class="option-btn" onclick="selectTestOption('technical')">
                                الرسم والفنون
                            </button>
                            <button class="option-btn" onclick="selectTestOption('original')">
                                التربية الإسلامية
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="test-actions">
                    <button class="btn-secondary" onclick="closeOrientationModal()">
                        إلغاء
                    </button>
                    <button class="btn-primary" onclick="submitOrientationTest()">
                        عرض النتيجة
                    </button>
                </div>
            </div>
        `;
    } else {
        testContainer.innerHTML = `
            <div class="test-content">
                <h3>اختبار التوجيه الجامعي</h3>
                <p>أجب على الأسئلة التالية لمساعدتك في اختيار التخصص الجامعي المناسب</p>
                
                <div class="test-questions">
                    <div class="test-question">
                        <h4>ما هي شعبة الباكالوريا الخاصة بك؟</h4>
                        <div class="options-grid">
                            <button class="option-btn" onclick="selectTestOption('scientific')">
                                علوم تجريبية
                            </button>
                            <button class="option-btn" onclick="selectTestOption('math')">
                                رياضيات
                            </button>
                            <button class="option-btn" onclick="selectTestOption('tech')">
                                تقني
                            </button>
                            <button class="option-btn" onclick="selectTestOption('literary')">
                                آداب
                            </button>
                        </div>
                    </div>
                </div>
                
                <div class="test-actions">
                    <button class="btn-secondary" onclick="closeOrientationModal()">
                        إلغاء
                    </button>
                    <button class="btn-primary" onclick="submitOrientationTest()">
                        عرض النتيجة
                    </button>
                </div>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

// إغلاق نافذة اختبار التوجيه
function closeOrientationModal() {
    document.getElementById('orientationModal').classList.remove('active');
}

// اختيار خيار في الاختبار
function selectTestOption(option) {
    // إضافة تأثير على الزر المختار
    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(btn => btn.classList.remove('selected'));
    event.target.classList.add('selected');
}

// إرسال اختبار التوجيه
function submitOrientationTest() {
    // في التطبيق الحقيقي، هنا نرسل النتائج ونحصل على التوصيات
    alert('تم إرسال إجاباتك. سيتم تحليلها وعرض التوصيات المناسبة.');
    closeOrientationModal();
}

// عرض تفاصيل التوجيه بعد الإعدادي
function showMiddleDetails() {
    document.getElementById('middle-details').style.display = 'block';
    document.getElementById('bac-details').style.display = 'none';
    showOrientationSection();
}

// عرض تفاصيل التوجيه بعد الباكالوريا
function showBacDetails() {
    document.getElementById('bac-details').style.display = 'block';
    document.getElementById('middle-details').style.display = 'none';
    showOrientationSection();
}

// إخفاء قسم التفاصيل
function hideDetails() {
    document.getElementById('middle-details').style.display = 'none';
    document.getElementById('bac-details').style.display = 'none';
}

// === اختبار التوجيه السريع ===
function nextQuickQuestion() {
    const currentQuestion = window.quickTestData.currentQuestion;
    const questions = window.quickTestData.questions;
    
    // حفظ الإجابة الحالية
    const currentOptions = document.querySelectorAll('.quick-option input[type="radio"]:checked');
    if (currentOptions.length > 0) {
        window.quickTestData.answers[questions[currentQuestion].id] = currentOptions[0].value;
    }
    
    // إذا كان هناك سؤال آخر
    if (currentQuestion < questions.length - 1) {
        window.quickTestData.currentQuestion++;
        showQuickQuestion();
    } else {
        // عرض النتيجة
        showQuickResult();
    }
}

// عرض السؤال في الاختبار السريع
function showQuickQuestion() {
    const currentQuestion = window.quickTestData.currentQuestion;
    const question = window.quickTestData.questions[currentQuestion];
    const progressFill = document.getElementById('quickTestProgress');
    const progressText = document.getElementById('quickProgressText');
    const prevBtn = document.getElementById('prevQuickBtn');
    const nextBtn = document.getElementById('nextQuickBtn');
    
    // تحديث شريط التقدم
    const progressPercent = ((currentQuestion + 1) / window.quickTestData.questions.length) * 100;
    progressFill.style.width = `${progressPercent}%`;
    progressText.textContent = `السؤال ${currentQuestion + 1}/${window.quickTestData.questions.length}`;
    
    // تحديث السؤال
    document.getElementById('quickQuestion').innerHTML = `
        <h4>${question.question}</h4>
        <div class="quick-options">
            ${question.options.map(option => `
                <label class="quick-option">
                    <input type="radio" name="q${question.id}" value="${option.id}" 
                           ${window.quickTestData.answers[question.id] === option.id ? 'checked' : ''}>
                    <span>${option.text}</span>
                </label>
            `).join('')}
        </div>
    `;
    
    // تحديث أزرار التنقل
    prevBtn.disabled = currentQuestion === 0;
    
    // تغيير نص زر التالي إذا كان آخر سؤال
    if (currentQuestion === window.quickTestData.questions.length - 1) {
        nextBtn.innerHTML = 'عرض النتيجة <i class="fas fa-arrow-left"></i>';
    } else {
        nextBtn.innerHTML = 'التالي <i class="fas fa-arrow-left"></i>';
    }
}

// عرض نتيجة الاختبار السريع
function showQuickResult() {
    const answers = window.quickTestData.answers;
    const questions = window.quickTestData.questions;
    
    // تحليل الإجابات
    let recommendation = '';
    let details = '';
    
    // مستوى الدراسة
    if (answers[1] === 'middle') {
        // توجيه إعدادي
        if (answers[2] === 'scientific') {
            recommendation = 'الشعبة العلمية';
            details = 'يناسبك اختيار الشعبة العلمية في المرحلة الثانوية. هذا الفرع يفتح لك أبواب التخصصات الطبية والهندسية في المستقبل.';
        } else if (answers[2] === 'literary') {
            recommendation = 'الشعبة الأدبية';
            details = 'يناسبك اختيار الشعبة الأدبية. هذا الفرع يؤهلك للتخصصات الأدبية والقانونية والإعلامية.';
        } else if (answers[2] === 'technical') {
            recommendation = 'التقني والمهني';
            details = 'يناسبك المسار التقني والمهني. هذا الفرع يركز على المهارات العملية والتقنية المطلوبة في سوق العمل.';
        } else {
            recommendation = 'الشعبة العلمية أو الأدبية';
            details = 'يمكنك الاختيار بين الشعبة العلمية أو الأدبية بناءً على اهتماماتك الأخرى.';
        }
    } else {
        // توجيه جامعي
        if (answers[3] === 'medical') {
            recommendation = 'التخصصات الطبية';
            details = 'يناسبك التوجه نحو التخصصات الطبية مثل الطب البشري، الصيدلة، أو طب الأسنان.';
        } else if (answers[3] === 'engineering') {
            recommendation = 'التخصصات الهندسية';
            details = 'يناسبك التوجه نحو التخصصات الهندسية مثل الهندسة المدنية، المعمارية، أو المعلوماتية.';
        } else if (answers[3] === 'education') {
            recommendation = 'التخصصات التربوية';
            details = 'يناسبك التوجه نحو التخصصات التربوية والتعليمية.';
        } else {
            recommendation = 'التخصصات الإدارية';
            details = 'يناسبك التوجه نحو التخصصات الإدارية والتجارية.';
        }
    }
    
    // عرض النتيجة
    document.getElementById('quickTestContainer').style.display = 'none';
    document.getElementById('quickResult').style.display = 'block';
    
    document.getElementById('quickResultCard').innerHTML = `
        <h5>${recommendation}</h5>
        <p>${details}</p>
        <div class="result-actions">
            <button class="btn-small" onclick="saveQuickResult()">
                <i class="fas fa-save"></i> حفظ النتيجة
            </button>
            <button class="btn-small" onclick="showFullTest()">
                <i class="fas fa-clipboard-list"></i> اختبار مفصل
            </button>
        </div>
    `;
}

// إعادة الاختبار السريع
function restartQuickTest() {
    window.quickTestData.currentQuestion = 0;
    window.quickTestData.answers = {};
    
    document.getElementById('quickTestContainer').style.display = 'block';
    document.getElementById('quickResult').style.display = 'none';
    
    showQuickQuestion();
}

// حفظ نتيجة الاختبار السريع
function saveQuickResult() {
    const user = JSON.parse(localStorage.getItem('currentUser'));
    if (!user) {
        alert('يجب تسجيل الدخول لحفظ النتائج');
        return;
    }
    
    const quickResult = {
        userId: user.id,
        date: new Date().toISOString(),
        answers: window.quickTestData.answers,
        recommendation: document.querySelector('#quickResultCard h5').textContent
    };
    
    let quickResults = JSON.parse(localStorage.getItem('quickOrientationResults')) || [];
    quickResults.push(quickResult);
    localStorage.setItem('quickOrientationResults', JSON.stringify(quickResults));
    
    alert('✅ تم حفظ نتيجة الاختبار السريع');
}

// الانتقال إلى الاختبار المفصل
function showFullTest() {
    const level = window.quickTestData.answers[1];
    if (level === 'middle') {
        startMiddleOrientation();
    } else {
        startBacOrientation();
    }
}

// تحديث الإحصائيات
function updateStatistics() {
    // في التطبيق الحقيقي، هنا نسترجع الإحصائيات من قاعدة البيانات
    // حالياً نستخدم أرقام افتراضية
    const users = JSON.parse(localStorage.getItem('users')) || [];
    const calculations = JSON.parse(localStorage.getItem('calculations')) || [];
    const orientationResults = JSON.parse(localStorage.getItem('orientationHistory')) || [];
    
    document.getElementById('totalUsers').textContent = users.length + '+';
    document.getElementById('totalCalculations').textContent = calculations.length + '+';
    document.getElementById('orientationTests').textContent = orientationResults.length + '+';
}

// إضافة CSS للزر الصغير
const style = document.createElement('style');
style.textContent = `
    .btn-small {
        background: rgba(67, 97, 238, 0.1);
        color: #4361ee;
        border: 1px solid #4361ee;
        padding: 8px 15px;
        border-radius: 5px;
        cursor: pointer;
        font-size: 0.9rem;
        display: inline-flex;
        align-items: center;
        gap: 5px;
        margin: 5px;
        transition: all 0.3s;
    }
    
    .btn-small:hover {
        background: #4361ee;
        color: white;
    }
    
    .option-btn {
        background: white;
        border: 2px solid #e2e8f0;
        padding: 15px;
        border-radius: 10px;
        cursor: pointer;
        transition: all 0.3s;
        text-align: center;
        font-weight: 500;
        color: #475569;
    }
    
    .option-btn:hover {
        border-color: #4361ee;
        background: rgba(67, 97, 238, 0.05);
    }
    
    .option-btn.selected {
        border-color: #4361ee;
        background: rgba(67, 97, 238, 0.1);
        color: #4361ee;
    }
    
    .options-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 15px;
        margin: 20px 0;
    }
    
    @media (max-width: 768px) {
        .options-grid {
            grid-template-columns: 1fr;
        }
    }
`;
document.head.appendChild(style);