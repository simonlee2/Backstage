/* eslint-disable import/no-anonymous-default-export */
import StoreKit from 'storekit-sdk';

export default async (req, res) => {
  const { id, env } = req.query;
  const { key } = JSON.parse(process.env.APP_STORE_KEY);
  const baseURL = env === 'production' ? 'https://api.storekit.itunes.apple.com/inApps/v1' : 'https://api.storekit-sandbox.itunes.apple.com/inApps/v1'
  const store = new StoreKit({
    baseURL: baseURL,
    issuer: '69a6de70-ff9b-47e3-e053-5b8c7c11a4d1',
    bid: 'com.cardinalblue.PicCollage',
    kid: '6R27A8XG4T',
    privateKey: key,
  });

  try {
    const subscriptions = await store.subscriptions(id);
    const history = await store.history(id);

    res.status(200).json({
      subscriptions: subscriptions,
      history, history
    });
  } catch (error) {
    if (error.response) {
      // The request was made and the server responde d with a status code
      // that falls out of the range of 2xx
      console.log(error.response.data);
      console.log(error.response.status);
      console.log(error.response.headers);
      res.status(error.response.status).json(error.response.data);
    } else if (error.request) {
      // The request was made but no response was received
      // `error.request` is an instance of XMLHttpRequest in the browser and an instance of
      // http.ClientRequest in node.js
      console.log(error.request);
      res.status(500).json(error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.log('Error', error.message);
      res.status(500).json(error.message)
    }
  }
}