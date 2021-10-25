// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "./DividendDistributor.sol";
import "./libs/IBEP20.sol";
import "./libs/SafeMath.sol";

contract DistributorFactory {
    using SafeMath for uint256;
    address _token;

    struct structDistributors {
        DividendDistributor distributorAddress;
        uint256 index;
        string tokenName;
        bool exists;
    }

    mapping(address => structDistributors) public distributorsArray;
    address[] public distributorsIndexes;

    modifier onlyToken() {
        require(msg.sender == _token);
        _;
    }

    constructor() {
        _token = msg.sender;
    }

    function addDistributor(
        address _router,
        address _BEP_TOKEN,
        address _wbnb
    ) external onlyToken returns (bool) {
        require(
            !distributorsArray[_BEP_TOKEN].exists,
            "Reflecto/Distributor already exists"
        );

        IBEP20 BEP_TOKEN = IBEP20(_BEP_TOKEN);
        DividendDistributor distributor = new DividendDistributor(
            _router,
            _BEP_TOKEN,
            _wbnb
        );

        distributorsIndexes.push(_BEP_TOKEN);
        distributorsArray[_BEP_TOKEN].distributorAddress = distributor;
        distributorsArray[_BEP_TOKEN].index = distributorsIndexes.length - 1;
        distributorsArray[_BEP_TOKEN].tokenName = BEP_TOKEN.name();
        distributorsArray[_BEP_TOKEN].exists = true;

        return true;
    }

    function deleteDistributor(address _BEP_TOKEN)
        external
        onlyToken
        returns (bool)
    {
        require(
            distributorsArray[_BEP_TOKEN].exists,
            "Reflecto/Distributor not found"
        );

        structDistributors memory deletedDistributer = distributorsArray[
            _BEP_TOKEN
        ];
        // if index is not the last entry
        if (deletedDistributer.index != distributorsIndexes.length - 1) {
            // delete distributorsIndexes[deletedDistributer.index];
            // last strucDistributer
            address lastAddress = distributorsIndexes[
                distributorsIndexes.length - 1
            ];
            distributorsIndexes[deletedDistributer.index] = lastAddress;
            distributorsArray[lastAddress].index = deletedDistributer.index;
        }
        delete distributorsArray[_BEP_TOKEN];
        delete distributorsIndexes[distributorsIndexes.length - 1];
        return true;
    }

    function getDistributorsAddresses() public view returns (address[] memory) {
        return distributorsIndexes;
    }

    function setShare(address shareholder, uint256 amount) external onlyToken {
        uint256 arrayLength = distributorsIndexes.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            if (
                0x0000000000000000000000000000000000000000 !=
                address(
                    distributorsArray[distributorsIndexes[i]].distributorAddress
                )
            ) {
                distributorsArray[distributorsIndexes[i]]
                    .distributorAddress
                    .setShare(shareholder, amount);
            }
        }
    }

    function process(uint256 gas) external onlyToken {
        uint256 arrayLength = distributorsIndexes.length;
        for (uint256 i = 0; i < arrayLength; i++) {
            if (
                0x0000000000000000000000000000000000000000 !=
                address(
                    distributorsArray[distributorsIndexes[i]].distributorAddress
                )
            ) {
                distributorsArray[distributorsIndexes[i]]
                    .distributorAddress
                    .process(gas);
            }
        }
    }

    function deposit() external payable onlyToken {
        uint256 arrayLength = distributorsIndexes.length;
        uint256 valuePerToken = msg.value.div(arrayLength);

        for (uint256 i = 0; i < arrayLength; i++) {
            if (
                0x0000000000000000000000000000000000000000 !=
                address(
                    distributorsArray[distributorsIndexes[i]].distributorAddress
                )
            ) {
                distributorsArray[distributorsIndexes[i]]
                    .distributorAddress
                    .deposit{value: valuePerToken}();
            }
        }
    }

    function getDistributor(address _BEP_TOKEN)
        public
        view
        returns (DividendDistributor)
    {
        return distributorsArray[_BEP_TOKEN].distributorAddress;
    }

    function getTotalUsers() public view returns (uint256) {
        return distributorsIndexes.length;
    }

    function setDistributionCriteria(
        address _BEP_TOKEN,
        uint256 _minPeriod,
        uint256 _minDistribution
    ) external onlyToken {
        distributorsArray[_BEP_TOKEN]
            .distributorAddress
            .setDistributionCriteria(_minPeriod, _minDistribution);
    }
}
