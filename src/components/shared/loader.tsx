import { LoaderCircle } from 'lucide-react';

function Loader({ className, title }: {className?: string, title: string}) {
  return (
    <div className={`flex flex-col w-full ${className}`}>
      <LoaderCircle className='text-primary-300 animate-spin' />
      <p className='mt-2 text-[12px]'>{title}</p>
    </div>
  )
}

export default Loader;