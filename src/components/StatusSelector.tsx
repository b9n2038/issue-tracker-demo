import {Popover, PopoverButton, PopoverPanel} from '@components/ui/popover';
import {IssueState} from '../generated/IssueTracker';
import StatusContexMenu from './StatusContextMenu';

interface StatusSelectorProps {
  status: keyof IssueState;
  onSelect?: (status: keyof IssueState) => void;
}

export default function StatusSelector({
  status,
  onSelect,
}: StatusSelectorProps) {
  return (
    <Popover className="relative">
      <PopoverButton aria-label="Select status">Trigger {status}</PopoverButton>
      <PopoverPanel>
        <StatusContexMenu id={status} onSelect={onSelect} />
      </PopoverPanel>
    </Popover>
  );
}
