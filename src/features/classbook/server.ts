import "server-only";
import { ClassBookRepository } from "@/features/classbook/repositories/class-book.repository";
import { ClassBookService } from "@/features/classbook/service/class-book.service";
import { createServerHttp } from "@/shared/lib/http.server";

export async function createClassBookServerService() {
  const { baseUrl, http } = await createServerHttp();
  return new ClassBookService(new ClassBookRepository(baseUrl, http));
}
