import React from 'react';
import { SnowflakeIcon } from './icons/themes/SnowflakeIcon';
import { GiftIcon } from './icons/themes/GiftIcon';
import { ShoppingTagIcon } from './icons/themes/ShoppingTagIcon';
import { AutumnLeafIcon } from './icons/themes/AutumnLeafIcon';
import { TurkeyIcon } from './icons/themes/TurkeyIcon';

interface ThemeIconProps {
  name?: string;
  className?: string;
}

const iconMap: { [key: string]: React.FC<React.SVGProps<SVGSVGElement>> } = {
  snowflake: SnowflakeIcon,
  gift: GiftIcon,
  'shopping-tag': ShoppingTagIcon,
  'autumn-leaf': AutumnLeafIcon,
  turkey: TurkeyIcon,
};

export const ThemeIcon: React.FC<ThemeIconProps> = ({ name, className }) => {
  if (!name) return null;
  const IconComponent = iconMap[name.toLowerCase()];
  if (!IconComponent) return null;
  
  return <IconComponent className={className} />;
};
