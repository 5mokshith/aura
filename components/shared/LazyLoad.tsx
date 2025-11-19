"useclient";

import{useEffect,useRef,useState,ReactNode}from"react";

interfaceLazyLoadProps{
children:ReactNode;
placeholder?:ReactNode;
rootMargin?:string;
threshold?:number;
className?:string;
}

exportfunctionLazyLoad({
children,
placeholder=null,
rootMargin="100px",
threshold=0.01,
className,
}:LazyLoadProps){
const[isVisible,setIsVisible]=useState(false);
constref=useRef<HTMLDivElement>(null);

useEffect(()=>{
constelement=ref.current;
if(!element)return;

constobserver=newIntersectionObserver(
([entry])=>{
if(entry.isIntersecting){
setIsVisible(true);
observer.disconnect();
}
},
{
rootMargin,
threshold,
}
);

observer.observe(element);

return()=>{
observer.disconnect();
};
},[rootMargin,threshold]);

return(
<divref={ref}className={className}>
{isVisible?children:placeholder}
</div>
);
}
