namespace IssueTracker;

enum IssueState {
  Backlog: "Backlog",
  Todo: "Todo",
  InProgress: "InProgress",
  Done: "Done",
  Cancelled: "Cancelled",
}

model Issue {
  @minLength(1)
  @maxLength(50)
  id: string;

  @minLength(1)
  @maxLength(200)
  title: string;

  @maxLength(1000)
  description?: string;

  status: IssueState;

  priority: int32; // 0-4 priority levels

  @maxLength(50)
  assignee?: string; // User ID

  @minLength(1)
  @maxLength(50)
  projectId: string;

  createdAt: utcDateTime;
  updatedAt: utcDateTime;
}

model Project {
  @minLength(1)
  @maxLength(50)
  id: string;

  @minLength(1)
  @maxLength(100)
  name: string;

  @maxLength(500)
  description?: string;
}

