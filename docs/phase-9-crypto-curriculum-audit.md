# Phase 9 Crypto Curriculum Audit

## Existing Lessons Reviewed

- Money Foundations: `what-is-money`, `store-of-value-medium-unit`, `liquidity-basics`
- Macro Economy: `interest-rates`, `dollar-liquidity`, `risk-assets`
- Money Flow: `money-flow`, `stablecoin-pipeline`, `exchange-chain-flow`
- Crypto Foundations: `what-is-crypto`, `bitcoin-ethereum`, `stablecoins`, `tokenomics`
- Market Intelligence: `tvl`, `onchain-risk`, `market-synthesis`

## Missing Topics Found

Crypto Foundations already covered cryptocurrency basics, Bitcoin, Ethereum, stablecoins, tokenomics, and some smart contract and DeFi language. The audit found gaps in:

- Blockchain, wallets, private keys, seed phrases, and custody models
- Transactions, fees, mining, Proof of Work, Proof of Stake, and staking
- Coin vs token, Layer 1 vs Layer 2, native asset vs application token
- Utility, governance, meme, privacy, exchange, real-world asset, and infrastructure token categories
- Centralized exchange vs decentralized exchange
- Protocol and application examples such as Chainlink, Uniswap, Aave, Maker or Sky, Polygon, Arbitrum, and Optimism

## Lessons Added Or Expanded

Added to Crypto Foundations:

- `blockchain-wallets`
  - Covers blockchain, wallet, private key, seed phrase, custodial wallet, and self-custody wallet.
- `consensus-transactions`
  - Covers transactions, fees, mining, Proof of Work, Proof of Stake, and staking.
- `crypto-classifications`
  - Covers coin vs token, Layer 1 vs Layer 2, native asset vs application token, stablecoins, governance tokens, meme coins, privacy coins, exchange tokens, real-world asset tokens, and infrastructure projects.
- `protocols-and-applications`
  - Covers blockchain vs protocol, decentralized exchanges, lending protocols, oracles, bridges, NFTs, centralized vs decentralized exchanges, and examples including Uniswap, Aave, Chainlink, Maker or Sky, Tether, and USDC.

Expanded:

- `what-is-crypto`
  - Now routes into blockchain and wallet fundamentals before comparing Bitcoin and Ethereum.
- `stablecoins`
  - Now routes into broader classification instead of jumping directly to tokenomics.
- `tokenomics`
  - Now follows classification and protocol/application context.

## Duplicate Or Overlapping Topics Resolved

- Stablecoins remain a dedicated lesson, while `crypto-classifications` references them only as one category.
- DeFi remains deeply explained in Market Intelligence through TVL, while `protocols-and-applications` introduces DeFi examples at a beginner level.
- Bitcoin and Ethereum remain the dedicated comparison lesson, while classification lessons use them only as examples of native assets and chains.

## Knowledge Graph Notes

The existing graph model was kept:

`lesson -> metric -> news topic -> coin -> chain -> macro topic`

The new Crypto Foundations lessons include relevant metrics, news topics, coins or tokens, chains, and macro topics so they can participate in the existing graph without a new graph model.

## Remaining Limitations

- Some example projects are represented as curriculum identifiers rather than full project profile pages.
- Privacy coins, meme coins, exchange tokens, and real-world asset tokens are covered as beginner categories, not as deep individual lessons.
- No investment recommendations or price predictions were added.
