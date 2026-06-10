module.exports = {
  ci: {
    collect: {
      // workflow에서 build 후 preview만 띄웁니다.
      startServerCommand:
        'npm run preview -- --host 127.0.0.1 --port 4173 --strictPort',
      startServerReadyPattern: 'Local:',
      startServerReadyTimeout: 120000,
      url: [
        'http://127.0.0.1:4173/find-player-game/',
        'http://127.0.0.1:4173/find-player-game/submission',
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
