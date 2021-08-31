/* eslint-disable import/no-anonymous-default-export */
import StoreKit from 'storekit-sdk';

export default async (req, res) => {
  const { id } = req.query;
  const key = JSON.parse(process.env.APP_STORE_KEY);
  const store = new StoreKit({
    baseURL: 'https://api.storekit-sandbox.itunes.apple.com/inApps/v1',
    issuer: '69a6de70-ff9b-47e3-e053-5b8c7c11a4d1',
    bid: 'com.cardinalblue.PicCollage',
    kid: '6R27A8XG4T',
    privateKey: key.key, 
  });

  try {
    const subscriptions = await store.subscriptions(id);
    const history = await store.history(id);

    res.status(200).json({
      subscriptions: subscriptions,
      history, history
    });
  } catch (e) {
    return res.status(500).json({
      error: e
    })
  }
}