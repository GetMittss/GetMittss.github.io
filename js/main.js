// 建设中的弹窗配置
const CONSTRUCTION_MODAL_ENABLED = true; // 设置为 false 可关闭弹窗

// 初始化建设中的弹窗
function initConstructionModal() {
    if (!CONSTRUCTION_MODAL_ENABLED) return;
    
    const modal = document.getElementById('constructionModal');
    const closeBtn = document.getElementById('closeConstructionModal');
    const overlay = modal ? modal.querySelector('.modal-overlay') : null;
    
    if (!modal) return;
    
    // 检查是否已显示过弹窗
    const hasSeenModal = localStorage.getItem('constructionModalSeen');
    
    if (!hasSeenModal) {
        modal.classList.add('active');
    }
    
    // 关闭弹窗
    if (closeBtn) {
        closeBtn.addEventListener('click', function() {
            modal.classList.remove('active');
            localStorage.setItem('constructionModalSeen', 'true');
        });
    }
    
    // 点击遮罩层关闭
    if (overlay) {
        overlay.addEventListener('click', function() {
            modal.classList.remove('active');
            localStorage.setItem('constructionModalSeen', 'true');
        });
    }
}

// 平滑滚动
document.querySelectorAll('nav a, .btn-secondary').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        if(this.getAttribute('href').startsWith('#')) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            
            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// 平台按钮点击效果
document.querySelectorAll('.platform-btn').forEach(button => {
    button.addEventListener('click', function() {
        alert('即将跳转到下载页面，请稍候...');
    });
});

// 下载配置
const DOWNLOAD_URL = 'https://example.com/downloads/elemental-havoc-trial.exe';

// 总下载次数功能（所有用户共享）
let totalDownloadCount = parseInt(localStorage.getItem('totalDownloadCount')) || 0;

// 更新总下载次数显示
function updateTotalDownloadCount() {
    const countElement = document.getElementById('totalDownloadCount');
    if (countElement) {
        countElement.textContent = totalDownloadCount.toLocaleString();
    }
}

// 初始化总下载次数显示
document.addEventListener('DOMContentLoaded', function() {
    updateTotalDownloadCount();
});

// 下载按钮点击效果
const downloadBtn = document.getElementById('downloadBtn');
if (downloadBtn) {
    downloadBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // 记录总下载次数
        totalDownloadCount++;
        localStorage.setItem('totalDownloadCount', totalDownloadCount);
        updateTotalDownloadCount();
        
        // 触发实际下载
        const link = document.createElement('a');
        link.href = DOWNLOAD_URL;
        link.download = 'elemental-havoc-trial.exe';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // 显示下载提示
        alert('感谢您对《元素浩劫：英雄重生》的兴趣！\n\n文件大小：15.8 GB\n当前总下载次数：' + totalDownloadCount + '\n预计下载时间：视网络情况而定');
    });
}

// 添加滚动效果
window.addEventListener('scroll', function() {
    const header = document.querySelector('header');
    if (window.scrollY > 100) {
        header.style.backgroundColor = 'rgba(10, 10, 30, 0.98)';
    } else {
        header.style.backgroundColor = 'rgba(10, 10, 30, 0.95)';
    }
});

// 客服功能
const serviceToggle = document.getElementById('serviceToggle');
const servicePanel = document.getElementById('servicePanel');
const closeService = document.getElementById('closeService');

// 展开/收起客服面板
if (serviceToggle) {
    serviceToggle.addEventListener('click', function() {
        servicePanel.classList.toggle('active');
    });
}

// 关闭客服面板
if (closeService) {
    closeService.addEventListener('click', function() {
        servicePanel.classList.remove('active');
    });
}

// 点击外部关闭
document.addEventListener('click', function(e) {
    if (servicePanel && serviceToggle) {
        if (!servicePanel.contains(e.target) && !serviceToggle.contains(e.target)) {
            servicePanel.classList.remove('active');
        }
    }
});

// 开始聊天
function startChat(type) {
    alert('正在连接 ' + type + ' 客服，请稍候...\n\n当前排队人数：3人\n预计等待时间：2-5分钟');
}

// 提交留言
function submitMessage(e) {
    e.preventDefault();
    const name = document.getElementById('userName').value;
    const email = document.getElementById('userEmail').value;
    const message = document.getElementById('userMessage').value;
    
    if (name && email && message) {
        alert('感谢您的留言！\n\n我们已收到您的反馈，客服人员将在24小时内通过邮箱回复您。\n\n提交内容：\n称呼：' + name + '\n邮箱：' + email + '\n问题：' + message);
        document.getElementById('userName').value = '';
        document.getElementById('userEmail').value = '';
        document.getElementById('userMessage').value = '';
    }
}

// 语言切换功能
let currentLang = localStorage.getItem('lang') || 'zh';
let translations = {};

// 加载语言文件
async function loadLanguage(lang) {
    console.log('Loading language:', lang);
    try {
        const response = await fetch(`locales/${lang}.json`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        translations = await response.json();
        console.log('Translations loaded:', translations);
        applyTranslations();
        updateLangSelector();
    } catch (error) {
        console.error('加载语言文件失败:', error);
    }
}

// 应用翻译到页面
function applyTranslations() {
    console.log('Applying translations');
    // 翻译所有带有 data-i18n 属性的元素
    const i18nElements = document.querySelectorAll('[data-i18n]');
    console.log('Found i18n elements:', i18nElements.length);
    
    i18nElements.forEach(element => {
        const key = element.getAttribute('data-i18n');
        const text = getNestedValue(translations, key);
        if (text) {
            element.textContent = text;
            console.log(`Translated ${key}: ${text}`);
        }
    });
    
    // 翻译所有带有 data-i18n-placeholder 属性的元素
    document.querySelectorAll('[data-i18n-placeholder]').forEach(element => {
        const key = element.getAttribute('data-i18n-placeholder');
        const text = getNestedValue(translations, key);
        if (text) {
            element.placeholder = text;
        }
    });
    
    // 更新文档标题
    if (translations.site && translations.site.title) {
        document.title = translations.site.title;
    }
}

// 获取嵌套对象值
function getNestedValue(obj, path) {
    return path.split('.').reduce((acc, part) => acc && acc[part], obj);
}

// 更新语言选择器状态
function updateLangSelector() {
    const options = document.querySelectorAll('.lang-option');
    options.forEach(option => {
        if (option.dataset.lang === currentLang) {
            option.classList.add('active');
        } else {
            option.classList.remove('active');
        }
    });
    
    const currentLangText = document.getElementById('currentLang');
    if (currentLangText) {
        currentLangText.textContent = currentLang === 'zh' ? '中文' : 'English';
    }
}

// 语言切换事件
const langBtn = document.getElementById('langBtn');
const langDropdown = document.getElementById('langDropdown');

if (langBtn) {
    langBtn.addEventListener('click', function(e) {
        e.stopPropagation();
        langDropdown.classList.toggle('active');
        document.querySelector('.language-selector').classList.toggle('active');
    });
}

// 语言选项点击
document.querySelectorAll('.lang-option').forEach(option => {
    option.addEventListener('click', function() {
        const lang = this.dataset.lang;
        currentLang = lang;
        localStorage.setItem('lang', lang);
        loadLanguage(lang);
        langDropdown.classList.remove('active');
        document.querySelector('.language-selector').classList.remove('active');
    });
});

// 点击外部关闭语言选择器
document.addEventListener('click', function(e) {
    const langSelector = document.querySelector('.language-selector');
    if (langSelector && langDropdown) {
        if (!langSelector.contains(e.target)) {
            langDropdown.classList.remove('active');
            langSelector.classList.remove('active');
        }
    }
});

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', function() {
    console.log('DOM Content Loaded');
    initConstructionModal(); // 初始化建设弹窗
    loadLanguage(currentLang);
});

// 如果 DOMContentLoaded 已经触发，立即加载
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('Document already ready, loading language');
    loadLanguage(currentLang);
}