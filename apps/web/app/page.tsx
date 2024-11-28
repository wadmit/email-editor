import NextImage from 'next/image';
import NextLink from 'next/link';
import ArrowImage from '@/public/arrow.svg';
import IconImage from '@/public/brand/icon.svg';
import StarImage from '@/public/star.svg';
import { Icons } from '@/components/icons';
import { NovueIcon } from '@/components/partners/novu-icon';
import Playground from './Main';

const components = [
  'Logo',
  'Buttons and Variants',
  'Variables',
  'Text Formatting',
  'Image',
  'Alignment',
  'Divider',
  'Spacer',
  'Footer',
  'List',
  'Quote',
  'Code',
];

const comingSoon = ['Social', 'Video', 'Table', 'Columns', 'Countdown'];

export const dynamic = 'force-static';

export default function LandingPage() {
  return (
    <div>
      <Playground />
    </div>
  );
}
