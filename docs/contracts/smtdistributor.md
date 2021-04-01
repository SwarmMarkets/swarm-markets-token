# `SmtDistributor`

## Functions:

- `constructor(address _token) (public)`

- `depositRewards(struct SmtDistributor.Reward[] rewards, uint256 totalAmount) (public)`

- `claim() (public)`

## Events:

- `Claim(address beneficiary, uint256 reward)`

### Function `constructor(address _token) public`

Sets the value for {token}.

Sets ownership to the account that deploys the contract.

### Function `depositRewards(struct SmtDistributor.Reward[] rewards, uint256 totalAmount) → bool public`

Deposits a new `totalAmount` to be claimed by beneficiaries distrubuted in `rewards`.

Requirements:

- the caller must be the owner.

- the accumulated rewards' amount should be equal to `totalAmount`.

#### Parameters:

- `rewards`: Array indicating each benaficiary reward from the total to be deposited.

- `totalAmount`: Total amount to be deposited.

### Function `claim() → bool public`

Claims beneficiary reward.

### Event `Claim(address beneficiary, uint256 reward)`

Emitted when `beneficiary` claims its `reward`.
