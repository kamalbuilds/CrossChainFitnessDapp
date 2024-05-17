'use client';

import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { useProfiles } from '@lens-protocol/react-web';
import { AvatarImage } from '@radix-ui/react-avatar';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useAccount } from 'wagmi';

export default function NewHomePage() {
  const { address } = useAccount();
  const { data } = useProfiles({
    where: {
      ownedBy: [address as string],
    },
  }) as any;
  const profile = data?.[data.length - 1];
  const lensHandle = profile?.handle?.localName;

  return (
    <main className='px-10 py-14 max-w-fit mx-auto'>
      <div className='flex gap-2 items-center'>
        <img
          src={profile?.metadata?.picture?.optimized?.uri}
          className='rounded-full w-[100px]'
        />
        <h1 className='text-2xl'>Welcome Back {lensHandle}.lens</h1>
      </div>

      {/* ask the user to post an update for their ongoing challenge using a nice card and redirect them to /challenges/1 */}

      <h3 className='text-4xl mt-10 font-bold'>
        You have not posted an update for your push-up challenge today.
      </h3>
      <div className='flex items-center gap-2 mt-6'>
        <Avatar>
          <AvatarImage src='/images/abhishek.png' />
        </Avatar>
        abhishek.lens and
        <Avatar>
          <AvatarImage src='/images/kamal.jpeg' />
        </Avatar>{' '}
        kamal.lens have already posted their updates.
      </div>

      <div className='flex flex-col mt-8'>
        <span>10/30 days done</span>
        <Progress value={33} className='w-1/3' />
      </div>

      <Link href='/challenges/1'>
        <Button className='mt-10 font-bold p-6'>
          POST UPDATE - 4h remaining!
        </Button>
      </Link>
    </main>
  );
}
