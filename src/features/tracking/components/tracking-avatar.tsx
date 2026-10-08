import * as React from "react";
export function Avatar({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <span className={"relative inline-flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-muted " + className}>{children}</span>;
}
export function AvatarImage({src,className=""}:{src?:string|null;className?:string}) {
  return src?<img src={src} alt="" className={"absolute inset-0 z-10 h-full w-full object-cover "+className} onError={event=>{event.currentTarget.style.display="none";}}/>:null;
}
export function AvatarFallback({children,className=""}:{children:React.ReactNode;className?:string}) {
  return <span className={"absolute inset-0 flex items-center justify-center rounded-full text-xs font-semibold "+className}>{children}</span>;
}
