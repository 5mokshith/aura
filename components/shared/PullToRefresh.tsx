"use***REMOVED***client";

import***REMOVED***{***REMOVED***useState,***REMOVED***useRef,***REMOVED***TouchEvent,***REMOVED***ReactNode***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***RefreshCw***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

interface***REMOVED***PullToRefreshProps***REMOVED***{
***REMOVED******REMOVED***onRefresh:***REMOVED***()***REMOVED***=>***REMOVED***Promise<void>;
***REMOVED******REMOVED***children:***REMOVED***ReactNode;
***REMOVED******REMOVED***className?:***REMOVED***string;
}

export***REMOVED***function***REMOVED***PullToRefresh({***REMOVED***onRefresh,***REMOVED***children,***REMOVED***className***REMOVED***}:***REMOVED***PullToRefreshProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[pullDistance,***REMOVED***setPullDistance]***REMOVED***=***REMOVED***useState(0);
***REMOVED******REMOVED***const***REMOVED***[isRefreshing,***REMOVED***setIsRefreshing]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***[touchStart,***REMOVED***setTouchStart]***REMOVED***=***REMOVED***useState<number***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***containerRef***REMOVED***=***REMOVED***useRef<HTMLDivElement>(null);

***REMOVED******REMOVED***const***REMOVED***maxPullDistance***REMOVED***=***REMOVED***100;
***REMOVED******REMOVED***const***REMOVED***triggerDistance***REMOVED***=***REMOVED***70;

***REMOVED******REMOVED***const***REMOVED***handleTouchStart***REMOVED***=***REMOVED***(e:***REMOVED***TouchEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Only***REMOVED***allow***REMOVED***pull-to-refresh***REMOVED***when***REMOVED***scrolled***REMOVED***to***REMOVED***top
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(containerRef.current***REMOVED***&&***REMOVED***containerRef.current.scrollTop***REMOVED***===***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setTouchStart(e.touches[0].clientY);
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleTouchMove***REMOVED***=***REMOVED***(e:***REMOVED***TouchEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(touchStart***REMOVED***===***REMOVED***null***REMOVED***||***REMOVED***isRefreshing)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***currentTouch***REMOVED***=***REMOVED***e.touches[0].clientY;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***distance***REMOVED***=***REMOVED***currentTouch***REMOVED***-***REMOVED***touchStart;

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Only***REMOVED***pull***REMOVED***down,***REMOVED***not***REMOVED***up
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(distance***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***containerRef.current***REMOVED***&&***REMOVED***containerRef.current.scrollTop***REMOVED***===***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Apply***REMOVED***resistance***REMOVED***to***REMOVED***pull***REMOVED***distance
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***resistedDistance***REMOVED***=***REMOVED***Math.min(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***distance***REMOVED*******REMOVED***0.5,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***maxPullDistance
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setPullDistance(resistedDistance);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Prevent***REMOVED***default***REMOVED***scroll***REMOVED***behavior***REMOVED***when***REMOVED***pulling
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(distance***REMOVED***>***REMOVED***10)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***e.preventDefault();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleTouchEnd***REMOVED***=***REMOVED***async***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(touchStart***REMOVED***===***REMOVED***null***REMOVED***||***REMOVED***isRefreshing)***REMOVED***return;

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(pullDistance***REMOVED***>=***REMOVED***triggerDistance)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsRefreshing(true);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Trigger***REMOVED***haptic***REMOVED***feedback***REMOVED***if***REMOVED***supported
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(typeof***REMOVED***navigator***REMOVED***!==***REMOVED***"undefined"***REMOVED***&&***REMOVED***"vibrate"***REMOVED***in***REMOVED***navigator)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***navigator.vibrate(20);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***await***REMOVED***onRefresh();
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(error)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***console.error("Refresh***REMOVED***failed:",***REMOVED***error);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***finally***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsRefreshing(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setPullDistance(0);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setPullDistance(0);
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***setTouchStart(null);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***getRotation***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(isRefreshing)***REMOVED***return***REMOVED***360;
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***(pullDistance***REMOVED***/***REMOVED***triggerDistance)***REMOVED*******REMOVED***360;
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***getOpacity***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***Math.min(pullDistance***REMOVED***/***REMOVED***triggerDistance,***REMOVED***1);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***ref={containerRef}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn("relative***REMOVED***overflow-auto",***REMOVED***className)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchStart={handleTouchStart}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchMove={handleTouchMove}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchEnd={handleTouchEnd}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Pull***REMOVED***indicator***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="absolute***REMOVED***top-0***REMOVED***left-0***REMOVED***right-0***REMOVED***flex***REMOVED***items-center***REMOVED***justify-center***REMOVED***transition-all***REMOVED***duration-200***REMOVED***pointer-events-none"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***height:***REMOVED***`${pullDistance}px`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***opacity:***REMOVED***getOpacity(),
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***flex-col***REMOVED***items-center***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<RefreshCw
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"h-6***REMOVED***w-6***REMOVED***text-primary***REMOVED***transition-transform",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***isRefreshing***REMOVED***&&***REMOVED***"animate-spin"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***transform:***REMOVED***`rotate(${getRotation()}deg)`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span***REMOVED***className="text-xs***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{isRefreshing
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***"Refreshing..."
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***pullDistance***REMOVED***>=***REMOVED***triggerDistance
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***?***REMOVED***"Release***REMOVED***to***REMOVED***refresh"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***:***REMOVED***"Pull***REMOVED***to***REMOVED***refresh"}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Content***REMOVED***with***REMOVED***offset***REMOVED***when***REMOVED***pulling***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***transform:***REMOVED***`translateY(${pullDistance}px)`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***transition:***REMOVED***isRefreshing***REMOVED***||***REMOVED***pullDistance***REMOVED***===***REMOVED***0***REMOVED***?***REMOVED***"transform***REMOVED***0.2s***REMOVED***ease-out"***REMOVED***:***REMOVED***"none",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
