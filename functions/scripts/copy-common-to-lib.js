const fs = require('fs')
const path = require('path')

const functionsDir = path.resolve(__dirname, '..')
const vendorDir = path.join(functionsDir, '_common')
const libVendorDir = path.join(functionsDir, 'lib', '_common')

fs.rmSync(libVendorDir, { recursive: true, force: true })
fs.cpSync(vendorDir, libVendorDir, { recursive: true })
