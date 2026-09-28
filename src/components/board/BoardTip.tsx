// Tooltip del tablero: reemplaza el title nativo del navegador (que ignora la paleta).
import * as Tooltip from '@radix-ui/react-tooltip';
import type { ReactNode } from 'react';

interface BoardTipProps {
  label: ReactNode;
  children: ReactNode;
  side?: 'top' | 'bottom' | 'left' | 'right';
}

export const BoardTip = ({ label, children, side = 'top' }: BoardTipProps) => (
  <Tooltip.Provider delayDuration={120} skipDelayDuration={300}>
    <Tooltip.Root>
      <Tooltip.Trigger asChild>{children}</Tooltip.Trigger>
      <Tooltip.Portal>
        <Tooltip.Content
          side={side}
          sideOffset={6}
          collisionPadding={8}
          className="z-[100] rounded-[3px] border border-board-line2 bg-board-ground px-2.5 py-1.5 font-data text-xs font-bold text-board-ink data-[state=delayed-open]:animate-in data-[state=delayed-open]:fade-in-0"
        >
          {label}
          <Tooltip.Arrow width={10} height={5} className="fill-board-line2" />
        </Tooltip.Content>
      </Tooltip.Portal>
    </Tooltip.Root>
  </Tooltip.Provider>
);

export default BoardTip;
