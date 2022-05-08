# StolenNFT Contracts

This repo contains all contracts, tests, docs & deployment details for [StolenNFT.art](https://stolennft.art)

- [Contract Documentation](docs/)
- [JSON ABI](outputs/contractsAbi.json) & [Human readable ABI JS](outputs/contractsAbi.js)
- [Test Coverage](outputs/testCoverage.txt)
- [Slither Report](outputs/slither_analysis.txt)[(full)](outputs/slither_analysis_full.txt)


### pnpm

This repo use `pnpm` for package management : https://pnpm.js.org

```bash
npx pnpm add -g pnpm
```


### Install 
```shell
pnpm install
```

### Set .env
``` 
cp .env.example .env
```

### Run 
```shell
pnpm chain
```

### Custom tasks

```shell
pnpm networks                   # display available networks
pnpm chain                      # add -- --no-deploy to disable automatic deployment
pnpm deploy:local               # to deploy locally via hardhat-deploy
pnpm deploy:network             # deploy contracts via scripts to given network
pnpm deploy:deployer:network    # deploy create2 deployer via script to given network
pnpm calculate                  # calculate deployment costs across networks
pnpm test                       # run tests & display gas report
pnpm coverage                   # calculate test coverage
```


### VSCode Extensions

- [Solidity](https://marketplace.visualstudio.com/items?itemName=JuanBlanco.solidity)
- [Solidity Visual Developer](https://marketplace.visualstudio.com/items?itemName=tintinweb.solidity-visual-auditor)
- [Slither](https://marketplace.visualstudio.com/items?itemName=trailofbits.slither-vscode)
- [Prettier](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
- [Code Spell Checker](https://marketplace.visualstudio.com/items?itemName=streetsidesoftware.code-spell-checker)

