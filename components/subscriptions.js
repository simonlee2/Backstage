import { 
  Box, 
  VStack, 
  Wrap, 
  WrapItem, 
  Text, 
  Badge, 
  Grid, 
  GridItem, 
  Divider,
  Heading
} from '@chakra-ui/react';

export default function Subscriptions({ data }) {
  if (data == null) {
    return null;
  }
  
  return (
    <div>
      <Box align="center">
        <Heading py="4" size="xl">Subscriptions</Heading>
      </Box>
      <Wrap w="full" justify="center">
      {
        data.data.map((group) => {
          return (
            <WrapItem key={ group.subscriptionGroupIdentifier }>
              <SubscriptionDetail data={ group } />
            </WrapItem>
          )
        })
      }
      </Wrap>
    </div>
  )
}

export function DefinitionList({ name, value, fontSize }) {
  return (
    <VStack align="start">
      <Text fontSize={ fontSize } fontWeight="semibold">{ name }</Text>
      <Text fontSize={ fontSize }>{ value }</Text>
    </VStack>
  )
}

export function SubscriptionDetail({ data }) {
  const lastTransaction = data.lastTransactions[0];
  const purchaseDate = new Date(lastTransaction.signedTransactionInfo.purchaseDate)
  const expiresDate = new Date(lastTransaction.signedTransactionInfo.expiresDate);

  return (
    <Box p="4" w={ ["sm","md"] } borderWidth="1px" borderRadius="lg">
      <Grid templateColumns="repeat(4, 1fr)" gap="4">
        <GridItem colSpan="4">
          <DefinitionList fontSize={ ["sm", "md"] } maxWidth="full" name="Product ID" value={ lastTransaction.signedTransactionInfo.productId }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Status" value={ parseStatus(lastTransaction.status) }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Auto-renew" value={ parseAutoRenewStatus(lastTransaction.signedRenewalInfo.autoRenewStatus) }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Purchase Date" value={ purchaseDate.toLocaleString() }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Expires Date" value={ expiresDate.toLocaleString() }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Subscription Offer" value={ parseOfferType(lastTransaction.signedTransactionInfo.offerType) } />
        </GridItem>
        <GridItem colSpan="4">
          <Divider />
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Transaction ID" value={ lastTransaction.signedTransactionInfo.transactionId } />
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Original Transaction" value={ lastTransaction.signedTransactionInfo.originalTransactionId } />
        </GridItem>
      </Grid>
    </Box>
  )
}

function parseStatus(value) {
  switch (value) {
    case 1:
      return <Badge colorScheme="green">Active</Badge>
    case 2:
      return <Badge colorScheme="red">Expired</Badge>
    case 3:
      return <Badge colorScheme="yello">Billing retry</Badge>
    case 4:
      return <Badge colorScheme="yello">Grace period</Badge>
    case 5:
      return <Badge colorScheme="red">Revoked</Badge>
    default:
      return null
  }
}

function parseOfferType(value) {
  console.log(`OfferType = ${value}`);
  switch (value) {
    case 1:
      return <Badge colorScheme="green">Introductory</Badge>
    case 2:
      return <Badge colorScheme="green">Promotion</Badge>
    case 3:
      return <Badge colorScheme="green">Code</Badge>
    default:
      return <Badge colorScheme="red">None</Badge>
  }
}

function parseAutoRenewStatus(value) {
  switch (value) {
    case 1:
      return <Badge colorScheme="green">On</Badge>
    case 0:
      return <Badge colorScheme="red">Off</Badge>
    default:
      return undefined
  }
}

function parseExpirationIntent(value) {
  switch (value) {
    case 1:
      return <Badge>Cancelled</Badge>
    case 2:
      return <Badge>Billing error</Badge>
    case 3:
      return <Badge>Rejected price increase</Badge>
    case 4: 
      return <Badge>Product unavailable</Badge>
  }
}