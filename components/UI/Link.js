import NextLink from "next/link";
import { Fragment } from "react";
import { useSelector } from "react-redux";

export default function Link({children,isActive,className,...props}){
    const name = typeof(children) == "string" ? children.toLowerCase() : children;

    return <Fragment>
                <NextLink {...props} >
                    <span
                    className={`  hover:cursor-pointer
                        ${className||'hover:brigntness-150 text-gray-400'}
                        ${isActive?'text-yellow-500':''}
                    `}
                    >
                        {children}
                    </span>
                </NextLink>
        </Fragment>
}