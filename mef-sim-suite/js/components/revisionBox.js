export function RevisionBox({ promptText, placeholderText, value }) {
  return `
    <section class="section">
      <h3>Step 4: Revision</h3>
      <label class="subtitle" for="revision-input">${promptText}</label>
      <textarea id="revision-input" placeholder="${placeholderText}">${value || ''}</textarea>
    </section>
  `;
}
