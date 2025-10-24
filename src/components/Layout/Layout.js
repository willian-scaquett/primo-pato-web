"use client";

import React, { useEffect } from "react";
import { Box } from "@mui/material";
import { Header } from "./Header";
import { useRouter, usePathname } from "next/navigation";

function Layout({ children, showHeader = true, headerProps = {}, noPadding = false, noScroll = false }) {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== 'undefined' ? sessionStorage.getItem('auth_token') : null;
    const isPublic = pathname === '/login' || pathname === '/register';
    if (!token && !isPublic) {
      router.replace('/login');
    }
  }, [pathname, router]);

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('auth_token');
    }
    router.replace('/login');
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: (theme) => theme.palette.background.default,
        display: "flex",
        flexDirection: "column",
        overflow: noScroll ? "hidden" : "initial",
      }}
    >
      {showHeader && <Header {...headerProps} onLogout={handleLogout} />}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          padding: noPadding ? 0 : 3,
        }}
      >
        {children}
      </Box>
    </Box>
  );
}

export { Layout };
