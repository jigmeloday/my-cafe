import { Button } from '../ui/button';
import { Input } from '../ui/input';

function Newsletter() {
  return (
    <form className="mt-12 mb-8 flex flex-col sm:flex-row items-center justify-center gap-3">
      <Input type="email" placeholder="Enter your email" required />
      <Button>Subscribe</Button>
    </form>
  );
}

export default Newsletter;
