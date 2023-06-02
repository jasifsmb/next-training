import LatestPosts from "./components/latest-posts";
import prisma from "./lib/prisma";
import { Post } from "./types";

export default async function Home() {
  const posts = await prisma.post.findMany({
    include: {
      user: {
        select: {
          email: true,
          name: true,
        },
      },
    },
    orderBy: {
      title: "desc",
    },
  });

  return (
    <main className="p-5">
      <h1 className="text-5xl ">Latest Posts</h1>
      <LatestPosts posts={posts.slice(0, 10)} />
    </main>
  );
}
