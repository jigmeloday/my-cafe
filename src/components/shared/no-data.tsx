import Image from 'next/image';
import { NodataPropsType } from '../../../types';
import { Button } from '../ui/button';

function NoData({ title, description, buttonText, action }: NodataPropsType) {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src="/svg/empty.svg"
          alt="no data"
          height={300}
          width={300}
          className=""
        />
        <h3>{title}</h3>
        <div className='my-[14px] w-[60%] text-center'>
          <p className='text-[12px] text-black/80'>{description}</p>
        </div>
        <Button onClick={() => action(true)}>{buttonText}</Button>
      </div>
    </div>
  );
}

export default NoData;
