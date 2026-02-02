// AEM Component Detail - Content Script
// 在 AEM 編輯模式中為組件工具欄添加 CRX 快速跳轉按鈕

(function() {
    'use strict';

    const ID_BUTTON_REDIRECT = 'aem-helper-crx-redirect';
    const FEATURE_KEY = 'componentDetail';
    const DEBOUNCE_DELAY = 50;
    
    let toolbar = null;
    let observer = null;
    let debounceTimer = null;

    // 檢查是否為 AEM 編輯頁面
    function isAEMEditorPage() {
        return window.location.pathname.includes('/editor.html/');
    }

    // 初始化功能
    async function initializeFeature() {
        // 只在 AEM 編輯頁面執行
        if (!isAEMEditorPage()) {
            return;
        }

        try {
            const { features = {} } = await chrome.storage.sync.get('features');
            if (features[FEATURE_KEY] !== false) {
                // 延遲查找工具欄，等待 AEM 編輯器載入
                waitForToolbar();
            }
        } catch (error) {
            console.error('AEM Helper: 初始化 component-detail 功能失敗', error);
        }
    }

    // 等待工具欄出現
    function waitForToolbar() {
        toolbar = document.getElementById('EditableToolbar');
        if (toolbar) {
            setupToolbarObserver();
        } else {
            // 使用 MutationObserver 等待工具欄出現
            const bodyObserver = new MutationObserver((mutations, obs) => {
                toolbar = document.getElementById('EditableToolbar');
                if (toolbar) {
                    obs.disconnect();
                    setupToolbarObserver();
                }
            });
            bodyObserver.observe(document.body, { childList: true, subtree: true });
        }
    }

    // 設置工具欄變化觀察器
    function setupToolbarObserver() {
        if (observer) {
            observer.disconnect();
        }
        
        observer = new MutationObserver(debouncedHandleMutations);
        observer.observe(toolbar, {
            attributes: true,
            childList: true
            // 移除 subtree: true 以減少不必要的觸發
        });
    }

    // 防抖處理
    function debouncedHandleMutations() {
        if (debounceTimer) {
            clearTimeout(debounceTimer);
        }
        debounceTimer = setTimeout(handleMutations, DEBOUNCE_DELAY);
    }

    // 處理工具欄變化
    function handleMutations() {
        if (!redirectButtonExists()) {
            addRedirectButtonToToolbar();
        }
    }

    // 檢查按鈕是否已存在
    function redirectButtonExists() {
        return document.getElementById(ID_BUTTON_REDIRECT);
    }

    // 添加跳轉按鈕到工具欄
    function addRedirectButtonToToolbar() {
        const lastButton = toolbar.lastElementChild;
        if (lastButton) {
            const dataPath = lastButton.getAttribute('data-path');
            if (dataPath) {
                const path = dataPath.replace(':', '%3A');
                const button = createComponentDetailButton();
                button.addEventListener('click', createClickHandler(path));
                toolbar.appendChild(button);
            }
        }
    }

    // 創建 CRX 跳轉按鈕
    function createComponentDetailButton() {
        const button = document.createElement('button');
        button.className = 'coral-Button coral-Button--quiet cq-editable-action';
        button.id = ID_BUTTON_REDIRECT;
        button.title = 'Open in CRXDE';
        button.type = 'button';
        
        const icon = document.createElement('coral-icon');
        icon.className = 'coral3-Icon--gearsEdit coral-Icon coral-Icon--sizeS';
        icon.setAttribute('aria-label', 'Open in CRXDE');
        button.appendChild(icon);
        
        return button;
    }

    // 創建點擊事件處理器
    function createClickHandler(path) {
        return function(event) {
            event.preventDefault();
            event.stopPropagation();
            window.open(`${location.protocol}//${location.host}/crx/de/index.jsp#${path}`);
        };
    }

    // 等待 DOM 載入完成後初始化
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeFeature);
    } else {
        initializeFeature();
    }
})();
