import "client-only";
import { ClassBookRepository } from "@/features/classbook/repositories/class-book.repository";
import { ClassBookService } from "@/features/classbook/service/class-book.service";
import { baseUrl } from "@/shared/config/api.client";

export const classBookService = new ClassBookService(
  new ClassBookRepository(baseUrl),
);
