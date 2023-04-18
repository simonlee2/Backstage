 import {
  VStack,
  HStack,
  Text,
  Switch,
} from "@chakra-ui/react";
import { useLocalStorage } from "../src/useLocalStorage";
import NextLink from 'next/link';
import { FaIdBadge } from 'react-icons/fa';

export default function Header() {
  const [storeKitEnv, setStoreKitEnv] = useLocalStorage("storeKitEnv", process.env.STOREKIT_ENV);

  const handleToggleEnv = () => {
    if (storeKitEnv === 'production') {
      setStoreKitEnv('sandbox');
    } else {
      setStoreKitEnv('production');
    }
  }

  const isSandbox = storeKitEnv === 'sandbox';

  return (
    <VStack shadow="md" spacing="0">
      <HStack
        px={[4, 10]}
        w="full"
        minH="14"
        zIndex="1"
        
        spacing="6"
        bgColor="white"
        alignItems="center"
        justify="space-between"
      >
        <NextLink href="/">
          <a>
            <HStack>
              <FaIdBadge size="30"/>
              <Text fontSize={ ["xl", "2xl"] }>Backstage</Text>
            </HStack>
          </a>
        </NextLink>
        <HStack alignItems="center">
          { renderToggle(isSandbox, handleToggleEnv) }
          <Text>Use Sandbox</Text>
        </HStack>
      </HStack>
      { 
        renderSandboxNotice(isSandbox)
      }
    </VStack>   
  );
}

function renderToggle(enabled, handleToggleEnv) {
  if (enabled) {
    return (
      <Switch size={"md"} colorScheme="orange" onChange={handleToggleEnv} isChecked/>
    )
  } else {
    return (
      <Switch size={"md"} colorScheme="orange" onChange={handleToggleEnv}/>
    )
  }
}

function renderSandboxNotice(enabled) {
  if (!enabled) {
    return null;
  } else {
    return (
      <HStack
        minHeight="4"
        justify="center"
        backgroundColor="orange"
        w="full"
      >
        <Text size="xs">Viewing Sandbox Data</Text>
      </HStack>
    )
  }
}