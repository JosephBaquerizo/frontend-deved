import Head from 'next/head';
import { useQuery } from 'urql';
import { PRODUCT_QUERY } from '../lib/query';
import Product from '../components/Product';
import { Gallery } from  '../styles/Gallery';

export default function Home() {

  const [results] = useQuery({ query: PRODUCT_QUERY });
  const { data, fetching, error } = results;

  // Check for data coming in
  if (fetching) return <p>Loading</p>
  if (error) return <p>Oh no...</p>
  const products = data.products.data;

  return (
    <div>
      <Head>
        <title>Styled HomePage</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Gallery>
          {
            products.map((product, index) => <Product key={index} product={product} />)
          }
        </Gallery>
      </main>
    </div>
  )
}

