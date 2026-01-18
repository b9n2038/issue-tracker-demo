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

  //show newIssueFrom
  const handleAddProject = useAddRowCallback('project', (_, store) => ({
    title: ['kr-tracker', 'garden'][getRandom(2)],
  }));

  return (
    <div id="buttons">
      <button onClick={handleAddProject}>Add a project</button>
      <button onClick={handleAddIssue}>Add a issue</button>
    </div>
  );
};
