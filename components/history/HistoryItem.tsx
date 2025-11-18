"use***REMOVED***client";

import***REMOVED***React,***REMOVED***{***REMOVED***useState,***REMOVED***TouchEvent***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***type***REMOVED***{***REMOVED***HistoryItem***REMOVED***}***REMOVED***from***REMOVED***"@/types";
import***REMOVED***{***REMOVED***CheckCircle2,***REMOVED***XCircle,***REMOVED***Ban,***REMOVED***Clock,***REMOVED***Users,***REMOVED***ChevronRight***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

interface***REMOVED***HistoryItemProps***REMOVED***{
***REMOVED******REMOVED***item:***REMOVED***HistoryItem;
***REMOVED******REMOVED***onClick:***REMOVED***()***REMOVED***=>***REMOVED***void;
}

export***REMOVED***function***REMOVED***HistoryItem({***REMOVED***item,***REMOVED***onClick***REMOVED***}:***REMOVED***HistoryItemProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[touchStart,***REMOVED***setTouchStart]***REMOVED***=***REMOVED***useState<number***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[touchEnd,***REMOVED***setTouchEnd]***REMOVED***=***REMOVED***useState<number***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[swipeOffset,***REMOVED***setSwipeOffset]***REMOVED***=***REMOVED***useState(0);

***REMOVED******REMOVED***//***REMOVED***Minimum***REMOVED***swipe***REMOVED***distance***REMOVED***(in***REMOVED***px)***REMOVED***to***REMOVED***trigger***REMOVED***action
***REMOVED******REMOVED***const***REMOVED***minSwipeDistance***REMOVED***=***REMOVED***100;

***REMOVED******REMOVED***const***REMOVED***handleTouchStart***REMOVED***=***REMOVED***(e:***REMOVED***TouchEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setTouchEnd(null);
***REMOVED******REMOVED******REMOVED******REMOVED***setTouchStart(e.targetTouches[0].clientX);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleTouchMove***REMOVED***=***REMOVED***(e:***REMOVED***TouchEvent)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***currentTouch***REMOVED***=***REMOVED***e.targetTouches[0].clientX;
***REMOVED******REMOVED******REMOVED******REMOVED***setTouchEnd(currentTouch);
***REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Calculate***REMOVED***offset***REMOVED***for***REMOVED***visual***REMOVED***feedback
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(touchStart***REMOVED***!==***REMOVED***null)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***offset***REMOVED***=***REMOVED***currentTouch***REMOVED***-***REMOVED***touchStart;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Limit***REMOVED***offset***REMOVED***to***REMOVED***prevent***REMOVED***excessive***REMOVED***swiping
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSwipeOffset(Math.max(-150,***REMOVED***Math.min(150,***REMOVED***offset)));
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***handleTouchEnd***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(!touchStart***REMOVED***||***REMOVED***!touchEnd)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setSwipeOffset(0);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return;
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***distance***REMOVED***=***REMOVED***touchStart***REMOVED***-***REMOVED***touchEnd;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***isLeftSwipe***REMOVED***=***REMOVED***distance***REMOVED***>***REMOVED***minSwipeDistance;
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***isRightSwipe***REMOVED***=***REMOVED***distance***REMOVED***<***REMOVED***-minSwipeDistance;

***REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Reset***REMOVED***offset
***REMOVED******REMOVED******REMOVED******REMOVED***setSwipeOffset(0);

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(isLeftSwipe***REMOVED***||***REMOVED***isRightSwipe)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Trigger***REMOVED***haptic***REMOVED***feedback***REMOVED***if***REMOVED***supported
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(typeof***REMOVED***navigator***REMOVED***!==***REMOVED***"undefined"***REMOVED***&&***REMOVED***"vibrate"***REMOVED***in***REMOVED***navigator)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***navigator.vibrate(10);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Open***REMOVED***the***REMOVED***item***REMOVED***on***REMOVED***swipe
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick();
***REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED***setTouchStart(null);
***REMOVED******REMOVED******REMOVED******REMOVED***setTouchEnd(null);
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***getStatusIcon***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(item.status)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"success":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<CheckCircle2***REMOVED***className="h-5***REMOVED***w-5***REMOVED***text-green-600"***REMOVED***/>;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"failed":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<XCircle***REMOVED***className="h-5***REMOVED***w-5***REMOVED***text-red-600"***REMOVED***/>;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"cancelled":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***<Ban***REMOVED***className="h-5***REMOVED***w-5***REMOVED***text-gray-500"***REMOVED***/>;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***getStatusColor***REMOVED***=***REMOVED***()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(item.status)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"success":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***"bg-green-50***REMOVED***text-green-700***REMOVED***border-green-200";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"failed":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***"bg-red-50***REMOVED***text-red-700***REMOVED***border-red-200";
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"cancelled":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***"bg-gray-50***REMOVED***text-gray-700***REMOVED***border-gray-200";
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***formatDuration***REMOVED***=***REMOVED***(ms:***REMOVED***number)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***seconds***REMOVED***=***REMOVED***Math.floor(ms***REMOVED***/***REMOVED***1000);
***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(seconds***REMOVED***<***REMOVED***60)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***`${seconds}s`;
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***minutes***REMOVED***=***REMOVED***Math.floor(seconds***REMOVED***/***REMOVED***60);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***remainingSeconds***REMOVED***=***REMOVED***seconds***REMOVED***%***REMOVED***60;
***REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***`${minutes}m***REMOVED***${remainingSeconds}s`;
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***formatTimestamp***REMOVED***=***REMOVED***(date:***REMOVED***Date)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***now***REMOVED***=***REMOVED***new***REMOVED***Date();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***diffMs***REMOVED***=***REMOVED***now.getTime()***REMOVED***-***REMOVED***date.getTime();
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***diffMins***REMOVED***=***REMOVED***Math.floor(diffMs***REMOVED***/***REMOVED***60000);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***diffHours***REMOVED***=***REMOVED***Math.floor(diffMs***REMOVED***/***REMOVED***3600000);
***REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***diffDays***REMOVED***=***REMOVED***Math.floor(diffMs***REMOVED***/***REMOVED***86400000);

***REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(diffMins***REMOVED***<***REMOVED***1)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***"Just***REMOVED***now";
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***if***REMOVED***(diffMins***REMOVED***<***REMOVED***60)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***`${diffMins}***REMOVED***minute${diffMins***REMOVED***>***REMOVED***1***REMOVED***?***REMOVED***"s"***REMOVED***:***REMOVED***""}***REMOVED***ago`;
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***if***REMOVED***(diffHours***REMOVED***<***REMOVED***24)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***`${diffHours}***REMOVED***hour${diffHours***REMOVED***>***REMOVED***1***REMOVED***?***REMOVED***"s"***REMOVED***:***REMOVED***""}***REMOVED***ago`;
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***if***REMOVED***(diffDays***REMOVED***<***REMOVED***7)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***`${diffDays}***REMOVED***day${diffDays***REMOVED***>***REMOVED***1***REMOVED***?***REMOVED***"s"***REMOVED***:***REMOVED***""}***REMOVED***ago`;
***REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***else***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***date.toLocaleDateString();
***REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED***};

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={onClick}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchStart={handleTouchStart}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchMove={handleTouchMove}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onTouchEnd={handleTouchEnd}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="group***REMOVED***cursor-pointer***REMOVED***rounded-lg***REMOVED***border***REMOVED***bg-card***REMOVED***p-4***REMOVED***transition-all***REMOVED***hover:shadow-md***REMOVED***hover:border-primary/50***REMOVED***touch-none***REMOVED***w-full***REMOVED***text-left***REMOVED***focus:outline-none***REMOVED***focus:ring-2***REMOVED***focus:ring-ring***REMOVED***focus:ring-offset-2"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***transform:***REMOVED***`translateX(${swipeOffset}px)`,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***transition:***REMOVED***swipeOffset***REMOVED***===***REMOVED***0***REMOVED***?***REMOVED***"transform***REMOVED***0.2s***REMOVED***ease-out"***REMOVED***:***REMOVED***"none",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label={`View***REMOVED***workflow:***REMOVED***${item.command}.***REMOVED***Status:***REMOVED***${item.status}.***REMOVED***${formatTimestamp(item.timestamp)}`}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-start***REMOVED***gap-3***REMOVED***sm:gap-4">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Status***REMOVED***Icon***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-shrink-0***REMOVED***mt-0.5***REMOVED***sm:mt-1"***REMOVED***aria-hidden="true">{getStatusIcon()}</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Content***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-1***REMOVED***min-w-0">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Command***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className="text-xs***REMOVED***sm:text-sm***REMOVED***font-medium***REMOVED***text-foreground***REMOVED***line-clamp-2***REMOVED***group-hover:text-primary***REMOVED***transition-colors">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.command}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Metadata***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mt-1.5***REMOVED***sm:mt-2***REMOVED***flex***REMOVED***flex-wrap***REMOVED***items-center***REMOVED***gap-2***REMOVED***sm:gap-3***REMOVED***text-2xs***REMOVED***sm:text-xs***REMOVED***text-muted-foreground">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Timestamp***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Clock***REMOVED***className="h-3***REMOVED***w-3"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>{formatTimestamp(item.timestamp)}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Duration***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>Duration:***REMOVED***{formatDuration(item.duration)}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Agents***REMOVED***Used***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.agentsUsed.length***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Users***REMOVED***className="h-3***REMOVED***w-3"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>{item.agentsUsed.length}***REMOVED***agent{item.agentsUsed.length***REMOVED***>***REMOVED***1***REMOVED***?***REMOVED***"s"***REMOVED***:***REMOVED***""}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Result***REMOVED***Count***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.resultCount***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex***REMOVED***items-center***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span>{item.resultCount}***REMOVED***result{item.resultCount***REMOVED***>***REMOVED***1***REMOVED***?***REMOVED***"s"***REMOVED***:***REMOVED***""}</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Agents***REMOVED***List***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.agentsUsed.length***REMOVED***>***REMOVED***0***REMOVED***&&***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="mt-1.5***REMOVED***sm:mt-2***REMOVED***flex***REMOVED***flex-wrap***REMOVED***gap-1">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.agentsUsed.map((agent,***REMOVED***index)***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***key={index}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="inline-flex***REMOVED***items-center***REMOVED***rounded-full***REMOVED***bg-primary/10***REMOVED***px-1.5***REMOVED***sm:px-2***REMOVED***py-0.5***REMOVED***text-2xs***REMOVED***sm:text-xs***REMOVED***font-medium***REMOVED***text-primary"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{agent}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Status***REMOVED***Badge***REMOVED***and***REMOVED***Swipe***REMOVED***Indicator***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<div***REMOVED***className="flex-shrink-0***REMOVED***flex***REMOVED***items-center***REMOVED***gap-2">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<span
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"inline-flex***REMOVED***items-center***REMOVED***rounded-full***REMOVED***border***REMOVED***px-2***REMOVED***sm:px-2.5***REMOVED***py-0.5***REMOVED***text-2xs***REMOVED***sm:text-xs***REMOVED***font-semibold***REMOVED***capitalize",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***getStatusColor()
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label={`Status:***REMOVED***${item.status}`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{item.status}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</span>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{/****REMOVED***Swipe***REMOVED***indicator***REMOVED***-***REMOVED***only***REMOVED***visible***REMOVED***on***REMOVED***mobile***REMOVED****/}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ChevronRight***REMOVED***className="h-4***REMOVED***w-4***REMOVED***text-muted-foreground***REMOVED***lg:hidden"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED***);
}
