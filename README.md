# Swarm Markets Token

## Documentation

![](docs/uml/swarm-markets-token.png?raw=true)

- [Smart contracts API documentation](SUMMARY.md)

## Addresses

### Kovan

- **SwarmMarketsToken**: `0xCF204A8F4b0Bd0Dd280Ab846CEE5EE4CD9dCb0F0`
- **SmtDistributor**: `0x820930546449143dc007Ad71541AC83f8B9F5210`
- **SmtVesting**: `0x3100315e6Ab3784cb62012DeFA03d14B1cb3Ff7c`

- [Deployment artifacts](deloyment/kovan.json)

### Rinkeby

- **SwarmMarketsToken**: `0x694D9B6b93fc0A6ab2a0E11f78613D80927A234D`
- **SmtDistributor**: `0x7a94D30ED098233ABc221AA08Be279B55EEF9eDf`
- **SmtVesting**: `0x2621275Cce9c79BE51340c8E2b08c60c6Ba26b23`

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
