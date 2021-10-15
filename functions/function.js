"use strict";

const axios = require("axios");

require("dotenv").config();

const token = process.env.TOKEN;
// token --> lovable-crow-brev-hedge

const corsAccess = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Credentials": true,
  "Access-Control-Allow-Methods": "*",
};

exports.handler = async function (event, context, callback) {
  await axios
    .get("http://69.164.196.141/languages")
    .then((res) => {
      return callback(null, {
        statusCode: 200,
        headers: corsAccess,
        body: JSON.stringify({ data: res.data }),
      });
    })
    .catch((err) => {
      return callback(null, {
        statusCode: 400,
        headers: corsAccess,
        body: JSON.stringify({ data: err }),
      });
    });
};

exports.languageHandler = async function (event, context, callback) {
  console.log("request:", JSON.stringify(event));

  const { language } = event.pathParameters;

  await axios
    .get(`http://69.164.196.141/languages/${language}`)
    .then((res) => {
      return callback(null, {
        statusCode: 200,
        headers: corsAccess,
        body: JSON.stringify({ data: res.data }),
      });
    })
    .catch((err) => {
      return callback(null, {
        statusCode: 400,
        headers: corsAccess,
        body: JSON.stringify({ data: err }),
      });
    });
};

exports.versionHandler = async function (event, context, callback) {
  console.log("request:", JSON.stringify(event.body));
  const { language } = event.pathParameters;

  const getFileType = (language) => {
    let suffix;
    switch (language) {
      case "c":
        suffix = ".c";
        break;
      case "cpp":
        suffix = ".cpp";
        break;
      case "csharp":
        suffix = ".cs";
        break;
      case "java":
        suffix = ".java";
        break;
      case "javascript":
        suffix = ".js";
        break;
      case "kotlin":
        suffix = ".kt";
        break;
      case "php":
        suffix = ".php";
        break;
      case "python":
        suffix = ".py";
        break;
      case "ruby":
        suffix = ".rb";
        break;
      case "swift":
        suffix = ".swift";
        break;
      case "typescript":
        suffix = ".ts";
        break;
      default:
        suffix = ".js";
    }
    return suffix;
  };

  await axios
    .post(
      `http://69.164.196.141/languages/${language}/latest`,
      {
        files: [
          {
            name: `main${getFileType(language)}`,
            content: JSON.parse(event.body).content,
          },
        ],
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Token " + token,
        },
      }
    )
    .then((res) => {
      return callback(null, {
        statusCode: 200,
        headers: corsAccess,
        body: JSON.stringify({ data: res.data }),
      });
    })
    .catch((err) => {
      return callback(null, {
        statusCode: 400,
        headers: corsAccess,
        body: JSON.stringify({ data: err }),
      });
    });
};
