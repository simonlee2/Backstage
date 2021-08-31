import Subscriptions from './subscriptions'
import History from './history'

export default function TransactionDetail({ data }) {
  return renderData(data);
}

function renderData(data) {
  const subscriptions = data.subscriptions;
  const history = data.history

  return (
    <div>
      <Subscriptions data={ subscriptions }></Subscriptions>  
      <History data={ history }></History>
    </div>
  )
}
