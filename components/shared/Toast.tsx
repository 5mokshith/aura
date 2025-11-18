"use***REMOVED***client";

import***REMOVED***{***REMOVED***createContext,***REMOVED***useContext,***REMOVED***useState,***REMOVED***useCallback,***REMOVED***ReactNode***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***X,***REMOVED***CheckCircle2,***REMOVED***AlertCircle,***REMOVED***AlertTriangle,***REMOVED***Info***REMOVED***}***REMOVED***from***REMOVED***"lucide-react";
import***REMOVED***{***REMOVED***cn***REMOVED***}***REMOVED***from***REMOVED***"@/lib/utils";

type***REMOVED***ToastVariant***REMOVED***=***REMOVED***"success"***REMOVED***|***REMOVED***"error"***REMOVED***|***REMOVED***"warning"***REMOVED***|***REMOVED***"info";

interface***REMOVED***Toast***REMOVED***{
***REMOVED******REMOVED***id:***REMOVED***string;
***REMOVED******REMOVED***message:***REMOVED***string;
***REMOVED******REMOVED***variant:***REMOVED***ToastVariant;
***REMOVED******REMOVED***duration?:***REMOVED***number;
}

interface***REMOVED***ToastContextValue***REMOVED***{
***REMOVED******REMOVED***toasts:***REMOVED***Toast[];
***REMOVED******REMOVED***showToast:***REMOVED***(message:***REMOVED***string,***REMOVED***variant?:***REMOVED***ToastVariant,***REMOVED***duration?:***REMOVED***number)***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***dismissToast:***REMOVED***(id:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

const***REMOVED***ToastContext***REMOVED***=***REMOVED***createContext<ToastContextValue***REMOVED***|***REMOVED***undefined>(undefined);

export***REMOVED***function***REMOVED***useToast()***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***context***REMOVED***=***REMOVED***useContext(ToastContext);
***REMOVED******REMOVED***if***REMOVED***(!context)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***new***REMOVED***Error("useToast***REMOVED***must***REMOVED***be***REMOVED***used***REMOVED***within***REMOVED***a***REMOVED***ToastProvider");
***REMOVED******REMOVED***}
***REMOVED******REMOVED***return***REMOVED***context;
}

interface***REMOVED***ToastProviderProps***REMOVED***{
***REMOVED******REMOVED***children:***REMOVED***ReactNode;
}

export***REMOVED***function***REMOVED***ToastProvider({***REMOVED***children***REMOVED***}:***REMOVED***ToastProviderProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[toasts,***REMOVED***setToasts]***REMOVED***=***REMOVED***useState<Toast[]>([]);

***REMOVED******REMOVED***const***REMOVED***showToast***REMOVED***=***REMOVED***useCallback(
***REMOVED******REMOVED******REMOVED******REMOVED***(message:***REMOVED***string,***REMOVED***variant:***REMOVED***ToastVariant***REMOVED***=***REMOVED***"info",***REMOVED***duration?:***REMOVED***number)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***id***REMOVED***=***REMOVED***`toast-${Date.now()}-${Math.random()}`;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Determine***REMOVED***auto-dismiss***REMOVED***duration***REMOVED***based***REMOVED***on***REMOVED***variant
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***let***REMOVED***autoDismissDuration***REMOVED***=***REMOVED***duration;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(autoDismissDuration***REMOVED***===***REMOVED***undefined)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***switch***REMOVED***(variant)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"success":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***autoDismissDuration***REMOVED***=***REMOVED***3000;***REMOVED***//***REMOVED***3s***REMOVED***for***REMOVED***success
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"warning":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***autoDismissDuration***REMOVED***=***REMOVED***5000;***REMOVED***//***REMOVED***5s***REMOVED***for***REMOVED***warning
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"error":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***autoDismissDuration***REMOVED***=***REMOVED***0;***REMOVED***//***REMOVED***Manual***REMOVED***dismiss***REMOVED***for***REMOVED***errors
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***case***REMOVED***"info":
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***autoDismissDuration***REMOVED***=***REMOVED***4000;***REMOVED***//***REMOVED***4s***REMOVED***for***REMOVED***info
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***break;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***newToast:***REMOVED***Toast***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***id,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***message,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***variant,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***duration:***REMOVED***autoDismissDuration,
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***};

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setToasts((prev)***REMOVED***=>***REMOVED***[...prev,***REMOVED***newToast]);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***Auto-dismiss***REMOVED***if***REMOVED***duration***REMOVED***is***REMOVED***set
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(autoDismissDuration***REMOVED***&&***REMOVED***autoDismissDuration***REMOVED***>***REMOVED***0)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setTimeout(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***dismissToast(id);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***},***REMOVED***autoDismissDuration);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***[]
***REMOVED******REMOVED***);

***REMOVED******REMOVED***const***REMOVED***dismissToast***REMOVED***=***REMOVED***useCallback((id:***REMOVED***string)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setToasts((prev)***REMOVED***=>***REMOVED***prev.filter((toast)***REMOVED***=>***REMOVED***toast.id***REMOVED***!==***REMOVED***id));
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<ToastContext.Provider***REMOVED***value={{***REMOVED***toasts,***REMOVED***showToast,***REMOVED***dismissToast***REMOVED***}}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ToastContainer***REMOVED***toasts={toasts}***REMOVED***onDismiss={dismissToast}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED***</ToastContext.Provider>
***REMOVED******REMOVED***);
}

interface***REMOVED***ToastContainerProps***REMOVED***{
***REMOVED******REMOVED***toasts:***REMOVED***Toast[];
***REMOVED******REMOVED***onDismiss:***REMOVED***(id:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

function***REMOVED***ToastContainer({***REMOVED***toasts,***REMOVED***onDismiss***REMOVED***}:***REMOVED***ToastContainerProps)***REMOVED***{
***REMOVED******REMOVED***if***REMOVED***(toasts.length***REMOVED***===***REMOVED***0)***REMOVED***return***REMOVED***null;

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className="fixed***REMOVED***z-50***REMOVED***flex***REMOVED***flex-col***REMOVED***gap-2***REMOVED***pointer-events-none"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style={{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***top:***REMOVED***"1rem",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***right:***REMOVED***"1rem",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***//***REMOVED***On***REMOVED***mobile,***REMOVED***position***REMOVED***at***REMOVED***bottom***REMOVED***for***REMOVED***better***REMOVED***reachability
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-live="polite"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-atomic="true"
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<style***REMOVED***jsx>{`
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***@media***REMOVED***(max-width:***REMOVED***768px)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***div***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***top:***REMOVED***auto;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***bottom:***REMOVED***1rem;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***left:***REMOVED***1rem;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***right:***REMOVED***1rem;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***`}</style>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{toasts.map((toast)***REMOVED***=>***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<ToastItem***REMOVED***key={toast.id}***REMOVED***toast={toast}***REMOVED***onDismiss={onDismiss}***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***))}
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}

interface***REMOVED***ToastItemProps***REMOVED***{
***REMOVED******REMOVED***toast:***REMOVED***Toast;
***REMOVED******REMOVED***onDismiss:***REMOVED***(id:***REMOVED***string)***REMOVED***=>***REMOVED***void;
}

function***REMOVED***ToastItem({***REMOVED***toast,***REMOVED***onDismiss***REMOVED***}:***REMOVED***ToastItemProps)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***variantStyles***REMOVED***=***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***success:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***container:***REMOVED***"bg-green-50***REMOVED***border-green-200***REMOVED***dark:bg-green-950***REMOVED***dark:border-green-800",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***icon:***REMOVED***"text-green-600***REMOVED***dark:text-green-400",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***text:***REMOVED***"text-green-900***REMOVED***dark:text-green-100",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***IconComponent:***REMOVED***CheckCircle2,
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***error:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***container:***REMOVED***"bg-red-50***REMOVED***border-red-200***REMOVED***dark:bg-red-950***REMOVED***dark:border-red-800",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***icon:***REMOVED***"text-red-600***REMOVED***dark:text-red-400",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***text:***REMOVED***"text-red-900***REMOVED***dark:text-red-100",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***IconComponent:***REMOVED***AlertCircle,
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***warning:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***container:***REMOVED***"bg-yellow-50***REMOVED***border-yellow-200***REMOVED***dark:bg-yellow-950***REMOVED***dark:border-yellow-800",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***icon:***REMOVED***"text-yellow-600***REMOVED***dark:text-yellow-400",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***text:***REMOVED***"text-yellow-900***REMOVED***dark:text-yellow-100",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***IconComponent:***REMOVED***AlertTriangle,
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***info:***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***container:***REMOVED***"bg-blue-50***REMOVED***border-blue-200***REMOVED***dark:bg-blue-950***REMOVED***dark:border-blue-800",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***icon:***REMOVED***"text-blue-600***REMOVED***dark:text-blue-400",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***text:***REMOVED***"text-blue-900***REMOVED***dark:text-blue-100",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***IconComponent:***REMOVED***Info,
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED***};

***REMOVED******REMOVED***const***REMOVED***style***REMOVED***=***REMOVED***variantStyles[toast.variant];
***REMOVED******REMOVED***const***REMOVED***Icon***REMOVED***=***REMOVED***style.IconComponent;

***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<div
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***role="alert"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"pointer-events-auto***REMOVED***flex***REMOVED***items-start***REMOVED***gap-3***REMOVED***p-4***REMOVED***rounded-lg***REMOVED***border***REMOVED***shadow-lg",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"animate-in***REMOVED***slide-in-from-top-5***REMOVED***fade-in***REMOVED***duration-300",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"max-w-md***REMOVED***w-full",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style.container
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<Icon***REMOVED***className={cn("size-5***REMOVED***flex-shrink-0***REMOVED***mt-0.5",***REMOVED***style.icon)}***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<p***REMOVED***className={cn("flex-1***REMOVED***text-sm***REMOVED***font-medium",***REMOVED***style.text)}>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{toast.message}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</p>

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<button
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onClick={()***REMOVED***=>***REMOVED***onDismiss(toast.id)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={cn(
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"flex-shrink-0***REMOVED***rounded-md***REMOVED***p-1***REMOVED***hover:bg-black/5***REMOVED***dark:hover:bg-white/10",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"focus:outline-none***REMOVED***focus:ring-2***REMOVED***focus:ring-offset-2***REMOVED***focus:ring-current",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***"transition-colors",
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***style.icon
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***)}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***aria-label="Dismiss***REMOVED***notification"
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<X***REMOVED***className="size-4"***REMOVED***aria-hidden="true"***REMOVED***/>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</button>
***REMOVED******REMOVED******REMOVED******REMOVED***</div>
***REMOVED******REMOVED***);
}
