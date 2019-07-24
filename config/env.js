
const isProd = process.env.NODE_ENV === "production";

const isDaily = process.env.NODE_ENV === "daily";

const isDev = process.env.NODE_ENV === "development";

const isServer = process.env.REACT_ENV === "server";

const isClient = process.env.REACT_ENV === "client";

module.exports = {
  isProd,
  isDaily,
  isDev,
  isServer,
  isClient,
};
