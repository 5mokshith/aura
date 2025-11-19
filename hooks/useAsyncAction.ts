"useclient";

import{useState,useCallback}from"react";
import{useToast}from"@/components/shared/Toast";

interfaceUseAsyncActionOptions<T>{
onSuccess?:(data:T)=>void;
onError?:(error:Error)=>void;
successMessage?:string;
errorMessage?:string;
showSuccessToast?:boolean;
showErrorToast?:boolean;
}

exportfunctionuseAsyncAction<T=void,Argsextendsany[]=[]>(
action:(...args:Args)=>Promise<T>,
options:UseAsyncActionOptions<T>={}
){
const[isLoading,setIsLoading]=useState(false);
const[error,setError]=useState<Error|null>(null);
const[data,setData]=useState<T|null>(null);
const{showToast}=useToast();

const{
onSuccess,
onError,
successMessage,
errorMessage,
showSuccessToast=true,
showErrorToast=true,
}=options;

constexecute=useCallback(
async(...args:Args)=>{
setIsLoading(true);
setError(null);

try{
constresult=awaitaction(...args);
setData(result);

if(showSuccessToast&&successMessage){
showToast(successMessage,"success");
}

onSuccess?.(result);
returnresult;
}catch(err){
consterror=errinstanceofError?err:newError("Anunknownerroroccurred");
setError(error);

if(showErrorToast){
showToast(errorMessage||error.message,"error");
}

onError?.(error);
throwerror;
}finally{
setIsLoading(false);
}
},
[action,onSuccess,onError,successMessage,errorMessage,showSuccessToast,showErrorToast,showToast]
);

constreset=useCallback(()=>{
setIsLoading(false);
setError(null);
setData(null);
},[]);

return{
execute,
isLoading,
error,
data,
reset,
};
}
