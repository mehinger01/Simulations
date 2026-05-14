export function SummaryPreview({ hypothesis, observations, revision, phaseMeta }) {
  return `
    <section class="section">
      <h3>Summary Preview</h3>
      <p><strong>Phase:</strong> ${phaseMeta}</p>
      <p><strong>Hypothesis:</strong> ${hypothesis || '—'}</p>
      <p><strong>Observations:</strong> ${observations || '—'}</p>
      <p><strong>Revision:</strong> ${revision || '—'}</p>
    </section>
  `;
}
