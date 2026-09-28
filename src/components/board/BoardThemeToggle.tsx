import { Moon, Sun } from 'lucide-react';
import BoardTip from './BoardTip';
import { useBoardTheme } from './useBoardTheme';

export const BoardThemeToggle = () => {
  const { theme, toggle } = useBoardTheme();
  const isLight = theme === 'light';
  const label = isLight ? 'Cambiar a tema oscuro' : 'Cambiar a tema claro';
  return (
    <BoardTip label={label} side="bottom">
      <button
        type="button"
        onClick={toggle}
        aria-label={label}
        className="flex h-11 w-11 items-center justify-center rounded-[3px] border border-board-line2 text-board-ink2 hover:border-board-amber hover:text-board-amberink"
      >
        {isLight ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
      </button>
    </BoardTip>
  );
};

export default BoardThemeToggle;
