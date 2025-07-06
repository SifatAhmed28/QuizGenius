// Enhanced AI Quiz Generator JavaScript with Authentication and History

class QuizGenerator {
  constructor() {
    this.selectedTypes = [];
    this.uploadedFile = null;
    this.isGenerating = false;
    this.isLoggedIn = false;
    this.currentUser = null;
    this.quizHistory = [];
    this.filteredHistory = [];
    this.currentTab = 'create';
    this.init();
  }

  init() {
    this.initializeElements();
    this.setupEventListeners();
    this.initializeParticles();
    this.animateCounters();
    this.setupIntersectionObserver();
    this.loadDummyData();
    this.setupTabNavigation();
  }

  initializeElements() {
    // Tab elements
    this.tabButtons = document.querySelectorAll('.tab-btn');
    this.tabContents = document.querySelectorAll('.tab-content');
    this.createTab = document.getElementById('createTab');
    this.historyTab = document.getElementById('historyTab');

    // Authentication elements
    this.loginBtn = document.getElementById('loginBtn');
    this.signupBtn = document.getElementById('signupBtn');
    this.loginModal = document.getElementById('loginModal');
    this.signupModal = document.getElementById('signupModal');
    this.loginModalClose = document.getElementById('loginModalClose');
    this.signupModalClose = document.getElementById('signupModalClose');
    this.loginForm = document.getElementById('loginForm');
    this.signupForm = document.getElementById('signupForm');
    this.userProfile = document.getElementById('userProfile');
    this.logoutBtn = document.getElementById('logoutBtn');

    // File upload elements
    this.uploadArea = document.getElementById('uploadArea');
    this.fileInput = document.getElementById('fileInput');
    this.fileInfo = document.getElementById('fileInfo');
    this.fileName = document.getElementById('fileName');
    this.fileSize = document.getElementById('fileSize');
    this.removeFileBtn = document.getElementById('removeFile');
    this.uploadProgress = document.getElementById('uploadProgress');
    this.progressFill = document.getElementById('progressFill');

    // Configuration elements
    this.optionCards = document.querySelectorAll('.option-card');
    this.generateBtn = document.getElementById('generateBtn');
    this.questionCountInput = document.getElementById('questionCount');
    this.totalMarksInput = document.getElementById('totalMarks');
    this.timeLimitInput = document.getElementById('timeLimit');

    // Marks input elements
    this.mcqMarksInput = document.getElementById('mcqMarks');
    this.tfMarksInput = document.getElementById('tfMarks');
    this.fibMarksInput = document.getElementById('fibMarks');
    this.shortMarksInput = document.getElementById('shortMarks');
    this.boardMarksInput = document.getElementById('boardMarks');

    // Quiz preview elements
    this.quizPreview = document.getElementById('quizPreview');
    this.generationProgress = document.getElementById('generationProgress');
    this.progressBar = document.getElementById('progressBar');
    this.progressPercent = document.getElementById('progressPercent');
    this.questionsContainer = document.getElementById('questionsContainer');
    this.quizSummary = document.getElementById('quizSummary');
    this.quizActions = document.getElementById('quizActions');

    // Preview summary elements
    this.previewQuestionCount = document.getElementById('previewQuestionCount');
    this.previewTotalMarks = document.getElementById('previewTotalMarks');
    this.previewTimeLimit = document.getElementById('previewTimeLimit');

    // Action buttons
    this.downloadBtn = document.getElementById('downloadBtn');
    this.emailBtn = document.getElementById('emailBtn');
    this.regenerateBtn = document.getElementById('regenerateBtn');

    // History elements
    this.searchInput = document.getElementById('searchInput');
    this.filterSelect = document.getElementById('filterSelect');
    this.historyList = document.getElementById('historyList');
    this.totalQuizzesEl = document.getElementById('totalQuizzes');
    this.publishedQuizzesEl = document.getElementById('publishedQuizzes');
    this.averageMarksEl = document.getElementById('averageMarks');
    this.totalTimeEl = document.getElementById('totalTime');

    // Other elements
    this.floatingActionBtn = document.getElementById('floatingActionBtn');
    this.notification = document.getElementById('notification');
  }

  setupEventListeners() {
    // Tab navigation
    this.tabButtons.forEach(btn => {
      btn.addEventListener('click', () => this.switchTab(btn.dataset.tab));
    });

    // Authentication
    if (this.loginBtn) {
      this.loginBtn.addEventListener('click', () => this.showModal('login'));
    }
    if (this.signupBtn) {
      this.signupBtn.addEventListener('click', () => this.showModal('signup'));
    }
    if (this.loginModalClose) {
      this.loginModalClose.addEventListener('click', () => this.hideModal('login'));
    }
    if (this.signupModalClose) {
      this.signupModalClose.addEventListener('click', () => this.hideModal('signup'));
    }
    if (this.loginForm) {
      this.loginForm.addEventListener('submit', (e) => this.handleLogin(e));
    }
    if (this.signupForm) {
      this.signupForm.addEventListener('submit', (e) => this.handleSignup(e));
    }
    if (this.logoutBtn) {
      this.logoutBtn.addEventListener('click', () => this.handleLogout());
    }

    // File upload listeners
    if (this.uploadArea) {
      this.uploadArea.addEventListener('click', (e) => {
        e.preventDefault();
        this.fileInput.click();
      });
      
      this.uploadArea.addEventListener('dragover', (e) => this.handleDragOver(e));
      this.uploadArea.addEventListener('dragleave', (e) => this.handleDragLeave(e));
      this.uploadArea.addEventListener('drop', (e) => this.handleDrop(e));
    }

    if (this.fileInput) {
      this.fileInput.addEventListener('change', (e) => this.handleFileSelect(e));
    }

    if (this.removeFileBtn) {
      this.removeFileBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        this.removeFile();
      });
    }

    // Option card listeners
    this.optionCards.forEach(card => {
      card.addEventListener('click', () => {
        this.toggleQuestionType(card);
        this.addRippleEffect(card);
      });
    });

    // Generate button listener
    if (this.generateBtn) {
      this.generateBtn.addEventListener('click', () => this.generateQuiz());
    }

    // Action button listeners
    if (this.downloadBtn) {
      this.downloadBtn.addEventListener('click', () => this.downloadQuiz());
    }
    if (this.emailBtn) {
      this.emailBtn.addEventListener('click', () => this.emailQuiz());
    }
    if (this.regenerateBtn) {
      this.regenerateBtn.addEventListener('click', () => this.regenerateQuiz());
    }

    // History search and filter
    if (this.searchInput) {
      this.searchInput.addEventListener('input', () => this.filterHistory());
    }
    if (this.filterSelect) {
      this.filterSelect.addEventListener('change', () => this.filterHistory());
    }

    // Floating action button
    if (this.floatingActionBtn) {
      this.floatingActionBtn.addEventListener('click', () => this.scrollToTop());
    }

    // Modal backdrop clicks
    if (this.loginModal) {
      this.loginModal.addEventListener('click', (e) => {
        if (e.target === this.loginModal) this.hideModal('login');
      });
    }
    if (this.signupModal) {
      this.signupModal.addEventListener('click', (e) => {
        if (e.target === this.signupModal) this.hideModal('signup');
      });
    }

    // Input validation listeners
    this.setupInputValidation();
  }

  setupTabNavigation() {
    // Initialize with create tab active
    this.switchTab('create');
  }

  switchTab(tabName) {
    // Update tab buttons
    this.tabButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.tab === tabName);
    });

    // Update tab contents
    this.tabContents.forEach(content => {
      content.classList.toggle('active', content.id === `${tabName}Tab`);
    });

    this.currentTab = tabName;

    // If switching to history, update the display
    if (tabName === 'history') {
      this.displayHistory();
    }
  }

  loadDummyData() {
    // Dummy quiz history data
    this.quizHistory = [
      {
        id: 1,
        title: "Biology Chapter 3: Cell Structure",
        dateCreated: "2025-07-01",
        questionsCount: 15,
        totalMarks: 75,
        status: "Published",
        questionTypes: ["MCQ", "True/False", "Short Answer"],
        timeLimit: 45,
        category: "Biology"
      },
      {
        id: 2,
        title: "Mathematics Midterm Review",
        dateCreated: "2025-06-28",
        questionsCount: 20,
        totalMarks: 100,
        status: "Draft",
        questionTypes: ["MCQ", "Fill in Blank", "Board Questions"],
        timeLimit: 60,
        category: "Mathematics"
      },
      {
        id: 3,
        title: "History: World War II",
        dateCreated: "2025-06-25",
        questionsCount: 12,
        totalMarks: 60,
        status: "Completed",
        questionTypes: ["MCQ", "Short Answer"],
        timeLimit: 40,
        category: "History"
      },
      {
        id: 4,
        title: "Physics: Mechanics Basics",
        dateCreated: "2025-06-22",
        questionsCount: 18,
        totalMarks: 90,
        status: "Published",
        questionTypes: ["MCQ", "True/False", "Board Questions"],
        timeLimit: 55,
        category: "Physics"
      },
      {
        id: 5,
        title: "Chemistry: Organic Compounds",
        dateCreated: "2025-06-20",
        questionsCount: 14,
        totalMarks: 70,
        status: "Draft",
        questionTypes: ["MCQ", "Fill in Blank"],
        timeLimit: 35,
        category: "Chemistry"
      },
      {
        id: 6,
        title: "Literature: Shakespeare Analysis",
        dateCreated: "2025-06-18",
        questionsCount: 10,
        totalMarks: 50,
        status: "Published",
        questionTypes: ["Short Answer", "Board Questions"],
        timeLimit: 50,
        category: "Literature"
      },
      {
        id: 7,
        title: "Computer Science: Data Structures",
        dateCreated: "2025-06-15",
        questionsCount: 25,
        totalMarks: 125,
        status: "Completed",
        questionTypes: ["MCQ", "True/False", "Short Answer"],
        timeLimit: 75,
        category: "Computer Science"
      },
      {
        id: 8,
        title: "Geography: Climate Patterns",
        dateCreated: "2025-06-12",
        questionsCount: 16,
        totalMarks: 80,
        status: "Published",
        questionTypes: ["MCQ", "Fill in Blank", "True/False"],
        timeLimit: 45,
        category: "Geography"
      }
    ];

    this.filteredHistory = [...this.quizHistory];
    this.updateHistoryStats();
  }

  updateHistoryStats() {
    const stats = {
      totalQuizzes: this.quizHistory.length,
      publishedQuizzes: this.quizHistory.filter(q => q.status === 'Published').length,
      averageMarks: Math.round(this.quizHistory.reduce((sum, q) => sum + q.totalMarks, 0) / this.quizHistory.length),
      totalTime: this.quizHistory.reduce((sum, q) => sum + q.timeLimit, 0)
    };

    if (this.totalQuizzesEl) this.totalQuizzesEl.textContent = stats.totalQuizzes;
    if (this.publishedQuizzesEl) this.publishedQuizzesEl.textContent = stats.publishedQuizzes;
    if (this.averageMarksEl) this.averageMarksEl.textContent = stats.averageMarks;
    if (this.totalTimeEl) this.totalTimeEl.textContent = stats.totalTime;
  }

  displayHistory() {
    if (!this.historyList) return;

    this.historyList.innerHTML = '';

    this.filteredHistory.forEach((quiz, index) => {
      const historyItem = this.createHistoryItem(quiz, index);
      this.historyList.appendChild(historyItem);
    });
  }

  createHistoryItem(quiz, index) {
    const item = document.createElement('div');
    item.className = 'history-item';
    item.style.animationDelay = `${index * 0.1}s`;

    const statusClass = `status-${quiz.status.toLowerCase()}`;
    const formattedDate = new Date(quiz.dateCreated).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });

    item.innerHTML = `
      <div class="history-header">
        <div>
          <div class="history-title">${quiz.title}</div>
          <div class="history-date">${formattedDate}</div>
        </div>
        <div class="history-status ${statusClass}">${quiz.status}</div>
      </div>
      
      <div class="history-details">
        <div class="history-detail">
          <i class="fas fa-tasks"></i>
          ${quiz.questionsCount} Questions
        </div>
        <div class="history-detail">
          <i class="fas fa-star"></i>
          ${quiz.totalMarks} Marks
        </div>
        <div class="history-detail">
          <i class="fas fa-clock"></i>
          ${quiz.timeLimit} mins
        </div>
        <div class="history-detail">
          <i class="fas fa-tag"></i>
          ${quiz.category}
        </div>
      </div>
      
      <div class="history-actions">
        <button class="history-action" onclick="quizApp.editQuiz(${quiz.id})">
          <i class="fas fa-edit"></i>
          Edit
        </button>
        <button class="history-action" onclick="quizApp.deleteQuiz(${quiz.id})">
          <i class="fas fa-trash"></i>
          Delete
        </button>
        <button class="history-action" onclick="quizApp.shareQuiz(${quiz.id})">
          <i class="fas fa-share"></i>
          Share
        </button>
        <button class="history-action" onclick="quizApp.downloadQuizFromHistory(${quiz.id})">
          <i class="fas fa-download"></i>
          Download
        </button>
      </div>
    `;

    return item;
  }

  filterHistory() {
    const searchTerm = this.searchInput ? this.searchInput.value.toLowerCase() : '';
    const statusFilter = this.filterSelect ? this.filterSelect.value : 'all';

    this.filteredHistory = this.quizHistory.filter(quiz => {
      const matchesSearch = quiz.title.toLowerCase().includes(searchTerm) ||
                           quiz.category.toLowerCase().includes(searchTerm);
      const matchesStatus = statusFilter === 'all' || quiz.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });

    this.displayHistory();
  }

  // History action methods
  editQuiz(id) {
    this.showNotification(`Editing quiz ${id}`, 'info');
    // Switch to create tab and populate with quiz data
    this.switchTab('create');
  }

  deleteQuiz(id) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.quizHistory = this.quizHistory.filter(q => q.id !== id);
      this.filteredHistory = this.filteredHistory.filter(q => q.id !== id);
      this.updateHistoryStats();
      this.displayHistory();
      this.showNotification('Quiz deleted successfully', 'success');
    }
  }

  shareQuiz(id) {
    const quiz = this.quizHistory.find(q => q.id === id);
    if (quiz) {
      navigator.clipboard.writeText(`Check out this quiz: ${quiz.title}`);
      this.showNotification('Quiz link copied to clipboard!', 'success');
    }
  }

  downloadQuizFromHistory(id) {
    const quiz = this.quizHistory.find(q => q.id === id);
    if (quiz) {
      this.showNotification(`Downloading "${quiz.title}"...`, 'info');
      // Simulate download
      setTimeout(() => {
        this.showNotification('Quiz downloaded successfully!', 'success');
      }, 2000);
    }
  }

  // Authentication methods
  showModal(type) {
    const modal = type === 'login' ? this.loginModal : this.signupModal;
    if (modal) {
      modal.classList.add('show');
      modal.style.display = 'flex';
    }
  }

  hideModal(type) {
    const modal = type === 'login' ? this.loginModal : this.signupModal;
    if (modal) {
      modal.classList.remove('show');
      setTimeout(() => {
        modal.style.display = 'none';
      }, 300);
    }
  }

  handleLogin(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get('email') || e.target.querySelector('input[type="email"]').value;
    const password = formData.get('password') || e.target.querySelector('input[type="password"]').value;

    // Simulate login process
    this.showNotification('Logging in...', 'info');
    
    setTimeout(() => {
      this.isLoggedIn = true;
      this.currentUser = {
        name: 'John Doe',
        email: email
      };
      this.updateAuthUI();
      this.hideModal('login');
      this.showNotification('Login successful!', 'success');
    }, 1500);
  }

  handleSignup(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const inputs = e.target.querySelectorAll('input');
    const name = inputs[0].value;
    const email = inputs[1].value;
    const password = inputs[2].value;
    const confirmPassword = inputs[3].value;

    if (password !== confirmPassword) {
      this.showNotification('Passwords do not match!', 'error');
      return;
    }

    // Simulate signup process
    this.showNotification('Creating account...', 'info');
    
    setTimeout(() => {
      this.isLoggedIn = true;
      this.currentUser = {
        name: name,
        email: email
      };
      this.updateAuthUI();
      this.hideModal('signup');
      this.showNotification('Account created successfully!', 'success');
    }, 1500);
  }

  handleLogout() {
    this.isLoggedIn = false;
    this.currentUser = null;
    this.updateAuthUI();
    this.showNotification('Logged out successfully', 'info');
  }

  updateAuthUI() {
    if (this.isLoggedIn) {
      // Hide login/signup buttons
      if (this.loginBtn) this.loginBtn.style.display = 'none';
      if (this.signupBtn) this.signupBtn.style.display = 'none';
      
      // Show user profile
      if (this.userProfile) {
        this.userProfile.classList.remove('hidden');
        const profileName = this.userProfile.querySelector('.profile-name');
        const profileEmail = this.userProfile.querySelector('.profile-email');
        if (profileName) profileName.textContent = this.currentUser.name;
        if (profileEmail) profileEmail.textContent = this.currentUser.email;
      }
    } else {
      // Show login/signup buttons
      if (this.loginBtn) this.loginBtn.style.display = 'flex';
      if (this.signupBtn) this.signupBtn.style.display = 'flex';
      
      // Hide user profile
      if (this.userProfile) this.userProfile.classList.add('hidden');
    }
  }

  setupInputValidation() {
    const inputs = [
      this.questionCountInput,
      this.totalMarksInput,
      this.timeLimitInput,
      this.mcqMarksInput,
      this.tfMarksInput,
      this.fibMarksInput,
      this.shortMarksInput,
      this.boardMarksInput
    ].filter(input => input);

    inputs.forEach(input => {
      input.addEventListener('input', () => this.validateInput(input));
      input.addEventListener('focus', () => this.highlightInput(input));
      input.addEventListener('blur', () => this.unhighlightInput(input));
    });
  }

  validateInput(input) {
    const value = parseInt(input.value);
    const min = parseInt(input.min);
    const max = parseInt(input.max);

    if (value < min || value > max || isNaN(value)) {
      input.style.borderColor = 'var(--color-error)';
      input.style.boxShadow = '0 0 0 3px rgba(255, 107, 107, 0.1)';
    } else {
      input.style.borderColor = 'var(--color-success)';
      input.style.boxShadow = '0 0 0 3px rgba(100, 255, 218, 0.1)';
    }
  }

  highlightInput(input) {
    const wrapper = input.parentElement;
    const highlight = wrapper.querySelector('.input-highlight');
    if (highlight) {
      highlight.style.width = '100%';
    }
  }

  unhighlightInput(input) {
    const wrapper = input.parentElement;
    const highlight = wrapper.querySelector('.input-highlight');
    if (highlight) {
      highlight.style.width = '0';
    }
  }

  initializeParticles() {
    const particlesContainer = document.getElementById('particles');
    if (!particlesContainer) return;
    
    const particleCount = 30;

    for (let i = 0; i < particleCount; i++) {
      setTimeout(() => {
        this.createParticle(particlesContainer);
      }, i * 200);
    }

    setInterval(() => {
      if (Math.random() > 0.7) {
        this.createParticle(particlesContainer);
      }
    }, 2000);
  }

  createParticle(container) {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    const size = Math.random() * 6 + 2;
    const startX = Math.random() * window.innerWidth;
    const duration = Math.random() * 8 + 12;
    const delay = Math.random() * 2;

    particle.style.width = `${size}px`;
    particle.style.height = `${size}px`;
    particle.style.left = `${startX}px`;
    particle.style.animationDuration = `${duration}s`;
    particle.style.animationDelay = `${delay}s`;

    container.appendChild(particle);

    setTimeout(() => {
      if (particle.parentNode) {
        particle.parentNode.removeChild(particle);
      }
    }, (duration + delay) * 1000);
  }

  animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    
    counters.forEach(counter => {
      const target = parseInt(counter.getAttribute('data-count'));
      const duration = 2000;
      let hasAnimated = false;

      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting && !hasAnimated) {
            hasAnimated = true;
            this.countUp(counter, target, duration);
            observer.unobserve(entry.target);
          }
        });
      });

      observer.observe(counter);
    });
  }

  countUp(element, target, duration) {
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        element.textContent = Math.floor(current).toLocaleString();
        requestAnimationFrame(updateCounter);
      } else {
        element.textContent = target.toLocaleString();
      }
    };

    updateCounter();
  }

  setupIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.slide-in').forEach(el => {
      observer.observe(el);
    });
  }

  handleDragOver(e) {
    e.preventDefault();
    this.uploadArea.classList.add('drag-over');
  }

  handleDragLeave(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('drag-over');
  }

  handleDrop(e) {
    e.preventDefault();
    this.uploadArea.classList.remove('drag-over');
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      this.processFile(files[0]);
    }
  }

  handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
      this.processFile(file);
    }
  }

  processFile(file) {
    this.uploadedFile = file;
    this.showUploadProgress();
    
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 20 + 5;
      progress = Math.min(progress, 100);
      
      if (this.progressFill) {
        this.progressFill.style.width = `${progress}%`;
      }
      
      if (progress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          this.showFileInfo();
        }, 500);
      }
    }, 300);
  }

  showUploadProgress() {
    const uploadContent = this.uploadArea.querySelector('.upload-content');
    if (uploadContent && this.uploadProgress) {
      uploadContent.style.display = 'none';
      this.uploadProgress.style.display = 'block';
    }
  }

  showFileInfo() {
    const uploadContent = this.uploadArea.querySelector('.upload-content');
    if (this.uploadProgress && uploadContent) {
      this.uploadProgress.style.display = 'none';
      uploadContent.style.display = 'block';
    }
    
    if (this.fileName && this.fileSize && this.fileInfo) {
      this.fileName.textContent = this.uploadedFile.name;
      this.fileSize.textContent = this.formatFileSize(this.uploadedFile.size);
      this.fileInfo.classList.add('show');
    }
    
    this.showNotification('File uploaded successfully!', 'success');
  }

  removeFile() {
    this.uploadedFile = null;
    if (this.fileInfo) {
      this.fileInfo.classList.remove('show');
    }
    if (this.fileInput) {
      this.fileInput.value = '';
    }
    if (this.progressFill) {
      this.progressFill.style.width = '0%';
    }
    this.showNotification('File removed', 'info');
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  toggleQuestionType(card) {
    const type = card.dataset.type;
    
    if (card.classList.contains('selected')) {
      card.classList.remove('selected');
      this.selectedTypes = this.selectedTypes.filter(t => t !== type);
    } else {
      card.classList.add('selected');
      this.selectedTypes.push(type);
    }
  }

  addRippleEffect(element) {
    const rect = element.getBoundingClientRect();
    const ripple = document.createElement('div');
    ripple.className = 'ripple';
    
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = '50%';
    ripple.style.top = '50%';
    ripple.style.transform = 'translate(-50%, -50%) scale(0)';
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(255, 255, 255, 0.6)';
    ripple.style.animation = 'ripple 0.6s linear';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
      if (ripple.parentNode) {
        ripple.remove();
      }
    }, 600);
  }

  async generateQuiz() {
    if (!this.uploadedFile) {
      this.showNotification('Please upload a file first!', 'error');
      return;
    }

    if (this.selectedTypes.length === 0) {
      this.showNotification('Please select at least one question type!', 'error');
      return;
    }

    if (this.isGenerating) return;
    
    this.isGenerating = true;
    this.generateBtn.classList.add('loading');
    this.generateBtn.disabled = true;

    if (this.previewQuestionCount) this.previewQuestionCount.textContent = this.questionCountInput.value;
    if (this.previewTotalMarks) this.previewTotalMarks.textContent = this.totalMarksInput.value;
    if (this.previewTimeLimit) this.previewTimeLimit.textContent = this.timeLimitInput.value;

    if (this.quizPreview) {
      this.quizPreview.classList.add('show');
      this.quizPreview.style.display = 'block';
      
      setTimeout(() => {
        this.quizPreview.scrollIntoView({ behavior: 'smooth' });
      }, 300);
    }

    this.resetQuizPreview();
    await this.simulateAIProcessing();
    this.showGeneratedContent();
    
    this.isGenerating = false;
    this.generateBtn.classList.remove('loading');
    this.generateBtn.disabled = false;
    
    this.showNotification('Quiz generated successfully!', 'success');
  }

  resetQuizPreview() {
    if (this.generationProgress) this.generationProgress.style.display = 'block';
    if (this.quizSummary) this.quizSummary.style.display = 'none';
    if (this.questionsContainer) this.questionsContainer.style.display = 'none';
    if (this.quizActions) this.quizActions.style.display = 'none';
    if (this.progressBar) this.progressBar.style.width = '0%';
    if (this.progressPercent) this.progressPercent.textContent = '0%';
  }

  async simulateAIProcessing() {
    const steps = [
      { text: 'Analyzing uploaded content...', duration: 800 },
      { text: 'Extracting key concepts...', duration: 600 },
      { text: 'Generating questions...', duration: 1000 },
      { text: 'Optimizing difficulty levels...', duration: 500 },
      { text: 'Finalizing quiz structure...', duration: 400 }
    ];

    let totalProgress = 0;
    const progressPerStep = 100 / steps.length;

    for (let i = 0; i < steps.length; i++) {
      const step = steps[i];
      const progressText = document.querySelector('.progress-text');
      if (progressText) {
        progressText.textContent = step.text;
      }
      
      const stepProgress = progressPerStep * (i + 1);
      await this.animateProgress(totalProgress, stepProgress, step.duration);
      totalProgress = stepProgress;
    }
  }

  animateProgress(from, to, duration) {
    return new Promise(resolve => {
      const startTime = Date.now();
      const animate = () => {
        const elapsed = Date.now() - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const currentValue = from + (to - from) * progress;
        
        if (this.progressBar) {
          this.progressBar.style.width = `${currentValue}%`;
        }
        if (this.progressPercent) {
          this.progressPercent.textContent = `${Math.round(currentValue)}%`;
        }
        
        if (progress < 1) {
          requestAnimationFrame(animate);
        } else {
          resolve();
        }
      };
      animate();
    });
  }

  showGeneratedContent() {
    if (this.generationProgress) {
      this.generationProgress.style.display = 'none';
    }
    
    if (this.quizSummary) {
      this.quizSummary.style.display = 'block';
      this.quizSummary.style.animation = 'fadeInUp 0.5s ease-out';
    }
    
    if (this.previewQuestionCount) {
      this.animateCountUp(this.previewQuestionCount, parseInt(this.questionCountInput.value));
    }
    if (this.previewTotalMarks) {
      this.animateCountUp(this.previewTotalMarks, parseInt(this.totalMarksInput.value));
    }
    if (this.previewTimeLimit) {
      this.animateCountUp(this.previewTimeLimit, parseInt(this.timeLimitInput.value));
    }
    
    setTimeout(() => {
      this.generateSampleQuestions();
      if (this.questionsContainer) {
        this.questionsContainer.style.display = 'block';
        this.questionsContainer.style.animation = 'fadeInUp 0.5s ease-out';
      }
    }, 500);
    
    setTimeout(() => {
      if (this.quizActions) {
        this.quizActions.style.display = 'flex';
        this.quizActions.style.animation = 'fadeInUp 0.5s ease-out';
      }
    }, 1000);
  }

  animateCountUp(element, target) {
    const duration = 1000;
    const startTime = Date.now();
    
    const animate = () => {
      const elapsed = Date.now() - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const currentValue = Math.floor(target * progress);
      
      element.textContent = currentValue;
      
      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };
    
    animate();
  }

  generateSampleQuestions() {
    if (!this.questionsContainer) return;
    
    this.questionsContainer.innerHTML = '';
    
    const questionCount = parseInt(this.questionCountInput.value) || 15;
    const sampleQuestions = this.getSampleQuestions();
    
    const titleHTML = `
      <div style="text-align: center; margin-bottom: 2rem; padding: 1.5rem; background: rgba(36, 43, 61, 0.3); border-radius: 12px;">
        <h2 style="color: var(--color-text); margin-bottom: 0.5rem; font-size: 1.5rem;">🎯 AI-Generated Quiz</h2>
        <p style="color: var(--color-text-secondary); margin: 0;">Based on your uploaded materials</p>
      </div>
    `;
    this.questionsContainer.innerHTML = titleHTML;
    
    for (let i = 0; i < Math.min(5, questionCount); i++) {
      const question = sampleQuestions[i % sampleQuestions.length];
      const questionHTML = this.generateQuestionHTML(i + 1, question);
      this.questionsContainer.innerHTML += questionHTML;
    }
    
    if (questionCount > 5) {
      const remainingHTML = `
        <div style="text-align: center; margin: 2rem 0; padding: 1.5rem; background: rgba(100, 255, 218, 0.1); border-radius: 12px; border: 1px dashed var(--color-primary);">
          <p style="color: var(--color-text); font-weight: 500; margin: 0;">
            <i class="fas fa-plus-circle" style="margin-right: 0.5rem; color: var(--color-primary);"></i>
            ${questionCount - 5} more questions generated by AI...
          </p>
          <p style="color: var(--color-text-secondary); font-size: 0.9rem; margin: 0.5rem 0 0 0;">
            Download the complete quiz to view all questions
          </p>
        </div>
      `;
      this.questionsContainer.innerHTML += remainingHTML;
    }
  }

  getSampleQuestions() {
    return [
      {
        type: 'MCQ',
        question: 'Which process do plants use to convert sunlight into chemical energy?',
        options: ['Photosynthesis', 'Respiration', 'Fermentation', 'Transpiration'],
        marks: parseInt(this.mcqMarksInput.value) || 2
      },
      {
        type: 'True/False',
        question: 'Mitochondria are known as the powerhouses of the cell.',
        marks: parseInt(this.tfMarksInput.value) || 1
      },
      {
        type: 'Fill in Blank',
        question: 'The process by which plants lose water through their leaves is called __________.',
        marks: parseInt(this.fibMarksInput.value) || 1
      },
      {
        type: 'Short Answer',
        question: 'Explain the significance of the Krebs cycle in cellular respiration.',
        marks: parseInt(this.shortMarksInput.value) || 3
      },
      {
        type: 'Board Question',
        question: 'Describe the process of protein synthesis in eukaryotic cells, including transcription and translation.',
        marks: parseInt(this.boardMarksInput.value) || 5
      }
    ];
  }

  generateQuestionHTML(index, question) {
    let optionsHTML = '';
    
    if (question.type === 'MCQ' && question.options) {
      optionsHTML = `
        <div class="question-options">
          ${question.options.map((option, i) => `
            <div class="question-option">
              <input type="radio" name="q${index}" id="q${index}${String.fromCharCode(97 + i)}">
              <label for="q${index}${String.fromCharCode(97 + i)}">${option}</label>
            </div>
          `).join('')}
        </div>
      `;
    } else if (question.type === 'True/False') {
      optionsHTML = `
        <div class="question-options">
          <div class="question-option">
            <input type="radio" name="q${index}" id="q${index}true">
            <label for="q${index}true">True</label>
          </div>
          <div class="question-option">
            <input type="radio" name="q${index}" id="q${index}false">
            <label for="q${index}false">False</label>
          </div>
        </div>
      `;
    } else if (question.type === 'Fill in Blank') {
      optionsHTML = `
        <div class="question-options">
          <div class="question-option">
            <input type="text" placeholder="Type your answer here" class="form-control" style="max-width: 300px;">
          </div>
        </div>
      `;
    } else if (question.type === 'Short Answer') {
      optionsHTML = `
        <div class="question-options">
          <div class="question-option">
            <textarea placeholder="Type your answer here" class="form-control" rows="3" style="min-height: 80px;"></textarea>
          </div>
        </div>
      `;
    } else if (question.type === 'Board Question') {
      optionsHTML = `
        <div class="question-options">
          <div class="question-option">
            <textarea placeholder="Type your detailed answer here" class="form-control" rows="5" style="min-height: 120px;"></textarea>
          </div>
        </div>
      `;
    }
    
    return `
      <div class="question" style="animation: fadeInUp 0.5s ease-out ${index * 0.1}s both;">
        <div class="question-header">
          <div class="question-number" style="font-weight: 600; color: var(--color-primary);">Question #${index}</div>
          <div class="question-meta">
            <span class="question-type">${question.type}</span>
            <span class="question-marks">${question.marks} Mark${question.marks > 1 ? 's' : ''}</span>
          </div>
        </div>
        <div class="question-text">${question.question}</div>
        ${optionsHTML}
      </div>
    `;
  }

  downloadQuiz() {
    this.showNotification('Generating PDF... This may take a moment.', 'info');
    
    setTimeout(() => {
      this.showNotification('Quiz PDF downloaded successfully!', 'success');
    }, 2000);
  }

  emailQuiz() {
    const email = prompt('Enter your email address to receive the quiz:');
    if (email && this.validateEmail(email)) {
      this.showNotification(`Quiz will be sent to ${email}`, 'success');
    } else if (email) {
      this.showNotification('Please enter a valid email address!', 'error');
    }
  }

  validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  regenerateQuiz() {
    if (this.isGenerating) return;
    
    this.showNotification('Regenerating quiz with new questions...', 'info');
    
    this.resetQuizPreview();
    
    setTimeout(() => {
      this.generateQuiz();
    }, 500);
  }

  scrollToTop() {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  }

  showNotification(message, type = 'success') {
    if (!this.notification) return;
    
    const icon = this.notification.querySelector('i');
    const text = this.notification.querySelector('.notification-text');
    
    if (!icon || !text) return;
    
    text.textContent = message;
    
    const colors = {
      success: { icon: 'fas fa-check-circle', bg: 'var(--color-success)' },
      error: { icon: 'fas fa-exclamation-circle', bg: 'var(--color-error)' },
      info: { icon: 'fas fa-info-circle', bg: 'var(--color-info)' },
      warning: { icon: 'fas fa-exclamation-triangle', bg: 'var(--color-warning)' }
    };
    
    const config = colors[type] || colors.success;
    icon.className = config.icon;
    this.notification.style.background = config.bg;
    
    this.notification.classList.add('show');
    
    setTimeout(() => {
      this.notification.classList.remove('show');
    }, 4000);
  }
}

// Global instance for history actions
let quizApp;

// Initialize the application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  quizApp = new QuizGenerator();
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
  @keyframes ripple {
    to {
      transform: translate(-50%, -50%) scale(4);
      opacity: 0;
    }
  }
  
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
`;
document.head.appendChild(style);