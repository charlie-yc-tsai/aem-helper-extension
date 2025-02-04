// Initialize application
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Initialize theme
        await initializeTheme();
        
        // Initialize tab settings
        await initializeTabSettings();
        
        // Initialize page data
        const pageData = await getPageData();
        
        // Initialize event listeners
        initializeEventListeners(pageData);
    } catch (error) {
        console.error('Initialization error:', error);
    }
});

// Theme initialization
async function initializeTheme() {
    const darkModeToggle = document.getElementById('darkMode');
    const { darkMode } = await chrome.storage.sync.get('darkMode');
    
    if (darkMode) {
        document.documentElement.setAttribute('data-theme', 'dark');
        darkModeToggle.checked = true;
    }else {
        document.documentElement.setAttribute('data-theme', 'light');
        darkModeToggle.checked = false;
    }

    darkModeToggle.addEventListener('change', async () => {
        const theme = darkModeToggle.checked ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', theme);
        await chrome.storage.sync.set({ darkMode: darkModeToggle.checked });
    });
}

// Tab settings initialization
async function initializeTabSettings() {
    const { baction } = await chrome.storage.sync.get('baction');
    const bactionToggle = document.getElementById('baction');
    
    if (baction) {
        bactionToggle.checked = baction;
    }

    bactionToggle.addEventListener('change', async () => {
        try {
            await chrome.storage.sync.set({ baction: bactionToggle.checked });
        } catch (error) {
            console.error('Failed to save tab settings:', error);
        }
    });
}

// Get current page data
async function getPageData() {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    const url = new URL(tab.url);
    return {
        baseUrl: url.protocol + "//" + url.host,
        path: url.pathname,
        search: url.search
    };
}

// Load page with proper URL
async function loadPage(baseUrl, path) {
    const url = baseUrl + path;
    const openInNewTab = document.getElementById('baction').checked;
    
    if (openInNewTab) {
        // Get current tab index
        const [currentTab] = await chrome.tabs.query({ active: true, currentWindow: true });
        // Create new tab to the right of current tab
        chrome.tabs.create({ 
            url: url,
            index: currentTab.index + 1  // This places the new tab right after the current one
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
        const cleanPath = pageData.path.replace("/editor.html", "").replace(".html", "");
        loadPage(pageData.baseUrl, "/crx/de/index.jsp#" + cleanPath);
    });
}