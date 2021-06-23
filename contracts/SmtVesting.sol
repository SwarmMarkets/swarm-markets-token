//SPDX-License-Identifier: GPL-3.0-only
pragma solidity ^0.7.0;
//pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/presets/ERC20PresetMinterPauser.sol";

contract SmtVesting is ERC20PresetMinterPauser {

    using SafeMath for uint256;

    /// @dev ERC20 basic token contract being held
    IERC20 public acceptedToken;
    
    /// @dev distribution start timestamp
    uint256 public distributionStartTime;

    // @dev time constants
    uint256 private constant SECONDS_IN_QUARTER = 7889238; // 60×60×24×30,436875*3 = 7889238  number of seconds in one quarter

    /// @dev trasnferable addresses whitelist
    mapping (address => bool) public whitelist;

    /// @dev trasnferable addresses whitelist
    mapping (address => uint256) public claimings;

    /// @dev Emitted when `owner` claims.
    event Claim(address indexed owner, uint256 amount);
     
    event AcceptedTokenSet(address _acceptedToken);

    event StartTimeSet (uint256 startTime);
    
    constructor(string memory name_, string memory symbol_)
        ERC20PresetMinterPauser(name_, symbol_) {
         distributionStartTime = 0;
    }

    function setAcceptedToken(address _token) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "must have DEFAULT_ADMIN_ROLE");
        acceptedToken = IERC20(_token);
        emit AcceptedTokenSet(_token);
    }

    // need to approve first    
    function deposit(uint256 _amount) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "must have DEFAULT_ADMIN_ROLE");
        acceptedToken.transferFrom(_msgSender(), address(this), _amount);
        _mint(_msgSender(), _amount);
    }

    function _beforeTokenTransfer(address from, address to, uint256 amount) internal virtual override {
        super._beforeTokenTransfer(from, to, amount);
        require(!paused(), "ERC20Pausable: token transfer while paused");
        require(whitelist[from], "trasnfers are just allowed for whitelisted addresses");
    }

    function getCurrentLockedAmount() external view {
        acceptedToken.balanceOf(address(this));
    }

    function addWhitelistedAddress(address _address) external {
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "must have DEFAULT_ADMIN_ROLE");
        whitelist[_address] = true;
    }

    function claim (uint256 amount) public {

        require(distributionStartTime!=0, "Starttime not set");
        uint256 claimableAmount = getClaimableAmount(_msgSender());
        require(claimableAmount>=amount, "amount too big");
        acceptedToken.transfer(_msgSender(), amount);
        burnFrom(_msgSender(), amount);

        claimings[_msgSender()] = claimings[_msgSender()].add(amount);
        emit Claim(_msgSender(), amount);
    }

    function claimMaximunAmount() external {
        claim(getClaimableAmount(_msgSender()));
    }

    function getClaimableAmount(address awarded) public view returns (uint256 amount) {

        require(distributionStartTime!=0, "Starttime not set");

        uint256 currentQuarter = currentQuarterSinceStartTime();
        uint256 balanceOnAuction = balanceOf(awarded).add(claimings[awarded]);

        if (currentQuarter == 0) {
            return (balanceOnAuction.mul(2).div(10)).sub(claimings[awarded]);
        }  
        if (currentQuarter == 1) {
           return (balanceOnAuction.mul(4).div(10)).sub(claimings[awarded]);
        }
        if (currentQuarter == 2) {
            return (balanceOnAuction.mul(6).div(10)).sub(claimings[awarded]);
        }
        if (currentQuarter == 3) {
            return (balanceOnAuction.mul(8).div(10)).sub(claimings[awarded]);
        }
        if (currentQuarter >= 4) {
            return balanceOf(awarded);
        }
    }

    function currentQuarterSinceStartTime() public view returns (uint256 currentQuarter){

        require(distributionStartTime!=0, "Starttime not set");

        return (block.timestamp.sub(distributionStartTime)).div(SECONDS_IN_QUARTER);
    }
    
    // set Unix timestamp format, must be a bigger than current block timestamp
    function setStartTime(uint256 startTime) external {
        
        require(hasRole(DEFAULT_ADMIN_ROLE, _msgSender()), "must have DEFAULT_ADMIN_ROLE");
        require((distributionStartTime == 0), "Start time can be set just one time");
        require(startTime > block.timestamp, "Start time must be a future timestamp");

        distributionStartTime = startTime;
        emit StartTimeSet(startTime);
    }
}