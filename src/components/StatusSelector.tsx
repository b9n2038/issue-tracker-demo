import {Popover, PopoverButton, PopoverPanel} from '@headlessui/react';
import {IssueState} from '../generated/IssueTracker';
import StatusContexMenu from './StatusContextMenu';

interface StatusSelectorProps {
  state: keyof IssueState;
  onSelect?: (status: keyof IssueState) => void;
}

export default function StatusSelector({
  status,
  onSelect,
}: StatusSelectorProps) {
  return (
    <Popover className="relative">
      <PopoverButton>{status}</PopoverButton>
      <PopoverPanel>
        <StatusContexMenu id={status} onSelect={onSelect} />
      </PopoverPanel>
    </Popover>
  );
}
