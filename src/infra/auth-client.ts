"use client";

import { AuthService } from "@/core/service/auth.service";
import { AuthRepository } from "@/infra/repositories/auth.repository";

export const clientAuthService = new AuthService(
  new AuthRepository("/api/bff"),
);
