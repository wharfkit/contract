import * as pkg from './index'
const ContractKit = pkg.default
for (const key of Object.keys(pkg)) {
    if (key === 'default') continue
    ContractKit[key] = pkg[key]
}
export default ContractKit
