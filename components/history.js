import {
  Text,
  Table,
  Thead,
  Th,
  Tr,
  Td,
  Tbody,
  Box,
  Badge,
  Button,
  HStack,
  VStack,
  Heading,
  Wrap,
  useBreakpointValue
} from '@chakra-ui/react'
import { useEffect, useState } from 'react'

export default function History({ transactionId }) {
  const variant = useBreakpointValue({ base: "list", sm: "list", md: "list", lg: "table"})
  const [history, setHistory] = useState(null);
  const [isLoadingMore, setIsLoadingMore] = useState(false);

  const fetchTransactions = async (tid) => {
    const url = `/api/transactions/${tid}?env=${localStorage.getItem('storeKitEnv')}`;
    console.log(`fetching transactions from ${url}`);
    console.log(url.includes('"'));
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    if (res.ok) {
      const { history } = await res.json();
      console.log(history);
      processData(history)
      setHistory(history);
    } else {
      const result = await res.json();
      const error = new Error(result.errorMessage);
      console.error(error);
      alert(error);
    }
  }

  const fetchMoreTransactions = async (tid) => {
    const revision = history.revision;
    const res = await fetch(`/api/transactions/${tid}?env=${localStorage.getItem('storeKitEnv')}&revision=${revision}`, {
      headers: {
        'Content-Type': 'application/json'
      },
      method: 'GET'
    })

    if (res.ok) {
      const moreHistory = (await res.json()).history;
      processData(moreHistory)

      history.signedTransactions = history.signedTransactions.concat(moreHistory.signedTransactions);
      history.hasMore = moreHistory.hasMore;
      history.revision = moreHistory.revision;
      console.log(`loaded more history. Revision: ${history.revision}, hasMore: ${history.hasMore}`);
    } else {
      const result = await res.json();
      const error = new Error(result.errorMessage);
      throw error;
    }
  }

  const loadMoreHistory = async () => {
    setIsLoadingMore(true);
    await fetchMoreTransactions(transactionId);
    setIsLoadingMore(false);
  }

  const renderLoadMoreButton = () => {
    return (
      <Box align="center" py="4">
        <Button
          isLoading={isLoadingMore}
          loadingText='Loading'
          colorScheme='teal'
          variant='outline'
          spinnerPlacement='end'
          onClick={ e => loadMoreHistory() }
        >
          Load More
        </Button>
      </Box>
    )
  }

  const canLoadMore = () => {
    if (history != null) {
      console.log(`history.hasMore: ${history.hasMore}, history.revision: ${history.revision}`);
    }
    return history != null && history.hasMore && history.revision;
  }

  useEffect(() => {
    fetchTransactions(transactionId);
  }, [transactionId]);

  if (transactionId == null) {
    return null;
  }

  return (
    <div>
      <Box align="center">
        <Heading py="4" size="xl">History</Heading>
      </Box>
      { variant === "table" ? renderTable(history) : renderList(history) }
      { canLoadMore() ? renderLoadMoreButton(isLoadingMore) : null }
    </div>
  );
}

function processData(history) {
  history.signedTransactions.forEach((transaction) => {
    transaction.purchaseDate = new Date(transaction.purchaseDate).toLocaleDateString();
    transaction.expiresDate = new Date(transaction.expiresDate).toLocaleDateString();
  });
}

function renderTable(history) {

  const columns = [
    {key: "transactionId", displayName: "Transaction ID"}, 
    {key: "productId", displayName: "Product"},
    {key: "purchaseDate", displayName: "Purchase Date"},
    {key: "expiresDate", displayName: "Expire Date"},
    {key: "type", displayName: "Product Type"},
    {key: "inAppOwnershipType", displayName: "Ownership Type"},
  ];
  
  return (
    <Table variant="simple" size="sm">
      <Thead>
        <Tr>
          {
            columns.map((column, index) => {
              return <Th key={ index }>{ column.displayName }</Th>
            })
          }
        </Tr>
      </Thead>
      <Tbody>
        { history && history.signedTransactions.map((transaction) => {
          return (
            <Tr key={ transaction.transactionId }>
              {
                columns.map((column) => {
                  return <Td key={ column.key }>{ transaction[column.key] }</Td>
                })
              }
            </Tr>
          ) 
        })}
        
      </Tbody>
    </Table>
  )
}

function renderList(history) {
  return (
    <VStack align="center">
      {
        history && history.signedTransactions.map((transaction) => {
          return (
            <Box align="start" p="4" w={ ["sm","md"] } borderWidth="1px" borderRadius="lg" key={ transaction.transactionId } overflow="wrap">
              <Wrap justify="space-between">
                <Badge fontSize={ ["xs", "sm"] }>{ transaction.type }</Badge>
                <Text fontWeight="light" fontSize={ ["xs", "sm"] } color="gray.800">#{ transaction.transactionId }</Text>
              </Wrap>
              <Text py="2" fontSize={ ["sm", "md"] } fontWeight="medium">{ transaction.productId }</Text>
              <HStack>
                <Text fontSize={ ["xs", "sm"] }>Purchased at:</Text>
                <Text fontSize={ ["xs", "sm"] }>{ transaction.purchaseDate }</Text>
              </HStack>
              <HStack>
                <Text fontSize={ ["xs", "sm"] }>Expires at:</Text>
                <Text fontSize={ ["xs", "sm"] }>{ transaction.expiresDate }</Text>
              </HStack>
            </Box>
          )
        })
      }
    </VStack>
  )
}