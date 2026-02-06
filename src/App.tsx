 import {StrictMode, useMemo, useState} from 'react';
 import {Provider, useCreateStore, useTable} from 'tinybase/ui-react';
import {createIndexes, createStore} from 'tinybase/with-schemas';
import {
  AppHeader,
  AppSidebar,
  NewIssueModal,
  SearchModal,
} from './components/AppSidebar';
import {DataTable} from './components/DataTable';
import {SidebarInset, SidebarProvider} from './components/ui/sidebar';
import {IssueState} from './generated/IssueTracker';
import {ThemeProvider} from './hooks/use-theme';

// Generate random issues for demo purposes
const generateRandomIssues = (store: any) => {
  const statuses = [
    IssueState.Backlog,
    IssueState.Todo,
    IssueState.InProgress,
    IssueState.Done,
    IssueState.Cancelled,
  ];
  const priorities = [0, 1, 2, 3, 4]; // 0-4
  const titles = [
    'Implement user authentication',
    'Fix responsive design on mobile',
    'Add dark mode support',
    'Optimize database queries',
    'Create API documentation',
    'Setup CI/CD pipeline',
    'Implement search functionality',
    'Add unit tests',
    'Refactor legacy code',
    'Improve error handling',
    'Add data validation',
    'Create user dashboard',
    'Implement notification system',
    'Add file upload feature',
    'Create admin panel',
    'Optimize bundle size',
    'Add accessibility features',
    'Implement caching',
    'Create data export functionality',
    'Add real-time updates',
    'Implement pagination',
    'Add drag and drop support',
    'Create user onboarding',
    'Implement multi-language support',
    'Add keyboard shortcuts',
    'Create custom themes',
  ];

  for (let i = 0; i < 25; i++) {
    const randomTitle = titles[Math.floor(Math.random() * titles.length)];
    const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
    const randomPriority =
      priorities[Math.floor(Math.random() * priorities.length)];

    store.setRow('issue', `issue-${i + 1}`, {
      title: `${randomTitle} ${i + 1}`,
      status: randomStatus,
      priority: randomPriority,
      projectId: '0', // Default to first project
      createdAt: new Date(
        Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
      ).toISOString(), // Random date within last 30 days
    });
  }
};

const MainContent = ({onModalOpen, searchCriteria}: {onModalOpen: (modal: string) => void; searchCriteria: {title: string; status?: string; priority?: number}}) => {
  const [activeView] = useState('issues');

  // Get all issues
  const issues = useTable('issue');

  // Filter issues based on search criteria
  const filteredIssues = useMemo(() => {
    let filtered = Object.keys(issues);
    if (searchCriteria.title) {
      filtered = filtered.filter(id =>
        String(issues[id]?.title || '').toLowerCase().includes(searchCriteria.title.toLowerCase())
      );
    }
    if (searchCriteria.status) {
      filtered = filtered.filter(id => issues[id]?.status === searchCriteria.status);
    }
    if (searchCriteria.priority !== undefined) {
      filtered = filtered.filter(id => issues[id]?.priority === searchCriteria.priority);
    }
    return filtered;
  }, [issues, searchCriteria]);

  const handleModalOpen = (modal: string) => {
    onModalOpen(modal);
  };

  const renderMainContent = () => {
    switch (activeView) {
      case 'issues':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Issues</h2>
            <div className="bg-card rounded-lg border p-6">
               <DataTable
                 tableId="issue"
                 cellId="title"
                 defaultPageSize={5}
                 {...(filteredIssues.length > 0
                   ? {filteredRowIds: filteredIssues}
                   : {})}
               />
            </div>
          </section>
        );
      case 'projects':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">Projects</h2>
            <div className="bg-card rounded-lg border p-6">
              <DataTable tableId="project" cellId="title" defaultPageSize={5} />
            </div>
          </section>
        );
      case 'views':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Issue Views
            </h2>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">
                View management will be implemented here.
              </p>
            </div>
          </section>
        );
      case 'archives':
        return (
          <section className="space-y-4">
            <h2 className="text-2xl font-semibold text-foreground">
              Archived Issues
            </h2>
            <div className="bg-card rounded-lg border p-6">
              <p className="text-muted-foreground">
                Archived Done/Cancelled issues will be displayed here.
              </p>
            </div>
          </section>
        );
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col h-full">
      <AppHeader
        activeView={activeView}
        onSearchClick={() => handleModalOpen('search')}
      />
      <main className="flex-1 overflow-auto p-8 pt-14">
        {renderMainContent()}
      </main>
    </div>
  );
};

export const App = () => {
  const store = useCreateStore(() => {
    // Create the TinyBase Store and initialize the Store's data

    //OPP: tinybase jsonschema
    const store = createStore().setTablesSchema({
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

    const indexes = createIndexes(store);
    indexes.setIndexDefinition(
      'byStatus', // indexId
      'issue', //      tableId to index
      'status', //    cellId to index on
    );
    indexes.setIndexDefinition(
      'byPriority', // indexId
      'issue', //      tableId to index
      'priority', //    cellId to index on
    );
    indexes.setIndexDefinition(
      'byTitle', // indexId
      'issue', //      tableId to index
      'title', //    cellId to index on
    );

    // Generate random issues
    generateRandomIssues(store);

    return store;
  });

  // State for search criteria
  const [searchCriteria, setSearchCriteria] = useState<{
    title: string;
    status?: string;
    priority?: number;
  }>({
    title: '',
    status: undefined,
    priority: undefined,
  });

  store.setRow('project', '0', {
    id: '0',
    name: 'Issue Tracker',
    description: 'Default project for issue tracking',
  });

  store.setRow('project', '1', {
    id: '1',
    name: 'Linear Clone',
    description: 'Clone of Linear issue tracking',
  });

  const [activeView, setActiveView] = useState('issues');
  const [showNewIssue, setShowNewIssue] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  const handleViewChange = (view: string) => {
    setActiveView(view);
  };

  const handleSearch = (criteria: {
    title?: string;
    status?: string;
    priority?: number;
  }) => {
    console.log('search with', criteria);
    setSearchCriteria({
      title: criteria.title || '',
      status: criteria.status,
      priority: criteria.priority,
    });
  };

  const handleModalOpen = (modal: string) => {
    if (modal === 'new-issue') {
      setShowNewIssue(true);
    } else if (modal === 'search') {
      setShowSearch(true);
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
                collapsible="icon"
              />
               <MainContent onModalOpen={handleModalOpen} searchCriteria={searchCriteria} />
            </SidebarInset>

            <NewIssueModal open={showNewIssue} onOpenChange={setShowNewIssue} />
            <SearchModal
              open={showSearch}
              onOpenChange={setShowSearch}
              onSearch={handleSearch}
            />
          </SidebarProvider>
        </Provider>
      </ThemeProvider>
    </StrictMode>
  );
};
