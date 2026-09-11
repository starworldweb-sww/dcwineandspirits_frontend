
"use server";

import { blogService } from "../api/services/blogService";

export async function getPostsAction(page = 1, limit = 10) {
  const data = await blogService.getAllPosts({ page, limit });
  return data;
}