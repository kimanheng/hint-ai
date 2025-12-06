// stealthFeatures.js - Additional stealth features for Windows process hiding

/**
 * Apply additional stealth measures to the Electron application
 * @param {BrowserWindow} mainWindow - The main application window
 */
function applyStealthMeasures(mainWindow) {
    console.log('Applying additional stealth measures...');

    // Hide from alt-tab on Windows
    try {
        mainWindow.setSkipTaskbar(true);
        console.log('Hidden from Windows taskbar');
    } catch (error) {
        console.warn('Could not hide from taskbar:', error.message);
    }

    // Prevent screenshots if content protection is enabled
    try {
        mainWindow.setContentProtection(true);
        console.log('Content protection enabled');
    } catch (error) {
        console.warn('Could not enable content protection:', error.message);
    }

    // Set Windows user agent
    try {
        const userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36';
        mainWindow.webContents.setUserAgent(userAgent);
        console.log('Set Windows user agent');
    } catch (error) {
        console.warn('Could not set user agent:', error.message);
    }
}

/**
 * Periodically randomize window title to avoid detection
 * @param {BrowserWindow} mainWindow - The main application window
 */
function startTitleRandomization(mainWindow) {
    const titles = [
        'System Configuration',
        'Audio Settings',
        'Network Monitor',
        'Performance Monitor',
        'System Information',
        'Device Manager',
        'Background Services',
        'System Updates',
        'Security Center',
        'Task Manager',
        'Resource Monitor',
        'System Properties',
        'Network Connections',
        'Audio Devices',
        'Display Settings',
        'Power Options',
        'System Tools',
        'Hardware Monitor',
    ];

    // Change title every 30-60 seconds
    const interval = setInterval(() => {
        try {
            if (!mainWindow.isDestroyed()) {
                const randomTitle = titles[Math.floor(Math.random() * titles.length)];
                mainWindow.setTitle(randomTitle);
            } else {
                clearInterval(interval);
            }
        } catch (error) {
            console.warn('Could not update window title:', error.message);
            clearInterval(interval);
        }
    }, 30000 + Math.random() * 30000); // 30-60 seconds

    return interval;
}

/**
 * Anti-debugging and anti-analysis measures
 */
function applyAntiAnalysisMeasures() {
    console.log('Applying anti-analysis measures...');

    // Clear console on production
    if (process.env.NODE_ENV === 'production') {
        console.clear();
    }

    // Randomize startup delay to avoid pattern detection
    const delay = 1000 + Math.random() * 3000; // 1-4 seconds
    return new Promise(resolve => {
        setTimeout(resolve, delay);
    });
}

module.exports = {
    applyStealthMeasures,
    startTitleRandomization,
    applyAntiAnalysisMeasures,
};
