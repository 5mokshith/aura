/**
 * Debounced Search Input Component
 * 
 * Search input with built-in debouncing and loading states
 * Requirements: 19.7
 */

import { Search, X, Loader2 } from 'lucide-react';
import { useDebouncedInput } from '@/app/hooks/useDebounce';
import { useEffect } from 'react';

interface DebouncedSearchInputProps {
  placeholder?: string;
  onSearch: (query: string) => void;
  delay?: number;
  className?: string;
  isLoading?: boolean;
  showClearButton?: boolean;
  autoFocus?: boolean;
}

/**
 * Debounced Search Input
 * Automatically debounces search queries to reduce API calls
 */
export function DebouncedSearchInput({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  className = '',
  isLoading = false,
  showClearButton = true,
  autoFocus = false,
}: DebouncedSearchInputProps) {
  const { value, debouncedValue, setValue, reset, isDebouncing } =
    useDebouncedInput('', delay);

  // Call onSearch when debounced value changes
  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const handleClear = () => {
    reset();
    onSearch('');
  };

  return (
    <div className={`relative ${className}`}>
      {/* Search Icon */}
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-white/40">
        <Search className="w-5 h-5" />
      </div>

      {/* Input Field */}
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`
          glass-input w-full pl-12 pr-12 py-3 rounded-xl
          text-white placeholder-white/40
          focus:outline-none focus:ring-2 focus:ring-neon-cyan/50
          transition-all duration-300
        `}
      />

      {/* Loading/Clear Button */}
      <div className="absolute right-4 top-1/2 -translate-y-1/2">
        {isLoading || isDebouncing ? (
          <Loader2 className="w-5 h-5 text-neon-cyan animate-spin" />
        ) : value && showClearButton ? (
          <button
            onClick={handleClear}
            className="text-white/40 hover:text-white transition-colors"
            aria-label="Clear search"
          >
            <X className="w-5 h-5" />
          </button>
        ) : null}
      </div>

      {/* Debouncing Indicator */}
      {isDebouncing && (
        <div className="absolute -bottom-6 left-0 text-xs text-white/40">
          Searching...
        </div>
      )}
    </div>
  );
}

/**
 * Compact Debounced Search Input
 * Smaller version for use in headers and toolbars
 */
export function CompactDebouncedSearchInput({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  className = '',
}: Omit<DebouncedSearchInputProps, 'isLoading' | 'showClearButton' | 'autoFocus'>) {
  const { value, debouncedValue, setValue, reset } = useDebouncedInput('', delay);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  return (
    <div className={`relative ${className}`}>
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/40" />
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder={placeholder}
        className="glass-input w-full pl-10 pr-10 py-2 rounded-lg text-sm text-white placeholder-white/40 focus:outline-none focus:ring-2 focus:ring-neon-cyan/50"
      />
      {value && (
        <button
          onClick={() => {
            reset();
            onSearch('');
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/40 hover:text-white"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}

/**
 * Search Input with Suggestions
 * Debounced search with dropdown suggestions
 */
interface SearchWithSuggestionsProps<T> extends DebouncedSearchInputProps {
  suggestions: T[];
  renderSuggestion: (item: T) => React.ReactNode;
  onSelectSuggestion: (item: T) => void;
  getSuggestionKey: (item: T) => string;
}

export function SearchWithSuggestions<T>({
  placeholder = 'Search...',
  onSearch,
  delay = 300,
  className = '',
  isLoading = false,
  suggestions,
  renderSuggestion,
  onSelectSuggestion,
  getSuggestionKey,
}: SearchWithSuggestionsProps<T>) {
  const { value, debouncedValue, setValue, reset } = useDebouncedInput('', delay);

  useEffect(() => {
    onSearch(debouncedValue);
  }, [debouncedValue, onSearch]);

  const showSuggestions = value.length > 0 && suggestions.length > 0;

  return (
    <div className={`relative ${className}`}>
      <DebouncedSearchInput
        placeholder={placeholder}
        onSearch={onSearch}
        delay={delay}
        isLoading={isLoading}
      />

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 mt-2 glass-panel rounded-xl overflow-hidden z-50 max-h-96 overflow-y-auto glass-scrollbar">
          {suggestions.map((item) => (
            <button
              key={getSuggestionKey(item)}
              onClick={() => {
                onSelectSuggestion(item);
                reset();
              }}
              className="w-full px-4 py-3 text-left hover:bg-white/10 transition-colors border-b border-white/5 last:border-b-0"
            >
              {renderSuggestion(item)}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
