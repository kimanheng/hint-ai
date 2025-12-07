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

        /* LaTeX/KaTeX styling */
        .message-content .katex {
            font-size: 1.1em;
        }

        .message-content .katex-display {
            margin: 0.8em 0;
            overflow-x: auto;
            overflow-y: hidden;
            padding: 0.5em 0;
        }

        .message-content .katex-display > .katex {
            text-align: center;
        }

        .message-content .latex-inline {
            display: inline;
        }

        .message-content .latex-block {
            display: block;
            text-align: center;
            margin: 0.8em 0;
            overflow-x: auto;
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

        .model-toggle {
            background: var(--input-background);
            color: var(--text-color);
            border: 1px solid var(--button-border);
            padding: 6px 12px;
            border-radius: 6px;
            font-size: 11px;
            cursor: pointer;
            transition: all 0.15s ease;
            white-space: nowrap;
            user-select: none;
        }

        .model-toggle:hover {
            background: var(--input-hover-background);
            border-color: var(--input-hover-border);
        }

        .model-toggle:active {
            transform: scale(0.98);
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
        this.selectedModel = localStorage.getItem('selectedModel') || 'gemini-2.5-flash';
        this.isTyping = false;
        this.pendingScreenshot = null;
    }

    handleModelChange() {
        // Toggle between the two models
        this.selectedModel = this.selectedModel === 'gemini-2.5-flash' ? 'gemini-3-pro' : 'gemini-2.5-flash';
        localStorage.setItem('selectedModel', this.selectedModel);
        
        // Persist to config file
        if (window.require) {
            const { ipcRenderer } = window.require('electron');
            ipcRenderer.invoke('set-selected-model', this.selectedModel);
        }
        
        const modelName = this.selectedModel === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'Gemini 3 Pro';
        if (window.cheddar) {
            window.cheddar.setStatus('Switching to ' + modelName + '...');
            window.cheddar.initializeGemini().then(() => {
                window.cheddar.setStatus('Switched to ' + modelName);
            });
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
                
                // Process LaTeX before markdown parsing
                let processedContent = this.processLaTeX(content);
                
                return window.marked.parse(processedContent);
            } catch (error) {
                console.warn('Error parsing markdown:', error);
                return this.escapeHtml(content).replace(/\n/g, '<br>');
            }
        }
        return this.escapeHtml(content).replace(/\n/g, '<br>');
    }

    processLaTeX(content) {
        if (typeof window === 'undefined' || !window.katex) {
            return content;
        }

        // Store code blocks to prevent LaTeX processing inside them
        const codeBlocks = [];
        let processedContent = content.replace(/```[\s\S]*?```|`[^`]+`/g, (match) => {
            codeBlocks.push(match);
            return `%%CODEBLOCK_${codeBlocks.length - 1}%%`;
        });

        // Process block LaTeX: $$...$$ (display mode)
        processedContent = processedContent.replace(/\$\$([\s\S]+?)\$\$/g, (match, latex) => {
            try {
                return `<div class="latex-block">${window.katex.renderToString(latex.trim(), {
                    displayMode: true,
                    throwOnError: false,
                    output: 'html'
                })}</div>`;
            } catch (error) {
                console.warn('KaTeX block error:', error);
                return match;
            }
        });

        // Process inline LaTeX: $...$ (but not $$)
        // Use negative lookbehind/lookahead to avoid matching $$ delimiters
        processedContent = processedContent.replace(/(?<!\$)\$(?!\$)([^$\n]+?)\$(?!\$)/g, (match, latex) => {
            try {
                return `<span class="latex-inline">${window.katex.renderToString(latex.trim(), {
                    displayMode: false,
                    throwOnError: false,
                    output: 'html'
                })}</span>`;
            } catch (error) {
                console.warn('KaTeX inline error:', error);
                return match;
            }
        });

        // Also support \[...\] for display mode and \(...\) for inline mode
        processedContent = processedContent.replace(/\\\[([\s\S]+?)\\\]/g, (match, latex) => {
            try {
                return `<div class="latex-block">${window.katex.renderToString(latex.trim(), {
                    displayMode: true,
                    throwOnError: false,
                    output: 'html'
                })}</div>`;
            } catch (error) {
                console.warn('KaTeX display error:', error);
                return match;
            }
        });

        processedContent = processedContent.replace(/\\\(([\s\S]+?)\\\)/g, (match, latex) => {
            try {
                return `<span class="latex-inline">${window.katex.renderToString(latex.trim(), {
                    displayMode: false,
                    throwOnError: false,
                    output: 'html'
                })}</span>`;
            } catch (error) {
                console.warn('KaTeX inline error:', error);
                return match;
            }
        });

        // Restore code blocks
        processedContent = processedContent.replace(/%%CODEBLOCK_(\d+)%%/g, (match, index) => {
            return codeBlocks[parseInt(index, 10)];
        });

        return processedContent;
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
            const message = hasText ? textInput.value.trim() : 'Answer all questions with maximum accuracy. Provide answer first, then provide brief explanations for your answer.';
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
                    ? html`<div class="empty-chat">Hello, I'm ready to help!<br/>Ctrl + Enter to screenshot and send.</div>`
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
                    <div class="model-toggle" @click=${this.handleModelChange} title="Click to toggle AI Model (Ctrl+T)">
                        ${this.selectedModel === 'gemini-2.5-flash' ? 'Gemini 2.5 Flash' : 'Gemini 3 Pro'}
                    </div>
                </div>
            </div>
        `;
    }
}

customElements.define('assistant-view', AssistantView);
