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
  products: T[];
}

const limit = 20;

const initialData: BasePagingRes<Product> = {
  limit: 0,
  skip: 0,
  total: 0,
  products: []
};

const getDataFromLocalStorage = () => {
  const dataFromLocalStorage = localStorage.getItem('products');
  const initialDataProduct = dataFromLocalStorage
    ? JSON.parse(dataFromLocalStorage)
    : { prevData: initialData, nextData: initialData, page: 1 };

  return initialDataProduct;
};
function App() {
  const [dataProducts, setDataProducts] = useState<BasePagingRes<Product>>(initialData);
  const [page, setPage] = useState<number>(1);

  const totalPages = useMemo<number>(() => {
    return dataProducts.total < limit ? 1 : Math.ceil(dataProducts.total / limit);
  }, [dataProducts]);

  const fetchProducts = async (page: number) => {
    const currentPage = page;
    let prevData = initialData;
    let nextData = initialData;
    let skip = 0;

    if (currentPage > 1) {
      skip = (page - 2) * limit;
      const { data } = await axios.get('https://dummyjson.com/products', {
        params: {
          skip,
          limit
        }
      });
      prevData = data;
    }

    if (currentPage < totalPages || currentPage === 1) {
      skip = page * limit;
      const { data } = await axios.get('https://dummyjson.com/products', {
        params: {
          skip,
          limit
        }
      });
      nextData = data;
    }

    if (currentPage === 1) {
      skip = (page - 1) * limit;
      const { data } = await axios.get('https://dummyjson.com/products', {
        params: {
          skip,
          limit
        }
      });
      setDataProducts(data);
    }

    localStorage.setItem('products', JSON.stringify({ nextData, prevData, page }));
  };

  React.useEffect(() => {
    fetchProducts(page);
  }, [page]);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNextPage = () => {
    scrollToTop();
    const data = getDataFromLocalStorage();
    setDataProducts(data.nextData);
    setPage((prev) => prev + 1);
  };
  const handlePrevPage = () => {
    scrollToTop();
    const data = getDataFromLocalStorage();
    setDataProducts(data.prevData);
    setPage((prev) => prev - 1);
  };

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
