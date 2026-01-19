import {useCallback, useState} from 'react';
import {useAddRowCallback} from 'tinybase/ui-react';
import {Button} from './components/ui/button';
import {Input} from './components/ui/input';
import {IssueState} from './generated/IssueTracker';

enum Priority {
  NONE = 0,
  LOW = 1,
  MEDIUM = 2,
  HIGH = 3,
  URGENT = 4,
}

export const IssueForm = () => {
  const [title, setTitle] = useState('');
  const [priority, setPriority] = useState<Priority>(Priority.NONE);
  const [status, setStatus] = useState<IssueState>(IssueState.Backlog);

  const addIssue = useAddRowCallback(
    'issue',
    () => ({ title, status, priority }),
    [title, status, priority],
    undefined,
    (rowId) => {
      clearFormState();
      console.log('Issue created:', rowId);
    },
  );

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && title.trim() !== '') {
      addIssue();
    }
  };

  const clearFormState = () => {
    setPriority(Priority.NONE);
    setTitle('');
    setStatus(IssueState.Backlog);
  };

  const handleTitleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => setTitle(event.target.value),
    [],
  );



  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (title.trim()) {
      addIssue();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="title" className="text-sm font-medium text-foreground">
          Issue Title
        </label>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder="Enter issue title..."
          value={title}
          onChange={handleTitleChange}
          onKeyDown={handleKeyDown}
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="priority" className="text-sm font-medium text-foreground">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value) as Priority)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={Priority.NONE}>None</option>
            <option value={Priority.LOW}>Low</option>
            <option value={Priority.MEDIUM}>Medium</option>
            <option value={Priority.HIGH}>High</option>
            <option value={Priority.URGENT}>Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value as IssueState)}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value={IssueState.Backlog}>Backlog</option>
            <option value={IssueState.Todo}>Todo</option>
            <option value={IssueState.InProgress}>In Progress</option>
            <option value={IssueState.Done}>Done</option>
            <option value={IssueState.Cancelled}>Cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex gap-2">
        <Button type="submit" disabled={!title.trim()}>
          Create Issue
        </Button>
        <Button type="button" variant="outline" onClick={clearFormState}>
          Clear
        </Button>
      </div>

      <div className="text-xs text-muted-foreground">
        Press Enter in the title field or click "Create Issue" to add the issue
      </div>
    </form>
  );
};
