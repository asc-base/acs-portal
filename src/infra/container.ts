import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { MasterDataRepository } from "./repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";
import { API_URL } from "@/config/config";
import { AuthRepository } from "./repositories/auth.repository";
import { AuthService } from "@/core/service/auth.service";

export const baseUrl = `${API_URL}/api`;

const newsRepository = new NewsRepository(baseUrl);
export const newsService = new NewsService(newsRepository);

const authRepository = new AuthRepository(baseUrl);
export const authService = new AuthService(authRepository);

const masterDataRepository = new MasterDataRepository(baseUrl);
export const masterDataService = new MasterDataService(masterDataRepository);
