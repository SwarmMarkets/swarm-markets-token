# `SmtDistributor`

## Functions:

- `constructor(address _token, address _owner) (public)`

- `depositRewards(struct SmtDistributor.Reward[] rewards, uint256 totalAmount) (external)`

- `claim() (external)`

## Events:

- `Claim(address beneficiary, uint256 reward)`

### Function `constructor(address _token, address _owner) public`

Sets the value for {token}.

Sets ownership to the account that deploys the contract.

### Function `depositRewards(struct SmtDistributor.Reward[] rewards, uint256 totalAmount) → bool external`

Deposits a new `totalAmount` to be claimed by beneficiaries distrubuted in `rewards`.

Requirements:

- the caller must be the owner.

- the accumulated rewards' amount should be equal to `totalAmount`.

#### Parameters:

- `rewards`: Array indicating each benaficiary reward from the total to be deposited.

- `totalAmount`: Total amount to be deposited.

### Function `claim() → bool external`

Claims beneficiary reward.

### Event `Claim(address beneficiary, uint256 reward)`

Emitted when `beneficiary` claims its `reward`.
