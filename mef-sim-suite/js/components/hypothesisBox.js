export function HypothesisBox({ promptText, placeholderText, submitLabel, value }) {
  return `
    <section class="section">
      <h3>Step 1: Hypothesis</h3>
      <label class="subtitle" for="hypothesis-input">${promptText}</label>
      <textarea id="hypothesis-input" placeholder="${placeholderText}">${value || ''}</textarea>
      <button class="primary" id="hypothesis-submit">${submitLabel}</button>
    </section>
  `;
}
