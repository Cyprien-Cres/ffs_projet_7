"use client"

import HeaderDesktop from "./headerDesktop";
import HeaderMobile from "./headerMobile";

type HeaderProps = {
    name: string;
}

export default function Header({ name }: HeaderProps) {
    return (
        <>
            <HeaderDesktop name={name} />
            <HeaderMobile name={name} />
        </>
    );
}