'use client';

import { Button } from '@/components/ui/button';
import { useWeb3Modal } from '@web3modal/wagmi/react';
import { useAccount } from 'wagmi';
import { disconnect } from '@wagmi/core';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { ModeToggle } from '@/components/dropdown';
import { ChevronRight, Droplets, LogOut } from 'lucide-react';
import { IconBarbell } from '@tabler/icons-react';

export function Nav() {
  const { open } = useWeb3Modal();
  const { address } = useAccount();
  const pathname = usePathname();

  return (
    <nav
      className='
    border-b flex
    flex-col sm:flex-row
    items-start sm:items-center
    sm:pr-10
    '
    >
      <div className='py-3 px-8 flex flex-1 items-center p'>
        <Link href='/' className='mr-5 flex items-center'>
          <IconBarbell className='h-6 w-6' />
          <p className={`ml-2 mr-4 text-lg font-semibold`}>USDC FIT</p>
        </Link>
        <Link
          href='/'
          className={`mr-5 text-sm ${pathname !== '/' && 'opacity-50'}`}
        >
          <p>Home</p>
        </Link>
        <Link
          href='/new'
          className={`mr-5 text-sm ${pathname !== '/new' && 'opacity-50'}`}
        >
          <p>New Challenge</p>
        </Link>
        <Link
          href='/new-home'
          className={`mr-5 text-sm ${pathname !== '/new-home' && 'opacity-50'}`}
        >
          <p>New Home</p>
        </Link>
        {address && (
          <Link
            href='/profile'
            className={`mr-5 text-sm ${pathname !== '/search' && 'opacity-60'}`}
          >
            <p>Profile</p>
          </Link>
        )}
      </div>
      <div
        className='
        flex
        sm:items-center
        pl-8 pb-3 sm:p-0
      '
      >
        {!address && (
          <Button onClick={() => open()} variant='secondary' className='mr-4'>
            Connect Wallet
            <ChevronRight className='h-4 w-4' />
          </Button>
        )}
        {address && (
          <Button onClick={disconnect} variant='secondary' className='mr-4'>
            Disconnect
            <LogOut className='h-4 w-4 ml-3' />
          </Button>
        )}

        {/* <ModeToggle /> */}
      </div>
    </nav>
  );
}
