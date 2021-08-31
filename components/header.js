 import {
  Flex,
  Spacer,
  ButtonGroup,
  Button,
  IconButton,
  HStack,
  Text,
} from "@chakra-ui/react";
import NextLink from 'next/link';
import { FaBeer, FaIdBadge } from 'react-icons/fa';

function handleClickFAQ() {
  console.log("Clicked FAQ");
}

function handleClickChangelog() {
  console.log("Clicked changelog");
}

export default function Header() {
  return (
    <HStack
        px={[4, 10]}
        w="full"
        minH="14"
        zIndex="1"
        shadow="md"
        spacing="6"
        bgColor="white"
        position="fixed"
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
      <ButtonGroup size={ ["md", "lg"] } variant="link" colorScheme="green">
        <Button onClick={handleClickFAQ}>
          FAQ
        </Button>
        <Button onClick={handleClickChangelog}>
          Changelog
        </Button>
      </ButtonGroup>
    </HStack>
  );
}