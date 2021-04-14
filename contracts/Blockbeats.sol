// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

import "./openzepplin/token/ERC721/ERC721.sol";

contract Blockbeats is ERC721 {
    struct Listing {
        uint256 id;
        string URI;
        uint64 price;
        string title; // might not need if URI metadata
        address payable creator;
        // expiry?
    }

    uint256 numTokens = 0;
    mapping(uint256 => string) private _tokenURIs;
    Listing[] public listings;

    constructor() ERC721("BBLicenses", "BBLC") {}

    /************ ARTIST **********/
    function createListing(
        string memory title,
        uint64 price,
        string memory URI
    ) public {
        Listing memory newListing =
            Listing({
                id: listings.length,
                URI: URI,
                price: price,
                title: title,
                creator: payable(msg.sender)
            });

        listings.push(newListing);
    }

    /*****************************/

    /******** CUSTOMERS **********/
    function viewListings() public view returns (Listing[] memory) {
        return (listings);
    }

    function buyListing(uint256 id) public payable {
        require(listings.length > id, "This listing ID does not exist");
        uint256 price = listings[id].price;

        require(msg.value == price, "Paid incorrect amount for listing");

        listings[id].creator.transfer(msg.value); // is transfer safe?

        mint(listings[id].URI);
    }

    /****************************/

    /***** ERC721 extensions ****/

    function mint(string memory tokenURI_) private {
        _mint(msg.sender, numTokens);
        _setTokenURI(numTokens, tokenURI_);
        numTokens++;
    }

    function _setTokenURI(uint256 tokenId, string memory _tokenURI)
        internal
        virtual
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI set of nonexistent token"
        );
        _tokenURIs[tokenId] = _tokenURI;
    }

    function tokenURI(uint256 tokenId)
        public
        view
        virtual
        override
        returns (string memory)
    {
        require(
            _exists(tokenId),
            "ERC721Metadata: URI query for nonexistent token"
        );

        string memory _tokenURI = _tokenURIs[tokenId];
        string memory base = "unset-base";

        // If there is no base URI, return the token URI.
        if (bytes(base).length == 0) {
            return _tokenURI;
        }
        // If both are set, concatenate the baseURI and tokenURI (via abi.encodePacked).
        if (bytes(_tokenURI).length > 0) {
            return string(abi.encodePacked(_tokenURI));
        }
        // If there is a baseURI but no tokenURI, concatenate the tokenID to the baseURI.
        return string(abi.encodePacked(base, tokenId));
    }
    /****************************/
}
