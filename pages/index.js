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
  const [searchType, setSearchType] = useState('cbid');
  const [transactionDetail, setTransactionDetail] = useState({subscriptions: null, history: null});

  const handleSelectSearchType = async event => {
    const type = event.target.value;
    if (type === "CBID") {
      console.log('Set search type to cbid');
      setSearchType('cbid');
    } else if (type === 'Transaction ID') {
      console.log('Set search type to tid');
      setSearchType('tid');
    } 
  }

  const handleSearch = async event => {
    event.preventDefault();
    setIsLoading(true);
    const query = event.target.query.value;

    if (searchType === 'cbid') {
      console.log("Search for cbid", query);
      await handleCBIDSearch(query);
    } else if (searchType === 'tid') {
      console.log("Search for tid", query);
      await handleTIDSearch(query);
    }

    setIsLoading(false);
  }

  const handleCBIDSearch = async (cbid) => {
    // Get Transaction ID using CBID
    try {
      const res = await fetch(`/api/pic_purchases/${cbid}?env=${localStorage.getItem('storeKitEnv')}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })

      if (!res.ok) {
        console.log("Not ok");
        const result = await res.json();
        throw Error(result.errorMessage);
      }

      const result = await res.json();
      const transactionID = result.data.purchases.edges[0].node.transaction_id;

      // fetch TID
      const cbidResult = await searchWithTransactionID(transactionID);
      setTransactionDetail(cbidResult);
    } catch (error) {
      alert(error);
      setTransactionDetail({subscriptions: null, history: null})
    }
  }

  const searchWithTransactionID = async (tid) => {
    const res = await fetch(`/api/transactions/${tid}?env=${localStorage.getItem('storeKitEnv')}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    if (res.ok) {
      return await res.json();
    } else {
      console.log("Not ok");
      const result = await res.json();
      throw Error(result.errorMessage);
    }
  }

  const handleTIDSearch = async (tid) => {
    try {
      const result = await searchWithTransactionID(tid);
      setTransactionDetail(result);
    } catch (error) {
      alert(error);
      setTransactionDetail({subscriptions: null, history: null})
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
              <Select w="280px" onChange={handleSelectSearchType}>
                <option>CBID</option>
                <option>Transaction ID</option>
              </Select>
              <Input id="query" name="query" type="search" required />
              <Button w="120px" isLoading={ isLoading } type="submit" colorScheme="green">Search</Button>
            </Flex>
          </form>
        <Subscriptions data={ transactionDetail.subscriptions }></Subscriptions>  
        <History data={ transactionDetail.history }></History>
      </Container>
    </NextLayout>
  )
}
