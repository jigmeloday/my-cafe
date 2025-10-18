import { Calendar, TimerIcon } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

function EventCard() {
  return(
    <Link className='w-full rounded-md overflow-hidden transition-all duration-300 ease-in-out border border-primary-50 hover:-translate-y-1 hover:shadow-lg hover:shadow-primary-500/10 cursor-pointer' href={`events/{}`}>
      <div className='h-[250px]'>
        <Image
        src='https://images.unsplash.com/photo-1502635385003-ee1e6a1a742d?ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&q=80&w=987'
        alt=''
        height={400}
        width={400}
        className='object-cover h-full w-full'
        />
      </div>
      <div className='px-[16px] py-[18px]'>
        <h6>Title goes herer</h6>
        <div className='flex mt-[8px] items-center space-x-4'>
          <TimerIcon size={16} />
          <span className='text-[12px]'>8:00 PM</span>
        </div>
        <div className='flex mt-[8px] items-center space-x-4'>
          <Calendar size={16}/>
          <span className='text-[12px]'>Mon 12 20205</span>
        </div>
       
      </div>
    </Link>
  )
}

export default EventCard;