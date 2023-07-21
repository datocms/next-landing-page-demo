'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  // const router = useRouter();
  // console.log(router);

  return (
    <div className="relative">
      <div
        onClick={() => {
          isOpen ? setIsOpen(false) : setIsOpen(true);
        }}
        onBlur={() =>
          setTimeout(() => {
            setIsOpen(false);
          }, 100)
        }
        className="ml-4 inline-flex w-28 items-center overflow-hidden rounded-md bg-white transition duration-100 hover:bg-gray-200 active:scale-95 active:bg-gray-300"
      >
        <button className="inline-flex cursor-pointer items-center justify-center rounded-lg px-4 py-2 text-sm font-medium text-gray-800">
          <svg
            className="mr-2 h-5 w-5 rounded-full"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsXlink="http://www.w3.org/1999/xlink"
            viewBox="0 0 3900 3900"
          >
            <path fill="#b22234" d="M0 0h7410v3900H0z" />
            <path
              d="M0 450h7410m0 600H0m0 600h7410m0 600H0m0 600h7410m0 600H0"
              stroke="#fff"
              strokeWidth="300"
            />
            <path fill="#3c3b6e" d="M0 0h2964v2100H0z" />
            <g fill="#fff">
              <g id="d">
                <g id="c">
                  <g id="e">
                    <g id="b">
                      <path
                        id="a"
                        d="M247 90l70.534 217.082-184.66-134.164h228.253L176.466 307.082z"
                      />
                      <use xlinkHref="#a" y="420" />
                      <use xlinkHref="#a" y="840" />
                      <use xlinkHref="#a" y="1260" />
                    </g>
                    <use xlinkHref="#a" y="1680" />
                  </g>
                  <use xlinkHref="#b" x="247" y="210" />
                </g>
                <use xlinkHref="#c" x="494" />
              </g>
              <use xlinkHref="#d" x="988" />
              <use xlinkHref="#c" x="1976" />
              <use xlinkHref="#e" x="2470" />
            </g>
          </svg>
          English
        </button>
      </div>

      <div
        className={
          'end-0 absolute z-10 mt-1 ml-4 w-28 rounded-md border border-gray-100 bg-white shadow-lg' +
          (isOpen ? '' : ' hidden')
        }
        role="menu"
      >
        <div className="inline-flex w-full cursor-pointer items-center justify-center rounded-lg text-sm font-medium text-gray-900 hover:bg-gray-100">
          <Link
            href="#"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-3.5 w-3.5 rounded-full"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-de"
                viewBox="0 0 512 512"
              >
                <path fill="#ffce00" d="M0 341.3h512V512H0z" />
                <path d="M0 0h512v170.7H0z" />
                <path fill="#d00" d="M0 170.7h512v170.6H0z" />
              </svg>
              Deutsch
            </div>
          </Link>
        </div>
        <div>
          <Link
            href="/about"
            locale="it"
            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-600 dark:hover:text-white"
            role="menuitem"
          >
            <div className="inline-flex items-center">
              <svg
                className="mr-2 h-3.5 w-3.5 rounded-full"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                id="flag-icon-css-it"
                viewBox="0 0 512 512"
              >
                <g fillRule="evenodd" strokeWidth="1pt">
                  <path fill="#fff" d="M0 0h512v512H0z" />
                  <path fill="#009246" d="M0 0h170.7v512H0z" />
                  <path fill="#ce2b37" d="M341.3 0H512v512H341.3z" />
                </g>
              </svg>
              Italiano
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelector;
