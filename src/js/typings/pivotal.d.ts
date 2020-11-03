declare namespace Pivotal {
  enum memberType {
    'owner', 'member', 'viewer'
  }

  enum permissions {
    'none', 'project_creation', 'administration'
  }

  enum projectType {
    'demo', 'private', 'public', 'shared'
  }

  enum role {
    'owner', 'member', 'viewer', 'inactive'
  }

  enum status {
    'active', 'suspended', 'delinquent', 'deleted', 'limited'
  }

  enum storyStatus {
    'accepted', 'delivered', 'finished', 'started', 'rejected', 'planned', 'unstarted', 'unscheduled'
  }

  enum storyType {
    'feature', 'bug', 'chore', 'release'
  }

  enum weekday {
    'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'
  }

  type cycleTimeDetails = {
    total_cycle_time: number;
    started_time: number;
    started_count: number;
    finished_time: number;
    finished_count: number;
    delivered_time: number;
    delivered_count: number;
    rejected_time: number;
    rejected_count: number;
    story_id: number;
    kind: string;
  }

  type date = string;
  type datetime = number | string;
  type datetimeInterval = string;

  type storyTransition = {
    state: storyStatus;
    story_id: number;
    project_id: number;
    project_version: number;
    occurred_at: datetime;
    performed_by_id: number;
    kind: string;
  }

  type timezone = {
    kind: string;
    offset: string;
    olson_name: string;
  };

  export type Epic = {
    id: number;
    project_id: number;
    name: string;
    label_id: number;
    description: string;
    comment_ids: number[];
    pull_request_ids: number[];
    branch_ids: number[];
    follower_ids: number[];
    created_at: datetime;
    updated_at: datetime;
    after_id: number;
    before_id: number;
    past_done_story_estimates: number;
    past_done_stories_count: number;
    past_done_stories_no_point_count: number;
    url: string;
    completed_at: datetime;
    projected_completion: datetime;
    kind: string;
  }

  export type EpicSearchResult = {
    epics: Epic[];
    total_hits: number;
    total_hits_with_done: number;
    kind: string;
  }

  export type Person = {
    id: number;
    name: string;
    email: string;
    initials: string;
    username: string;
    kind: string;
  }

  export type Me = Person & {
    api_token: string;
    has_google_identity: boolean;
    accounts: AccountSummary[];
    projects: MembershipSummary[];
    receives_in_app_notifications: boolean;
    created_at: datetime;
    updated_at: datetime;
    time_zone: timezone;
  }

  export type Project = {
    id: number;
    name: string;
    status: string;
    version: number;
    iteration_length: number;
    week_start_day: weekday;
    ponumber_scale: string;
    ponumber_scale_is_custom: boolean;
    bugs_and_chores_are_estimatable: boolean;
    automatic_planning: boolean;
    enable_following: boolean;
    enable_tasks: boolean;
    start_date: date;
    time_zone: timezone;
    velocity_averaged_over: number;
    shown_iterations_start_time: datetime;
    start_time: datetime;
    number_of_done_iterations_to_show: number;
    has_google_domain: boolean;
    description: string;
    profile_content: string;
    enable_incoming_emails: boolean;
    initial_velocity: number;
    project_type: projectType;
    public: boolean;
    atom_enabled: boolean;
    current_iteration_number: number;
    current_standard_deviation: number;
    current_velocity: number;
    current_volatility: number;
    account_id: number;
    join_as: memberType;
    story_ids: number[];
    epic_ids: number[];
    membership_ids: number[];
    label_ids: number[];
    numberegration_ids: number[];
    review_type_ids: number[];
    story_template_ids: number[];
    iteration_override_numbers: number[];
    created_at: datetime;
    updated_at: datetime;
    scm_type_host_url_mapping: object;
    kind: string;
  }

  type AccountMembership = {
    id: number;
    person_id: number;
    account_id: number;
    created_at: datetime;
    updated_at: datetime;
    owner: boolean;
    admin: boolean;
    project_creator: boolean;
    kind: string;
  }

  type AccountSummary = {
    id: number;
    name: string;
    status: status;
    days_left: number;
    over_the_limit: boolean;
    owner_id: number;
    admin_ids: number[];
    permissions: permissions;
    number_of_projects: number;
    number_of_private_projects: number;
    project_limit: number;
    is_enterprise_guest: boolean;
    plan: string;
    kind: string;
  }

  type MembershipSummary = {
    id: number;
    project_id: number;
    project_name: string;
    project_color: string;
    favorite: boolean;
    role: role;
    last_viewed_at: datetime;
    kind: string;
  }

  type Release = {
    id: number;
    project_id: number;
    name: string[5000];
    description: string[20000];
    current_state: storyStatus;
    accepted_at: datetime;
    deadline: datetime;
    label_ids: number[];
    story_ids: number[];
    created_at: datetime;
    updated_at: datetime;
    url: string;
    projected_completion: datetime;
    projected_completion_interval: datetimeInterval;
    points_accepted: number;
    points_total: number;
    counts_accepted: number;
    counts_total: number;
    kind: string;
  }

  type Story = {
    id: number;
    project_id: number;
    name: string;
    description: string;
    story_type: storyType;
    current_state: storyStatus;
    estimate: number;
    accepted_at: datetime;
    deadline: datetime;
    projected_completion: datetime;
    points_accepted: number;
    points_total: number;
    counts_accepted: number;
    counts_total: number;
    requested_by_id: number;
    owned_by_id: number;
    owner_ids: number[];
    label_ids: number[];
    task_ids: number[];
    pull_request_ids: number[];
    cicd_event_ids: number[];
    branch_ids: number[];
    blocker_ids: number[];
    follower_ids: number[];
    comment_ids: number[];
    created_at: datetime;
    updated_at: datetime;
    before_id: number;
    after_id: number;
    integration_id: number;
    external_id: string[255];
    url: string;
    transitions: storyTransition[];
    blocked_story_ids: number[];
    review_ids: number[];
    cycle_time_details: cycleTimeDetails;
    kind: string;
  }

  export type StoriesSearchResult = {
    stories: Story[];
    total_hits: number;
    total_hits_with_done: number;
    total_points: number;
    total_points_completed: number;
    kind: string;
  }

  export type SearchResultContainer = {
    query: string;
    stories: StoriesSearchResult;
    epics: EpicSearchResult;
    kind: string;
  }
}
