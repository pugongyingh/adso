import moment from "moment";
import { v4 } from "uuid";
import axios from "axios";

export const formatFilename = filename => {
  const date = moment().format("YYYYMMDD");
  const hash = v4();
  const cleanFileName = filename.toLowerCase().replace(/[^a-z0-9]/g, "-");
  const newFilename = `post-images/${date}-${hash}-${cleanFileName}`;
  return newFilename.substring(0, 60);
};

export const uploadToS3 = async (file, signedRequest) => {
  console.log("File", file);
  console.log("signedRequest", signedRequest);
  const options = {
    headers: {
      "Access-Control-Allow-Origin": "*"
    }
  };
  await axios.put(signedRequest, file, options);
};
