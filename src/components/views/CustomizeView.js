import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';
import { resizeLayout } from '../../utils/windowResize.js';

export class CustomizeView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            cursor: default;
            user-select: none;
            box-sizing: border-box;
        }

        :host {
            display: block;
            height: 100%;
            overflow: hidden;
        }

        .settings-wrapper {
            display: flex;
            flex-direction: column;
            height: 100%;
        }

        /* Tab Navigation */
        .tabs {
            display: flex;
            gap: 2px;
            padding: 8px 12px 0;
            background: transparent;
            border-bottom: 1px solid var(--border-color, rgba(255, 255, 255, 0.1));
            flex-shrink: 0;
        }

        .tab {
            padding: 8px 16px;
            background: transparent;
            border: none;
            color: var(--description-color, rgba(255, 255, 255, 0.5));
            font-size: 12px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            border-radius: 6px 6px 0 0;
            position: relative;
        }

        .tab:hover {
            color: var(--text-color, white);
            background: rgba(255, 255, 255, 0.05);
        }

        .tab.active {
            color: var(--text-color, white);
            background: rgba(255, 255, 255, 0.08);
        }

        .tab.active::after {
            content: '';
            position: absolute;
            bottom: -1px;
            left: 0;
            right: 0;
            height: 2px;
            background: var(--accent-color, #007aff);
            border-radius: 2px 2px 0 0;
        }

        /* Tab Content */
        .tab-content {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
        }

        .tab-panel {
            display: none;
        }

        .tab-panel.active {
            display: block;
        }

        /* Settings Groups */
        .setting-group {
            margin-bottom: 20px;
        }

        .setting-group:last-child {
            margin-bottom: 0;
        }

        .group-title {
            font-size: 11px;
            font-weight: 600;
            color: var(--description-color, rgba(255, 255, 255, 0.5));
            text-transform: uppercase;
            letter-spacing: 0.8px;
            margin-bottom: 12px;
            padding-bottom: 8px;
            border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        /* Setting Row */
        .setting-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 12px 0;
            border-bottom: 1px solid rgba(255, 255, 255, 0.04);
        }

        .setting-row:last-child {
            border-bottom: none;
        }

        .setting-info {
            flex: 1;
            margin-right: 16px;
            min-width: 0;
            overflow: hidden;
        }

        .setting-label {
            font-size: 13px;
            font-weight: 500;
            color: var(--text-color, white);
            margin-bottom: 2px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .setting-description {
            font-size: 11px;
            color: var(--description-color, rgba(255, 255, 255, 0.5));
            line-height: 1.4;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }

        .setting-control {
            flex-shrink: 0;
            min-width: 40px;
        }

        /* Select Control */
        .select-control {
            background: var(--input-background, rgba(0, 0, 0, 0.3));
            color: var(--text-color, white);
            border: 1px solid var(--input-border, rgba(255, 255, 255, 0.12));
            padding: 6px 28px 6px 10px;
            border-radius: 6px;
            font-size: 12px;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 6px center;
            background-repeat: no-repeat;
            background-size: 14px;
            min-width: 120px;
            transition: all 0.15s ease;
        }

        .select-control:hover {
            border-color: rgba(255, 255, 255, 0.2);
            background-color: rgba(0, 0, 0, 0.4);
        }

        .select-control:focus {
            outline: none;
            border-color: var(--accent-color, #007aff);
            box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
        }

        /* Toggle Switch */
        .toggle-switch {
            position: relative;
            display: inline-block;
            width: 40px;
            height: 22px;
            flex-shrink: 0;
        }

        .toggle-switch input {
            opacity: 0;
            width: 0;
            height: 0;
        }

        .toggle-slider {
            position: absolute;
            cursor: pointer;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background: rgba(255, 255, 255, 0.1);
            border: 1px solid rgba(255, 255, 255, 0.15);
            transition: 0.2s ease;
            border-radius: 22px;
        }

        .toggle-slider::before {
            position: absolute;
            content: '';
            height: 16px;
            width: 16px;
            left: 2px;
            bottom: 2px;
            background: white;
            transition: 0.2s ease;
            border-radius: 50%;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.3);
        }

        .toggle-switch input:checked + .toggle-slider {
            background: var(--accent-color, #007aff);
            border-color: var(--accent-color, #007aff);
        }

        .toggle-switch input:checked + .toggle-slider::before {
            transform: translateX(18px);
        }

        .toggle-switch input:focus + .toggle-slider {
            box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
        }

        /* Slider Control */
        .slider-control {
            width: 100%;
            max-width: 200px;
        }

        .slider-header {
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 6px;
        }

        .slider-value {
            font-size: 11px;
            font-weight: 600;
            color: var(--accent-color, #007aff);
            background: rgba(0, 122, 255, 0.1);
            padding: 2px 8px;
            border-radius: 4px;
        }

        .slider-input {
            -webkit-appearance: none;
            appearance: none;
            width: 100%;
            height: 4px;
            border-radius: 2px;
            background: rgba(255, 255, 255, 0.1);
            outline: none;
            cursor: pointer;
        }

        .slider-input::-webkit-slider-thumb {
            -webkit-appearance: none;
            appearance: none;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent-color, #007aff);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
            transition: transform 0.1s ease;
        }

        .slider-input::-webkit-slider-thumb:hover {
            transform: scale(1.1);
        }

        .slider-input::-moz-range-thumb {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: var(--accent-color, #007aff);
            cursor: pointer;
            border: 2px solid white;
            box-shadow: 0 1px 4px rgba(0, 0, 0, 0.3);
        }

        /* Textarea */
        .textarea-control {
            width: 100%;
            background: var(--input-background, rgba(0, 0, 0, 0.3));
            color: var(--text-color, white);
            border: 1px solid var(--input-border, rgba(255, 255, 255, 0.12));
            padding: 10px 12px;
            border-radius: 6px;
            font-size: 12px;
            line-height: 1.5;
            resize: vertical;
            min-height: 80px;
            transition: all 0.15s ease;
            font-family: inherit;
        }

        .textarea-control:hover {
            border-color: rgba(255, 255, 255, 0.2);
        }

        .textarea-control:focus {
            outline: none;
            border-color: var(--accent-color, #007aff);
            box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
        }

        .textarea-control::placeholder {
            color: var(--placeholder-color, rgba(255, 255, 255, 0.3));
        }

        /* Keybind Input */
        .keybind-input {
            background: var(--input-background, rgba(0, 0, 0, 0.3));
            color: var(--text-color, white);
            border: 1px solid var(--input-border, rgba(255, 255, 255, 0.12));
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            font-family: 'SF Mono', 'Consolas', monospace;
            text-align: center;
            min-width: 100px;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .keybind-input:hover {
            border-color: rgba(255, 255, 255, 0.2);
        }

        .keybind-input:focus {
            outline: none;
            border-color: var(--accent-color, #007aff);
            box-shadow: 0 0 0 2px rgba(0, 122, 255, 0.15);
            cursor: text;
        }

        /* Button */
        .btn {
            background: rgba(255, 255, 255, 0.08);
            color: var(--text-color, white);
            border: 1px solid rgba(255, 255, 255, 0.12);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
        }

        .btn:hover {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.2);
        }

        .btn:active {
            transform: translateY(1px);
        }

        /* Keybinds List */
        .keybinds-list {
            display: flex;
            flex-direction: column;
            gap: 2px;
        }

        .keybind-row {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 8px 12px;
            background: rgba(255, 255, 255, 0.02);
            border-radius: 6px;
            transition: background 0.1s ease;
        }

        .keybind-row:hover {
            background: rgba(255, 255, 255, 0.04);
        }

        .keybind-info {
            flex: 1;
        }

        .keybind-name {
            font-size: 12px;
            font-weight: 500;
            color: var(--text-color, white);
        }

        .keybind-desc {
            font-size: 10px;
            color: var(--description-color, rgba(255, 255, 255, 0.4));
            margin-top: 1px;
        }

        /* Warning Box */
        .warning-box {
            display: flex;
            align-items: flex-start;
            gap: 10px;
            padding: 12px;
            background: rgba(251, 191, 36, 0.08);
            border: 1px solid rgba(251, 191, 36, 0.2);
            border-radius: 8px;
            margin-bottom: 16px;
        }

        .warning-icon {
            font-size: 16px;
            line-height: 1;
        }

        .warning-text {
            font-size: 11px;
            color: #fbbf24;
            line-height: 1.5;
        }

        /* Footer Note */
        .settings-footer {
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.02);
            border-top: 1px solid rgba(255, 255, 255, 0.06);
            flex-shrink: 0;
        }

        .footer-note {
            font-size: 10px;
            color: var(--description-color, rgba(255, 255, 255, 0.4));
            text-align: center;
        }

        /* Scrollbar */
        .tab-content::-webkit-scrollbar {
            width: 6px;
        }

        .tab-content::-webkit-scrollbar-track {
            background: transparent;
        }

        .tab-content::-webkit-scrollbar-thumb {
            background: rgba(255, 255, 255, 0.1);
            border-radius: 3px;
        }

        .tab-content::-webkit-scrollbar-thumb:hover {
            background: rgba(255, 255, 255, 0.2);
        }

        /* Full width setting for text areas */
        .setting-row.full-width {
            flex-direction: column;
            align-items: stretch;
        }

        .setting-row.full-width .setting-info {
            margin-right: 0;
            margin-bottom: 10px;
        }

        .setting-row.full-width .setting-control {
            width: 100%;
        }
    `;

    static properties = {
        activeTab: { type: String },
        selectedScreenshotInterval: { type: String },
        selectedImageQuality: { type: String },
        layoutMode: { type: String },
        keybinds: { type: Object },
        googleSearchEnabled: { type: Boolean },
        backgroundTransparency: { type: Number },
        fontSize: { type: Number },
        onScreenshotIntervalChange: { type: Function },
        onImageQualityChange: { type: Function },
        onLayoutModeChange: { type: Function },
        advancedMode: { type: Boolean },
        onAdvancedModeChange: { type: Function },
    };

    constructor() {
        super();
        this.activeTab = 'general';
        this.selectedScreenshotInterval = '5';
        this.selectedImageQuality = 'medium';
        this.layoutMode = 'normal';
        this.keybinds = this.getDefaultKeybinds();
        this.onScreenshotIntervalChange = () => {};
        this.onImageQualityChange = () => {};
        this.onLayoutModeChange = () => {};
        this.onAdvancedModeChange = () => {};
        this.googleSearchEnabled = true;
        this.advancedMode = false;
        this.backgroundTransparency = 0.8;
        this.fontSize = 20;

        this.loadKeybinds();
        this.loadGoogleSearchSettings();
        this.loadAdvancedModeSettings();
        this.loadBackgroundTransparency();
        this.loadFontSize();
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadLayoutMode();
        resizeLayout();
    }

    switchTab(tab) {
        this.activeTab = tab;
    }

    handleScreenshotIntervalSelect(e) {
        this.selectedScreenshotInterval = e.target.value;
        localStorage.setItem('selectedScreenshotInterval', this.selectedScreenshotInterval);
        this.onScreenshotIntervalChange(this.selectedScreenshotInterval);
    }

    handleImageQualitySelect(e) {
        this.selectedImageQuality = e.target.value;
        this.onImageQualityChange(e.target.value);
    }

    handleLayoutModeSelect(e) {
        this.layoutMode = e.target.value;
        localStorage.setItem('layoutMode', this.layoutMode);
        this.onLayoutModeChange(e.target.value);
    }

    handleCustomPromptInput(e) {
        localStorage.setItem('customPrompt', e.target.value);
    }

    getDefaultKeybinds() {
        return {
            moveUp: 'Ctrl+Shift+Up',
            moveDown: 'Ctrl+Shift+Down',
            moveLeft: 'Ctrl+Shift+Left',
            moveRight: 'Ctrl+Shift+Right',
            toggleVisibility: 'Ctrl+\\',
            nextStep: 'Ctrl+Enter',
            goBack: 'Ctrl+Backspace',
            scrollUp: 'Ctrl+Up',
            scrollDown: 'Ctrl+Down',
            emergencyErase: 'Ctrl+Shift+E',
            toggleModel: 'Ctrl+T',
            newSession: 'Ctrl+S',
        };
    }

    loadKeybinds() {
        const savedKeybinds = localStorage.getItem('customKeybinds');
        if (savedKeybinds) {
            try {
                this.keybinds = { ...this.getDefaultKeybinds(), ...JSON.parse(savedKeybinds) };
            } catch (e) {
                console.error('Failed to parse saved keybinds:', e);
                this.keybinds = this.getDefaultKeybinds();
            }
        }
    }

    saveKeybinds() {
        localStorage.setItem('customKeybinds', JSON.stringify(this.keybinds));
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('update-keybinds', this.keybinds);
        }
    }

    handleKeybindChange(action, value) {
        this.keybinds = { ...this.keybinds, [action]: value };
        this.saveKeybinds();
        this.requestUpdate();
    }

    resetKeybinds() {
        this.keybinds = this.getDefaultKeybinds();
        localStorage.removeItem('customKeybinds');
        this.requestUpdate();
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.send('update-keybinds', this.keybinds);
        }
    }

    getKeybindActions() {
        return [
            { key: 'nextStep', name: 'Screenshot + Send', description: 'Capture and send to AI' },
            { key: 'goBack', name: 'Go Back', description: 'Return to main view' },
            { key: 'newSession', name: 'New Session', description: 'Clear chat and start fresh' },
            { key: 'toggleVisibility', name: 'Toggle Visibility', description: 'Show/hide window' },
            { key: 'toggleModel', name: 'Toggle AI Model', description: 'Switch between Gemini models' },
            { key: 'moveUp', name: 'Move Up', description: 'Move window up' },
            { key: 'moveDown', name: 'Move Down', description: 'Move window down' },
            { key: 'moveLeft', name: 'Move Left', description: 'Move window left' },
            { key: 'moveRight', name: 'Move Right', description: 'Move window right' },
            { key: 'scrollUp', name: 'Scroll Up', description: 'Scroll content up' },
            { key: 'scrollDown', name: 'Scroll Down', description: 'Scroll content down' },
            { key: 'emergencyErase', name: 'Emergency Erase', description: 'Clear all and hide' },
        ];
    }

    handleKeybindFocus(e) {
        e.target.placeholder = 'Press keys...';
        e.target.select();
    }

    handleKeybindInput(e) {
        e.preventDefault();
        const modifiers = [];
        if (e.ctrlKey) modifiers.push('Ctrl');
        if (e.metaKey) modifiers.push('Cmd');
        if (e.altKey) modifiers.push('Alt');
        if (e.shiftKey) modifiers.push('Shift');

        let mainKey = e.key;
        switch (e.code) {
            case 'ArrowUp': mainKey = 'Up'; break;
            case 'ArrowDown': mainKey = 'Down'; break;
            case 'ArrowLeft': mainKey = 'Left'; break;
            case 'ArrowRight': mainKey = 'Right'; break;
            case 'Enter': mainKey = 'Enter'; break;
            case 'Space': mainKey = 'Space'; break;
            case 'Backslash': mainKey = '\\'; break;
            default:
                if (e.key.length === 1) mainKey = e.key.toUpperCase();
                break;
        }

        if (['Control', 'Meta', 'Alt', 'Shift'].includes(e.key)) return;

        const keybind = [...modifiers, mainKey].join('+');
        const action = e.target.dataset.action;
        this.handleKeybindChange(action, keybind);
        e.target.value = keybind;
        e.target.blur();
    }

    loadGoogleSearchSettings() {
        const googleSearchEnabled = localStorage.getItem('googleSearchEnabled');
        if (googleSearchEnabled !== null) {
            this.googleSearchEnabled = googleSearchEnabled === 'true';
        }
    }

    async handleGoogleSearchChange(e) {
        this.googleSearchEnabled = e.target.checked;
        localStorage.setItem('googleSearchEnabled', this.googleSearchEnabled.toString());
        if (window.require) {
            try {
                const { ipcRenderer } = window.require('electron');
                await ipcRenderer.invoke('update-google-search-setting', this.googleSearchEnabled);
            } catch (error) {
                console.error('Failed to notify main process:', error);
            }
        }
        this.requestUpdate();
    }

    loadLayoutMode() {
        const savedLayoutMode = localStorage.getItem('layoutMode');
        if (savedLayoutMode) this.layoutMode = savedLayoutMode;
    }

    loadAdvancedModeSettings() {
        const advancedMode = localStorage.getItem('advancedMode');
        if (advancedMode !== null) this.advancedMode = advancedMode === 'true';
    }

    async handleAdvancedModeChange(e) {
        this.advancedMode = e.target.checked;
        localStorage.setItem('advancedMode', this.advancedMode.toString());
        this.onAdvancedModeChange(this.advancedMode);
        this.requestUpdate();
    }

    loadBackgroundTransparency() {
        const backgroundTransparency = localStorage.getItem('backgroundTransparency');
        if (backgroundTransparency !== null) {
            this.backgroundTransparency = parseFloat(backgroundTransparency) || 0.8;
        }
        this.updateBackgroundTransparency();
    }

    handleBackgroundTransparencyChange(e) {
        this.backgroundTransparency = parseFloat(e.target.value);
        localStorage.setItem('backgroundTransparency', this.backgroundTransparency.toString());
        this.updateBackgroundTransparency();
        this.requestUpdate();
    }

    updateBackgroundTransparency() {
        const root = document.documentElement;
        root.style.setProperty('--header-background', `rgba(0, 0, 0, ${this.backgroundTransparency})`);
        root.style.setProperty('--main-content-background', `rgba(0, 0, 0, ${this.backgroundTransparency})`);
        root.style.setProperty('--card-background', `rgba(255, 255, 255, ${this.backgroundTransparency * 0.05})`);
        root.style.setProperty('--input-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.375})`);
        root.style.setProperty('--input-focus-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.625})`);
        root.style.setProperty('--button-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.625})`);
        root.style.setProperty('--preview-video-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 1.125})`);
        root.style.setProperty('--screen-option-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.5})`);
        root.style.setProperty('--screen-option-hover-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.75})`);
        root.style.setProperty('--scrollbar-background', `rgba(0, 0, 0, ${this.backgroundTransparency * 0.5})`);
    }

    loadFontSize() {
        const fontSize = localStorage.getItem('fontSize');
        if (fontSize !== null) this.fontSize = parseInt(fontSize, 10) || 20;
        this.updateFontSize();
    }

    handleFontSizeChange(e) {
        this.fontSize = parseInt(e.target.value, 10);
        localStorage.setItem('fontSize', this.fontSize.toString());
        this.updateFontSize();
        this.requestUpdate();
    }

    updateFontSize() {
        const root = document.documentElement;
        root.style.setProperty('--response-font-size', `${this.fontSize}px`);
    }

    handleStealthProfileChange(e) {
        localStorage.setItem('stealthProfile', e.target.value);
        alert('Restart the application for stealth changes to take full effect.');
    }

    renderGeneralTab() {
        return html`
            <div class="setting-group">
                <div class="group-title">AI Configuration</div>
                
                <div class="setting-row full-width">
                    <div class="setting-info">
                        <div class="setting-label">Custom Instructions</div>
                        <div class="setting-description">Customize how the AI behaves for your specific needs</div>
                    </div>
                    <div class="setting-control">
                        <textarea
                            class="textarea-control"
                            placeholder="e.g., 'You are a calculus expert. Show step-by-step solutions.'"
                            .value=${localStorage.getItem('customPrompt') || ''}
                            @input=${this.handleCustomPromptInput}
                        ></textarea>
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Google Search</div>
                        <div class="setting-description">Allow AI to search for up-to-date information</div>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" .checked=${this.googleSearchEnabled} @change=${this.handleGoogleSearchChange} />
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>

            <div class="setting-group">
                <div class="group-title">Screen Capture</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Image Quality</div>
                        <div class="setting-description">Higher quality uses more tokens</div>
                    </div>
                    <div class="setting-control">
                        <select class="select-control" .value=${this.selectedImageQuality} @change=${this.handleImageQualitySelect}>
                            <option value="high">High</option>
                            <option value="medium">Medium</option>
                            <option value="low">Low</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="setting-group">
                <div class="group-title">Stealth</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Stealth Profile</div>
                        <div class="setting-description">Requires restart to take effect</div>
                    </div>
                    <div class="setting-control">
                        <select class="select-control" .value=${localStorage.getItem('stealthProfile') || 'ultra'} @change=${this.handleStealthProfileChange}>
                            <option value="visible">Visible</option>
                            <option value="balanced">Balanced</option>
                            <option value="ultra">Ultra-Stealth</option>
                        </select>
                    </div>
                </div>
            </div>
        `;
    }

    renderAppearanceTab() {
        return html`
            <div class="setting-group">
                <div class="group-title">Layout</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Window Size</div>
                        <div class="setting-description">Compact mode uses smaller window</div>
                    </div>
                    <div class="setting-control">
                        <select class="select-control" .value=${this.layoutMode} @change=${this.handleLayoutModeSelect}>
                            <option value="normal">Normal</option>
                            <option value="compact">Compact</option>
                        </select>
                    </div>
                </div>
            </div>

            <div class="setting-group">
                <div class="group-title">Appearance</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Background Opacity</div>
                        <div class="setting-description">Adjust interface transparency</div>
                    </div>
                    <div class="setting-control">
                        <div class="slider-control">
                            <div class="slider-header">
                                <span class="slider-value">${Math.round(this.backgroundTransparency * 100)}%</span>
                            </div>
                            <input
                                type="range"
                                class="slider-input"
                                min="0.3"
                                max="1"
                                step="0.05"
                                .value=${this.backgroundTransparency}
                                @input=${this.handleBackgroundTransparencyChange}
                            />
                        </div>
                    </div>
                </div>

                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Response Font Size</div>
                        <div class="setting-description">AI response text size</div>
                    </div>
                    <div class="setting-control">
                        <div class="slider-control">
                            <div class="slider-header">
                                <span class="slider-value">${this.fontSize}px</span>
                            </div>
                            <input
                                type="range"
                                class="slider-input"
                                min="12"
                                max="28"
                                step="1"
                                .value=${this.fontSize}
                                @input=${this.handleFontSizeChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        `;
    }

    renderShortcutsTab() {
        return html`
            <div class="setting-group">
                <div class="group-title">Keyboard Shortcuts</div>
                
                <div class="keybinds-list">
                    ${this.getKeybindActions().map(action => html`
                        <div class="keybind-row">
                            <div class="keybind-info">
                                <div class="keybind-name">${action.name}</div>
                                <div class="keybind-desc">${action.description}</div>
                            </div>
                            <input
                                type="text"
                                class="keybind-input"
                                .value=${this.keybinds[action.key]}
                                placeholder="Press keys..."
                                data-action=${action.key}
                                @keydown=${this.handleKeybindInput}
                                @focus=${this.handleKeybindFocus}
                                readonly
                            />
                        </div>
                    `)}
                </div>

                <div style="margin-top: 16px; text-align: center;">
                    <button class="btn" @click=${this.resetKeybinds}>Reset to Defaults</button>
                </div>
            </div>
        `;
    }

    renderAdvancedTab() {
        return html`
            <div class="warning-box">
                <span class="warning-icon">⚠️</span>
                <span class="warning-text">
                    These settings are for advanced users. Changes may affect application stability.
                </span>
            </div>

            <div class="setting-group">
                <div class="group-title">Developer Options</div>
                
                <div class="setting-row">
                    <div class="setting-info">
                        <div class="setting-label">Advanced Mode</div>
                        <div class="setting-description">Enable experimental features and dev tools</div>
                    </div>
                    <div class="setting-control">
                        <label class="toggle-switch">
                            <input type="checkbox" .checked=${this.advancedMode} @change=${this.handleAdvancedModeChange} />
                            <span class="toggle-slider"></span>
                        </label>
                    </div>
                </div>
            </div>
        `;
    }

    render() {
        return html`
            <div class="settings-wrapper">
                <div class="tabs">
                    <button class="tab ${this.activeTab === 'general' ? 'active' : ''}" @click=${() => this.switchTab('general')}>
                        General
                    </button>
                    <button class="tab ${this.activeTab === 'appearance' ? 'active' : ''}" @click=${() => this.switchTab('appearance')}>
                        Appearance
                    </button>
                    <button class="tab ${this.activeTab === 'shortcuts' ? 'active' : ''}" @click=${() => this.switchTab('shortcuts')}>
                        Shortcuts
                    </button>
                    <button class="tab ${this.activeTab === 'advanced' ? 'active' : ''}" @click=${() => this.switchTab('advanced')}>
                        Advanced
                    </button>
                </div>

                <div class="tab-content">
                    <div class="tab-panel ${this.activeTab === 'general' ? 'active' : ''}">
                        ${this.renderGeneralTab()}
                    </div>
                    <div class="tab-panel ${this.activeTab === 'appearance' ? 'active' : ''}">
                        ${this.renderAppearanceTab()}
                    </div>
                    <div class="tab-panel ${this.activeTab === 'shortcuts' ? 'active' : ''}">
                        ${this.renderShortcutsTab()}
                    </div>
                    <div class="tab-panel ${this.activeTab === 'advanced' ? 'active' : ''}">
                        ${this.renderAdvancedTab()}
                    </div>
                </div>

                <div class="settings-footer">
                    <div class="footer-note">Settings are saved automatically</div>
                </div>
            </div>
        `;
    }
}

customElements.define('customize-view', CustomizeView);
