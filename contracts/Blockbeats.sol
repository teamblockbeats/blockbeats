// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

// ideally import with the below line, but i couldn't get it to work
// import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

// ipfs://QmZCJ3M9ki4pW2wMJt7gpoLAuTyZhJ7Rj58kfpoTESv5ab

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
    mapping(address => uint256[]) private _ownersTokens;
    mapping(uint256 => uint256) private _tokenListings;
    Listing[] public listings;

    constructor() ERC721("BBLicenses", "BBLC") {}

    /************ ARTIST **********/
    /**
     * Creates a new listing struct instance and appends to contract Listing array
     */
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
    /**
     * Returns the contracts Listing array
     */
    function viewListings() public view returns (Listing[] memory) {
        return (listings);
    }

    /**
     * Handles request to buy a listingID.
     * If the payment is correct, a new token is minted using the URI in the
     * listing. The original creator of the listing is paid the payment.
     */
    function buyListing(uint256 id) public payable {
        require(listings.length > id, "This listing ID does not exist");
        uint256 price = listings[id].price;

        require(msg.value == price, "Paid incorrect amount for listing");

        listings[id].creator.transfer(msg.value); // is transfer safe?
        
        _tokenListings[numTokens] = id;

        mint(listings[id].URI);
    }
   
   /**
    * returns the tokens owned by a particular address
    */
    function tokensAtAddress(address owner) public view returns (uint256[] memory) {
        return(_ownersTokens[owner]);
    }
    
    /**
     * Returns the listing associated with a tokenId
     */
    function resolveTokenToListing(uint256 tokenId) public view returns (Listing memory) {
        uint256 listingId = _tokenListings[tokenId];
        return listings[listingId];
    }

    /****************************/

    /***** ERC721 extensions ****/

    /** 
     Returns a URI with metadata about the contract.
     See: https://docs.opensea.io/docs/contract-level-metadata
     */
    function contractURI() public pure returns (string memory) {
        return "ipfs://QmZCJ3M9ki4pW2wMJt7gpoLAuTyZhJ7Rj58kfpoTESv5ab";
    }

    /**
     Calls the openzepplin _mint function and maps the URI against the
     new minted token.
     */
    function mint(string memory tokenURI_) private {
        _mint(msg.sender, numTokens);
        _setTokenURI(numTokens, tokenURI_);
        _ownersTokens[msg.sender].push(numTokens);
        numTokens++;
    }

    /**
     Maps a URI to a token if the token exists
     */
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

    /**
     returns a URI mapped to a tokenID if the token exists
     */
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
        string memory base = "error-unset-URI";

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
