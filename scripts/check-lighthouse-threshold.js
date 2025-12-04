#!/usr/bin/env node
/**
 * Lighthouse CI workflow checker script.
 * Fails the build if Lighthouse score drops below a threshold.
 */

import fs from 'fs';
import path from 'path';

const SCORE_THRESHOLD = 70; // Fail if any score drops below 70

const report = JSON.parse(
  fs.readFileSync(path.resolve(process.cwd(), 'lighthouse-report.json'), 'utf-8')
);

const scores = {
  performance: report.categories.performance?.score * 100 || 0,
  accessibility: report.categories.accessibility?.score * 100 || 0,
  'best-practices': report.categories['best-practices']?.score * 100 || 0,
  seo: report.categories.seo?.score * 100 || 0,
};

console.log('\n📊 Lighthouse Scores:');
console.log(`  Performance: ${scores.performance.toFixed(0)}`);
console.log(`  Accessibility: ${scores.accessibility.toFixed(0)}`);
console.log(`  Best Practices: ${scores['best-practices'].toFixed(0)}`);
console.log(`  SEO: ${scores.seo.toFixed(0)}\n`);

const failedScores = Object.entries(scores).filter(([_, score]) => score < SCORE_THRESHOLD);

if (failedScores.length > 0) {
  console.error(`❌ Scores below ${SCORE_THRESHOLD} threshold:`);
  failedScores.forEach(([category, score]) => {
    console.error(`  ${category}: ${score.toFixed(0)}`);
  });
  process.exit(1);
} else {
  console.log(`✅ All scores meet the ${SCORE_THRESHOLD}+ threshold!\n`);
  process.exit(0);
}
