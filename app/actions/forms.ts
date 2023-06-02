"use server";

import { redirect } from "next/navigation";
import { Post } from "../types";
import prisma from "../lib/prisma";
import { hash } from "bcrypt";

export async function submit(formData: FormData) {
  const post = await prisma.post.create({
    data: {
      userId: 1,
      title: formData.get("title")!.valueOf() as string,
      body: formData.get("body")!.valueOf() as string,
    },
  });

  // throw new Error("Testing...");
  redirect(`/${post.id}`);
}

export async function register(formData: FormData) {
  const hashed = await hash(formData.get("password")!.valueOf() as string, 12);

  const user = await prisma.user.create({
    data: {
      email: formData.get("email")!.valueOf() as string,
      name: formData.get("name")!.valueOf() as string,
      password: hashed,
      isAdmin: false,
    },
  });

  redirect("/api/auth/signin");
}
