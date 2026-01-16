import { BarChart3, Users, ShoppingCart } from 'lucide-react';

interface IconProps {
  name: string;
  className?: string;
}

export function Icon({ name, className = "w-16 h-16" }: IconProps) {
  const iconProps = { className };
  
  switch (name) {
    case 'chart-bar':
      return <BarChart3 {...iconProps} />;
    case 'users':
      return <Users {...iconProps} />;
    case 'shopping-cart':
      return <ShoppingCart {...iconProps} />;
    default:
      return null;
  }
}




