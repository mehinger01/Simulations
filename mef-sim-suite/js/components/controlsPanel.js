export function ControlsPanel({ disabled, bodyHtml }) {
  return `
    <section class="section">
      <h3>Step 2: Simulation Controls</h3>
      <fieldset ${disabled ? 'disabled' : ''}>
        ${bodyHtml}
      </fieldset>
      ${disabled ? '<p class="muted">Submit a hypothesis to unlock controls.</p>' : ''}
    </section>
  `;
}
