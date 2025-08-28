import { NewsRepository } from "./repositories/news.repository";
import { NewsService } from "@/core/service/news.service";
import { MasterDataRepository } from "./repositories/master-data.repository";
import { MasterDataService } from "@/core/service/master-data.service";

export const baseUrl = "http://localhost:8000/api";

const newsRepository = new NewsRepository(baseUrl);
export const newsService = new NewsService(newsRepository);

const masterDataRepository = new MasterDataRepository(baseUrl);
export const masterDataService = new MasterDataService(masterDataRepository);
