"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***useEffect,***REMOVED***useRef,***REMOVED***useCallback***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***useHistory***REMOVED***}***REMOVED***from***REMOVED***"@/contexts/HistoryContext";
import***REMOVED***{***REMOVED***HistoryItem***REMOVED***}***REMOVED***from***REMOVED***"./HistoryItem";
import***REMOVED***{***REMOVED***Loader2,***REMOVED***Inbox,***REMOVED***XCircle***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";

interface***REMOVED***HistoryListProps***REMOVED***{
***REMOVED******REMOVED***onItemSelect:***REMOVED***(taskId:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***HistoryList({***REMOVED***onItemSelect***REMOVED***}:***REMOVED***HistoryListProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***items,***REMOVED***isLoading,***REMOVED***error,***REMOVED***hasMore,***REMOVED***loadMore***REMOVED***}***REMOVED***=***REMOVED***useHistory();
***REMOVED******REMOVED***const***REMOVED***observerTarget***REMOVED***=***REMOVED***useRef<HTMLDivElement>(null);

***REMOVED******REMOVED***//***REMOVED***Infinite***REMOVED***scroll***REMOVED***implementation
***REMOVED******REMOVED***const***REMOVED***handleObserver***REMOVED***=***REMOVED***useCallback(
***REMOVED******REMOVED******REMOVED******REMOVED***(entries:***REMOVED***IntersectionObserverEntry[])***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***[target]***REMOVED***=***REMOVED***entries;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(target.isIntersecting***REMOVED***&&***REMOVED***hasMore***REMOVED***&&***REMOVED***!isLoading)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***loadMore();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***[hasMore,***REMOVED***isLoading,***REMOVED***loadMore]
***REMOVED******REMOVED***);

***REMOVED******REMOVED***useEffect(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***element***REMOVED***=***REMOVED***observerTarget.current;
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!element)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***observer***REMOVED***=***REMOVED***new***REMOVED***IntersectionObserver(handleObserver,***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***root:***REMOVED***null,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***rootMargin:***REMOVED***"100px",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***threshold:***REMOVED***0.1,
***REMOVED******REMOVED******REMOVED******REMOVED***});

***REMOVED******REMOVED******REMOVED******REMOVED***observer.observe(element);

***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(element)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***observer.unobserve(element);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***};
***REMOVED******REMOVED***},***REMOVED***[handleObserver]);

***REMOVED******REMOVED***if***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-col***REMOVED***items-center***REMOVED***justify-center***REMOVED***py-12***REMOVED***text-center"***REMOVED***role="alert">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<XCircle***REMOVED***className="h-12***REMOVED***w-12***REMOVED***text-red-500***REMOVED***mb-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h3***REMOVED***className="text-lg***REMOVED***font-semibold***REMOVED***text-foreground***REMOVED***mb-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Failed***REMOVED***to***REMOVED***load***REMOVED***history
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-sm***REMOVED***text-muted-foreground">{error}</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***if***REMOVED***(!isLoading***REMOVED***&&***REMOVED***items.length***REMOVED***===***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-col***REMOVED***items-center***REMOVED***justify-center***REMOVED***py-12***REMOVED***text-center"***REMOVED***role="status">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Inbox***REMOVED***className="h-12***REMOVED***w-12***REMOVED***text-muted-foreground***REMOVED***mb-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<h3***REMOVED***className="text-lg***REMOVED***font-semibold***REMOVED***text-foreground***REMOVED***mb-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***No***REMOVED***history***REMOVED***yet
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</h3>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-sm***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Your***REMOVED***workflow***REMOVED***history***REMOVED***will***REMOVED***appear***REMOVED***here***REMOVED***once***REMOVED***you***REMOVED***start***REMOVED***using***REMOVED***AURA
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED***}

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<nav***REMOVED***className="space-y-3"***REMOVED***aria-label="Workflow***REMOVED***history">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ul***REMOVED***className="space-y-3"***REMOVED***role="list">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{items.map((item)***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<li***REMOVED***key={item.id}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<HistoryItem
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***item={item}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***onItemSelect(item.id)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</li>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</ul>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Loading***REMOVED***indicator***REMOVED***for***REMOVED***initial***REMOVED***load***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isLoading***REMOVED***&&***REMOVED***items.length***REMOVED***===***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***py-8"***REMOVED***role="status"***REMOVED***aria-live="polite">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Loader2***REMOVED***className="h-8***REMOVED***w-8***REMOVED***animate-spin***REMOVED***text-primary"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span***REMOVED***className="sr-only">Loading***REMOVED***history</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Infinite***REMOVED***scroll***REMOVED***trigger***REMOVED***and***REMOVED***loading***REMOVED***indicator***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***ref={observerTarget}***REMOVED***className="py-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isLoading***REMOVED***&&***REMOVED***items.length***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***justify-center"***REMOVED***role="status"***REMOVED***aria-live="polite">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Loader2***REMOVED***className="h-6***REMOVED***w-6***REMOVED***animate-spin***REMOVED***text-primary"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span***REMOVED***className="ml-2***REMOVED***text-sm***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***Loading***REMOVED***more...
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{!hasMore***REMOVED***&&***REMOVED***items.length***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-center***REMOVED***text-sm***REMOVED***text-muted-foreground"***REMOVED***role="status">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***No***REMOVED***more***REMOVED***items***REMOVED***to***REMOVED***load
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</nav>
***REMOVED******REMOVED***);
}
