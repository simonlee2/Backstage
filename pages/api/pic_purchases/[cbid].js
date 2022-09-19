export default async (req, res) => {
    const { cbid } = req.query;
    const graphql = JSON.stringify({
        query: "query Purchases($limit: Int, $afterCursor: String) {\n    purchases(first: $limit, after: $afterCursor) {\n        edges {\n            cursor\n            node {\n                product_id\n                transaction_id\n                purchased_at\n                expires_at\n                verified_at\n                canceled_at\n            }\n        }\n    }\n}",
        variables: {"limit":10,"afterCursor":""}
      })
    const url = `https://piccollage.com/api/graphql?cb_device_id=${cbid}`
    try {
        const transactionRes = await fetch(url,{
            headers: {
              'Content-Type': 'application/json'
            },
            method: 'POST',
            body: graphql,
            mode: "no-cors"
        })

        if (transactionRes.ok) {
            const result = await transactionRes.json();
            res.status(200).json(result)
        } else {
            console.log("Not ok");
            const result = await transactionRes.json();
            throw Error(result.errorMessage);
        }
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