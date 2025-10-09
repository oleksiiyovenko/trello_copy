import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface HintProps {
  children: React.ReactNode;
  description: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
  sideOffset?: number;
}

export function Hint({
  children,
  description,
  side = 'bottom',
  sideOffset = 0,
}: HintProps) {
  return (
    <Tooltip delayDuration={0}>
      <TooltipTrigger asChild>{children}</TooltipTrigger>
      <TooltipContent
        sideOffset={sideOffset}
        side={side}
        className='text-xs max-w-[220px] break-words text-foreground bg-muted'
      >
        {description}
      </TooltipContent>
    </Tooltip>
  );
}
