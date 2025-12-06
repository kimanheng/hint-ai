import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class AssistantView extends LitElement {
    static styles = css`
        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
        }

        * {
            font-family: 'Inter', sans-serif;
            cursor: default;
        }

        .chat-container {
            height: calc(100% - 60px);
            overflow-y: auto;
            border-radius: 10px;
            background: var(--main-content-background);
            padding: 16px;
            scroll-behavior: smooth;
            display: flex;
            flex-direction: column;
            gap: 16px;
        }

        .chat-container::-webkit-scrollbar {
            width: 8px;
        }

        .chat-container::-webkit-scrollbar-track {
            background: var(--scrollbar-track);
            border-radius: 4px;
        }

        .chat-container::-webkit-scrollbar-thumb {
            background: var(--scrollbar-thumb);
            border-radius: 4px;
        }

        .chat-container::-webkit-scrollbar-thumb:hover {
            background: var(--scrollbar-thumb-hover);
        }

        .message {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 85%;
            animation: slideIn 0.3s ease-out;
        }

        @keyframes slideIn {
            from {
                opacity: 0;
                transform: translateY(10px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .message.user {
            align-self: flex-end;
            align-items: flex-end;
        }

        .message.ai {
            align-self: flex-start;
            align-items: flex-start;
        }

        .message-content {
            padding: 12px 16px;
            border-radius: 12px;
            font-size: var(--response-font-size, 16px);
            line-height: 1.5;
            user-select: text;
            cursor: text;
            word-wrap: break-word;
        }

        .message.user .message-content {
            background: var(--focus-border-color, #007aff);
            color: white;
        }

        .message.ai .message-content {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
        }

        .message-screenshot {
            max-width: 400px;
            border-radius: 8px;
            border: 1px solid var(--button-border);
            cursor: pointer;
            transition: transform 0.2s;
        }

        .message-screenshot:hover {
            transform: scale(1.02);
        }

        .empty-chat {
            display: flex;
            align-items: center;
            justify-content: center;
            height: 100%;
            color: var(--description-color);
            font-size: 14px;
            text-align: center;
        }

        /* Markdown styling for AI messages */
        .message-content * {
            user-select: text;
            cursor: text;
        }

        .message-content a {
            cursor: pointer;
            color: var(--link-color);
            text-decoration: none;
        }

        .message-content a:hover {
            text-decoration: underline;
        }

        .message-content h1,
        .message-content h2,
        .message-content h3,
        .message-content h4,
        .message-content h5,
        .message-content h6 {
            margin: 0.8em 0 0.4em 0;
            color: var(--text-color);
            font-weight: 600;
        }

        .message-content h1 {
            font-size: 1.5em;
        }
        .message-content h2 {
            font-size: 1.3em;
        }
        .message-content h3 {
            font-size: 1.15em;
        }

        .message-content p {
            margin: 0.5em 0;
        }

        .message-content ul,
        .message-content ol {
            margin: 0.5em 0;
            padding-left: 1.5em;
        }

        .message-content li {
            margin: 0.3em 0;
        }

        .message-content blockquote {
            margin: 0.8em 0;
            padding: 0.4em 0.8em;
            border-left: 3px solid var(--focus-border-color);
            background: rgba(0, 122, 255, 0.1);
            font-style: italic;
        }

        .message-content code {
            background: rgba(255, 255, 255, 0.1);
            padding: 0.2em 0.4em;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.85em;
        }

        .message-content pre {
            background: rgba(0, 0, 0, 0.3);
            border: 1px solid var(--button-border);
            border-radius: 6px;
            padding: 0.8em;
            overflow-x: auto;
            margin: 0.8em 0;
        }

        .message-content pre code {
            background: none;
            padding: 0;
        }

        .message-content strong,
        .message-content b {
            font-weight: 600;
        }

        .message-content em,
        .message-content i {
            font-style: italic;
        }

        .message-content hr {
            border: none;
            border-top: 1px solid var(--border-color);
            margin: 1em 0;
        }

        .message-content table {
            border-collapse: collapse;
            width: 100%;
            margin: 0.8em 0;
            font-size: 0.9em;
        }

        .message-content th,
        .message-content td {
            border: 1px solid var(--border-color);
            padding: 0.4em;
            text-align: left;
        }

        .message-content th {
            background: rgba(0, 0, 0, 0.2);
            font-weight: 600;
        }

        .input-area {
            display: flex;
            flex-direction: column;
            gap: 8px;
            margin-top: 10px;
        }

        .pending-screenshot-container {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 8px 12px;
            background: var(--input-background);
            border: 1px solid var(--button-border);
            border-radius: 8px;
        }

        .pending-screenshot-preview {
            width: 60px;
            height: 40px;
            object-fit: cover;
            border-radius: 4px;
            border: 1px solid var(--button-border);
        }

        .pending-screenshot-info {
            flex: 1;
            font-size: 12px;
            color: var(--description-color);
        }

        .remove-screenshot-button {
            background: transparent;
            border: none;
            color: var(--description-color);
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.15s ease;
        }

        .remove-screenshot-button:hover {
            background: rgba(255, 0, 0, 0.1);
            color: #ff4444;
        }

        .remove-screenshot-button svg {
            width: 16px;
            height: 16px;
        }

        .text-input-container {
            display: flex;
            gap: 10px;
            align-items: center;
        }

        .text-input-container input {
            flex: 1;
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 12px 16px;
            border-radius: 8px;
            font-size: 14px;
        }

        .text-input-container input:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 3px var(--focus-box-shadow);
            background: var(--input-focus-background);
        }

        .text-input-container input::placeholder {
            color: var(--placeholder-color);
        }

        .model-selector {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 6px 10px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            appearance: none;
            background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3e%3cpath stroke='%23ffffff' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3e%3c/svg%3e");
            background-position: right 6px center;
            background-repeat: no-repeat;
            background-size: 10px;
            padding-right: 24px;
            transition: all 0.15s ease;
            white-space: nowrap;
        }

        .model-selector:hover {
            background: var(--input-hover-background);
            border-color: var(--input-hover-border);
        }

        .model-selector:focus {
            outline: none;
            border-color: var(--focus-border-color);
            box-shadow: 0 0 0 2px var(--focus-box-shadow);
        }

        .send-button {
            background: var(--focus-border-color, #007aff);
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 8px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.15s ease;
            display: flex;
            align-items: center;
            gap: 6px;
        }

        .send-button:hover {
            background: var(--focus-border-color-hover, #0062cc);
            transform: scale(1.02);
        }

        .send-button:active {
            transform: scale(0.98);
        }

        .send-button svg {
            width: 16px;
            height: 16px;
        }

        .typing-indicator {
            display: flex;
            gap: 4px;
            padding: 12px 16px;
            align-items: center;
        }

        .typing-indicator .dot {
            width: 8px;
            height: 8px;
            background: var(--description-color);
            border-radius: 50%;
            animation: bounce 1.4s infinite ease-in-out;
        }

        .typing-indicator .dot:nth-child(1) { animation-delay: 0s; }
        .typing-indicator .dot:nth-child(2) { animation-delay: 0.2s; }
        .typing-indicator .dot:nth-child(3) { animation-delay: 0.4s; }

        @keyframes bounce {
            0%, 80%, 100% { transform: translateY(0); }
            40% { transform: translateY(-6px); }
        }

        .message-time {
            font-size: 10px;
            color: var(--description-color);
            margin-top: 4px;
        }

        .message.user .message-time {
            text-align: right;
        }
    `;

    static properties = {
        messages: { type: Array },
        onSendText: { type: Function },
        selectedModel: { type: String },
        isTyping: { type: Boolean },
        pendingScreenshot: { type: String },
    };

    constructor() {
        super();
        this.messages = [];
        this.onSendText = () => {};
        this.selectedModel = localStorage.getItem('selectedModel') || 'gemini-3-pro-preview';
        this.isTyping = false;
        this.pendingScreenshot = null;
    }

    handleModelChange(e) {
        this.selectedModel = e.target.value;
        localStorage.setItem('selectedModel', this.selectedModel);
        
        const statusMessage = `Model changed to ${this.selectedModel === 'gemini-3-pro-preview' ? 'Gemini 3 Pro' : 'Gemini 2.5 Flash'}. Restart your session for this to take effect.`;
        if (window.cheddar) {
            window.cheddar.setStatus(statusMessage);
        }
        
        this.requestUpdate();
    }

    addMessage(type, content, screenshot = null) {
        // If adding an AI message, stop typing indicator
        if (type === 'ai') {
            this.isTyping = false;
        }
        
        this.messages = [...this.messages, {
            type,
            content,
            screenshot,
            timestamp: Date.now()
        }];
        
        // Auto-scroll to bottom
        this.updateComplete.then(() => {
            const container = this.shadowRoot.querySelector('.chat-container');
            if (container) {
                container.scrollTop = container.scrollHeight;
            }
        });
    }

    setTyping(isTyping) {
        this.isTyping = isTyping;
        if (isTyping) {
            // Auto-scroll to show typing indicator
            this.updateComplete.then(() => {
                const container = this.shadowRoot.querySelector('.chat-container');
                if (container) {
                    container.scrollTop = container.scrollHeight;
                }
            });
        }
    }

    setPendingScreenshot(screenshot) {
        this.pendingScreenshot = screenshot;
        this.requestUpdate();
    }

    removePendingScreenshot() {
        this.pendingScreenshot = null;
        // Also clear from the app's pending screenshot
        const app = window.cheddar && window.cheddar.e();
        if (app) {
            app._pendingScreenshot = null;
        }
        this.requestUpdate();
    }

    clearMessages() {
        this.messages = [];
    }

    renderMarkdown(content) {
        if (typeof window !== 'undefined' && window.marked) {
            try {
                window.marked.setOptions({
                    breaks: true,
                    gfm: true,
                    sanitize: false,
                });
                return window.marked.parse(content);
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return this.escapeHtml(content).replace(/\n/g, '<br>');
            }
        }
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    scrollChatDown() {
        const container = this.shadowRoot.querySelector('.chat-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.min(container.scrollHeight - container.clientHeight, container.scrollTop + scrollAmount);
        }
    }

    scrollChatUp() {
        const container = this.shadowRoot.querySelector('.chat-container');
        if (container) {
            const scrollAmount = container.clientHeight * 0.3;
            container.scrollTop = Math.max(0, container.scrollTop - scrollAmount);
        }
    }

    loadFontSize() {
        const fontSize = localStorage.getItem('fontSize');
        if (fontSize !== null) {
            const fontSizeValue = parseInt(fontSize, 10) || 20;
            const root = document.documentElement;
            root.style.setProperty('--response-font-size', `${fontSizeValue}px`);
        }
    }

    connectedCallback() {
        super.connectedCallback();
        this.loadFontSize();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');

            this.handleScrollUp = () => {
                this.scrollChatUp();
            };

            this.handleScrollDown = () => {
                this.scrollChatDown();
            };

            ipcRenderer.on('scroll-response-up', this.handleScrollUp);
            ipcRenderer.on('scroll-response-down', this.handleScrollDown);
        }
    }

    disconnectedCallback() {
        super.disconnectedCallback();

        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            if (this.handleScrollUp) {
                ipcRenderer.removeListener('scroll-response-up', this.handleScrollUp);
            }
            if (this.handleScrollDown) {
                ipcRenderer.removeListener('scroll-response-down', this.handleScrollDown);
            }
        }
    }

    async handleSendText() {
        const textInput = this.shadowRoot.querySelector('#textInput');
        const hasText = textInput && textInput.value.trim();
        const hasScreenshot = this.pendingScreenshot;
        
        // Send if there's either text or a pending screenshot
        if (hasText || hasScreenshot) {
            // Use default message if sending screenshot without text
            const message = hasText ? textInput.value.trim() : 'Answer first, explanation later';
            if (textInput) textInput.value = '';
            this.isTyping = true; // Show typing indicator
            await this.onSendText(message);
        }
    }

    handleTextKeydown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            this.handleSendText();
        }
    }

    formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }

    render() {
        return html`
            <div class="chat-container">
                ${this.messages.length === 0
                    ? html`<div class="empty-chat">Hello, I'm ready to help!<br/>Send a screenshot or type a message.</div>`
                    : this.messages.map(msg => {
                          if (msg.type === 'user') {
                              return html`
                                  <div class="message user">
                                      ${msg.screenshot
                                          ? html`<img src="data:image/jpeg;base64,${msg.screenshot}" class="message-screenshot" />`
                                          : ''}
                                      <div class="message-content">${msg.content}</div>
                                      <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                                  </div>
                              `;
                          } else {
                              return html`
                                  <div class="message ai">
                                      <div class="message-content" .innerHTML=${this.renderMarkdown(msg.content)}></div>
                                      <div class="message-time">${this.formatTime(msg.timestamp)}</div>
                                  </div>
                              `;
                          }
                      })}
                ${this.isTyping ? html`
                    <div class="message ai">
                        <div class="typing-indicator">
                            <div class="dot"></div>
                            <div class="dot"></div>
                            <div class="dot"></div>
                        </div>
                    </div>
                ` : ''}
            </div>

            <div class="input-area">
                ${this.pendingScreenshot ? html`
                    <div class="pending-screenshot-container">
                        <img src="data:image/jpeg;base64,${this.pendingScreenshot}" class="pending-screenshot-preview" />
                        <span class="pending-screenshot-info">Screenshot ready to send</span>
                        <button class="remove-screenshot-button" @click=${this.removePendingScreenshot} title="Remove screenshot">
                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M18 6L6 18M6 6L18 18" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            </svg>
                        </button>
                    </div>
                ` : ''}

                <div class="text-input-container">
                    <select class="model-selector" .value=${this.selectedModel} @change=${this.handleModelChange} title="Select AI Model">
                        <option value="gemini-3-pro-preview">Gemini 3 Pro</option>
                        <option value="gemini-2.5-flash">Gemini 2.5 Flash</option>
                    </select>

                    <input type="text" id="textInput" placeholder="${this.pendingScreenshot ? 'Type a message about the screenshot...' : 'Type a message...'}" @keydown=${this.handleTextKeydown} />

                    <button class="send-button" @click=${this.handleSendText} title="Send message">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path d="M22 2L11 13" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                            <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);
