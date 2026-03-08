// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

/**
 * @title ContentAuthenticity
 * @dev Smart contract for registering and verifying content authenticity on Polygon
 * @notice This contract allows creators to register content hashes and prove ownership
 */

contract ContentAuthenticity {
    // Structure to store content metadata
    struct ContentRecord {
        bytes32 contentHash;
        address creator;
        bytes signature;
        uint256 timestamp;
        string metadata;
        bool verified;
    }

    // State variables
    mapping(bytes32 => ContentRecord) public contentRegistry;
    mapping(address => bytes32[]) public creatorContents;
    mapping(bytes32 => bool) public verifiedContents;
    
    address public owner;
    uint256 public registrationFee;
    uint256 public totalRegistrations;

    // Events
    event ContentRegistered(
        bytes32 indexed contentHash,
        address indexed creator,
        uint256 timestamp
    );
    
    event ContentVerified(
        bytes32 indexed contentHash,
        address indexed verifier,
        uint256 timestamp
    );
    
    event RegistrationFeeUpdated(uint256 newFee);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Only owner can call this function");
        _;
    }

    modifier contentExists(bytes32 _hash) {
        require(contentRegistry[_hash].timestamp > 0, "Content not found");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        registrationFee = 0;
        totalRegistrations = 0;
    }

    /**
     * @dev Register content authenticity
     * @param _contentHash The SHA256 hash of the content
     * @param _signature Digital signature from the creator
     * @param _metadata Additional metadata about the content
     */
    function registerContent(
        bytes32 _contentHash,
        bytes calldata _signature,
        string calldata _metadata
    ) public payable {
        require(
            msg.value >= registrationFee,
            "Insufficient payment for registration"
        );
        require(contentRegistry[_contentHash].timestamp == 0, "Content already registered");
        require(_contentHash != bytes32(0), "Invalid content hash");

        // Store content record
        ContentRecord storage record = contentRegistry[_contentHash];
        record.contentHash = _contentHash;
        record.creator = msg.sender;
        record.signature = _signature;
        record.timestamp = block.timestamp;
        record.metadata = _metadata;
        record.verified = false;

        // Track creator's contents
        creatorContents[msg.sender].push(_contentHash);
        totalRegistrations++;

        emit ContentRegistered(_contentHash, msg.sender, block.timestamp);
    }

    /**
     * @dev Verify content authenticity
     * @param _contentHash The SHA256 hash of the content
     * @return ContentRecord The registered content record
     */
    function verifyContent(bytes32 _contentHash)
        public
        contentExists(_contentHash)
        returns (ContentRecord memory)
    {
        ContentRecord storage record = contentRegistry[_contentHash];
        record.verified = true;
        verifiedContents[_contentHash] = true;

        emit ContentVerified(_contentHash, msg.sender, block.timestamp);
        return record;
    }

    /**
     * @dev Get content record details
     * @param _contentHash The SHA256 hash of the content
     * @return The content record
     */
    function getContent(bytes32 _contentHash)
        public
        view
        contentExists(_contentHash)
        returns (ContentRecord memory)
    {
        return contentRegistry[_contentHash];
    }

    /**
     * @dev Check if content is verified
     * @param _contentHash The SHA256 hash of the content
     * @return Boolean indicating verification status
     */
    function isVerified(bytes32 _contentHash) public view returns (bool) {
        return verifiedContents[_contentHash];
    }

    /**
     * @dev Get all contents registered by a creator
     * @param _creator The creator's address
     * @return Array of content hashes
     */
    function getCreatorContents(address _creator)
        public
        view
        returns (bytes32[] memory)
    {
        return creatorContents[_creator];
    }

    /**
     * @dev Update registration fee (owner only)
     * @param _newFee The new registration fee in wei
     */
    function setRegistrationFee(uint256 _newFee) public onlyOwner {
        registrationFee = _newFee;
        emit RegistrationFeeUpdated(_newFee);
    }

    /**
     * @dev Withdraw collected fees (owner only)
     */
    function withdrawFees() public onlyOwner {
        uint256 balance = address(this).balance;
        require(balance > 0, "No fees to withdraw");
        payable(owner).transfer(balance);
    }

    /**
     * @dev Transfer ownership
     * @param _newOwner The new owner's address
     */
    function transferOwnership(address _newOwner) public onlyOwner {
        require(_newOwner != address(0), "Invalid new owner");
        owner = _newOwner;
    }

    // Receive function to accept ETH
    receive() external payable {}
}
