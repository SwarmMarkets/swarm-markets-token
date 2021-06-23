# Swarm Markets Token

## Documentation

![](docs/uml/swarm-markets-token.png?raw=true)

- [Smart contracts API documentation](SUMMARY.md)

## Addresses

### Mainnet

- **SwarmMarketsToken**: `0x2E376EFc7202287c169D127fcaDF069e4227456d`
- **SmtDistributor**: `0x241a9843611EEe430E4847B99Df2966d230eC8C0`
- **SmtVesting**: `0xF67506e32Fefd2597FCbD2F5d3A5B7a73873F58A`

- [Deployment artifacts](deloyment/mainnet.json)


### Kovan

- **SwarmMarketsToken**: `0x5a4eada4ca02eBC6B8daF9d7d3fE1D4A280C9318`
- **SmtDistributor**: `0xCfBC0E64D2CdD8b4E8008869e8AB4Adbd232011A`
- **SmtVesting**: `0xDEfA6602a6f8FE33e158ECE318565173A426Bb44`

- [Deployment artifacts](deloyment/kovan.json)

### Rinkeby

- **SwarmMarketsToken**: `0x244CAf2A12877018C4cD188215d2473BcdaA5D82`
- **SmtDistributor**: `0x16a521F158ccF39f71aee30ce5D2Ae8A4756Fb51`
- **SmtVesting**: `0x3500D3597f828c5e10A6CA5DF90efc778A7084E4`

- [Deployment artifacts](deloyment/rinkeby.json)

## Development

- Create an `.env` file in the root of this project using [.env.example](.env.example) content as example.
- Install dependencies with:
```bash
$ yarn
```

### Test
```bash
$ yarn test
```

### Update API docs and UML diagram
```bash
$ yarn docify
$ yarn doc:uml
```

### Deploy
```bash
$ yarn deploy:network
```

Supported networks: `rinkeby`, `kovan`

### Very contract on Etherscan
```bash
$ yarn verify:network
```

Supported networks: `rinkeby`, `kovan`
