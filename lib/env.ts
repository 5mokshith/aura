//Type-safeenvironmentvariables
exportconstenv={
//Publicvariables(accessibleinbrowser)
apiUrl:process.env.NEXT_PUBLIC_API_URL||"http://localhost:3000/api",
googleClientIdPublic:process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID||"",

//Server-onlyvariables
googleClientId:process.env.GOOGLE_CLIENT_ID||"",
googleClientSecret:process.env.GOOGLE_CLIENT_SECRET||"",
nextAuthUrl:process.env.NEXTAUTH_URL||"http://localhost:3000",
nextAuthSecret:process.env.NEXTAUTH_SECRET||"",
bffApiUrl:process.env.BFF_API_URL||"http://localhost:8000",
}asconst;

//Validaterequiredenvironmentvariablesonserver
if(typeofwindow==="undefined"){
constrequiredEnvVars=["NEXTAUTH_SECRET"]asconst;

for(constenvVarofrequiredEnvVars){
if(!process.env[envVar]){
console.warn(`Warning:${envVar}environmentvariableisnotset`);
}
}
}
