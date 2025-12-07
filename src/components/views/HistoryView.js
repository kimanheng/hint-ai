import { html, css, LitElement } from '../../assets/lit-core-2.7.4.min.js';

export class HistoryView extends LitElement {
    static styles = css`
        * {
            font-family: 'Inter', 'Segoe UI', sans-serif;
            cursor: default;
            user-select: none;
        }

        :host {
            height: 100%;
            display: flex;
            flex-direction: column;
            width: 100%;
            align-items: center;
            justify-content: center;
        }

        .empty-message {
            text-align: center;
            color: var(--description-color);
            padding: 40px 20px;
        }

        .empty-message h2 {
            font-size: 18px;
            margin-bottom: 12px;
            color: var(--text-color);
        }

        .empty-message p {
            font-size: 14px;
            line-height: 1.6;
        }
    `;

    render() {
        return html`
            <div class="empty-message">
                <h2>Chat History</h2>
                <p>
                    All your conversations are displayed in real-time<br />
                    within the assistant chat view.
                </p>
            </div>
        `;
    }
}

customElements.define('history-view', HistoryView);
