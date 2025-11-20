# Debounce Usage Guide

This guide explains how to use the debounce hooks and components in the AURA application.

## Overview

Debouncing is a performance optimization technique that delays the execution of a function until after a specified time has passed since the last time it was invoked. This is particularly useful for:

- Search inputs (reduce API calls)
- Form validation
- Window resize handlers
- Scroll event handlers

**Default Delay**: 300ms (as per requirements 19.7)

## Available Hooks

### 1. `useDebounce`

Debounces a value.

```typescript
import { useDebounce } from '@/app/hooks/useDebounce';

function SearchComponent() {
  const [searchQuery, setSearchQuery] = useState('');
  const debouncedQuery = useDebounce(searchQuery, 300);

  useEffect(() => {
    // This will only run 300ms after the user stops typing
    if (debouncedQuery) {
      fetchSearchResults(debouncedQuery);
    }
  }, [debouncedQuery]);

  return (
    <input
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="Search..."
    />
  );
}
```

### 2. `useDebouncedCallback`

Debounces a callback function.

```typescript
import { useDebouncedCallback } from '@/app/hooks/useDebounce';

function FormComponent() {
  const debouncedSave = useDebouncedCallback(
    (formData) => {
      // Save to API
      saveFormData(formData);
    },
    500 // 500ms delay
  );

  return (
    <form onChange={(e) => debouncedSave(e.target.value)}>
      {/* form fields */}
    </form>
  );
}
```

### 3. `useDebouncedSearch`

Complete debounced search solution with request cancellation.

```typescript
import { useDebouncedSearch } from '@/app/hooks/useDebounce';

function FileSearchComponent() {
  const searchFn = async (query: string) => {
    const response = await fetch(`/api/drive/search?query=${query}`);
    return response.json();
  };

  const { query, setQuery, results, isSearching, error } = useDebouncedSearch(
    searchFn,
    300
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search files..."
      />
      {isSearching && <p>Searching...</p>}
      {error && <p>Error: {error.message}</p>}
      {results && <ResultsList results={results} />}
    </div>
  );
}
```

### 4. `useDebouncedInput`

Combines input state management with debouncing.

```typescript
import { useDebouncedInput } from '@/app/hooks/useDebounce';

function FilterComponent() {
  const { value, debouncedValue, setValue, reset, isDebouncing } =
    useDebouncedInput('', 300);

  useEffect(() => {
    // Apply filter with debounced value
    applyFilter(debouncedValue);
  }, [debouncedValue]);

  return (
    <div>
      <input
        value={value}
        onChange={(e) => setValue(e.target.value)}
        placeholder="Filter..."
      />
      {isDebouncing && <span>Filtering...</span>}
      <button onClick={reset}>Clear</button>
    </div>
  );
}
```

### 5. `useThrottle`

Alternative to debounce - ensures function is called at most once per interval.

```typescript
import { useThrottle } from '@/app/hooks/useDebounce';

function ScrollComponent() {
  const throttledScroll = useThrottle(
    () => {
      // Handle scroll
      console.log('Scrolled!');
    },
    200 // Max once per 200ms
  );

  useEffect(() => {
    window.addEventListener('scroll', throttledScroll);
    return () => window.removeEventListener('scroll', throttledScroll);
  }, [throttledScroll]);

  return <div>{/* content */}</div>;
}
```

## Available Components

### 1. `DebouncedSearchInput`

Full-featured search input with debouncing.

```typescript
import { DebouncedSearchInput } from '@/app/components/ui/DebouncedSearchInput';

function FilesPage() {
  const handleSearch = (query: string) => {
    // This is called 300ms after user stops typing
    fetchFiles(query);
  };

  return (
    <DebouncedSearchInput
      placeholder="Search files..."
      onSearch={handleSearch}
      delay={300}
      isLoading={isLoading}
      showClearButton={true}
      autoFocus={false}
    />
  );
}
```

### 2. `CompactDebouncedSearchInput`

Smaller version for headers and toolbars.

```typescript
import { CompactDebouncedSearchInput } from '@/app/components/ui/DebouncedSearchInput';

function Header() {
  return (
    <CompactDebouncedSearchInput
      placeholder="Quick search..."
      onSearch={handleSearch}
      delay={300}
    />
  );
}
```

### 3. `SearchWithSuggestions`

Debounced search with dropdown suggestions.

```typescript
import { SearchWithSuggestions } from '@/app/components/ui/DebouncedSearchInput';

function FileSearchWithSuggestions() {
  const [suggestions, setSuggestions] = useState([]);

  const handleSearch = async (query: string) => {
    const results = await fetchSuggestions(query);
    setSuggestions(results);
  };

  return (
    <SearchWithSuggestions
      placeholder="Search files..."
      onSearch={handleSearch}
      suggestions={suggestions}
      renderSuggestion={(file) => (
        <div>
          <p>{file.name}</p>
          <p className="text-sm text-white/60">{file.type}</p>
        </div>
      )}
      onSelectSuggestion={(file) => openFile(file)}
      getSuggestionKey={(file) => file.id}
    />
  );
}
```

## Real-World Examples

### Example 1: Files Page Search

```typescript
// app/files/page.tsx
import { DebouncedSearchInput } from '@/app/components/ui/DebouncedSearchInput';

export default function FilesPage() {
  const [files, setFiles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleSearch = async (query: string) => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/drive/search?query=${query}`);
      const data = await response.json();
      setFiles(data.files);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <DebouncedSearchInput
        placeholder="Search your Drive files..."
        onSearch={handleSearch}
        delay={300}
        isLoading={isLoading}
      />
      <FileGrid files={files} />
    </div>
  );
}
```

### Example 2: Logs Page Task ID Filter

```typescript
// app/logs/page.tsx
import { useDebouncedInput } from '@/app/hooks/useDebounce';

export default function LogsPage() {
  const { value, debouncedValue, setValue } = useDebouncedInput('', 300);

  useEffect(() => {
    if (debouncedValue) {
      fetchLogs({ taskId: debouncedValue });
    }
  }, [debouncedValue]);

  return (
    <input
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder="Filter by task ID..."
    />
  );
}
```

### Example 3: Gmail Search

```typescript
// app/components/gmail/GmailSearch.tsx
import { useDebouncedSearch } from '@/app/hooks/useDebounce';

export function GmailSearch() {
  const searchEmails = async (query: string) => {
    const response = await fetch(`/api/gmail/search?query=${query}`);
    return response.json();
  };

  const { query, setQuery, results, isSearching, error } = useDebouncedSearch(
    searchEmails,
    300
  );

  return (
    <div>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search emails..."
      />
      {isSearching && <LoadingSpinner />}
      {error && <ErrorMessage error={error} />}
      {results && <EmailList emails={results.messages} />}
    </div>
  );
}
```

## Performance Benefits

### Without Debouncing

```
User types: "h" -> API call
User types: "e" -> API call
User types: "l" -> API call
User types: "l" -> API call
User types: "o" -> API call

Total: 5 API calls
```

### With Debouncing (300ms)

```
User types: "h" -> wait
User types: "e" -> wait
User types: "l" -> wait
User types: "l" -> wait
User types: "o" -> wait
[300ms passes] -> API call

Total: 1 API call
```

**Result**: 80% reduction in API calls!

## Best Practices

1. **Choose the right delay**:
   - Search inputs: 300ms (default)
   - Form validation: 500ms
   - Auto-save: 1000ms
   - Window resize: 150ms

2. **Use request cancellation**:
   - Always cancel pending requests when a new one starts
   - Use `AbortController` for fetch requests
   - `useDebouncedSearch` handles this automatically

3. **Show loading states**:
   - Display a loading indicator while debouncing
   - Use `isDebouncing` flag from `useDebouncedInput`

4. **Provide feedback**:
   - Show "Searching..." or similar message
   - Display debounce indicator if delay is noticeable

5. **Consider throttling for continuous events**:
   - Use `useThrottle` for scroll, resize, mousemove
   - Use `useDebounce` for discrete events like typing

## Testing

```typescript
import { renderHook, act } from '@testing-library/react';
import { useDebounce } from '@/app/hooks/useDebounce';

test('debounces value', async () => {
  const { result, rerender } = renderHook(
    ({ value }) => useDebounce(value, 300),
    { initialProps: { value: 'initial' } }
  );

  expect(result.current).toBe('initial');

  // Update value
  rerender({ value: 'updated' });

  // Value should not change immediately
  expect(result.current).toBe('initial');

  // Wait for debounce
  await act(async () => {
    await new Promise((resolve) => setTimeout(resolve, 350));
  });

  // Value should now be updated
  expect(result.current).toBe('updated');
});
```

## Troubleshooting

### Issue: Debounce not working

**Solution**: Make sure you're using the debounced value, not the original value.

```typescript
// ❌ Wrong
const debouncedQuery = useDebounce(query, 300);
fetchData(query); // Using original value

// ✅ Correct
const debouncedQuery = useDebounce(query, 300);
fetchData(debouncedQuery); // Using debounced value
```

### Issue: Multiple API calls still happening

**Solution**: Ensure you're canceling previous requests.

```typescript
// Use useDebouncedSearch which handles cancellation
const { query, setQuery, results } = useDebouncedSearch(searchFn, 300);
```

### Issue: Delay feels too long

**Solution**: Adjust the delay based on use case.

```typescript
// Faster for better UX
const debouncedValue = useDebounce(value, 150);

// Slower to reduce API load
const debouncedValue = useDebounce(value, 500);
```
