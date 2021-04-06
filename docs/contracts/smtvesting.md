# `SmtVesting`

## Functions:

- `constructor() (public)`

- `setToken(address _token) (external)`

- `claim() (external)`

- `claimableAmount() (public)`

- `_claimableAmount(bool isFirstYCBClaimed, uint256 blockNumber, uint256 lCBlock) (internal)`

- `accumulateAnualComBatch(bool isFirstYCBClaimed, uint256 blockNumber, uint256 lCBlock) (public)`

- `accumulateFromPastYears(uint256 blockNumber, uint256 lCBlock) (public)`

- `accumulateCurrentYear(uint256 blockNumber, uint256 lCBlock) (public)`

- `getWeekPortionFromBlock(uint256 blockNumber) (internal)`

- `getWeekPortionUntilBlock(uint256 blockNumber) (internal)`

- `yearAnualDistribution(uint256 year) (public)`

- `yearAnualCommunityBatch(uint256 year) (public)`

- `yearAnualWeeklyBatch(uint256 year) (public)`

- `weeklyRedPerc(uint256 week) (internal)`

- `yearFrontWeightedWRB(uint256 year) (internal)`

- `yearWeekRelaseBatch(uint256 year, uint256 week) (public)`

- `yearFirstBlock(uint256 year) (internal)`

- `yearWeekFirstBlock(uint256 year, uint256 week) (internal)`

- `yearWeekLastBlock(uint256 year, uint256 week) (internal)`

- `blockYear(uint256 blockNumber) (internal)`

- `blockWeek(uint256 blockNumber) (internal)`

## Events:

- `Claim(address owner, uint256 amount)`

### Function `constructor() public`

Sets the value for {initialBloc}.

Sets ownership to the given `_owner`.

### Function `setToken(address _token) external`

Sets the value for `token`.

Requirements:

- the caller must be the owner.

- `_token` can't be zero address

- `token` should not be already set

### Function `claim() external`

Claims next token batch.

Requirements:

- the caller must be the owner.

### Function `claimableAmount() → uint256 public`

Gets the next token batch to be claimed since the last claim until current block.

### Function `_claimableAmount(bool isFirstYCBClaimed, uint256 blockNumber, uint256 lCBlock) → uint256 internal`

Gets the next token batch to be claimed since the last claim until current block.

### Function `accumulateAnualComBatch(bool isFirstYCBClaimed, uint256 blockNumber, uint256 lCBlock) → uint256 public`

Accumulates non claimed Anual Comunity Batches.

### Function `accumulateFromPastYears(uint256 blockNumber, uint256 lCBlock) → uint256 public`

Accumulates non claimed Weekly Release Batches from a week in a previous year.

### Function `accumulateCurrentYear(uint256 blockNumber, uint256 lCBlock) → uint256 public`

Accumulates non claimed Weekly Release Batches from a week in the current year.

### Function `getWeekPortionFromBlock(uint256 blockNumber) → uint256 internal`

Calculates the portion of Weekly Release Batch from a block to the end of that block's week.

### Function `getWeekPortionUntilBlock(uint256 blockNumber) → uint256 internal`

Calculates the portion of Weekly Release Batch from the start of a block's week the block.

### Function `yearAnualDistribution(uint256 year) → uint256 public`

Calculates the Total Anual Distribution for a given year.

TAD = (62500000) * (1 - 0.25)^y

#### Parameters:

- `year`: Year zero based.

### Function `yearAnualCommunityBatch(uint256 year) → uint256 public`

Calculates the Anual Comunity Batch for a given year.

20% * yearAnualDistribution

#### Parameters:

- `year`: Year zero based.

### Function `yearAnualWeeklyBatch(uint256 year) → uint256 public`

Calculates the Anual Weekly Batch for a given year.

80% * yearAnualDistribution

#### Parameters:

- `year`: Year zero based.

### Function `weeklyRedPerc(uint256 week) → uint256 internal`

Calculates weekly reduction percentage for a given week.

WRP = (1 - 0.5)^w

#### Parameters:

- `week`: Week zero based.

### Function `yearFrontWeightedWRB(uint256 year) → uint256 internal`

Calculates W1 weekly release batch amount for a given year.

yearAnualWeeklyBatch / (0.995^0 + 0.995^1 ... + 0.995^51)

#### Parameters:

- `year`: Year zero based.

### Function `yearWeekRelaseBatch(uint256 year, uint256 week) → uint256 public`

Calculates the Weekly Release Batch amount for the given year and week.

#### Parameters:

- `year`: Year zero based.

- `week`: Week zero based.

### Function `yearFirstBlock(uint256 year) → uint256 internal`

Gets first block of the given year.

#### Parameters:

- `year`: Year zero based.

### Function `yearWeekFirstBlock(uint256 year, uint256 week) → uint256 internal`

Gets first block of the given year and week.

#### Parameters:

- `year`: Year zero based.

- `week`: Week zero based.

### Function `yearWeekLastBlock(uint256 year, uint256 week) → uint256 internal`

Gets last block of the given year and week.

#### Parameters:

- `year`: Year zero based.

- `week`: Week zero based.

### Function `blockYear(uint256 blockNumber) → uint256 internal`

Gets the year of a given block.

#### Parameters:

- `blockNumber`: Block number.

### Function `blockWeek(uint256 blockNumber) → uint256 internal`

Gets the week of a given block within the block year.

#### Parameters:

- `blockNumber`: Block number.

### Event `Claim(address owner, uint256 amount)`

Emitted when `owner` claims.
