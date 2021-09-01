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
import Subscriptions from '../components/subscriptions'
import History from '../components/history'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionID, setTransactionID] = useState('');
  const [transactionDetail, setTransactionDetail] = useState({subscriptions: null, history: null});

  const handleSubmit = async event => {
    event.preventDefault();
    const tid = event.target.tid.value;
    setTransactionID(tid);
    setIsLoading(true);

    try {
      const res = await fetch(`/api/transactions/${tid}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })

      if (res.ok) {
        const result = await res.json();
        console.log(result);
        setTransactionDetail(result);
      } else {
        console.log("Not ok");
        const result = await res.json();
        throw Error(result.errorMessage);
      }
    } catch (error) {
      alert(error);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <NextLayout>
      <Container centerContent>
        {/* Title  */}
        <Text fontSize={ ["2xl","4xl"] } fontWeight="semibold" py="8">
          In-app Purchase Records
        </Text>
        <Text fontSize={ ["md","lg"] }>
          Get started with a <Code className={styles.code}>Transaction ID</Code> 👇🏻
        </Text>

        {/* Input */}
        <form onSubmit={handleSubmit}>
          <HStack py="12">
            <Input id="tid" name="tid" type="text" placeholder="Transaction ID" required />
            <Button isLoading={ isLoading } type="submit" colorScheme="green">Go!</Button>
          </HStack>
        </form>
        <Subscriptions data={ transactionDetail.subscriptions }></Subscriptions>  
        <History data={ transactionDetail.history }></History>
      </Container>
    </NextLayout>
  )
}
