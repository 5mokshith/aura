"use client";

import { useEffect, useState, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function CallbackContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleCallback = async () => {
      const code = searchParams.get("code");
      const errorParam = searchParams.get("error");

      if (errorParam) {
        setError(`Authentication failed: ${errorParam}`);
        setIsProcessing(false);
        return;
      }
if(errorParam){
setError(`Authenticationfailed:${errorParam}`);
setIsProcessing(false);
return;
}

if(!code){
setError("Noauthorizationcodereceived");
setIsProcessing(false);
return;
}

try{
constresponse=awaitfetch("/api/auth/callback",{
method:"POST",
headers:{
"Content-Type":"application/json",
},
body:JSON.stringify({code}),
});

if(!response.ok){
constdata=awaitresponse.json();
thrownewError(data.message||"Failedtoexchangetoken");
}

//Successfullyauthenticated,redirecttodashboard
router.push("/");
}catch(err){
console.error("Callbackerror:",err);
setError(errinstanceofError?err.message:"Authenticationfailed");
setIsProcessing(false);
}
};

handleCallback();
},[searchParams,router]);

if(error){
return(
<divclassName="flexmin-h-screenitems-centerjustify-centerbg-gray-50">
<divclassName="w-fullmax-w-mdspace-y-4rounded-lgbg-whitep-8shadow-lg">
<divclassName="text-center">
<divclassName="mx-automb-4flexh-12w-12items-centerjustify-centerrounded-fullbg-red-100">
<svg
className="h-6w-6text-red-600"
fill="none"
viewBox="002424"
stroke="currentColor"
>
<path
strokeLinecap="round"
strokeLinejoin="round"
strokeWidth={2}
d="M618L186M66l1212"
/>
</svg>
</div>
<h2className="text-xlfont-semiboldtext-gray-900">
AuthenticationFailed
</h2>
<pclassName="mt-2text-smtext-gray-600">{error}</p>
</div>
<button
onClick={()=>router.push("/login")}
className="w-fullrounded-lgbg-blue-600px-4py-2text-whitefont-mediumhover:bg-blue-700focus:outline-nonefocus:ring-2focus:ring-blue-500focus:ring-offset-2"
>
TryAgain
</button>
</div>
</div>
);
}

return(
<divclassName="flexmin-h-screenitems-centerjustify-centerbg-gray-50">
<divclassName="text-center">
<divclassName="mb-4h-12w-12animate-spinrounded-fullborder-4border-gray-300border-t-blue-600mx-auto"></div>
<h2className="text-xlfont-semiboldtext-gray-900">
{isProcessing?"Completingauthentication...":"Redirecting..."}
</h2>
<pclassName="mt-2text-smtext-gray-600">Pleasewait</p>
</div>
</div>
);
}

exportdefaultfunctionCallbackPage(){
return(
<Suspense
fallback={
<divclassName="flexmin-h-screenitems-centerjustify-centerbg-gray-50">
<divclassName="text-center">
<divclassName="mb-4h-12w-12animate-spinrounded-fullborder-4border-gray-300border-t-blue-600mx-auto"></div>
<h2className="text-xlfont-semiboldtext-gray-900">Loading...</h2>
<pclassName="mt-2text-smtext-gray-600">Pleasewait</p>
</div>
</div>
}
>
<CallbackContent/>
</Suspense>
);
}
