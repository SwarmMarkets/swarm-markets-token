---

# Swarm Markets Smart Contracts

## Documentation

![](docs/uml/swarm-markets.svg?raw=true)

- [Smart contracts API documentation](docs/)

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

Supported networks: `mainnet`, `goerli`, `polygon`, `mumbai`

### Verify contract on Etherscan/PolygonScan

```bash
$ yarn verify:network
```

Supported networks: `mainnet`, `goerli`, `polygon`, `mumbai`
