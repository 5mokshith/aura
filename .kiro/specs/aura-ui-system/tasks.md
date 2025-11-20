# Implementation Plan

- [x] 1. Project foundation and configuration













  - [ ] 1.1 Initialize Next.js 15 with App Router and TypeScript in strict mode

    - Configure Next.js with App Router





    - Set up TypeScript with strict mode



    - _Requirements: 4.1, 4.2, 4.3, 15.2, 20.1, 20.2_
  
  - [ ] 1.2 Install and configure Tailwind CSS with custom glassmorphism utilities






    - Initialize Tailwind CSS





    - Create custom design tokens for glassmorphism
    - Set up color palette (neon cyan, purple, pink)
    - Configure backdrop blur and shadow utilities



    - _Requirements: 4.1, 4.5, 20.1, 20.2, 20.3, 20.4, 20.5_


  
  - [x] 1.3 Install required dependencies



    - Install googleapis, @google/generative-ai, @supabase/supabase-js
    - Install UI dependencies (framer-motion, lucide-react)
    - _Requirements: 4.1, 4.3, 15.2_







  


  - [x] 1.4 Set up environment variables and client initialization



    - Create .env.local template
    - Set up Supabase client and server configurations


    - Configure Google OAuth client
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

- [x] 2. Database schema and Supabase migrations









  - [x] 2.1 Create Supabase migration for user_tokens table






    - Define table schema with id, user_id, provider, access_token, refresh_token, expires_at, scopes columns
    - Add indexes on user_id and expires_at
    - Add timestamps
    - _Requirements: 6.4, 14.1, 14.2_
  
  - [x] 2.2 Create Supabase migration for execution_logs table with Realtime support



    - Define table schema with id, user_id, task_id, step_id, agent_type, message, log_level, metadata, created_at columns
    - Add indexes on task_id, user_id, and created_at
    - Enable Realtime for real-time log updates
    - _Requirements: 2.5, 9.2, 14.3, 17.1, 17.2, 17.3_
  
  - [x] 2.3 Create Supabase migration for task_history table


    - Define table schema with id, user_id, task_id, title, status, input_prompt, output_summary, outputs, google_services, duration_ms, created_at, completed_at columns
    - Add indexes on user_id, status, and created_at
    - _Requirements: 5.2, 5.3, 5.4, 5.5_
  

  - [x] 2.4 Create Supabase migration for documents_generated table





    - Define table schema with id, user_id, task_id, document_type, google_id, title, url, created_at columns
    - Add indexes on user_id and task_id
    - _Requirements: 5.3, 10.1, 10.2_

- [x] 3. Authentication and OAuth implementation




  - [x] 3.1 Create API route /api/auth/google/redirect



    - Implement OAuth2 client initialization
    - Generate authorization URL with all required scopes (Gmail, Drive, Docs, Sheets, Calendar)
    - _Requirements: 6.2, 6.3, 11.1_
  
  - [x] 3.2 Create API route /api/auth/google/callback



    - Handle OAuth callback with authorization code
    - Exchange code for access and refresh tokens
    - Store encrypted tokens in Supabase user_tokens table
    - Redirect to main chat interface
    - _Requirements: 6.4, 11.1, 14.1, 15.1, 15.2_
  
  - [x] 3.3 Create API route /api/auth/logout



    - Clear user session
    - Optionally revoke tokens
    - _Requirements: 11.1_
  
  - [x] 3.4 Implement token encryption and decryption utilities




    - Create AES-256-GCM encryption functions
    - Implement secure key management
    - _Requirements: 14.4, 15.1, 15.2_
  -

  - [x] 3.5 Implement automatic token refresh logic




    - Check token expiration before API calls
    - Refresh tokens when expired
    - Update stored tokens in database
    - _Requirements: 7.2, 14.5, 18.2_


- [x] 4. Google Workspace API integration routes











  - [x] 4.1 Create Gmail API routes



  - [x] 4.1 Create Gmail API routes




-

    - [x] 4.1.1 Implement /api/gmail/send route






      - Create MIME message with attachments support
      - Send email via Gmail API
      --_Requirements: 11.3_





   

    - [x] 4.1.2 Implement /api/gmail/search route




      - Search emails with query parameters
      - Return formatted mes
sage list
      - _Requirements: 11.3_
    


    - [x] 4.1.3 Implement /api/gmail/read route



      - Fetch full message content
      - Parse attachments

      - _Requirements: 11.3_




  
  - [x] 4.2 Create Google Drive API routes





    - [x] 4.2.1 Implement /api/drive/search route





      - Search files with query and filters
      - Return file metadata with thumbnails
      - _Requirements: 10.2, 10.3, 11.4_

    
-Downloadfi cont

    - [x] 4.2.2 Implement /api/drive/download route


      - Download file content
      - Handle different MIME types
    

  - _Requirements: 10.4, 11.4_
    
    - [x] 4.2.3 Implement /api/drive/upload route





      - Upload files to Drive
      - Support folder organization
      - _Requirements: 11.4_
  


  - [x] 4.3 Create Google Docs API routes





    - [x] 4.3.1 Implement /api/docs/create route




      - Create new document with title
      - Insert formatted content (headings, paragraphs)

      - Return document ID and URL
      - _Requirements: 11.5_
    
    - [x] 4.3.2 Implement /api/docs/update route




      - Batch update document content


      - Support append, replace, insert operations
      - _Requirements: 11.5_

    


    - [x] 4.3.3 Implement /api/docs/read route



      - Fetch document content
  
    - Convert to plain text
      - _Requirements: 11.5_
  
  - [x] 4.4 Create Google Sheets API routes







    - [x] 4.4.1 Implement /api/sheets/read route



      - Read spreadsheet data by range
      - Return 2D array of values
      - _Requirements: 12.1, 12.4_


    

    - [x] 4.4.2 Implement /api/she


ets/write route


      - Append rows to spreadsheet

      - Validate data format
      - _Requirements: 12.2, 12.4_
    

    - [x] 4.4.3 Implement /api/sheets/update route






      - Update existing cell values
      - Support batch updates
      - _Requirements: 12.3, 12.4_
  

  - [x] 4.5 Create Google Calendar API routes





    - [x] 4.5.1 Implement /api/calendar/create route



      - Create calendar events with attendees
      - Validate date formats and time zones
    
  - _Requirements: 13.1, 13.4_
    


    - [x] 4.5.2 Implement /api/calendar/list route



      - Fetch events within date range
      - Return formatted event list
    
 - _Requirements: 13.2_

    
    - [x] 4.5.3 Implement /api/calendar/delete route



      - Delete events by ID
      - Handle calendar conflicts
      - _Requirements: 13.3, 13.5_
-

- [x] 5. Agent system and orchestration







  - [x] 5.1 Create Planner Agent with Gemini integration


    - Implement task decomposition logic
    - Parse user prompts into executable steps
    - Identify required Google services
    - Generate structured task plans
    - _Requirements: 1.3, 2.1, 11.2_
  

  - [x] 5.2 Implement Worker Agents for each Google service


    - Create Gmail worker for email operations
    - Create Drive worker for file operations
    - Create Docs worker for document operations
    - Create Sheets worker for spreadsheet operations
    - Create Calendar worker for event operations
    - _Requirements: 2.4, 11.2_
  
  - [x] 5.3 Create Evaluator Agent for result validation




    - Validate task execution results
    - Identify failures and suggest retries
    - Generate result summaries
    - _Requirements: 11.2, 18.3_
  
  - [x] 5.4 Implement API route /api/agent/plan



    - Accept user prompt
    - Call Planner Agent
    - Generate task ID
    - Save task plan to database
    - Return task decomposition
    - _Requirements: 1.3, 2.1, 11.2_
  
  - [x] 5.5 Implement API route /api/agent/execute



    - Retrieve task plan from database
    - Execute steps sequentially
    - Log execution progress to Supabase
    - Handle errors and retries
    - Save task outputs
    - _Requirements: 2.2, 2.3, 2.4, 11.2, 18.3_
  
  - [x] 5.6 Implement API route /api/agent/evaluate



    - Validate execution results
    - Check for errors or incomplete tasks
    - Return validation report
    - _Requirements: 11.2_
  
  - [x] 5.7 Implement API route /api/agent/logs



    - Query execution_logs table by task ID
    - Filter by agent type and date range
    - Return formatted log entries
    - _Requirements: 9.2, 9.3, 9.4, 11.2_

- [x] 6. Supabase database API routes






  - [x] 6.1 Implement /api/db/save-token route


    - Encrypt tokens before storage
    - Upsert to user_tokens table
    - _Requirements: 14.1, 14.4_
  
  - [x] 6.2 Implement /api/db/get-tokens route


    - Retrieve tokens for user
    - Decrypt before returning
    - Check expiration
    - _Requirements: 14.2_
  
  - [x] 6.3 Implement /api/db/save-logs route


    - Insert execution logs
    - Support metadata JSON
    - Trigger Realtime updates
    - _Requirements: 14.3, 17.1_

- [-] 7. Chat interface components



  - [x] 7.1 Create ChatInterface component


    - Implement message list with auto-scroll
    - Handle user input submission
    - Display task decomposition in assistant messages
    - Show live execution feed
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5_
  
  - [x] 7.2 Create Message component


    - Render user messages (right-aligned)
    - Render assistant messages (left-aligned)
    - Display task decomposition cards
    - Show execution updates
    - _Requirements: 1.2, 1.3, 1.4_
  
  - [x] 7.3 Create FloatingInput component


    - Implement glassmorphism input bar
    - Position fixed at bottom
    - Handle text input and submission
    - Show loading state during execution
    - _Requirements: 1.1, 4.1, 4.4_
  
  - [x] 7.4 Create ExecutionFeed component


    - Display real-time execution updates
    - Show status indicators (pending, running, completed, failed)
    - Animate status changes
    - _Requirements: 1.4, 1.5, 2.5, 17.2_
  
  - [x] 7.5 Integrate Supabase Realtime for live updates


    - Subscribe to execution_logs table
    - Update UI on new log entries
    - Handle connection status
    - _Requirements: 17.1, 17.2, 17.3, 17.4, 17.5_

- [x] 8. Task visualization components




  - [x] 8.1 Create TaskVisualizer component


    - Implement right sidebar layout
    - Display active task information
    - Show subtask list with timeline
    - Make collapsible on mobile
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_
  
  - [x] 8.2 Create TaskCard component


    - Display task title and status
    - Show Google service icons
    - Display agent badges
    - Implement glassmorphism styling
    - _Requirements: 2.2, 2.3, 2.4, 4.2, 4.3_
  
  - [x] 8.3 Create StatusBadge component


    - Render status indicators (pending, running, completed, failed)
    - Apply appropriate colors and animations
    - Show progress for running tasks
    - _Requirements: 1.5, 2.5, 4.2_

- [x] 9. Quick actions and navigation



  - [x] 9.1 Create QuickActionsPanel component


    - Implement horizontal layout (desktop) / vertical drawer (mobile)
    - Display action buttons with icons
    - Handle action clicks
    - _Requirements: 3.1, 3.2, 3.4, 3.5_
  
  - [x] 9.2 Create QuickActionButton component


    - Implement glassmorphism button styling
    - Add neon glow hover effects
    - Trigger chat with pre-filled prompts
    - _Requirements: 3.2, 3.3, 3.4, 4.2, 4.3_

- [-] 10. Main chat page layout





  - [x] 10.1 Create home page (/) with chat interface

    - Integrate ChatInterface component
    - Add TaskVisualizer sidebar
    - Include QuickActionsPanel
    - Implement responsive layout
    -gemini like voice mode (live mode as gemini calls it)
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 16.1, 16.2_

- [x] 11. Task execution timeline page






  - [x] 11.1 Create timeline page (/timeline)


    - Display chronological task history
    - Show task cards with status
    - Include filter controls
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 5.5_
  
  - [x] 11.2 Create TimelineHeader component


    - Display page title
    - Include filter bar (date, status, service)
    - _Requirements: 5.5_
  
  - [x] 11.3 Create TaskCard component for timeline


    - Show task title and status
    - Display outputs with links
    - Show execution time
    - Add retry button for failed tasks
    - _Requirements: 5.2, 5.3, 5.4, 18.4_
  
  - [x] 11.4 Create FilterBar component


    - Implement date range picker
    - Add status filter dropdown
    - Add Google service filter
    - _Requirements: 5.5_
  
  - [x] 11.5 Implement data fetching from task_history table


    - Query Supabase with filters
    - Implement pagination
    - Cache results
    - _Requirements: 5.1, 5.2, 5.3, 5.4, 19.5_

- [x] 12. Google OAuth setup page


  - [x] 12.1 Create OAuth setup page (/auth/setup)


    - Display AURA logo
    - Show "Connect Google Workspace" heading
    - List requested permissions
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 12.2 Create ScopesList component


    - Display all OAuth scopes with descriptions
    - Show checkmarks for each permission
    - _Requirements: 6.3_
  
  - [x] 12.3 Create ConnectButton component


    - Implement glassmorphism button
    - Trigger OAuth redirect on click
    - Show loading state
    - _Requirements: 6.2, 6.4_
  
  - [x] 12.4 Implement OAuth flow integration


    - Call /api/auth/google/redirect
    - Handle callback redirect
    - Store tokens and redirect to chat
    - _Requirements: 6.2, 6.4, 6.5_

- [x] 13. User dashboard page




  - [x] 13.1 Create dashboard page (/dashboard)


    - Display connected apps status
    - Show token validity
    - Display recent activity
    - Show storage usage
    - _Requirements: 7.1, 7.2, 7.3, 7.4_
  
  - [x] 13.2 Create ConnectedApps component


    - Display Google service icons in grid
    - Show active status indicators
    - _Requirements: 7.1_
  
  - [x] 13.3 Create TokenStatus component


    - Display access token expiration
    - Show refresh token status
    - Add reconnect button
    - _Requirements: 7.2, 7.5_
  
  - [x] 13.4 Create RecentActivity component


    - Fetch last 10 tasks from task_history
    - Display task summaries with timestamps
    - _Requirements: 7.3_
  
  - [x] 13.5 Create StorageUsage component


    - Query Supabase for storage metrics
    - Display logs size and entry count
    - _Requirements: 7.4_

- [x] 14. Settings page




  - [x] 14.1 Create settings page (/settings)


    - Display profile information
    - Show API key management
    - Include preferences form
    - Add danger zone section
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5_
  
  - [x] 14.2 Create ProfileSection component


    - Display user email and account creation date
    - _Requirements: 8.1_
  
  - [x] 14.3 Create ApiKeyManager component


    - Display masked API key
    - Implement regenerate functionality
    - Show confirmation dialog
    - _Requirements: 8.2, 8.4_
  
  - [x] 14.4 Create PreferencesForm component


    - Add theme selector
    - Add notification toggle
    - _Requirements: 8.3_
  
  - [x] 14.5 Create DangerZone component


    - Add disconnect Google account button
    - Add delete logs button
    - Add delete account button
    - Implement confirmation dialogs for all actions
    - _Requirements: 8.3, 8.4, 8.5_

- [x] 15. Logs viewer page





  - [x] 15.1 Create logs page (/logs)


    - Display execution logs
    - Include filter controls
    - Add export functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 15.2 Create LogsHeader component


    - Display page title
    - Include filter inputs (task ID, date range, agent type)
    - Add export button
    - _Requirements: 9.4, 9.5_
  
  - [x] 15.3 Create LogViewer component


    - Display scrollable log entries
    - Implement syntax highlighting
    - Show timestamps and agent types
    - _Requirements: 9.2, 9.3_
  
  - [x] 15.4 Create LogEntry component


    - Format individual log lines
    - Color-code by log level
    - Display metadata
    - _Requirements: 9.2, 9.3_
  
  - [x] 15.5 Implement log fetching and filtering


    - Query execution_logs table
    - Apply filters
    - Implement pagination
    - Add JSON export functionality
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
-

- [x] 16. Files browser page




  - [x] 16.1 Create files page (/files)


    - Display Google Drive files
    - Include search and filters
    - Implement grid layout
    - _Requirements: 10.1, 10.2, 10.3, 10.4, 10.5_
  
  - [x] 16.2 Create FilesHeader component


    - Add search bar
    - Include file type filters
    - _Requirements: 10.3_
  
  - [x] 16.3 Create FileGrid component


    - Display files in responsive grid
    - Implement infinite scroll
    - _Requirements: 10.1, 10.5_
  
  - [x] 16.4 Create FileCard component


    - Show file thumbnail
    - Display file name and metadata
    - Add action menu (summarize, share, download)
    - _Requirements: 10.2, 10.4_
  
  - [x] 16.5 Integrate with /api/drive/search


    - Fetch files with search query
    - Apply filters
    - Cache results
    - _Requirements: 10.2, 10.3, 19.5_

- [x] 17. Error handling and user feedback





  - [x] 17.1 Create error handling utilities


    - Implement AuraError class
    - Create error categorization logic
    - Map error codes to user messages
    - _Requirements: 18.1, 18.5_
  
  - [x] 17.2 Implement API error responses


    - Create standardized error response format
    - Log errors to Supabase
    - Return user-friendly messages
    - _Requirements: 18.1, 18.5_
  
  - [x] 17.3 Create error display components


    - Implement toast notifications
    - Create error modal for critical errors
    - Add inline error messages
    - _Requirements: 18.1, 18.2, 18.3_
  
  - [x] 17.4 Implement retry mechanisms


    - Add retry buttons for failed tasks
    - Implement automatic retry with exponential backoff
    - _Requirements: 18.3, 18.4_
  
  - [x] 17.5 Handle OAuth token expiration


    - Detect expired tokens
    - Show reconnect prompt
    - Redirect to OAuth setup
    - _Requirements: 18.2_
-

- [x] 18. Performance optimizations



  - [x] 18.1 Implement code splitting and lazy loading


    - Configure route-based code splitting
    - Lazy load heavy components
    - _Requirements: 19.2_
  
  - [x] 18.2 Optimize images and assets


    - Use Next.js Image component
    - Compress images
    - _Requirements: 19.2_
  
  - [x] 18.3 Implement API response caching


    - Cache Google API responses for 5 minutes
    - Use React Query or SWR for client-side caching
    - _Requirements: 19.5_
  
  - [x] 18.4 Add optimistic UI updates


    - Update chat interface before server confirmation
    - Rollback on errors
    - _Requirements: 19.4_
  
  - [x] 18.5 Implement debounced search


    - Add 300ms debounce to search inputs
    - Cancel pending requests
    - _Requirements: 19.7_

- [x] 19. Responsive design and accessibility




  - [x] 19.1 Implement responsive layouts


    - Create mobile-first designs
    - Add breakpoints for tablet and desktop
    - Test on multiple screen sizes
    - _Requirements: 16.1, 16.2_
  
  - [x] 19.2 Ensure touch-friendly interactions


    - Use minimum 44x44px tap targets
    - Add touch gestures for mobile
    - _Requirements: 16.3_
  
  - [x] 19.3 Implement keyboard navigation


    - Add keyboard shortcuts
    - Ensure all interactive elements are keyboard accessible
    - _Requirements: 16.4_
  


  - [x] 19.4 Meet WCAG 2.1 Level AA standards





    - Check color contrast ratios
    - Add ARIA labels
    - Test with screen readers
    - _Requirements: 16.5_

- [x] 20. Glassmorphism design system



  - [x] 20.1 Create Tailwind configuration with custom tokens


    - Define glass color palette
    - Add backdrop blur utilities
    - Configure shadow utilities
    - Add neon glow effects
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 20.1, 20.2, 20.3, 20.4, 20.5_
  
  - [x] 20.2 Create glassmorphism CSS utilities


    - Implement .glass-panel classes
    - Create .glass-button variants
    - Add message bubble styles
    - Create task card styles
    - Add status indicator styles
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5_
  
  - [x] 20.3 Implement animation utilities

    - Create fade-in animation
    - Add slide-up animation
    - Implement glow-pulse animation
    - _Requirements: 4.5_
  
  - [x] 20.4 Create reusable UI components


    - Implement Button component with glassmorphism
    - Create Input component with glass styling
    - Add Modal component
    - _Requirements: 4.1, 4.2, 4.3, 4.4_
-

- [x] 21. Security implementation




  - [x] 21.1 Implement environment variable management


    - Create .env.local template
    - Document all required variables
    - Validate environment on startup
    - _Requirements: 15.1, 15.2_
  
  - [x] 21.2 Implement rate limiting middleware


    - Add rate limiting to all API routes
    - Configure limits per endpoint
    - Return 429 status for exceeded limits
    - _Requirements: 15.5_
  

  - [x] 21.3 Implement CSRF protection

    - Use Next.js built-in CSRF protection
    - Add state parameter to OAuth flow
    - _Requirements: 15.4_
  
  - [x] 21.4 Implement input validation


    - Validate all API request bodies
    - Sanitize user inputs
    - Prevent XSS attacks
    - _Requirements: 15.3_

- [ ]* 22. Integration and end-to-end testing
  - [ ]* 22.1 Write integration tests for OAuth flow
    - Test redirect to Google
    - Test callback handling
    - Test token storage
    - _Requirements: 6.2, 6.4_
  
  - [ ]* 22.2 Write integration tests for agent system
    - Test task planning
    - Test task execution
    - Test error handling
    - _Requirements: 11.2_
  
  - [ ]* 22.3 Write E2E tests for critical user flows
    - Test new user onboarding
    - Test task execution flow
    - Test token expiration handling
    - _Requirements: 1.1, 2.1, 6.2, 18.2_

- [ ]* 23. Documentation and deployment preparation
  - [ ]* 23.1 Create API documentation
    - Document all API routes
    - Include request/response examples
    - Add error code reference
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5, 12.1, 12.2, 12.3, 13.1, 13.2, 13.3, 14.1, 14.2, 14.3_
  
  - [ ]* 23.2 Create deployment guide
    - Document environment setup
    - List deployment steps
    - Include troubleshooting tips
    - _Requirements: 15.1, 15.2_
  
  - [ ]* 23.3 Create user guide
    - Document key features
    - Include screenshots
    - Add FAQ section
    - _Requirements: 1.1, 2.1, 3.1, 5.1, 6.1, 7.1, 8.1, 9.1, 10.1_
