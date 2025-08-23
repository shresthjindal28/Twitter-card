import axios from "axios";
const TWITTERURL = "https://api.twitter.com/2/users/by/username/";

export const baseAxios = axios.create({
  baseURL: TWITTERURL,
  headers: {
    Authorization: `Bearer ${process.env.TWITTER_API_TOKEN}`,
  },
});
