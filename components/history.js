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
  HStack,
  VStack,
  Heading,
  Wrap,
  useBreakpointValue
} from '@chakra-ui/react'

export default function History({ data }) {
  const variant = useBreakpointValue({ base: "list", sm: "list", md: "list", lg: "table"})

  if (data == null) {
    return null;
  }

  data.signedTransactions.forEach((transaction) => {
    transaction.purchaseDate = new Date(transaction.purchaseDate).toLocaleDateString();
    transaction.expiresDate = new Date(transaction.expiresDate).toLocaleDateString();
  });

  return (
    <div>
      <Box align="center">
        <Heading py="4" size="xl">History</Heading>
      </Box>
      { variant === "table" ? renderTable(data) : renderList(data) }
    </div>
  );
}

function renderTable(data) {

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
        {data.signedTransactions.map((transaction) => {
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

function renderList(data) {
  return (
    <VStack align="center">
      {
        data.signedTransactions.map((transaction) => {
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