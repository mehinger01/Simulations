export function ObservationBox({ promptText, placeholderText, value }) {
  return `
    <section class="section">
      <h3>Step 3: Observation</h3>
      <label class="subtitle" for="observation-input">${promptText}</label>
      <textarea id="observation-input" placeholder="${placeholderText}">${value || ''}</textarea>
    </section>
  `;
}
