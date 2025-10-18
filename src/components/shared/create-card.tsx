import { Plus } from 'lucide-react';

function CreateCard({
  title,
  primaryText,
  description,
  setOpen,
}: {
  title: string;
  description?: string;
  setOpen: (value: boolean) => void;
  primaryText: string;
}) {
  return (
    <div
      onClick={() => setOpen(true)}
      className="min-h-[340px] w-full rounded-md flex flex-col items-center justify-center border-2 border-dashed border-primary-500 p-6 cursor-pointer group transition-all duration-300 hover:shadow-lg"
    >
      <Plus
        size={32}
        className="text-primary-500 transition-transform duration-700 ease-in-out group-hover:rotate-180"
      />
      <p className="mt-4 text-center text-sm font-medium">
        {title} {' '}
        <span className="font-semibold text-primary-500">{primaryText}</span>
      </p>
      <p className="mt-2 text-center text-xs text-black/70">{description}</p>
    </div>
  );
}

export default CreateCard;
