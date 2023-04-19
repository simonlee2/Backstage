import StoreKit from 'storekit-sdk';

export default function Store({ env }) {
    const { key } = JSON.parse(process.env.APP_STORE_KEY);
    const baseURL = env === 'production' ? 'https://api.storekit.itunes.apple.com/inApps/v1' : 'https://api.storekit-sandbox.itunes.apple.com/inApps/v1'

    const store = new StoreKit({
        baseURL: baseURL,
        issuer: '69a6de70-ff9b-47e3-e053-5b8c7c11a4d1',
        bid: 'com.cardinalblue.PicCollage',
        kid: '6R27A8XG4T',
        privateKey: key,
    });

    return store;
};
