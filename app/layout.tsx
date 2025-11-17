import***REMOVED***type***REMOVED***{***REMOVED***Metadata***REMOVED***}***REMOVED***from***REMOVED***"next";
import***REMOVED***{***REMOVED***Geist,***REMOVED***Geist_Mono***REMOVED***}***REMOVED***from***REMOVED***"next/font/google";
import***REMOVED***"./globals.css";

const***REMOVED***geistSans***REMOVED***=***REMOVED***Geist({
***REMOVED******REMOVED***variable:***REMOVED***"--font-geist-sans",
***REMOVED******REMOVED***subsets:***REMOVED***["latin"],
});

const***REMOVED***geistMono***REMOVED***=***REMOVED***Geist_Mono({
***REMOVED******REMOVED***variable:***REMOVED***"--font-geist-mono",
***REMOVED******REMOVED***subsets:***REMOVED***["latin"],
});

export***REMOVED***const***REMOVED***metadata:***REMOVED***Metadata***REMOVED***=***REMOVED***{
***REMOVED******REMOVED***title:***REMOVED***"Create***REMOVED***Next***REMOVED***App",
***REMOVED******REMOVED***description:***REMOVED***"Generated***REMOVED***by***REMOVED***create***REMOVED***next***REMOVED***app",
};

export***REMOVED***default***REMOVED***function***REMOVED***RootLayout({
***REMOVED******REMOVED***children,
}:***REMOVED***Readonly<{
***REMOVED******REMOVED***children:***REMOVED***React.ReactNode;
}>)***REMOVED***{
***REMOVED******REMOVED***return***REMOVED***(
***REMOVED******REMOVED******REMOVED******REMOVED***<html***REMOVED***lang="en">
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***<body
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***className={`${geistSans.variable}***REMOVED***${geistMono.variable}***REMOVED***antialiased`}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***>
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***{children}
***REMOVED******REMOVED******REMOVED******REMOVED******REMOVED******REMOVED***</body>
***REMOVED******REMOVED******REMOVED******REMOVED***</html>
***REMOVED******REMOVED***);
}
