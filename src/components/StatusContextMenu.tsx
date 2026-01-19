import {Select} from '@components/ui/select';
import {IssueState} from '../generated/IssueTracker';

interface StatusContextMenuProps {
  selectedStatus: string;
  className?: string;
  onSelect?: (item: any) => void;
}

const states = Object.keys(IssueState);
//show value or None
//onClick, open,
//onSelect choose and callback
export default function StatusContexMenu({
  selectedStatus,
  className,
  onSelect,
}: StatusContextMenuProps) {
  const handleSelected = (id: string) => {
    onSelect && onSelect(id);
  };
  return (
    <Select name="status" aria-label="Issue status">
      {states.map((status) => (
        <option
          value="{status}"
          aria-checked={selectedStatus == status}
          onClick={handleSelected}
        >
          {status}
        </option>
      ))}
    </Select>
  );
  // return (
  // <RadioGroup value={selected} onChange={setSelected} aria-label="Status">
  // {states.map((state)=> {
  // <Field key={state} className="flex items-center gap-2">
  // <Radio value={state} className="group flex size=5 items-center justify-center rounded=full">
  // <span className="invisible size-2 rounded-full bg-white group=data-checked:visible"/>
  // </Radio>
  // <Label>{state}</Label>
  // </Field>
  // })}
  // )
}
