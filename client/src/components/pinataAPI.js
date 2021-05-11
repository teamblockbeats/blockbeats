//imports needed for this function
const axios = require("axios");
const FormData = require("form-data");

export const pinFileToIPFS = (pinataApiKey, pinataSecretApiKey, file) => {
  const url = `https://api.pinata.cloud/pinning/pinFileToIPFS`;

  //we gather a local file for this example, but any valid readStream source will work here.
  let data = new FormData();
  data.append("file", file);

  return axios.post(url, data, {
    maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
    headers: {
      "Content-Type": `multipart/form-data; boundary=${data._boundary}`,
      pinata_api_key: pinataApiKey,
      pinata_secret_api_key: pinataSecretApiKey,
    },
  });
};

const attributesToJSON = (attrDict) => {
  var attrList = [];
  Object.keys(attrDict).forEach((key) => {
    attrList = attrList.concat({ trait_type: key, value: attrDict[key] });
  });

  return attrList;
};

export const pinListingToIPFS = (
  pinataApiKey,
  pinataSecretApiKey,
  musicFile,
  imageFile,
  title,
  description,
  attributes,
  onStatus,
  onSuccess
) => {
  const fileUrl = `https://api.pinata.cloud/pinning/pinFileToIPFS`;
  const jsonUrl = `https://api.pinata.cloud/pinning/pinJSONToIPFS`;

  var musicHash = "";
  var imageHash = "";

  let musicData = new FormData();
  musicData.append("file", musicFile);

  let imageData = new FormData();
  imageData.append("file", imageFile);

  onStatus("Uploading Music to IPFS...");

  axios
    .post(fileUrl, musicData, {
      maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
      headers: {
        "Content-Type": `multipart/form-data; boundary=${musicData._boundary}`,
        pinata_api_key: pinataApiKey,
        pinata_secret_api_key: pinataSecretApiKey,
      },
    })
    .then(function (musicResponse) {
      musicHash = musicResponse.data.IpfsHash;

      onStatus("Uploading Art to IPFS...");

      axios
        .post(fileUrl, imageData, {
          maxBodyLength: "Infinity", //this is needed to prevent axios from erroring out with large files
          headers: {
            "Content-Type": `multipart/form-data; boundary=${imageData._boundary}`,
            pinata_api_key: pinataApiKey,
            pinata_secret_api_key: pinataSecretApiKey,
          },
        })
        .then(function (imageResponse) {
          imageHash = imageResponse.data.IpfsHash;

          onStatus("Uploading Metadata to IPFS...");

          /** JSON structure derived from opensea standard, see:
           *    https://docs.opensea.io/docs/metadata-standards#section-metadata-structure
           **/
          let JSONBody = {
            name: title,
            description: description,
            animation_url: "ipfs://" + musicHash,
            image: "ipfs://" + imageHash,
            attributes: attributesToJSON(attributes),
          };
          axios
            .post(jsonUrl, JSONBody, {
              headers: {
                pinata_api_key: pinataApiKey,
                pinata_secret_api_key: pinataSecretApiKey,
              },
            })
            .then(function (response) {
              onSuccess("ipfs://" + response.data.IpfsHash);
            })
            .catch((error) => {
              onStatus("Failed");
            });
        })
        .catch((error) => {
          onStatus("Failed");
        });
    })
    .catch((error) => {
      onStatus("Failed");
    });
};
