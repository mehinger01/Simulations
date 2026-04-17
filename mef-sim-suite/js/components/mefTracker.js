const row = (label, value) => `
  <div>
    <div class="row"><span>${label}</span><strong>${Math.round(value)}</strong></div>
    <div class="mef-bar" aria-label="${label} ${Math.round(value)} percent"><span style="width:${value}%"></span></div>
  </div>
`;

export function MEFTracker({ matterValue, energyValue, forceValue }) {
  return `
    <section class="section">
      <h3>MEF Tracker</h3>
      ${row('Matter', matterValue)}
      ${row('Energy', energyValue)}
      ${row('Forces', forceValue)}
    </section>
  `;
}
