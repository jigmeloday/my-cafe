import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';

function Page(){
  return(
    <div>
      <div className='flex space-x-2'>
        {
          [{className: 'bg-primary-50'}, {className: 'bg-primary-100'},{className: 'bg-primary-200'},{className: 'bg-primary-300'},{className: 'bg-primary-400'},{className: 'bg-primary-500'},{className: 'bg-primary-600'},{className: 'bg-primary-700'},{className: 'bg-primary-800'},{className: 'bg-primary-900'}].map((item) => (
            <div className={`size-[150px] ${item.className}`} key={item.className}>
              hello
            </div>
          ))
        }
      </div>
      <div className='my-[24px]'>
        <p className='my-[16px] text-4xl font-bold text-primary-500'>Button type</p>
       <div className='flex space-x-2'>
         <Button>Button Primary</Button>
         <Button variant="outline">Button outline</Button>
         <Button variant="secondary">Button secondary</Button>
         <Button variant="ghost">Button ghost</Button>
         <Button variant="link">Button link</Button>
       </div>
      </div>
      <div className='my-[32px]'>
         <p className='my-[16px] text-4xl font-bold text-primary-500'>Heading tag</p>
        <h1>Heading 1</h1>
        <h2>Heading 2</h2>
        <h3>Heading 3</h3>
        <h4>Heading 4</h4>
        <h5>Heading 5</h5>
        <h6>Heading 6</h6>
      </div>
      
        <div className='my-[52px]'>
        <p className='my-[16px] text-4xl font-bold text-primary-500'>Input type</p>
       <div className='px-[32px] space-y-10'>
         <Input />
         <Textarea />
         <Checkbox />
         <Checkbox checked={true} />
         <Slider />
         <Switch />
       </div>
      </div>
    </div>
  )
}

export default Page;