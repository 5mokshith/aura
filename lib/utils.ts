import{typeClassValue,clsx}from"clsx";
import{twMerge}from"tailwind-merge";

exportfunctioncn(...inputs:ClassValue[]){
returntwMerge(clsx(inputs));
}
