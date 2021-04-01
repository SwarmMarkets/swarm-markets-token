# Swarm Markets Token

## Documentation

![](docs/uml/swarm-markets-token.png?raw=true)

- [Smart contracts API documentation](SUMMARY.md)

## Addresses

### Kovan

- **SwarmMarketsToken**: `0x0B73827564d7335e1caF198C0F0fa463848f4F71`
- **SmtDistributor**: `0xC00d1f0B74c88dc449634a6104988F9dE6f8cb70`
- **SmtVesting**: `0xC31c50a613e1C66C3A1605646C91A9C476E9d90d`

- [Deployment artifacts](deloyment/kovan.json)

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
