import {Button} from './components/ui/button';
import {useAddRowCallback} from 'tinybase/ui-react';
import {IssueState} from './generated/IssueTracker';
// Convenience function for generating a random integer
const getRandom = (max = 100) => Math.floor(Math.random() * max);
const IssueStates = Object.keys(IssueState);
export const Buttons = () => {
  // Attach events to the buttons to mutate the data in the TinyBase Store
  // const handleCount = useSetValueCallback(
  //   'counter',
  //   () => (value: ValueOrUndefined) => ((value ?? 0) as number) + 1,
  // );
  // const handleRandom = useSetValueCallback('random', () => getRandom());
  const handleAddIssue = useAddRowCallback('issue', (_, store) => ({
    title: ['fido', 'felix', 'bubbles', 'lowly', 'polly'][getRandom(5)],
    priority: getRandom(4),
    status: IssueStates[getRandom(4)],
    projectId: store.getRowIds('project')[getRandom(1)],
  }));

  return (
    <div className="flex gap-4">
      <Button onClick={handleAddIssue} className="px-6">
        Add Random Issue
      </Button>
    </div>
  );
};
