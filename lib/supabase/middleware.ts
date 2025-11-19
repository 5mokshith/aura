import{createServerClient}from"@supabase/ssr";
import{NextResponse,type NextRequest}from"next/server";

export async function updateSession(request:NextRequest){
let supabaseResponse = NextResponse.next({
request,
});

const supabase = createServerClient(
process.env.NEXT_PUBLIC_SUPABASE_URL!,
process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
{
cookies:{
getAll(){
return request.cookies.getAll();
},
setAll(cookiesToSet){
cookiesToSet.forEach(({name,value,options})=>
request.cookies.set(name,value)
);
supabaseResponse=NextResponse.next({
request,
});
cookiesToSet.forEach(({name,value,options})=>
supabaseResponse.cookies.set(name,value,options)
);
},
},
}
);

//IMPORTANT:AvoidwritinganylogicbetweencreateServerClientand
//supabase.auth.getUser().Asimplemistakecouldmakeitveryhardtodebug
//issueswithusersbeingrandomlyloggedout.

const{
data:{user},
}= await supabase.auth.getUser();

//Protectedroutes
const protectedPaths=["/dashboard","/settings","/workflow"];
const isProtectedPath=protectedPaths.some((path)=>
request.nextUrl.pathname.startsWith(path)
);

if(isProtectedPath&&!user){
//Redirecttologinifaccessingprotectedroutewithoutauthentication
const url=request.nextUrl.clone();
url.pathname="/login";
return NextResponse.redirect(url);
}

if(request.nextUrl.pathname==="/login"&&user){
//Redirecttodashboardifalreadyauthenticated
const url=request.nextUrl.clone();
url.pathname="/dashboard";
return NextResponse.redirect(url);
}

//IMPORTANT:You*must*returnthesupabaseResponseobjectasitis.Ifyou're
//creatinganewresponseobjectwithNextResponse.next()makesureto:
//1.Passtherequestinit,likeso:
//constmyNewResponse=NextResponse.next({request})
//2.Copyoverthecookies,likeso:
//myNewResponse.cookies.setAll(supabaseResponse.cookies.getAll())
//3.ChangethemyNewResponseobjecttofityourneeds,butavoidchanging
//thecookies!
//4.Finally:
//returnmyNewResponse
//Ifthisisnotdone,youmaybecausingthebrowserandservertogoout
//ofsyncandterminatetheuser'ssessionprematurely!

return supabaseResponse;
}
