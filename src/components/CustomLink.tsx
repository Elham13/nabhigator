"use client";

import React, { useTransition } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { Loader } from "@mantine/core";

const CustomLink = ({
  href,
  children,
  replace,
  ...rest
}: Parameters<typeof NextLink>[0]) => {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  return (
    <NextLink
      legacyBehavior={false}
      href={href}
      onClick={(e) => {
        e.preventDefault();
        startTransition(() => {
          const url = href.toString();
          if (replace) {
            router.replace(url);
          } else {
            router.push(url);
          }
        });
      }}
      {...rest}
    >
      {isPending ? <Loader size="sm" type="dots" /> : children}
    </NextLink>
  );
};

export default CustomLink;
