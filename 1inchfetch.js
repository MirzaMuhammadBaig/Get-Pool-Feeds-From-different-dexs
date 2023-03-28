import fetch from "node-fetch";

const endpoint = "https://api.thegraph.com/subgraphs/name/nelsongaldeman/simplefi-1inch-mainnet";

const query = `
query {
  accountLiquidities {
    id
    balance
    account {
      id
      positions {
        accountAddress
        blockNumber
      }
    }
    pair {
      id
      blockNumber
      reserve0
      reserve1
      timestamp
      totalSupply
      factory {
        id
      }
      token0 {
        id
        decimals
        blockNumber
        name
        symbol
        tokenStandard
        timestamp
      }
      token1 {
        id
        decimals
        blockNumber
        name
        symbol
        timestamp
        tokenStandard
      }
    }
  }
  accountPositions {
    id
    positionCounter
    positions {
      account {
        id
      }
      accountAddress
      accountPosition {
        id
        positionCounter
      }
      blockNumber
      closed
      history {
        id
        transferredTo
      }
      historyCounter
      id
      inputTokenBalances
      market {
        id
        blockNumber
        timestamp
      }
      marketAddress
      outputTokenBalance
      positionType
      rewardTokenBalances
      timestamp
      transferredTo
    }
  }
  accounts {
    id
    positions {
      id
      blockNumber
      closed
      accountAddress
      inputTokenBalances
      historyCounter
      outputTokenBalance
      marketAddress
      positionType
      rewardTokenBalances
      timestamp
      transferredTo
    }
  }
  burns {
    id
    amount0
    amount1
    liquityAmount
    transferToPairEventApplied
    transferToZeroEventApplied
    syncEventApplied
    from {
      id
    }
    to {
      id
    }
    pair {
      id
      blockNumber
      reserve0
      reserve1
      timestamp
      totalSupply
      token0 {
        name
        decimals
        tokenStandard
        blockNumber
        symbol
      }
      token1 {
        name
        symbol
        decimals
        blockNumber
        tokenStandard
      }
    }
  }
  marketSnapshots {
    blockNumber
    id
    inputTokenBalances
    logIndex
    outputTokenTotalSupply
    timestamp
    transactionHash
    transactionIndexInBlock
    market {
      id
      blockNumber
      inputTokenTotalBalances
      outputTokenTotalSupply
      protocolName
      protocolType
      timestamp
    }
  }
  markets {
    blockNumber
    account {
      id
    }
    history {
      id
      blockNumber
      timestamp
      transactionHash
    }
    id
    inputTokenTotalBalances
    inputTokens {
      id
      decimals
      blockNumber
      name
      symbol
      timestamp
      tokenStandard
    }
    outputToken {
      id
      decimals
      blockNumber
      name
      symbol
      timestamp
      tokenStandard
    }
    outputTokenTotalSupply
    positions {
      accountAddress
      positionType
      timestamp
      id
    }
    protocolName
    protocolType
    rewardTokens {
      id
      decimals
      blockNumber
      name
      symbol
      tokenStandard
    }
    timestamp
  }
  mints {
    id
    amount0
    amount1
    liquityAmount
    pair {
      totalSupply
      token0 {
        name
        symbol
        tokenStandard
      }
      token1 {
        name
        symbol
        tokenStandard
      }
    }
    syncEventApplied
  }
  pairs {
    id
    blockNumber
    reserve0
    reserve1
    timestamp
    totalSupply
    token0 {
      id
      blockNumber
      decimals
      name
      symbol
      timestamp
      tokenStandard
    }
    token1 {
      id
      decimals
      blockNumber
      name
      symbol
      timestamp
      tokenStandard
    }
  }
  positionSnapshots {
    id
    inputTokenBalances
    outputTokenBalance
    rewardTokenBalances
    transferredTo
    transaction {
      id
      blockNumber
      inputTokenAmounts
      outputTokenAmount
      rewardTokenAmounts
      timestamp
      transactionHash
      transactionIndexInBlock
      transactionType
      transferredFrom
      transferredTo
    }
  }
  positions {
    account {
      id
    }
    accountAddress
    accountPosition {
      id
      positionCounter
    }
    blockNumber
    closed
    historyCounter
    id
    inputTokenBalances
    marketAddress
    outputTokenBalance
    positionType
    rewardTokenBalances
    timestamp
    transferredTo
  }
  tokens {
    id
    decimals
    blockNumber
    name
    symbol
    timestamp
    tokenStandard
  }
  transactions {
    id
    gasUsed
    gasPrice
    blockNumber
    inputTokenAmounts
    outputTokenAmount
    rewardTokenAmounts
    timestamp
    transactionHash
    transactionIndexInBlock
    transactionType
    transferredFrom
    transferredTo
  }
}
`;

async function fetch1inchData() {
  try {
    const response = await fetch(endpoint, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ query }),
    });
    const { data } = await response.json();
    console.log("data", data);
  } catch (error) {
    console.log("error", error);
  }
}

fetch1inchData();
