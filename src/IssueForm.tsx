import {useCallback, useRef, useState} from 'react';
import {useAddRowCallback, useStore} from 'tinybase/ui-react';
import StatusSelector from './components/StatusSelector';
import {Issue, IssueState} from './generated/IssueTracker';

enum IssueFormMode {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
}
interface IssueFormProps {
  isOpen: boolean;
  onDismiss?: () => void;
  mode?: IssueFormMode;
  inputValues?: Partial<Issue>;
}

enum Priority {
  NONE,
  URGENT,
  HIGH,
  MEDIUM,
  LOW,
}

export const IssueForm = ({
  isOpen,
  onDismiss,
  mode = IssueFormMode.CREATE,
}: IssueFormProps) => {
  const ref = useRef<HTMLInputElement>(null);
  const [title, setTitle] = useState('');
  // const [description, setDescription] = useState(''); //rich text
  const [priority, setPriority] = useState(Priority.NONE);
  const [status, setStatus] = useState(IssueState.Backlog);
  //labels

  const issueStore = useStore();

  const listenerId = issueStore?.addRowListener(
    'issue',
    null,
    (store, tableId, rowId) => {
      console.log(`${rowId} row in ${tableId} table changed`);
    },
  );
  const clearFormState = () => {
    setPriority(0);
    setTitle('');
    setStatus(IssueState.Backlog);
  };
  // const type = useValue('type', 'viewStore')
  const handleTitleChange = useCallback(
    ({target: {value}}) => setTitle(value),
    [],
  );

  const handleKeyDown = useAddRowCallback(
    'issue',
    ({which, target: {value: title}}, store) =>
      which == 13 && title != '' ? {title, status, priority} : undefined,
    [setTitle],
    undefined,
    (rowId, _, row) => {
      clearFormState();
      console.log('interesting, fires once', rowId, row['title']);
    },
  );

  const handleSubmit = () => {
    //do validation
    //createUssue
    //clearState
    //Dodismiss
  };

  return (
    <div className="issue__create">
      <input
        placeholder="Issue title"
        value={title}
        // ref={ref}
        onChange={handleTitleChange}
        onKeyDown={handleKeyDown}
      />
      <input
        value={priority}
        type="number"
        min="0"
        max="4"
        maxLength={1}
        onChange={(e) => setPriority(e.target.value)}
      />
      <StatusSelector state={status} onSelect={setStatus} />
    </div>
  );
};
