import { CafeType } from '../../../types';
import CafeCard from '../shared/cafe-card';

function FeatureList({ feature }: { feature: CafeType[] }) {
  return (
   <div className="flex overflow-x-auto space-x-6 py-4 scrollbar-x">
  {feature.map((item) => (
    <div key={item.id} className="flex-shrink-0 w-[300px]">
      <CafeCard cafe={item} />
    </div>
  ))}
</div>
  );
}

export default FeatureList;
