import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { MasterDataRepository } from "./repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";
import { API_URL } from "@/config/config";

export const baseUrl = String(API_URL);

const newsRepository = new NewsRepository(baseUrl);
export const newsService = new NewsService(newsRepository);

const masterDataRepository = new MasterDataRepository(baseUrl);
export const masterDataService = new MasterDataService(masterDataRepository);

const authRepository = new AuthRepository(baseUrl);
export const authService = new AuthService(authRepository);
