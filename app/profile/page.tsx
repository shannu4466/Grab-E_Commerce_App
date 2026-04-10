import ProfileClient from "./ProfileClient";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Profile"
}

export default function Cart() {
    return (
        <>
            <ProfileClient />
        </>
    )
}