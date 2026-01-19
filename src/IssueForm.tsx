import {useCallback, useRef, useState} from 'react';
import {useStore} from 'tinybase/ui-react';
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
  const priorityRef = useRef<HTMLSelectElement>(null);
  const statusRef = useRef<HTMLSelectElement>(null);
  const issueStore = useStore();

  const addIssue = useCallback(() => {
    const priorityValue = priorityRef.current?.value || "0";
    const statusValue = statusRef.current?.value || "Backlog";

    const currentPriority = Number(priorityValue);
    const currentStatus = statusValue as IssueState;

    console.log('Creating issue with:', {
      title,
      status: currentStatus,
      priority: currentPriority,
      priorityRefValue: priorityValue,
      statusRefValue: statusValue
    });

    // Create issue directly using the store
    issueStore?.setRow('issue', Date.now().toString(), {
      title,
      status: currentStatus,
      priority: currentPriority,
      projectId: '0', // Default to first project
      createdAt: new Date().toISOString()
    });
    clearFormState();
  }, [title, issueStore]);

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter' && title.trim() !== '') {
      addIssue();
    }
  };

  const clearFormState = () => {
    setTitle('');
    if (priorityRef.current) priorityRef.current.value = "0";
    if (statusRef.current) statusRef.current.value = "Backlog";
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
            ref={priorityRef}
            defaultValue={Priority.NONE.toString()}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="0">None</option>
            <option value="1">Low</option>
            <option value="2">Medium</option>
            <option value="3">High</option>
            <option value="4">Urgent</option>
          </select>
        </div>

        <div className="space-y-2">
          <label htmlFor="status" className="text-sm font-medium text-foreground">
            Status
          </label>
          <select
            id="status"
            ref={statusRef}
            defaultValue={IssueState.Backlog}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="Backlog">Backlog</option>
            <option value="Todo">Todo</option>
            <option value="InProgress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Cancelled">Cancelled</option>
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
