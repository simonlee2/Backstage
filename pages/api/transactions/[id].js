/* eslint-disable import/no-anonymous-default-export */
import Store from "../../../utils/store"

export default async (req, res) => {
  const { id, env, revision } = req.query;
  const store = Store({ env: env });
  const sort = "DESCENDING"

  try {
    const history = await store.paginatedHistory(id, sort, revision);

    res.status(200).json({
      history
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