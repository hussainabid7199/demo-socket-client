import { signOut } from 'next-auth/react';
import React from 'react'
import { Button } from '../ui/button';

const Logout = () => {
    async function logout() {
        if (typeof window != "undefined") {
            localStorage.removeItem('at');
            localStorage.removeItem("guid");
            localStorage.removeItem("email");
            localStorage.removeItem('fullName');
        }
        await signOut({ callbackUrl: "/" })
    }
    return (
        <>
            <Button onClick={logout}>Logout</Button>
        </>
    )
}

export default Logout;