import {IssueState} from '../generated/IssueTracker';

interface StatusSelectorProps {
  status: IssueState;
  onSelect?: (status: IssueState) => void;
}

export default function StatusSelector({
  status,
  onSelect,
}: StatusSelectorProps) {
  return (
    <select
      value={status}
      onChange={(e) => onSelect?.(e.target.value as IssueState)}
      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
    >
      <option value={IssueState.Backlog}>Backlog</option>
      <option value={IssueState.Todo}>Todo</option>
      <option value={IssueState.InProgress}>In Progress</option>
      <option value={IssueState.Done}>Done</option>
      <option value={IssueState.Cancelled}>Cancelled</option>
    </select>
  );
}
