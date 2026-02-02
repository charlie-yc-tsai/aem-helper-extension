// Cache DOM elements and state
let cachedElements = null;
let cachedTabIndex = 0;

// Get cached DOM elements
function getElements() {
    if (!cachedElements) {
        cachedElements = {
            darkModeToggle: document.getElementById('darkMode'),
            bactionToggle: document.getElementById('baction'),
            componentDetailToggle: document.getElementById('componentDetail')
        };
    }
    return cachedElements;
}

// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Batch fetch all storage data in one call
        const [storageData, pageData] = await Promise.all([
            chrome.storage.sync.get(['darkMode', 'baction', 'features']),
            getPageData()
        ]);
        
        // Cache tab index for later use
        cachedTabIndex = pageData.tabIndex;
        
        // Initialize all settings with cached data
        initializeAllSettings(storageData);
        
        // Initialize event listeners
        initializeEventListeners(pageData);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Initialize all settings at once
function initializeAllSettings(storageData) {
    const { darkModeToggle, bactionToggle, componentDetailToggle } = getElements();
    const { darkMode, baction, features = {} } = storageData;
    
    // Theme (default: enabled)
    const isDark = darkMode !== undefined ? darkMode : true;
    document.documentElement.setAttribute('data-theme', isDark ? 'dark' : 'light');
    darkModeToggle.checked = isDark;
    
    // New Tab (default: enabled)
    bactionToggle.checked = baction !== undefined ? baction : true;
    
    // Component Detail (default: enabled)
    componentDetailToggle.checked = features.componentDetail !== undefined ? features.componentDetail : true;
    
    // Setup change listeners
    darkModeToggle.addEventListener('change', () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
    });
    
    bactionToggle.addEventListener('change', () => {
        chrome.storage.sync.set({ baction: bactionToggle.checked });
    });
    
    componentDetailToggle.addEventListener('change', async () => {
        const { features = {} } = await chrome.storage.sync.get('features');
        features.componentDetail = componentDetailToggle.checked;
        chrome.storage.sync.set({ features });
    });
}

// Get current page data
async function getPageData() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    return {
        baseUrl: url.protocol + "//" + url.host,
        path: url.pathname,
        search: url.search,
        searchParams: url.searchParams,
        tabIndex: tab.index
    };
}

// Load page with proper URL
function loadPage(baseUrl, path) {
    const url = baseUrl + path;
    const { bactionToggle } = getElements();
    
    if (bactionToggle.checked) {
        chrome.tabs.create({ 
            url: url,
            index: cachedTabIndex + 1
        });
    } else {
        chrome.tabs.update(null, { active: true, url: url });
        window.close();
    }
}

// Update query string parameters
function updateQueryStringParameter(uri, key, value) {
    const re = new RegExp("([?&])" + key + "=.*?(&|$)", "i");
    const separator = uri.indexOf('?') !== -1 ? "&" : "?";
    
    if (uri.match(re)) {
        return uri.replace(re, '$1' + key + "=" + value + '$2');
    }
    return uri + separator + key + "=" + value;
}

// Initialize all event listeners
function initializeEventListeners(pageData) {
    // Generic function buttons
    document.querySelectorAll('.generic-func').forEach(button => {
        button.addEventListener('click', function() {
            const href = this.getAttribute('href');
            loadPage(pageData.baseUrl, href);
        });
    });

    // Debug buttons
    document.getElementById("debug-clientlibs").addEventListener("click", () => {
        const path = pageData.path.replace("/editor.html", "");
        const newPath = updateQueryStringParameter(path + pageData.search, "debugClientLibs", "true");
        loadPage(pageData.baseUrl, newPath);
    });

    document.getElementById("debug-layout").addEventListener("click", () => {
        const path = pageData.path.replace("/editor.html", "");
        const newPath = updateQueryStringParameter(path + pageData.search, "debug", "layout");
        loadPage(pageData.baseUrl, newPath);
    });

    document.getElementById("disabled-mode").addEventListener("click", () => {
        const path = pageData.path.replace("/editor.html", "");
        const newPath = updateQueryStringParameter(path + pageData.search, "wcmmode", "disabled");
        loadPage(pageData.baseUrl, newPath);
    });

    document.getElementById("edit-mode").addEventListener("click", () => {
        loadPage(pageData.baseUrl, "/editor.html" + pageData.path);
    });

    document.getElementById("page-properties").addEventListener("click", () => {
        const cleanPath = pageData.path.replace("/editor.html", "").replace(".html", "");
        loadPage(pageData.baseUrl, "/mnt/overlay/wcm/core/content/sites/properties.html?item=" + cleanPath);
    });

    document.getElementById("in-crx-de").addEventListener("click", () => {
        let cleanPath;
        
        // 檢查是否為 properties.html 頁面，從 item 參數獲取路徑
        if (pageData.path.includes('/mnt/overlay/wcm/core/content/sites/properties.html')) {
            cleanPath = pageData.searchParams.get('item') || '';
        } else {
            cleanPath = pageData.path.replace("/editor.html", "").replace(".html", "");
        }
        
        loadPage(pageData.baseUrl, "/crx/de/index.jsp#" + cleanPath);
    });
}