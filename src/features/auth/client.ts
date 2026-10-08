"use client";

import "client-only";
import { AuthService } from "@/features/auth/service/auth.service";
import { AuthRepository } from "@/features/auth/repositories/auth.repository";
import { baseUrl } from "@/shared/config/api.client";

export const clientAuthService = new AuthService(new AuthRepository(baseUrl));
