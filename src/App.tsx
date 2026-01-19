import {StrictMode} from 'react';
import {Provider, useCreateStore} from 'tinybase/ui-react';
import {SortedTableInHtmlTable} from 'tinybase/ui-react-dom';
import {createStore} from 'tinybase/with-schemas';
import {Buttons} from './Buttons';
import {IssueState} from './generated/IssueTracker';
import {IssueForm} from './IssueForm';
export const App = () => {
  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data

    //OPP: tinybase jsonschema
    return createStore().setTablesSchema({
      project: {
        id: {type: 'string', default: ''},
        name: {type: 'string', default: ''},
        description: {type: 'string', default: ''},
      },
      issue: {
        id: {type: 'string', default: ''},
        title: {type: 'string', default: ''},
        // description: {type: 'string', default: ''},
        status: {type: 'string', default: 'Backlog'},
        priority: {type: 'number', default: 0},
        // assignee: {type: 'string', default: ''},
        projectId: {type: 'string', default: ''},
        createdAt: {type: 'string', default: ''},
        // updatedAt: {type: 'string', default: ''},
      },
    }) as any;
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
    status: IssueState.Backlog,
    priority: 1,
    created: '2026-01-18',
    // description: 'more stuff'}
  });
  return (
    <StrictMode>
      <Provider store={store}>
        <div className="min-h-screen bg-background">
          <header className="border-b bg-card">
            <div className="container mx-auto px-4 py-6">
              <h1 className="text-3xl font-bold text-foreground">Issue Tracker</h1>
            </div>
          </header>

          <main className="container mx-auto px-4 py-8 space-y-8">
            <section className="flex justify-center">
              <Buttons />
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Issues</h2>
                <div className="bg-card rounded-lg border p-6">
                  <SortedTableInHtmlTable
                    tableId="issue"
                    cellId="title"
                    limit={5}
                    sortOnClick={true}
                    className="w-full"
                    paginator={true}
                  />
                </div>
              </section>

              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Create New Issue</h2>
                <div className="bg-card rounded-lg border p-6">
                  <IssueForm />
                </div>
              </section>
            </div>

            <section className="space-y-4">
              <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
              <div className="bg-card rounded-lg border p-6">
                <SortedTableInHtmlTable
                  tableId="project"
                  cellId="title"
                  limit={5}
                  sortOnClick={true}
                  className="w-full"
                  paginator={true}
                />
              </div>
            </section>
          </main>
        </div>
      </Provider>
    </StrictMode>
  );
};
