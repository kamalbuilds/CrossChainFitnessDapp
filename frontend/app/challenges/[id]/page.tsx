'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

import { Button } from '@/components/ui/button';
import { Challenge } from '@/lib/types';
import { cn } from '@/lib/utils';
import { useExplorePublications } from '@lens-protocol/react-web';
import { Grab, Heart, MessageSquare, Repeat2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

const sampleChallenge: Challenge = {
  id: '1',
  activity: 'push-ups',
  amountOfActivityPerUnit: 10,
  completionTimeUnit: 'day',
  description: 'Do 10 push-ups every day for 30 days',
  duration: 30,
  judges: ['roger.lens', 'nader.lens'],
  participants: ['kamal.lens', 'abhishek.lens', 'aman.lens'],
  wagerAmount: 100,
};

export default function ChallengePage({ params }: { params: { id: string } }) {
  const { data: pubs, loading } = useExplorePublications() as any;

  return (
    <main className='px-10 py-14 max-w-fit mx-auto'>
      <h1 className='text-3xl font-bold'>{sampleChallenge.description} </h1>
      <div className='mt-10'>
        <h2 className='text-xl font-bold'>Wager Amount</h2>
        <p className='mt-2'>{sampleChallenge.wagerAmount} USDC Coin</p>
      </div>

      <div className='mt-10'>
        <h2 className='text-xl font-bold'>Judges</h2>
        <ul className='mt-2'>
          {sampleChallenge.judges.map((judge) => (
            <li key={judge}>{judge}</li>
          ))}
        </ul>
      </div>

      <div className='mt-10'>
        <h2 className='text-xl font-bold'>Participants</h2>
        <ul className='mt-2'>
          {sampleChallenge.participants.map((participant) => (
            <li key={participant}>{participant}</li>
          ))}
        </ul>
      </div>

      <Button className='mt-10 font-bold p-6'>POST YOUR DAILY UPDATE</Button>

      <h2 className='text-xl font-bold mt-10'>Previous updates</h2>

      {pubs?.map((publication) => {
        return (
          <div
            className='border-b w-6/12'
            key={publication.id}
            onClick={() =>
              window.open(
                `https://share.lens.xyz/p/${publication.id}`,
                '_blank'
              )
            }
          >
            <div
              className='
                      space-y-3 mb-4 pt-6 pb-2
                      sm:px-6 px-2
                      '
            >
              <div className='flex'>
                <Avatar>
                  <AvatarImage
                    src={publication.by?.metadata?.picture?.optimized?.uri}
                  />
                  <AvatarFallback>
                    {publication.by.handle.localName.slice(0, 2)}
                  </AvatarFallback>
                </Avatar>
                <div className='ml-4'>
                  <h3 className='mb-1 font-medium leading-none'>
                    {publication.by.handle.localName}.
                    {publication.by.handle.namespace}
                  </h3>
                  <p className='text-xs text-muted-foreground'>
                    {publication.by.metadata?.displayName}
                  </p>
                </div>
              </div>
              <div>
                <img
                  className={cn(`
                            max-w-full sm:max-w-[500px]
                            rounded-2xl h-auto object-cover transition-all hover:scale-105
                            `)}
                  src={
                    publication.__typename === 'Post'
                      ? publication.metadata?.asset?.image?.optimized?.uri
                      : ''
                  }
                />
                <ReactMarkdown
                  className='
                          mt-4 break-words
                          '
                >
                  {publication.metadata.content.replace(
                    /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gi,
                    '[LINK]($1)'
                  )}
                </ReactMarkdown>
              </div>
              <div>
                <Button className='rounded-full mr-1' variant='secondary'>
                  <MessageSquare className='mr-2 h-4 w-4' />
                  {publication.stats.comments}
                </Button>
                <Button className='rounded-full mr-1' variant='secondary'>
                  <Repeat2 className='mr-2 h-4 w-4' />
                  {publication.stats.mirrors}
                </Button>
                <Button className='rounded-full mr-1' variant='secondary'>
                  <Heart className='mr-2 h-4 w-4' />
                  {publication.stats.upvotes}
                </Button>
                <Button className='rounded-full mr-1' variant='secondary'>
                  <Grab className='mr-2 h-4 w-4' />
                  {publication.stats.collects}
                </Button>
              </div>
            </div>
          </div>
        );
      })}
    </main>
  );
}
