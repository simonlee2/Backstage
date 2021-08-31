import Head from 'next/head'
import Header from './header'
import styles from './layout.module.css'
import { Link, Text } from '@chakra-ui/react';

const siteTitle = "Backstage";
export default function NextLayout({ children }) {
  return (
    <div>
      <Head>
        <link rel="icon" href="/favicon.ico"/>
        <title>{ siteTitle }</title>
        <meta
          name="description"
          content="Support your paying customers with confidence and ease"
        />
        <meta name="og:title" content={siteTitle} />
        {/* <meta name="viewport" content="width=device-width, initial-scale=1"/> */}
      </Head>
      <Header />
      <main className={styles.main}>{children}</main>
      <footer className={styles.footer}>
        <Text>
          Made by the {" "}
          <Link
            href="https://picc.co/?utm_source=backstage_app"
            target="_blank"
            >
            PicCollage Company
          </Link>
        </Text>
      </footer>
    </div>
  );
};