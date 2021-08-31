import NextLayout from '../components/layout'
import styles from '../styles/Home.module.css'
import {
  Code,
  Text,
  Input,
  Container,
  HStack,
  Button,
  Box
} from '@chakra-ui/react';
import React, { useState } from 'react';
import TransactionDetail from '../components/transactionDetail';

export default function Home() {
  const [transactionID, setTransactionID] = useState('');
  const [transactionDetail, setTransactionDetail] = useState({subscriptions: null, history: null});

  const handleSubmit = async event => {
    event.preventDefault();
    const tid = event.target.tid.value;
    setTransactionID(tid);

    const res = await fetch(`/api/transactions/${tid}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    const result = await res.json()
    setTransactionDetail(result );
  }

  return (
    <NextLayout>
      {/* Title  */}
      <Text fontSize={ ["2xl","4xl"] } fontWeight="semibold" py="8">
        In-app Purchase Records
      </Text>
      <Text fontSize={ ["md","lg"] }>
        Get started with a <Code className={styles.code}>Transaction ID</Code> 👇🏻
      </Text>

      {/* Input */}
      <Container>
        <form onSubmit={handleSubmit}>
          <HStack py="12">
            <Input id="tid" name="tid" type="text" placeholder="Transaction ID" required />
            <Button type="submit" colorScheme="green">Go!</Button>
          </HStack>
        </form>
      </Container>
      <Box align="center" w="100%">
        <TransactionDetail data={ transactionDetail }/>
      </Box>
    </NextLayout>
  )
}
