# Implementation Plan

- [x] 1. Set up Next.js project structure and core configuration
  - Initialize Next.js 15 project with App Router and TypeScript
  - Configure Tailwind CSS with custom theme colors and spacing
  - Install and configure shadcn/ui component library
  - Set up ESLint and Prettier for code quality
  - Create base folder structure (app, components, lib, types)
  - Configure environment variables for API endpoints
  - _Requirements: 1.1, 8.1, 9.5_

- [x] 2. Implement authentication context and OAuth flow
  - Create AuthContext with React Context API for session management
  - Implement useAuth hook for accessing authentication state
  - Build login page with "Connect Google Account" button
  - Create OAuth callback route handler for token exchange
  - Implement auth status API route to check connection state
  - Add token refresh logic for expired sessions
  - _Requirements: 6.1, 6.2, 6.5_

- [x] 3. Build core layout components
- [x] 3.1 Create top navigation bar component
  - Implement TopNavigation component with logo and navigation links
  - Add OAuth connection status indicator
  - Include user profile dropdown menu
  - Add responsive hamburger menu for mobile
  - _Requirements: 6.1, 7.2_

- [x] 3.2 Implement dashboard layout with sidebar
  - Create dashboard layout wrapper component
  - Build QuickActionsSidebar component structure
  - Implement responsive behavior (collapsible on mobile)
  - Add mobile bottom navigation alternative
  - _Requirements: 4.1, 7.2_

- [x] 4. Develop command input interface
- [x] 4.1 Create CommandInput component with validation
  - Build auto-resizing textarea (3-10 lines)
  - Implement character counter display
  - Add input validation (minimum 10 characters)
  - Create submit button with loading state
  - _Requirements: 1.1, 1.2, 1.4_

- [x] 4.2 Implement prompt templates functionality
  - Create PromptTemplates dropdown component
  - Define at least 5 default prompt templates
  - Implement template selection to populate input
  - Add template categories (email, docs, calendar, analysis)
  - _Requirements: 1.3_

- [x] 4.3 Add keyboard shortcuts to command input
  - Implement Ctrl+Enter (Cmd+Enter) to submit command
  - Add Ctrl+K (Cmd+K) to focus input from anywhere
  - Create keyboard shortcut help modal
  - _Requirements: 1.5, 9.3_

- [x] 5. Build workflow execution context and state management
  - Create WorkflowContext with React Context API
  - Define WorkflowState interface and types
  - Implement useWorkflow hook for state access
  - Add workflow execution API route handler
  - Create SSE stream endpoint for real-time updates
  - Implement SSE client connection with auto-reconnect
  - _Requirements: 2.1, 2.2, 8.2_

- [x] 6. Implement execution tracker component
- [x] 6.1 Create ExecutionTracker with progress display
  - Build ExecutionTracker component structure
  - Implement progress bar showing current/total steps
  - Add step list with status indicators
  - Create AgentIndicator component with icons
  - Display estimated time remaining
  - _Requirements: 2.1, 2.3_

- [x] 6.2 Add real-time SSE updates to tracker
  - Connect ExecutionTracker to SSE stream
  - Update step status on SSE events
  - Handle step_start, step_complete, step_error events
  - Ensure updates occur within 500ms of state change
  - _Requirements: 2.2_

- [x] 6.3 Implement expandable step details
  - Create StepProgress component for individual steps
  - Add expand/collapse functionality for step details
  - Display step inputs and outputs when expanded
  - Show error messages with retry option for failed steps
  - _Requirements: 2.4, 2.5_

- [x] 6.4 Add workflow cancellation functionality
  - Create CancelButton component in ExecutionTracker
  - Implement cancel API route handler
  - Send cancellation request within 200ms of click
  - Update UI to cancelled state within 1 second
  - Display which steps completed vs cancelled
  - _Requirements: 10.1, 10.2, 10.3, 10.5_

- [x] 7. Build results display components
- [x] 7.1 Create ResultsPanel component
  - Build ResultsPanel component structure
  - Implement result card grid layout
  - Display results within 1 second of completion
  - Add empty state for no results
  - _Requirements: 3.1_

- [x] 7.2 Implement ResultCard with type-specific rendering
  - Create ResultCard component with type detection
  - Add icons for different result types (doc, email, sheet, etc.)
  - Implement preview display for documents (first 500 chars)
  - Create ActionButtons component for each result
  - _Requirements: 3.2, 3.3_

- [x] 7.3 Add action buttons and external links
  - Implement "Open in Drive" button for documents
  - Add "View Email" button for email results
  - Create "Download" button for file results
  - Ensure links open in new browser tab
  - Add copy-to-clipboard functionality
  - _Requirements: 3.2, 3.5_

- [x] 7.4 Implement feedback widget
  - Create FeedbackWidget component with thumbs up/down
  - Add feedback submission API route
  - Store feedback in workflow results
  - Display feedback confirmation toast
  - _Requirements: 3.4_

- [x] 8. Develop quick actions sidebar
- [x] 8.1 Create QuickAction data structure and storage
  - Define QuickAction interface and types
  - Create default set of 8+ quick action templates
  - Implement favorites storage (localStorage or API)
  - Track usage count for recent actions
  - _Requirements: 4.1, 4.3_

- [x] 8.2 Build QuickActionsSidebar component
  - Create sidebar component with action list
  - Implement category sections (email, docs, calendar, etc.)
  - Add favorites section at top
  - Display 5 most recent actions
  - _Requirements: 4.1, 4.4_

- [x] 8.3 Implement quick action selection and execution
  - Handle quick action click to populate CommandInput
  - Add parameter prompt modal for actions requiring inputs
  - Implement favorite toggle functionality
  - Add search/filter for quick actions
  - _Requirements: 4.2, 4.5_

- [x] 9. Build history and task tracking features
- [x] 9.1 Create history context and data fetching
  - Create HistoryContext with React Context API
  - Implement history API route to fetch past workflows
  - Define TaskHistoryEntry interface
  - Add pagination support for history list
  - _Requirements: 5.1_

- [x] 9.2 Implement HistoryList component
  - Create history page with HistoryList component
  - Build HistoryItem component for each entry
  - Display timestamp, command, status, and duration
  - Implement infinite scroll pagination
  - _Requirements: 5.1, 5.2_

- [x] 9.3 Add history filtering and search
  - Create HistoryFilters component
  - Implement date range filter
  - Add status filter (success/failure/cancelled)
  - Create agent type filter
  - Add search by command text
  - _Requirements: 5.3_

- [x] 9.4 Build task detail modal
  - Create TaskDetailModal component
  - Display complete workflow execution details
  - Show all steps with inputs/outputs
  - Add "Re-run" button to execute same command
  - Preserve partial results for cancelled workflows
  - _Requirements: 5.4, 5.5, 10.4_

- [x] 10. Implement settings and OAuth management
- [x] 10.1 Create settings page structure
  - Build settings page layout
  - Create tabbed interface for different settings sections
  - Add OAuth management section
  - _Requirements: 6.3_

- [x] 10.2 Build OAuthStatus component
  - Create OAuthStatus component showing connection state
  - Display user email when connected
  - Show token expiration time
  - Add visual indicator (green/red badge)
  - _Requirements: 6.1_

- [x] 10.3 Implement scopes list and management
  - Create ScopesList component
  - Display all requested OAuth scopes with descriptions
  - Show which scopes are currently granted
  - Add informational tooltips for each scope
  - _Requirements: 6.3_

- [x] 10.4 Add disconnect functionality
  - Create DisconnectButton component
  - Implement disconnect API route to revoke tokens
  - Add confirmation modal before disconnect
  - Clear local auth state on disconnect
  - _Requirements: 6.4_

- [x] 11. Implement responsive design and mobile optimizations
- [x] 11.1 Add responsive breakpoints and layouts
  - Configure Tailwind breakpoints (sm, md, lg, xl)
  - Implement single-column layout for mobile (< 768px)
  - Test rendering on viewport widths 320px to 2560px
  - Ensure all components adapt to screen size
  - _Requirements: 7.1, 7.2_

- [x] 11.2 Create mobile bottom sheet for execution tracker
  - Build MobileBottomSheet component
  - Implement expand/collapse functionality
  - Add swipe gestures for sheet control
  - Show ExecutionTracker in bottom sheet on mobile
  - _Requirements: 7.4_

- [x] 11.3 Implement touch gestures and mobile interactions
  - Add swipe-to-navigate for history entries
  - Ensure minimum 44x44px touch targets
  - Implement pull-to-refresh on history page
  - Add haptic feedback for key actions (if supported)
  - _Requirements: 7.3_

- [x] 11.4 Optimize mobile performance
  - Implement lazy loading for below-fold content
  - Add reduced motion support for animations
  - Optimize images for mobile viewport sizes
  - Test font readability at 12px to 20px sizes
  - _Requirements: 7.5_

- [x] 12. Add accessibility features
- [x] 12.1 Implement keyboard navigation
  - Ensure all interactive elements are keyboard accessible
  - Set proper tab order following visual flow
  - Add skip links for main content
  - Implement Escape key to close modals
  - Test complete keyboard navigation flow
  - _Requirements: 9.1, 9.4_

- [x] 12.2 Add ARIA labels and semantic HTML
  - Add ARIA labels to all interactive components
  - Use semantic HTML elements (nav, main, aside, etc.)
  - Implement ARIA live regions for dynamic updates
  - Add alt text for all images and icons
  - Create descriptive link text
  - _Requirements: 9.2_

- [x] 12.3 Ensure color contrast and visual accessibility
  - Verify 4.5:1 contrast ratio for all text
  - Ensure 3:1 contrast for UI components
  - Avoid color-only information conveyance
  - Test with browser zoom up to 200%
  - Add focus indicators for all focusable elements
  - _Requirements: 9.5_

- [x] 13. Implement error handling and loading states
- [x] 13.1 Create global error boundary
  - Build ErrorBoundary component
  - Display user-friendly error messages
  - Add "Retry" and "Report" buttons
  - Log errors to console for debugging
  - _Requirements: 8.4_

- [x] 13.2 Add toast notification system
  - Create Toast component with variants (success, error, warning, info)
  - Implement toast context and useToast hook
  - Configure auto-dismiss timers (3s success, 5s warning, manual error)
  - Position toasts appropriately (top-right or bottom for mobile)
  - _Requirements: 8.3, 8.4_

- [x] 13.3 Implement loading states for async operations
  - Add LoadingSpinner component
  - Show loading indicators for operations > 300ms
  - Implement skeleton screens for data fetching
  - Add loading states to all buttons during actions
  - _Requirements: 8.5_

- [x] 13.4 Create state-specific UI feedback
  - Implement idle state with prominent command input
  - Create executing state with disabled input and cancel button
  - Build success state with green checkmark (2s display)
  - Design error state with clear message and actions
  - _Requirements: 8.1, 8.2, 8.3, 8.4_

- [x] 14. Add API routes and backend integration
- [x] 14.1 Create workflow execution API routes
  - Implement POST /api/workflow/execute route
  - Create GET /api/workflow/stream SSE endpoint
  - Add POST /api/workflow/cancel route
  - Implement error handling and validation
  - _Requirements: 2.1, 2.2, 10.2_

- [x] 14.2 Build history API routes
  - Create GET /api/history route with pagination
  - Add filtering and search query parameters
  - Implement GET /api/history/[id] for detail view
  - Add POST /api/history/rerun route
  - _Requirements: 5.1, 5.3, 5.5_

- [x] 14.3 Implement authentication API routes
  - Create GET /api/auth/status route
  - Build POST /api/auth/disconnect route
  - Add token refresh endpoint
  - Implement OAuth callback handler
  - _Requirements: 6.1, 6.4, 6.5_

- [x] 14.4 Add quick actions and feedback API routes
  - Create GET /api/quick-actions route
  - Implement POST /api/quick-actions/favorite route
  - Add POST /api/feedback route for result ratings
  - _Requirements: 4.3, 3.4_

- [x] 15. Implement caching and performance optimizations
  - Configure SWR for API response caching
  - Implement route-based code splitting
  - Add dynamic imports for heavy components (modals)
  - Optimize bundle size with tree-shaking
  - Configure Next.js Image component for all images
  - Add service worker for offline support (PWA)
  - _Requirements: 8.5_

- [ ]\* 16. Testing and quality assurance
- [ ]\* 16.1 Write unit tests for components
  - Test CommandInput validation and submission
  - Test ExecutionTracker state updates
  - Test ResultsPanel rendering and interactions
  - Test QuickActionsSidebar selection logic
  - Test HistoryList filtering and search
  - Achieve 80% component test coverage
  - _Requirements: All_

- [ ]\* 16.2 Create integration tests
  - Test complete workflow execution flow
  - Test OAuth connection and disconnection flow
  - Test history filtering and detail view
  - Test quick action execution
  - Test mobile responsive behavior
  - _Requirements: All_

- [ ]\* 16.3 Perform accessibility testing
  - Run axe-core accessibility audit
  - Test keyboard navigation completeness
  - Verify screen reader compatibility
  - Check color contrast with WAVE tool
  - Validate WCAG 2.1 Level AA compliance
  - _Requirements: 9.1, 9.2, 9.5_

- [ ]\* 16.4 Conduct performance testing
  - Measure Core Web Vitals (FCP, LCP, TTI, CLS)
  - Run Lighthouse audit (target 90+ score)
  - Test on low-end mobile devices
  - Verify SSE update latency < 500ms
  - Optimize based on performance metrics
  - _Requirements: 2.2, 8.5_

