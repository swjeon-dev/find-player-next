module.exports = {
  ci: {
    collect: {
      // workflow에서 build 후 next start로 서버를 띄웁니다.
      startServerCommand:
        'npm run start -- -p 3000 -H 127.0.0.1',
      startServerReadyPattern: 'Ready',
      startServerReadyTimeout: 120000,
      url: [
        'http://127.0.0.1:3000/',
        'http://127.0.0.1:3000/submission',
      ],
      numberOfRuns: process.env.GITHUB_ACTIONS === 'true' ? 1 : 3,
      settings: {
        chromeFlags:
          '--headless=new --disable-dev-shm-usage --no-sandbox --disable-gpu',
      },
    },
    upload: {
      target: 'temporary-public-storage',
    },
    assert: {
      // PR Checks(status)에 카테고리 점수가 표시됩니다.
      assertions: {
        'categories:performance': ['warn', { minScore: 0.85 }],
        'categories:accessibility': ['warn', { minScore: 0.9 }],
        'categories:best-practices': ['warn', { minScore: 0.9 }],
        'categories:seo': ['warn', { minScore: 0.9 }],
      },
    },
  },
}
