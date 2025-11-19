"useclient";

import{useEffect}from"react";
import{useRouter}from"next/navigation";

exportdefaultfunctionHome(){
constrouter=useRouter();

useEffect(()=>{
router.replace("/dashboard");
},[router]);

return(
<divclassName="flexmin-h-screenitems-centerjustify-center">
<divclassName="text-center">
<divclassName="mb-4h-8w-8animate-spinrounded-fullborder-4border-gray-300border-t-blue-600mx-auto"></div>
<pclassName="text-gray-600">Redirecting...</p>
</div>
</div>
);
}
