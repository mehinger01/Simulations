import { today } from './utils.js';

export function printSummary({ suiteTitle, phaseTitle, mode, hypothesis, observations, revision }) {
  const name = window.prompt('Optional student name:') || '';
  const printWindow = window.open('', '_blank', 'width=900,height=700');
  if (!printWindow) return;

  const modeLine = mode ? `<p><strong>Transfer Mode:</strong> ${mode}</p>` : '';
  printWindow.document.write(`
    <html>
      <head><title>${suiteTitle} - ${phaseTitle}</title></head>
      <body style="font-family: Arial, sans-serif; color: #000; background: #fff; padding: 2rem;">
        <h1>${suiteTitle}</h1>
        <h2>${phaseTitle}</h2>
        <p><strong>Student Name:</strong> ${name || '__________'}</p>
        <p><strong>Date:</strong> ${today()}</p>
        ${modeLine}
        <h3>Hypothesis</h3><p>${hypothesis || '—'}</p>
        <h3>Observations</h3><p>${observations || '—'}</p>
        <h3>Revised Explanation</h3><p>${revision || '—'}</p>
      </body>
    </html>
  `);
  printWindow.document.close();
  printWindow.focus();
  printWindow.print();
}
