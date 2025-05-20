import { Heart } from 'lucide-react';

const Footer = () => {
  return (
    <div className="flex items-center justify-center gap-1 h-20 bg-green">
      <div className="text-white text-sm">Made with</div>
      <Heart className="w-4 h-4" fill="var(--color-orange)" />
      <div className="text-white text-sm">in 2025</div>
    </div>
  );
};

export default Footer;
