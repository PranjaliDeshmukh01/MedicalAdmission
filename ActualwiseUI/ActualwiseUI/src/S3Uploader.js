import AWS from "aws-sdk/global";
import S3 from "aws-sdk/clients/s3";

AWS.config.update({
  region: "us-east-1",
  accessKeyId: "AKIA55C6FFQOD5WKBVXQ",
  secretAccessKey: "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",
});

const myBucket = new S3({
  params: { Bucket: "actualwise-healthcare-datasets" },
  region: "us-east-1",
});

// Function to upload the file with a username prefix
export const uploadFile = (file, username) => {
  const params = {
    Body: file,
    Bucket: "actualwise-healthcare-datasets",
    Key: `input/${username}_${file.name}`, // Uploads file to the input folder with username prefix
    ContentType: file.type, // Add the content type for the file
    Metadata: {
      // Optional: You could add metadata, such as processing status
      status: "processing", // Mark as processing by default
    },
  };

  return new Promise((resolve, reject) => {
    myBucket.putObject(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data);
      }
    });
  });
};

export const listProcessedFiles = (username) => {
  const params = {
    Bucket: "actualwise-healthcare-datasets",
    Prefix: `allinOneGo/${username}_`, // List files in the output folder with username prefix
  };

  return new Promise((resolve, reject) => {
    myBucket.listObjectsV2(params, (err, data) => {
      if (err) {
        reject(err);
      } else {
        resolve(data.Contents);
      }
    });
  });
};

export const getFileDownloadUrl = (key) => {
  const params = {
    Bucket: "actualwise-healthcare-datasets",
    Key: key,
    Expires: 60, // URL expiration time in seconds
  };

  return myBucket.getSignedUrl("getObject", params);
};
