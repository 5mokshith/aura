"useclient";

/**
*SkipLinkcomponentprovidesakeyboard-accessiblewaytoskiptomaincontent
*Requirement9.1:Supportkeyboardnavigationforallinteractiveelements
*/
exportfunctionSkipLink(){
return(
<a
href="#main-content"
className="sr-onlyfocus:not-sr-onlyfocus:absolutefocus:top-4focus:left-4focus:z-50focus:px-4focus:py-2focus:bg-primaryfocus:text-primary-foregroundfocus:rounded-mdfocus:outline-nonefocus:ring-2focus:ring-ringfocus:ring-offset-2"
>
Skiptomaincontent
</a>
);
}
