import { useMemo, useState } from 'react';
import axios from 'axios';
import './App.css';
import Header from '@components/Header';
import React from 'react';
import ProductItem from '@components/ProductItem';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  thumbnail: string;
}

interface BasePagingRes<T> {
  limit: number;
  skip: number;
  total: number;
  products: Product[];
}

const limit = 20;

const initialData: BasePagingRes<Product> = {
  limit: 0,
  skip: 0,
  total: 0,
  products: []
};

function App() {
  const [dataProducts, setDataProducts] = useState<BasePagingRes<Product>>(initialData);
  const [page, setPage] = useState<number>(1);
  const [totalProducts, setTotalProducts] = useState<number>(0);

  const getProducts = async (skip: number) => {
    const { data } = await axios.get('https://dummyjson.com/products', {
      params: {
        skip,
        limit
      }
    });

    setDataProducts(data);
    setTotalProducts(data.total);
  };

  const skip = useMemo<number>(() => {
    return (page - 1) * limit;
  }, [page]);

  const totalPages = useMemo<number>(() => {
    // we suppose that if we have 0 items we want 1 empty page
    return totalProducts < limit ? 1 : Math.ceil(totalProducts / limit);
  }, [totalProducts]);

  React.useEffect(() => {
    getProducts(skip);
  }, [skip]);

  const handleNextPage = () => setPage((prev) => prev + 1);
  const handlePrevPage = () => setPage((prev) => prev - 1);

  return (
    <>
      <Header />
      <div className='p-5'>
        <div className='mt-[60px] grid grid-flow-row gap-8 text-neutral-600 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'>
          {dataProducts.products.length > 0 &&
            dataProducts.products.map((product) => <ProductItem product={product} key={product.id} />)}
        </div>
        <div className='flex justify-center items-center gap-3'>
          <button
            disabled={page === 1}
            onClick={handlePrevPage}
            type='button'
            className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
          >
            Previous
          </button>
          <button
            disabled={page === totalPages}
            onClick={handleNextPage}
            type='button'
            className='text-gray-900 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-200 font-medium rounded-lg text-sm px-5 py-2.5 mr-2 mb-2 dark:bg-gray-800 dark:text-white dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700'
          >
            Next
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
