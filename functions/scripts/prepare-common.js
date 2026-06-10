const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

const functionsDir = path.resolve(__dirname, '..')
const rootDir = path.resolve(functionsDir, '..')
const commonDir = path.join(rootDir, 'common')
const commonDist = path.join(commonDir, 'dist')
const vendorDir = path.join(functionsDir, '_common')

// 1) common 컴파일
execSync('npx tsc -p tsconfig.json', { cwd: commonDir, stdio: 'inherit' })

// 2) functions/_common 에 복사 (tsc-alias가 참조할 위치)
fs.rmSync(vendorDir, { recursive: true, force: true })
fs.cpSync(commonDist, vendorDir, { recursive: true })
