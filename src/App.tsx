import {StrictMode, useState} from 'react';
import {Provider, useCreateStore} from 'tinybase/ui-react';
import {createStore} from 'tinybase/with-schemas';
import {Buttons} from './Buttons';
import {DataTable} from './components/DataTable';
import {AppSidebar, AppHeader, NewIssueModal, SearchModal} from './components/AppSidebar';
import {SidebarProvider, SidebarInset} from './components/ui/sidebar';
import {ThemeProvider} from './hooks/use-theme';
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

  const [activeView, setActiveView] = useState('issues');
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleModalOpen = (modal: string) => {
    if (modal === 'new-issue') {
      setShowNewIssue(true);
    } else if (modal === 'search') {
      setShowSearch(true);
    }
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'issues':
        return (
          <div className="space-y-8">
            <section className="flex justify-center">
              <Buttons />
            </section>

            <div className="grid gap-8 lg:grid-cols-2">
              <section className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Issues</h2>
                <div className="bg-card rounded-lg border p-6">
                  <DataTable
                    tableId="issue"
                    cellId="title"
                    defaultPageSize={5}
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
          </div>
        );
      case 'projects':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
            <div className="bg-card rounded-lg border p-6">
              <DataTable
                tableId="project"
                cellId="title"
                defaultPageSize={5}
              />
            </div>
          </section>
        );
      case 'views':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Issue Views</h2>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">View management will be implemented here.</p>
            </div>
          </section>
        );
      case 'archives':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Archived Issues</h2>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">Archived Done/Cancelled issues will be displayed here.</p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <StrictMode>
      <ThemeProvider defaultTheme="system" storageKey="issue-tracker-theme">
        <Provider store={store}>
          <SidebarProvider>
            <SidebarInset>
              <AppSidebar
                activeView={activeView}
                onViewChange={handleViewChange}
                onModalOpen={handleModalOpen}
              />
              <div className="flex flex-col flex-1">
                <AppHeader
                  activeView={activeView}
                  onSearchClick={() => setShowSearch(true)}
                />
                <main className="flex-1 space-y-4 p-8 pt-6">
                  {renderMainContent()}
                </main>
              </div>
            </SidebarInset>

            <NewIssueModal
              open={showNewIssue}
              onOpenChange={setShowNewIssue}
            />
            <SearchModal
              open={showSearch}
              onOpenChange={setShowSearch}
            />
          </SidebarProvider>
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
};
