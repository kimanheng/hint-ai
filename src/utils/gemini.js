const { GoogleGenerativeAI } = require('@google/generative-ai');
const { BrowserWindow, ipcMain } = require('electron');

let isInitializingSession = false;
let geminiModel = null;

function sendToRenderer(channel, data) {
    const windows = BrowserWindow.getAllWindows();
    if (windows.length > 0) {
        windows[0].webContents.send(channel, data);
    }
}

async function getStoredSetting(key, defaultValue) {
    try {
        const windows = BrowserWindow.getAllWindows();
        if (windows.length > 0) {
            // Wait a bit for the renderer to be ready
            await new Promise(resolve => setTimeout(resolve, 100));

            // Try to get setting from renderer process localStorage
            const value = await windows[0].webContents.executeJavaScript(`
                (function() {
                    try {
                        if (typeof localStorage === 'undefined') {
                            console.log('localStorage not available yet for ${key}');
                            return '${defaultValue}';
                        }
                        const stored = localStorage.getItem('${key}');
                        console.log('Retrieved setting ${key}:', stored);
                        return stored || '${defaultValue}';
                    } catch (e) {
                        console.error('Error accessing localStorage for ${key}:', e);
                        return '${defaultValue}';
                    }
                })()
            `);
            return value;
        }
    } catch (error) {
        console.error('Error getting stored setting for', key, ':', error.message);
    }
    console.log('Using default value for', key, ':', defaultValue);
    return defaultValue;
}

async function initializeGeminiSession(apiKey, customPrompt = '', selectedModel = '') {
    if (isInitializingSession) {
        console.log('Session initialization already in progress');
        return false;
    }

    isInitializingSession = true;
    sendToRenderer('session-initializing', true);

    try {
        const genAI = new GoogleGenerativeAI(apiKey);
        
        // Default system prompt if none provided
        const systemPrompt = customPrompt || 'Hello, would you like any help?';
        
        // Use selected model or default to Gemini 2.5 Flash
        const modelName = selectedModel || 'gemini-2.5-flash';
        console.log('Initializing model:', modelName);
        
        const model = genAI.getGenerativeModel({ 
            model: modelName,
            systemInstruction: systemPrompt
        });

        geminiModel = model;

        isInitializingSession = false;
        sendToRenderer('session-initializing', false);
        sendToRenderer('update-status', 'Session connected - Ready for screenshots');
        
        console.log(`${modelName} session initialized successfully`);
        return true;
    } catch (error) {
        console.error('Failed to initialize Gemini session:', error);
        isInitializingSession = false;
        sendToRenderer('session-initializing', false);
        sendToRenderer('update-status', 'Error: ' + error.message);
        return false;
    }
}

function setupGeminiIpcHandlers(geminiSessionRef) {
    // Store the geminiSessionRef globally
    global.geminiSessionRef = geminiSessionRef;

    ipcMain.handle('initialize-gemini', async (event, apiKey, customPrompt, selectedModel) => {
        const success = await initializeGeminiSession(apiKey, customPrompt, selectedModel);
        return success;
    });

    ipcMain.handle('send-image-content', async (event, { data }) => {
        if (!geminiModel) {
            return { success: false, error: 'No active Gemini session' };
        }

        try {
            if (!data || typeof data !== 'string') {
                console.error('Invalid image data received');
                return { success: false, error: 'Invalid image data' };
            }

            const buffer = Buffer.from(data, 'base64');

            if (buffer.length < 1000) {
                console.error(`Image buffer too small: ${buffer.length} bytes`);
                return { success: false, error: 'Image buffer too small' };
            }

            console.log('📸 Screenshot received, storing for next query...');
            
            // Store the image for the next text query
            if (!global.pendingImages) {
                global.pendingImages = [];
            }
            global.pendingImages.push({
                inlineData: {
                    data: data,
                    mimeType: 'image/jpeg'
                }
            });

            return { success: true };
        } catch (error) {
            console.error('Error processing image:', error);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('send-text-message', async (event, text) => {
        if (!geminiModel) {
            return { success: false, error: 'No active Gemini session' };
        }

        try {
            if (!text || typeof text !== 'string' || text.trim().length === 0) {
                return { success: false, error: 'Invalid text message' };
            }

            console.log('💬 Sending message to Gemini:', text);
            sendToRenderer('update-status', 'Processing...');

            // Prepare the message parts (text + any pending images)
            const messageParts = [];
            
            // Add pending images if any
            if (global.pendingImages && global.pendingImages.length > 0) {
                console.log(`📎 Including ${global.pendingImages.length} screenshot(s) with query`);
                messageParts.push(...global.pendingImages);
                global.pendingImages = []; // Clear pending images
            }
            
            // Add the text
            messageParts.push(text.trim());

            const result = await geminiModel.generateContent(messageParts);
            const response = result.response;
            const responseText = response.text();

            console.log('✅ Received response from Gemini');
            
            // Update UI with response
            sendToRenderer('update-response', responseText);
            sendToRenderer('update-status', 'Ready');

            return { success: true, response: responseText };
        } catch (error) {
            console.error('Error sending message to Gemini:', error);
            sendToRenderer('update-status', 'Error: ' + error.message);
            return { success: false, error: error.message };
        }
    });

    ipcMain.handle('close-session', async event => {
        try {
            geminiModel = null;
            
            if (global.pendingImages) {
                global.pendingImages = [];
            }

            sendToRenderer('update-status', 'Session closed');
            return { success: true };
        } catch (error) {
            console.error('Error closing session:', error);
            return { success: false, error: error.message };
        }
    });
}

module.exports = {
    initializeGeminiSession,
    getStoredSetting,
    sendToRenderer,
    setupGeminiIpcHandlers,
};
