import***REMOVED***{***REMOVED***type***REMOVED***NextRequest***REMOVED***}***REMOVED***from***REMOVED***"next/server";
import***REMOVED***{***REMOVED***updateSession***REMOVED***}***REMOVED***from***REMOVED***"@/lib/supabase/middleware";

export***REMOVED***async***REMOVED***function***REMOVED***middleware(request:***REMOVED***NextRequest)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***await***REMOVED***updateSession(request);
}

export***REMOVED***const***REMOVED***config***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***matcher:***REMOVED***[
***REMOVED******REMOVED******REMOVED******REMOVED***/*
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*******REMOVED***Match***REMOVED***all***REMOVED***request***REMOVED***paths***REMOVED***except***REMOVED***for***REMOVED***the***REMOVED***ones***REMOVED***starting***REMOVED***with:
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*******REMOVED***-***REMOVED***_next/static***REMOVED***(static***REMOVED***files)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*******REMOVED***-***REMOVED***_next/image***REMOVED***(image***REMOVED***optimization***REMOVED***files)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*******REMOVED***-***REMOVED***favicon.ico***REMOVED***(favicon***REMOVED***file)
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED*******REMOVED***-***REMOVED***public***REMOVED***folder
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED****/
***REMOVED******REMOVED******REMOVED******REMOVED***"/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
***REMOVED******REMOVED***],
};
