import lighthouse from 'lighthouse';
import * as chromeLauncher from 'chrome-launcher';

async function runAudit(url, options = {}) {
  const chrome = await chromeLauncher.launch({chromeFlags: ['--headless', '--no-sandbox', '--disable-gpu']});
  const result = await lighthouse(url, {
    port: chrome.port,
    output: 'json',
    logLevel: 'error',
    formFactor: options.mobile ? 'mobile' : 'desktop',
    screenEmulation: options.mobile ? undefined : { disabled: true },
    throttling: options.mobile ? undefined : { cpuSlowdownMultiplier: 1 },
  });
  
  await chrome.kill();
  return result.lhr;
}

async function main() {
  const url = 'http://localhost:5000';
  
  console.log('Running Desktop Lighthouse Audit...\n');
  const desktopResult = await runAudit(url, { mobile: false });
  
  console.log('=== DESKTOP LIGHTHOUSE SCORES ===');
  console.log(`Performance: ${Math.round(desktopResult.categories.performance.score * 100)}`);
  console.log(`Accessibility: ${Math.round(desktopResult.categories.accessibility.score * 100)}`);
  console.log(`Best Practices: ${Math.round(desktopResult.categories['best-practices'].score * 100)}`);
  console.log(`SEO: ${Math.round(desktopResult.categories.seo.score * 100)}`);
  
  console.log('\n=== KEY PERFORMANCE METRICS ===');
  const metrics = desktopResult.audits;
  console.log(`First Contentful Paint: ${metrics['first-contentful-paint'].displayValue}`);
  console.log(`Largest Contentful Paint: ${metrics['largest-contentful-paint'].displayValue}`);
  console.log(`Total Blocking Time: ${metrics['total-blocking-time'].displayValue}`);
  console.log(`Cumulative Layout Shift: ${metrics['cumulative-layout-shift'].displayValue}`);
  console.log(`Speed Index: ${metrics['speed-index'].displayValue}`);
  
  console.log('\n=== OPPORTUNITIES FOR IMPROVEMENT ===');
  const opportunities = Object.values(desktopResult.audits)
    .filter(a => a.details?.type === 'opportunity' && a.score !== null && a.score < 1)
    .sort((a, b) => (b.details?.overallSavingsMs || 0) - (a.details?.overallSavingsMs || 0));
  
  opportunities.slice(0, 10).forEach(opp => {
    console.log(`- ${opp.title}: ${opp.displayValue || ''}`);
  });
  
  console.log('\n=== FAILED AUDITS ===');
  const failed = Object.values(desktopResult.audits)
    .filter(a => a.score !== null && a.score === 0);
  
  failed.forEach(f => {
    console.log(`- ${f.title}`);
  });
  
  console.log('\n=== ACCESSIBILITY ISSUES ===');
  const a11yIssues = Object.values(desktopResult.audits)
    .filter(a => a.id.startsWith('aria') || a.id.includes('color-contrast') || a.id.includes('label'))
    .filter(a => a.score !== null && a.score < 1);
  
  a11yIssues.forEach(issue => {
    console.log(`- ${issue.title}: ${issue.description?.substring(0, 80)}...`);
  });
}

main().catch(console.error);
