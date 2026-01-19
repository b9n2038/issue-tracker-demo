namespace IssueTracker;

enum IssueState {
  Backlog: "Backlog",
  Todo: "Todo",
  InProgress: "InProgress",
  Done: "Done",
  Cancelled: "Cancelled",
}

model Issue {
  id: string;
  title: string;
  description?: string;
  status: IssueState;
  priority: int32; // 0-5 like Linear
  assignee?: string; // User ID
  projectId: string;
  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model Project {
  id: string;
  name: string;
  description?: string;
}

