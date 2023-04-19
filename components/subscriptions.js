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
import { useEffect, useState } from 'react';

export default function Subscriptions({ transactionId }) {
  const [subscriptions, setSubscriptions] = useState(null);

  const fetchSubscriptions = async (tid) => {
    try {
      const res = await fetch(`/api/subscriptions/${tid}?env=${localStorage.getItem('storeKitEnv')}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      })

      if (res.ok) {
        const { subscriptions } =  await res.json();
        console.log(subscriptions);
        setSubscriptions(subscriptions);
      } else {
        const result = await res.json();
        const error = new Error(result.errorMessage);
        throw error;
      }
    } catch (error) {
      console.error(error);
      alert(error);
      setSubscriptions(null);
    }
  }

  useEffect(() => {
    fetchSubscriptions(transactionId);
  }, [transactionId]);

  if (transactionId == null) {
    return null;
  }
  
  return (
    <div>
      <Box align="center">
        <Heading py="4" size="xl">Subscriptions</Heading>
      </Box>
      <Wrap w="full" justify="center">
      {
        subscriptions && subscriptions.data.map((group) => {
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
  const purchaseDate = new Date(lastTransaction.signedTransactionInfo.purchaseDate).toLocaleString();
  const expiresDate = new Date(lastTransaction.signedTransactionInfo.expiresDate).toLocaleString();
  const productId = lastTransaction.signedTransactionInfo.productId;
  const status = parseStatus(lastTransaction.status);
  const autoRenewStatus = parseAutoRenewStatus(lastTransaction.signedRenewalInfo.autoRenewStatus);
  const offerType = parseOfferType(lastTransaction.signedTransactionInfo.offerType);
  const transactionId = lastTransaction.signedTransactionInfo.transactionId;
  const originalTransactionId = lastTransaction.signedTransactionInfo.originalTransactionId;

  return (
    <Box p="4" w={ ["sm","md"] } borderWidth="1px" borderRadius="lg">
      <Grid templateColumns="repeat(4, 1fr)" gap="4">
        <GridItem colSpan="4">
          <DefinitionList fontSize={ ["sm", "md"] } maxWidth="full" name="Product ID" value={ productId }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Status" value={ status }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Auto-renew" value={ autoRenewStatus }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Purchase Date" value={ purchaseDate }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Expires Date" value={ expiresDate }/>
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Subscription Offer" value={ offerType } />
        </GridItem>
        <GridItem colSpan="4">
          <Divider />
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Transaction ID" value={ transactionId } />
        </GridItem>
        <GridItem colSpan="2">
          <DefinitionList fontSize={ ["sm", "md"] } name="Original Transaction" value={ originalTransactionId } />
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