import { query } from "express";
import { z } from "zod";

export const deleteFileSchema = z.object({
  query: z.object({
    url: z.string().min(1, {
      message: 'Url is required'
    })
  })
})