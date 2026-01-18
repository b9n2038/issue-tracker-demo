import {StrictMode} from 'react';
import {Provider, useCreateStore} from 'tinybase/ui-react';
import {SortedTableInHtmlTable} from 'tinybase/ui-react-dom';
import {Inspector} from 'tinybase/ui-react-inspector';
import {createStore} from 'tinybase/with-schemas';
import {Buttons} from './Buttons';
import {IssueState} from './generated/IssueTracker';
import {IssueForm} from './IssueForm';

const IssueStates = Object.keys(IssueState);
export const App = () => {
  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data

    //OPP: tinybase jsonschema
    return createStore().setTablesSchema({
      project: {
        id: {type: 'string'},
        name: {type: 'string'},
        description: {type: 'string'},
      },
      issue: {
        id: {type: 'string'},
        title: {type: 'string'},
        // description: {type: 'string'},
        state: {type: 'string'},
        priority: {type: 'number'},
        // assignee: {type: 'string'},
        projectId: {type: 'string'},
        createdAt: {type: 'string'},
        // updatedAt: {type: 'string'},
      },
    });
  });

  store.setRow('project', '0', {
    title: 'issue-tracker',
    id: '0',
    description: 'Default issue-tracker',
  });

  store.setRow('project', '1', {
    title: 'linear-cline',
    id: '1',
    description: 'Linear clone project',
  });

  store.setRow('issue', '1', {
    title: 'some issue',
    id: '1',
    state: IssueState.Backlog,
    priority: 1,
    created: '2026-01-18',
    // description: 'more stuff'}
  });
  return (
    <StrictMode>
      <Provider store={store}>
        <header>
          <h1>
            <img src="/favicon.svg" />
            Issue Tracker
          </h1>
        </header>
        <Buttons />
        <div>
          <h2>Issue Table</h2>
          <SortedTableInHtmlTable
            tableId="issue"
            cellId="title"
            limit={5}
            sortOnClick={true}
            className="sortedTable"
            paginator={true}
          />
        </div>
        <div>
          <h2>New Issue</h2>
          <IssueForm isOpen={true} />
        </div>
        <div>
          <h2>Project Table</h2>
          <SortedTableInHtmlTable
            tableId="project"
            cellId="title"
            limit={5}
            sortOnClick={true}
            className="sortedTable"
            paginator={true}
          />
        </div>
        <Inspector />
      </Provider>
    </StrictMode>
  );
};
