
import { spawn } from 'child_process';

const runLighthouse = () => {
  const lighthouse = spawn('npx', ['lighthouse', 'http://127.0.0.1:5001/', '--output=json', '--output-path=lighthouse-report.json', '--chrome-flags="--headless --no-sandbox"']);
  
  lighthouse.stdout.on('data', (data) => {
    console.log(`lighthouse stdout: ${data}`);
  });
  
  lighthouse.stderr.on('data', (data) => {
    console.error(`lighthouse stderr: ${data}`);
  });

  lighthouse.on('close', (code) => {
    if (code === 0) {
      checkScores();
    } else {
      console.error('Lighthouse failed');
      process.exit(1);
    }
  });
};

const checkScores = () => {
  const checker = spawn('node', ['scripts/check-lighthouse-threshold.js']);
  checker.stdout.on('data', (data) => {
    console.log(`${data}`);
  });
  checker.on('close', () => {
    process.exit(0);
  });
};

runLighthouse();
