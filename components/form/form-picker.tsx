'use client';
import { defaultImages } from '@/constants/images';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

import { unsplash } from '@/lib/usplash';
import { cn } from '@/lib/utils';

import { Check, Loader2 } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { FormErrors } from './form-errors';

interface FormPickerProps {
  id: string;
  errors?: Record<string, string[] | undefined>;
  width: number;
}

export function FormPicker({ id, errors, width }: FormPickerProps) {
  const { pending } = useFormStatus();

  const [images, setImages] = useState<Array<Record<string, any>>>(
    width > 1024 ? defaultImages : defaultImages.slice(0, 6)
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [selectedImageId, setSelectedImageId] = useState(null);

  useEffect(() => {
    const fetchImages = async () => {
      // return 'Remove on prod';
      setIsLoading(true);
      try {
        const result = await unsplash.photos.getRandom({
          collectionIds: ['317099'],
          count: width > 1024 ? 9 : 6,
        });
        if (result && result.response) {
          const newImages = result.response as Array<Record<string, any>>;
          setImages(newImages);
        } else {
          console.error('Failed to get images from Unsplash');
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchImages();
  }, []);

  if (isLoading) {
    return (
      <div className='p-6 flex items-center justify-center'>
        <Loader2 className='size-6 text-sky-700 animate-spin' />
      </div>
    );
  }
  return (
    <div className='relative'>
      <div className='grid grid-cols-3 gap-2 mb-2'>
        {images.map((image) => (
          <button
            type='button'
            key={image.id}
            className={cn(
              'cursor-pointer relative aspect-video group hover:opacity-75 transition bg-muted '
            )}
            onClick={() => {
              if (pending) return;
              setSelectedImageId(image.id);
            }}
          >
            <input
              type='radio'
              id={image.id}
              name={id}
              className='hidden'
              checked={selectedImageId === image.id}
              disabled={pending}
              value={`${image.id}|${image.urls.thumb}|${image.urls.full}|${image.links.html}|${image.user.name}`}
              onChange={() => {}}
            />
            <Image
              src={image.urls.thumb}
              alt='unsplash image'
              className='object-cover rounded-sm'
              fill
            />
            {selectedImageId === image.id && (
              <div className='absolute inset-y-0 size-full bg-black/30 flex items-center justify-center rounded-sm'>
                <Check className='size-4 text-white' />
              </div>
            )}
            <div className='md:hidden group-hover:block md:opacity-0 group-hover:opacity-100 absolute bottom-0 w-full text-[8px] md:text-[10px] text-white p-1 bg-black/50 rounded-b-sm'>
              <Link
                className='underline md:no-underline hover:underline truncate max-w-fit w-full block'
                target='_blank'
                href={image.links.html}
              >
                {image.user.name}
              </Link>
            </div>
          </button>
        ))}
      </div>
      <FormErrors id='image' errors={errors} />
    </div>
  );
}
