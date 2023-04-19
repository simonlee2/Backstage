import NextLayout from '../components/layout'
import styles from '../styles/Home.module.css'
import {
  Text,
  Input,
  Container,
  Button,
  Select,
  Flex
} from '@chakra-ui/react';
import React, { useState } from 'react';
import Subscriptions from '../components/subscriptions'
import History from '../components/history'

export default function Home() {
  const [isLoading, setIsLoading] = useState(false);
  const [transactionId, setTransactionId] = useState(null);
  const [subscriptions, setSubscriptions] = useState(null);
  const [history, setHistory] = useState(null);

  const handleSearch = async event => {
    event.preventDefault();
    setIsLoading(true);

    const query = event.target.query.value;
    try {
      if (isCBID(query)) {
        const tid = await fetchTransactionId(query);
        await handleTIDSearch(tid);
      } else if (isTransactionId(query)) {
        await handleTIDSearch(query);
      } else {
        const error = new Error("Unknown query format");
        console.error(error);
        alert(error);
      }
    } catch (error) {
      console.error(error);
      alert(error);
    }
    
    setIsLoading(false);
  }

  const isCBID = (query) => {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
    return uuidRegex.test(query);
  }

  const isTransactionId = (query) => {
    const numberRegex = /^[0-9]+$/;
    return numberRegex.test(query);
  }

  const fetchTransactionId = async (cbid) => {
    console.log(`fetchTransactionId(${cbid})`);
    const res = await fetch(`/api/pic_purchases/${cbid}?env=${localStorage.getItem('storeKitEnv')}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    const result = await res.json();

    if (!res.ok) {
      const error = new Error(result.errorMessage);
      throw error;
    }

    const purchases = result.data.purchases;
    if (purchases === null) {
      throw new Error("No purchases found for this CBID");
    }
      
    const transactionId = purchases.edges[0].node.transaction_id;
    return transactionId
  }

  const fetchTransactions = async (tid) => {
    const res = await fetch(`/api/transactions/${tid}?env=${localStorage.getItem('storeKitEnv')}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    if (res.ok) {
      return await res.json();
    } else {
      const result = await res.json();
      const error = new Error(result.errorMessage);
      throw error;
    }
  }

  const fetchSubscriptions = async (tid) => {
    const res = await fetch(`/api/subscriptions/${tid}?env=${localStorage.getItem('storeKitEnv')}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    if (res.ok) {
      return await res.json();
    } else {
      const result = await res.json();
      const error = new Error(result.errorMessage);
      throw error;
    }
  }

  const handleTIDSearch = async (tid) => {

    try {
      const { subscriptions } = await fetchSubscriptions(tid);
      setSubscriptions(subscriptions);
    } catch (error) {
      console.error(error);
      alert(error);
      setSubscriptions(null);
    }

    try {
      const { history } = await fetchTransactions(tid);
      setHistory(history);
    } catch (error) {
      console.error(error);
      alert(error);
      setSubscriptions(null);
    }
  }

  return (
    <NextLayout>
      <Container
        centerContent
        px="0"
        py="4"
        maxW="full"
      >
        {/* Title  */}
        <Text fontSize={ ["2xl","4xl"] } fontWeight="semibold" py="8">
          In-app Purchase Records
        </Text>

          {/* Search with CBID */}
          <form onSubmit={handleSearch}>
            <Flex direction={['column', 'row']} spacing="5px" py="4" align="center">
              <Input id="query" w={ ["md", "md", "lg"]} name="query" type="search" placeholder="Transaction ID or CBID" required />
              <Button w="120px" isLoading={ isLoading } type="submit" colorScheme="green">Search</Button>
            </Flex>
          </form>
        <Subscriptions data={ subscriptions }></Subscriptions>
        <History data={ history }></History>
      </Container>
    </NextLayout>
  )
}
