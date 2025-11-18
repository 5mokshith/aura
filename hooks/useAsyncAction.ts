"use***REMOVED***client";

import***REMOVED***{***REMOVED***useState,***REMOVED***useCallback***REMOVED***}***REMOVED***from***REMOVED***"react";
import***REMOVED***{***REMOVED***useToast***REMOVED***}***REMOVED***from***REMOVED***"@/components/shared/Toast";

interface***REMOVED***UseAsyncActionOptions<T>***REMOVED***{
***REMOVED******REMOVED***onSuccess?:***REMOVED***(data:***REMOVED***T)***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***onError?:***REMOVED***(error:***REMOVED***Error)***REMOVED***=>***REMOVED***void;
***REMOVED******REMOVED***successMessage?:***REMOVED***string;
***REMOVED******REMOVED***errorMessage?:***REMOVED***string;
***REMOVED******REMOVED***showSuccessToast?:***REMOVED***boolean;
***REMOVED******REMOVED***showErrorToast?:***REMOVED***boolean;
}

export***REMOVED***function***REMOVED***useAsyncAction<T***REMOVED***=***REMOVED***void,***REMOVED***Args***REMOVED***extends***REMOVED***any[]***REMOVED***=***REMOVED***[]>(
***REMOVED******REMOVED***action:***REMOVED***(...args:***REMOVED***Args)***REMOVED***=>***REMOVED***Promise<T>,
***REMOVED******REMOVED***options:***REMOVED***UseAsyncActionOptions<T>***REMOVED***=***REMOVED***{}
)***REMOVED***{
***REMOVED******REMOVED***const***REMOVED***[isLoading,***REMOVED***setIsLoading]***REMOVED***=***REMOVED***useState(false);
***REMOVED******REMOVED***const***REMOVED***[error,***REMOVED***setError]***REMOVED***=***REMOVED***useState<Error***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***[data,***REMOVED***setData]***REMOVED***=***REMOVED***useState<T***REMOVED***|***REMOVED***null>(null);
***REMOVED******REMOVED***const***REMOVED***{***REMOVED***showToast***REMOVED***}***REMOVED***=***REMOVED***useToast();

***REMOVED******REMOVED***const***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***onSuccess,
***REMOVED******REMOVED******REMOVED******REMOVED***onError,
***REMOVED******REMOVED******REMOVED******REMOVED***successMessage,
***REMOVED******REMOVED******REMOVED******REMOVED***errorMessage,
***REMOVED******REMOVED******REMOVED******REMOVED***showSuccessToast***REMOVED***=***REMOVED***true,
***REMOVED******REMOVED******REMOVED******REMOVED***showErrorToast***REMOVED***=***REMOVED***true,
***REMOVED******REMOVED***}***REMOVED***=***REMOVED***options;

***REMOVED******REMOVED***const***REMOVED***execute***REMOVED***=***REMOVED***useCallback(
***REMOVED******REMOVED******REMOVED******REMOVED***async***REMOVED***(...args:***REMOVED***Args)***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(true);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(null);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***try***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***result***REMOVED***=***REMOVED***await***REMOVED***action(...args);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setData(result);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(showSuccessToast***REMOVED***&&***REMOVED***successMessage)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***showToast(successMessage,***REMOVED***"success");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onSuccess?.(result);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***return***REMOVED***result;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***catch***REMOVED***(err)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***const***REMOVED***error***REMOVED***=***REMOVED***err***REMOVED***instanceof***REMOVED***Error***REMOVED***?***REMOVED***err***REMOVED***:***REMOVED***new***REMOVED***Error("An***REMOVED***unknown***REMOVED***error***REMOVED***occurred");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setError(error);

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***if***REMOVED***(showErrorToast)***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***showToast(errorMessage***REMOVED***||***REMOVED***error.message,***REMOVED***"error");
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}

***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***onError?.(error);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***throw***REMOVED***error;
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}***REMOVED***finally***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(false);
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***}
***REMOVED******REMOVED******REMOVED******REMOVED***},
***REMOVED******REMOVED******REMOVED******REMOVED***[action,***REMOVED***onSuccess,***REMOVED***onError,***REMOVED***successMessage,***REMOVED***errorMessage,***REMOVED***showSuccessToast,***REMOVED***showErrorToast,***REMOVED***showToast]
***REMOVED******REMOVED***);

***REMOVED******REMOVED***const***REMOVED***reset***REMOVED***=***REMOVED***useCallback(()***REMOVED***=>***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***setIsLoading(false);
***REMOVED******REMOVED******REMOVED******REMOVED***setError(null);
***REMOVED******REMOVED******REMOVED******REMOVED***setData(null);
***REMOVED******REMOVED***},***REMOVED***[]);

***REMOVED******REMOVED***return***REMOVED***{
***REMOVED******REMOVED******REMOVED******REMOVED***execute,
***REMOVED******REMOVED******REMOVED******REMOVED***isLoading,
***REMOVED******REMOVED******REMOVED******REMOVED***error,
***REMOVED******REMOVED******REMOVED******REMOVED***data,
***REMOVED******REMOVED******REMOVED******REMOVED***reset,
***REMOVED******REMOVED***};
}
