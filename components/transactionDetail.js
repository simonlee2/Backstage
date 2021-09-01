import Subscriptions from './subscriptions'
import History from './history'
import { Container } from '@chakra-ui/react'

export default function TransactionDetail({ data }) {
  return renderData(data);
}

function renderData(data) {
  const subscriptions = data.subscriptions;
  const history = data.history

  return (
    <Container centerContent>
      {/* <Subscriptions data={ subscriptions }></Subscriptions>   */}
      <History data={ history }></History>
    </Container>
  )
}
