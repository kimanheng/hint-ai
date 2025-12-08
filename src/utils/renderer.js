// renderer.js
const { ipcRenderer } = require('electron');

// Initialize random display name for UI components
window.randomDisplayName = null;

// Request random display name from main process
ipcRenderer
    .invoke('get-random-display-name')
    .then(name => {
        window.randomDisplayName = name;
        console.log('Set random display name:', name);
    })
    .catch(err => {
        console.warn('Could not get random display name:', err);
        window.randomDisplayName = 'System Monitor';
    });

let mediaStream = null;
let screenshotInterval = null;

let hiddenVideo = null;
let offscreenCanvas = null;
let offscreenContext = null;
let currentImageQuality = 'medium'; // Store current image quality for manual screenshots

// Token tracking system for rate limiting
let tokenTracker = {
    tokens: [], // Array of {timestamp, count, type} objects

    // Add tokens to the tracker
    addTokens(count, type = 'image') {
        const now = Date.now();
        this.tokens.push({
            timestamp: now,
            count: count,
            type: type,
        });

        // Clean old tokens (older than 1 minute)
        this.cleanOldTokens();
    },

    // Calculate image tokens based on Gemini 2.0 rules
    calculateImageTokens(width, height) {
        // Images ≤384px in both dimensions = 258 tokens
        if (width <= 384 && height <= 384) {
            return 258;
        }

        // Larger images are tiled into 768x768 chunks, each = 258 tokens
        const tilesX = Math.ceil(width / 768);
        const tilesY = Math.ceil(height / 768);
        const totalTiles = tilesX * tilesY;

        return totalTiles * 258;
    },

    // Clean tokens older than 1 minute
    cleanOldTokens() {
        const oneMinuteAgo = Date.now() - 60 * 1000;
        this.tokens = this.tokens.filter(token => token.timestamp > oneMinuteAgo);
    },

    // Get total tokens in the last minute
    getTokensInLastMinute() {
        this.cleanOldTokens();
        return this.tokens.reduce((total, token) => total + token.count, 0);
    },

    // Check if we should throttle based on settings
    shouldThrottle() {
        // Get rate limiting settings from localStorage
        const throttleEnabled = localStorage.getItem('throttleTokens') === 'true';
        if (!throttleEnabled) {
            return false;
        }

        const maxTokensPerMin = parseInt(localStorage.getItem('maxTokensPerMin') || '1000000', 10);
        const throttleAtPercent = parseInt(localStorage.getItem('throttleAtPercent') || '75', 10);

        const currentTokens = this.getTokensInLastMinute();
        const throttleThreshold = Math.floor((maxTokensPerMin * throttleAtPercent) / 100);

        console.log(`Token check: ${currentTokens}/${maxTokensPerMin} (throttle at ${throttleThreshold})`);

        return currentTokens >= throttleThreshold;
    },

    // Reset the tracker
    reset() {
        this.tokens = [];
    },
};

async function initializeGemini() {
    const apiKey = localStorage.getItem('apiKey')?.trim();
    if (apiKey) {
        const selectedModel = localStorage.getItem('selectedModel') || 'gemini-2.5-flash';
        const success = await ipcRenderer.invoke('initialize-gemini', apiKey, localStorage.getItem('customPrompt') || '', selectedModel);
        if (success) {
            cheddar.setStatus('Ready');
        } else {
            cheddar.setStatus('error');
        }
    }
}

// Listen for status updates
ipcRenderer.on('update-status', (event, status) => {
    console.log('Status update:', status);
    cheddar.setStatus(status);
});

// Listen for responses - REMOVED: This is handled in HintAIApp.js to avoid duplicates
// ipcRenderer.on('update-response', (event, response) => {
//     console.log('Gemini response:', response);
//     cheddar.e().setResponse(response);
//     // You can add UI elements to display the response if needed
// });

async function startCapture(screenshotIntervalSeconds = 5, imageQuality = 'medium') {
    // Store the image quality for manual screenshots
    currentImageQuality = imageQuality;

    // Reset token tracker when starting new capture session
    tokenTracker.reset();
    console.log('🎯 Token tracker reset for new capture session');

    try {
        console.log('Starting screenshot capture...');
        
        mediaStream = await navigator.mediaDevices.getDisplayMedia({
            video: {
                frameRate: 1,
                width: { ideal: 1920 },
                height: { ideal: 1080 },
            },
            audio: false,
        });

        console.log('Screenshot capture started successfully');

        // Handle stream ending
        mediaStream.getVideoTracks()[0].addEventListener('ended', () => {
            console.log('Screen capture ended');
            stopCapture();
        });

        // Start capturing screenshots - check if manual mode
        if (screenshotIntervalSeconds === 'manual' || screenshotIntervalSeconds === 'Manual') {
            console.log('Manual mode enabled - screenshots will be captured on demand only');
            // Don't start automatic capture in manual mode
        } else {
            const intervalMilliseconds = parseInt(screenshotIntervalSeconds) * 1000;
            screenshotInterval = setInterval(() => captureScreenshot(imageQuality), intervalMilliseconds);

            // Capture first screenshot immediately
            setTimeout(() => captureScreenshot(imageQuality), 100);
        }
    } catch (err) {
        console.error('Error starting capture:', err);
        cheddar.setStatus('error');
    }
}

async function captureScreenshot(imageQuality = 'medium', isManual = false) {
    console.log(`Capturing ${isManual ? 'manual' : 'automated'} screenshot...`);
    if (!mediaStream) return;

    // Check rate limiting for automated screenshots only
    if (!isManual && tokenTracker.shouldThrottle()) {
        console.log('⚠️ Automated screenshot skipped due to rate limiting');
        return;
    }

    // Lazy init of video element
    if (!hiddenVideo) {
        hiddenVideo = document.createElement('video');
        hiddenVideo.srcObject = mediaStream;
        hiddenVideo.muted = true;
        hiddenVideo.playsInline = true;
        await hiddenVideo.play();

        await new Promise(resolve => {
            if (hiddenVideo.readyState >= 2) return resolve();
            hiddenVideo.onloadedmetadata = () => resolve();
        });

        // Lazy init of canvas based on video dimensions
        offscreenCanvas = document.createElement('canvas');
        offscreenCanvas.width = hiddenVideo.videoWidth;
        offscreenCanvas.height = hiddenVideo.videoHeight;
        offscreenContext = offscreenCanvas.getContext('2d');
    }

    // Check if video is ready
    if (hiddenVideo.readyState < 2) {
        console.warn('Video not ready yet, skipping screenshot');
        return;
    }

    offscreenContext.drawImage(hiddenVideo, 0, 0, offscreenCanvas.width, offscreenCanvas.height);

    // Check if image was drawn properly by sampling multiple pixels
    const imageData = offscreenContext.getImageData(0, 0, 10, 10);
    let nonBlackPixels = 0;
    for (let i = 0; i < imageData.data.length; i += 4) {
        // Check if pixel is not black (has any color)
        if (imageData.data[i] > 5 || imageData.data[i + 1] > 5 || imageData.data[i + 2] > 5) {
            nonBlackPixels++;
        }
    }
    const isBlank = nonBlackPixels < 5; // Consider blank if less than 5 non-black pixels

    if (isBlank) {
        console.warn('Screenshot appears to be blank/black - attempting native capture to bypass content protection');
        // Try native capture which bypasses content protection
        const nativeSuccess = await captureNativeScreenshot(imageQuality);
        if (nativeSuccess) {
            console.log('Native capture succeeded for blank screen');
            return Promise.resolve(true);
        }
        console.warn('Native capture also failed');
    }

    let qualityValue;
    switch (imageQuality) {
        case 'high':
            qualityValue = 0.9;
            break;
        case 'medium':
            qualityValue = 0.7;
            break;
        case 'low':
            qualityValue = 0.5;
            break;
        default:
            qualityValue = 0.7; // Default to medium
    }

    // Wrap in Promise to ensure we wait for the screenshot to be fully processed
    return new Promise((resolve, reject) => {
        offscreenCanvas.toBlob(
            async blob => {
                if (!blob) {
                    console.error('Failed to create blob from canvas');
                    reject(new Error('Failed to create blob from canvas'));
                    return;
                }

                const reader = new FileReader();
                reader.onloadend = async () => {
                    try {
                        const base64data = reader.result.split(',')[1];

                        // Validate base64 data
                        if (!base64data || base64data.length < 100) {
                            console.error('Invalid base64 data generated');
                            reject(new Error('Invalid base64 data generated'));
                            return;
                        }

                        const result = await ipcRenderer.invoke('send-image-content', {
                            data: base64data,
                        });

                        if (result.success) {
                            // Track image tokens after successful send
                            const imageTokens = tokenTracker.calculateImageTokens(offscreenCanvas.width, offscreenCanvas.height);
                            tokenTracker.addTokens(imageTokens, 'image');
                            console.log(`📊 Image sent successfully - ${imageTokens} tokens used (${offscreenCanvas.width}x${offscreenCanvas.height})`);
                            
                            // Store screenshot for display in chat (both in app and assistant view)
                            const app = window.cheddar && window.cheddar.e();
                            if (app) {
                                app._pendingScreenshot = base64data;
                                if (app._assistantView) {
                                    app._assistantView.setPendingScreenshot(base64data);
                                }
                            }
                            resolve(true);
                        } else {
                            console.error('Failed to send image:', result.error);
                            reject(new Error(result.error));
                        }
                    } catch (error) {
                        console.error('Error processing screenshot:', error);
                        reject(error);
                    }
                };
                reader.onerror = () => {
                    console.error('FileReader error');
                    reject(new Error('FileReader error'));
                };
                reader.readAsDataURL(blob);
            },
            'image/jpeg',
            qualityValue
        );
    });
}

async function captureManualScreenshot(imageQuality = null) {
    console.log('Manual screenshot triggered');
    const quality = imageQuality || currentImageQuality;
    try {
        // First try native capture which bypasses content protection
        const nativeResult = await captureNativeScreenshot(quality);
        if (nativeResult) {
            cheddar.setStatus('Screenshot captured - type your message');
            return true;
        }
        
        // Fallback to stream-based capture if native fails and we have a stream
        if (mediaStream) {
            await captureScreenshot(quality, true);
            cheddar.setStatus('Screenshot captured - type your message');
            return true;
        }
        
        throw new Error('No capture method available');
    } catch (error) {
        console.error('Failed to capture manual screenshot:', error);
        cheddar.setStatus('Failed to capture screenshot');
        return false;
    }
}

// Native screen capture that bypasses content protection
// Uses Electron's desktopCapturer API directly in main process
async function captureNativeScreenshot(imageQuality = 'medium') {
    console.log('Attempting native screenshot capture (bypasses content protection)...');
    try {
        const result = await ipcRenderer.invoke('capture-screen-native', { quality: imageQuality });
        
        if (!result.success) {
            console.error('Native capture failed:', result.error);
            return false;
        }
        
        const base64data = result.data;
        
        // Validate base64 data
        if (!base64data || base64data.length < 100) {
            console.error('Invalid base64 data from native capture');
            return false;
        }
        
        // Send to Gemini
        const sendResult = await ipcRenderer.invoke('send-image-content', {
            data: base64data,
        });
        
        if (sendResult.success) {
            // Track image tokens after successful send
            const imageTokens = tokenTracker.calculateImageTokens(result.width, result.height);
            tokenTracker.addTokens(imageTokens, 'image');
            console.log(`📊 Native screenshot sent successfully - ${imageTokens} tokens used (${result.width}x${result.height})`);
            
            // Store screenshot for display in chat
            const app = window.cheddar && window.cheddar.e();
            if (app) {
                app._pendingScreenshot = base64data;
                if (app._assistantView) {
                    app._assistantView.setPendingScreenshot(base64data);
                }
            }
            return true;
        } else {
            console.error('Failed to send native screenshot:', sendResult.error);
            return false;
        }
    } catch (error) {
        console.error('Error in native screenshot capture:', error);
        return false;
    }
}

// Expose functions to global scope for external access
window.captureManualScreenshot = captureManualScreenshot;
window.captureNativeScreenshot = captureNativeScreenshot;

function stopCapture() {
    if (screenshotInterval) {
        clearInterval(screenshotInterval);
        screenshotInterval = null;
    }

    if (mediaStream) {
        mediaStream.getTracks().forEach(track => track.stop());
        mediaStream = null;
    }

    // Clean up hidden elements
    if (hiddenVideo) {
        hiddenVideo.pause();
        hiddenVideo.srcObject = null;
        hiddenVideo = null;
    }
    offscreenCanvas = null;
    offscreenContext = null;
    
    console.log('Screenshot capture stopped');
}

// Send text message to Gemini
async function sendTextMessage(text) {
    if (!text || text.trim().length === 0) {
        console.warn('Cannot send empty text message');
        return { success: false, error: 'Empty message' };
    }

    try {
        const result = await ipcRenderer.invoke('send-text-message', text);
        if (result.success) {
            console.log('Text message sent successfully');
        } else {
            console.error('Failed to send text message:', result.error);
        }
        return result;
    } catch (error) {
        console.error('Error sending text message:', error);
        return { success: false, error: error.message };
    }
}

// Listen for emergency erase command from main process
ipcRenderer.on('clear-sensitive-data', () => {
    console.log('Clearing renderer-side sensitive data...');
    localStorage.removeItem('apiKey');
    localStorage.removeItem('customPrompt');
});

// Handle shortcuts based on current view
async function handleShortcut(action) {
    const currentView = cheddar.getCurrentView();

    if (action === 'send') {
        // Ctrl+Enter: Start session on main view, or screenshot + send on assistant view
        if (currentView === 'main') {
            cheddar.element().handleStart();
        } else if (currentView === 'assistant') {
            // Check if still processing a previous message
            const assistantView = cheddar.element().shadowRoot.querySelector('assistant-view');
            if (assistantView && assistantView.isProcessing) {
                console.log('Still processing previous message, please wait...');
                return;
            }
            // Capture screenshot and send directly to Gemini
            const success = await captureManualScreenshot();
            // Trigger send on assistant view only if screenshot was captured successfully
            if (success && assistantView) {
                assistantView.handleSendText();
            }
        }
    } else if (action === 'goBack') {
        // Ctrl+Backspace: Go back to main view
        if (currentView !== 'main') {
            cheddar.element().handleClose();
        }
    } else if (action === 'newSession') {
        // Ctrl+S: Start a new session (clear chat history)
        if (currentView === 'assistant') {
            await startNewSession();
        }
    }
}

// Start a new chat session (clear history but stay in assistant view)
async function startNewSession() {
    try {
        const result = await ipcRenderer.invoke('new-chat-session');
        if (result.success) {
            // Clear the assistant view chat
            const app = cheddar.element();
            if (app && app._assistantView) {
                app._assistantView.clearMessages();
                app._assistantView.setPendingScreenshot(null);
            }
            app._pendingScreenshot = null;
            console.log('🔄 New session started - chat history cleared');
        } else {
            console.error('Failed to start new session:', result.error);
            cheddar.setStatus('Error: ' + result.error);
        }
    } catch (error) {
        console.error('Error starting new session:', error);
        cheddar.setStatus('Error starting new session');
    }
}

// Create reference to the main app element
const hintAIApp = document.querySelector('hint-ai-app');

// Consolidated cheddar object - all functions in one place
const cheddar = {
    // Element access
    element: () => hintAIApp,
    e: () => hintAIApp,

    // App state functions - access properties directly from the app element
    getCurrentView: () => hintAIApp.currentView,
    getLayoutMode: () => hintAIApp.layoutMode,

    // Status and response functions
    setStatus: text => hintAIApp.setStatus(text),
    setResponse: response => hintAIApp.setResponse(response),

    // Core functionality
    initializeGemini,
    startCapture,
    stopCapture,
    sendTextMessage,
    handleShortcut,

    // Content protection function
    getContentProtection: () => {
        const contentProtection = localStorage.getItem('contentProtection');
        return contentProtection !== null ? contentProtection === 'true' : true;
    },
};

// Make it globally available
window.cheddar = cheddar;
