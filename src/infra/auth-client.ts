"use client";

import { AuthService } from "@/core/service/auth.service";
import { AuthRepository } from "@/infra/repositories/auth.repository";

export const publicAuthService = new AuthService(new AuthRepository("/api"));

export const clientAuthService = new AuthService(
  new AuthRepository("/api/bff"),
);
