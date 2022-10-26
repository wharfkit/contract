import Rewards from './codegen-sample'

Rewards.shared()
    .claim('greymass')
    .then(() => {
        console.log('Claimed rewards!')
    })
