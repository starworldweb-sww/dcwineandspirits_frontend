
"use server";

import { blogService } from "../api/services/blogService";

export async function getPostsAction(page = 1, limit = 12) {
  const data = await blogService.getAllPosts({ page, limit });
  return data;
}