import Image from 'next/image';
import { NodataPropsType } from '../../../types';
import { Button } from '../ui/button';
import { useSession } from 'next-auth/react';

function NoData({ title, description, buttonText, action, className }: NodataPropsType) {
  const { data: session } = useSession();

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center">
        <Image
          src="/svg/empty.svg"
          alt="no data"
          height={300}
          width={300}
          className=""
        />
        <h3>{title}</h3>
        <div className="my-[14px] w-[60%] text-center">
          <p className="text-[12px] text-black/80">{description}</p>
        </div>
         {
          buttonText ? <>
         {['super_admin', 'owner'].includes(session?.user.role as string) &&
          session?.user.cafeCreation && (
            <Button onClick={() => action?.(true)}>{buttonText}</Button>
          )}
         </>: null
         }
      </div>
    </div>
  );
}

export default NoData;
