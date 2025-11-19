import type { QuickAction, QuickActionCategory } from "@/types";

// Storage keys
const STORAGE_KEYS = {
  FAVORITES: "aura_quick_actions_favorites",
  USAGE_COUNTS: "aura_quick_actions_usage",
} as const;

// Default quick action templates (8+ actions)
export const DEFAULT_QUICK_ACTIONS: QuickAction[] = [
  // Email actions
  {
    id: "email-1",
    title: "Summarize Emails",
    description: "Get a summary of unread emails from the last 24 hours",
    template: "Summarize all unread emails from the last 24 hours",
    icon: "Mail",
    category: "email",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "email-2",
    title: "Draft Response",
    description: "Draft a professional email response",
    template: "Draft a professional response to my most recent unread email",
    icon: "Mail",
    category: "email",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "email-3",
    title: "Find Important Emails",
    description: "Find emails marked as important or urgent",
    template: "Find all important or urgent emails from the last week",
    icon: "Mail",
    category: "email",
    isFavorite: false,
    usageCount: 0,
  },

  // Docs actions
  {
    id: "docs-1",
    title: "Create Meeting Notes",
    description: "Generate meeting notes document from calendar event",
    template: "Create a meeting notes document for my next calendar event",
    icon: "FileText",
    category: "docs",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "docs-2",
    title: "Create Report",
    description: "Generate a weekly report document",
    template: "Create a weekly report document summarizing my activities",
    icon: "FileText",
    category: "docs",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "docs-3",
    title: "Organize Files",
    description: "Organize recent Drive files into folders",
    template: "Organize my recent Drive files into appropriate folders by topic",
    icon: "FileText",
    category: "docs",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "docs-4",
    title: "Create Document from Email",
    description: "Convert email thread into a document",
    template: "Create a Google Doc from my latest email thread with action items",
    icon: "FileText",
    category: "docs",
    isFavorite: false,
    usageCount: 0,
  },

  // Calendar actions
  {
    id: "calendar-1",
    title: "Schedule Follow-up",
    description: "Schedule a follow-up meeting based on email thread",
    template: "Schedule a follow-up meeting based on my latest email thread",
    icon: "Calendar",
    category: "calendar",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "calendar-2",
    title: "Find Available Slots",
    description: "Find available meeting times this week",
    template: "Find all available {duration}-hour meeting slots in my calendar {timeframe}",
    icon: "Calendar",
    category: "calendar",
    isFavorite: false,
    usageCount: 0,
    parameters: [
      {
        name: "duration",
        label: "Meeting Duration (hours)",
        type: "number",
        placeholder: "1",
        required: true,
        defaultValue: "1",
      },
      {
        name: "timeframe",
        label: "Timeframe",
        type: "text",
        placeholder: "this week",
        required: true,
        defaultValue: "this week",
      },
    ],
  },
  {
    id: "calendar-3",
    title: "Summarize Today's Schedule",
    description: "Get a summary of today's meetings and events",
    template: "Summarize all my meetings and events scheduled for today",
    icon: "Calendar",
    category: "calendar",
    isFavorite: false,
    usageCount: 0,
  },

  // Analysis actions
  {
    id: "analysis-1",
    title: "Analyze Spreadsheet",
    description: "Generate insights from spreadsheet data",
    template: "Analyze the data in my latest spreadsheet and provide insights",
    icon: "BarChart3",
    category: "analysis",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "analysis-2",
    title: "Create Chart from Data",
    description: "Generate visualizations from spreadsheet data",
    template: "Create charts and visualizations from my latest spreadsheet data",
    icon: "BarChart3",
    category: "analysis",
    isFavorite: false,
    usageCount: 0,
  },
  {
    id: "analysis-3",
    title: "Email Analytics",
    description: "Analyze email patterns and statistics",
    template: "Analyze my email patterns from the last month and provide statistics",
    icon: "BarChart3",
    category: "analysis",
    isFavorite: false,
    usageCount: 0,
  },
];

// Storage utilities
export const QuickActionsStorage = {
  /**
   * Get favorite action IDs from localStorage
   */
  getFavorites(): string[] {
    if (typeof window === "undefined") return [];

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Error reading favorites from localStorage:", error);
      return [];
    }
  },

  /**
   * Save favorite action IDs to localStorage
   * Maximum 20 favorites per user
   */
  saveFavorites(favoriteIds: string[]): void {
    if (typeof window === "undefined") return;

    try {
      // Limit to 20 favorites
      const limited = favoriteIds.slice(0, 20);
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(limited));
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  },

  /**
   * Toggle favorite status for an action
   */
  toggleFavorite(actionId: string): string[] {
    const favorites = this.getFavorites();
    const index = favorites.indexOf(actionId);

    if (index > -1) {
      // Remove from favorites
      favorites.splice(index, 1);
    } else {
      // Add to favorites (check limit)
      if (favorites.length < 20) {
        favorites.push(actionId);
      } else {
        console.warn("Maximum of 20 favorites reached");
        return favorites;
      }
    }

    this.saveFavorites(favorites);
    return favorites;
  },

  /**
   * Get usage counts from localStorage
   */
  getUsageCounts(): Record<string, number> {
    if (typeof window === "undefined") return {};

    try {
      const stored = localStorage.getItem(STORAGE_KEYS.USAGE_COUNTS);
      return stored ? JSON.parse(stored) : {};
    } catch (error) {
      console.error("Error reading usage counts from localStorage:", error);
      return {};
    }
  },

  /**
   * Save usage counts to localStorage
   */
  saveUsageCounts(counts: Record<string, number>): void {
    if (typeof window === "undefined") return;

    try {
