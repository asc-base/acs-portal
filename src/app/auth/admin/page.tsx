"use client";
import React from "react";
import IMAGE from "../../../../public/ImageLoginAdmin.svg";
import Image from "next/image";
import { Button, TextField } from "@mui/material";
import { AuthAdmin } from "@/core/viewmodels/auth";
import { useForm, SubmitHandler } from "react-hook-form";

const AuthAdminPage = () => {
  type FormData = {
    email: string;
    password: string;
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const onSubmit: SubmitHandler<FormData> = async (data) => {
    const result = await AuthAdmin(data);
    if (!result) {
      console.error("Login failed");
    }
    console.log("Login successful", result);
  };

  return (
    <div className="min-h-screen">
      <div className="grid h-screen grid-cols-1 md:grid-cols-2">
        <div className="flex h-full justify-center">
          <Image src={IMAGE} alt="Login Image" />
        </div>
        <div className="flex h-full">
          <div className="container mx-auto flex w-full flex-col items-center justify-center gap-y-4 px-10">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="flex w-full flex-col gap-y-4"
            >
              <TextField
                required
                fullWidth
                label="อีเมล์"
                {...register("email", { required: true })}
                error={!!errors.email}
                helperText={errors.email ? "อีเมล์จำเป็นต้องกรอก" : ""}
                placeholder="อีเมล์"
                // type="email"
                size="medium"
                InputProps={{
                  style: {
                    borderColor: "var(--color-primary02)",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "var(--color-primary02)",
                  },
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                  },
                  "& label": {
                    color: "var(--color-primary02)",
                  },
                }}
              />
              <TextField
                required
                fullWidth
                label="รหัสผ่าน"
                placeholder="รหัสผ่าน"
                type="password"
                size="medium"
                {...register("password", { required: true })}
                error={!!errors.password}
                helperText={errors.password ? "รหัสผ่านจำเป็นต้องกรอก" : ""}
                InputProps={{
                  style: {
                    borderColor: "var(--color-primary02)",
                  },
                }}
                InputLabelProps={{
                  style: {
                    color: "var(--color-primary02)",
                  },
                  shrink: true,
                }}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    "& fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                    "&:hover fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                    "&.Mui-focused fieldset": {
                      borderColor: "var(--color-primary02)",
                    },
                  },
                  "& label": {
                    color: "var(--color-primary02)",
                  },
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{
                  backgroundColor: "var(--color-primary02)",
                  "&:hover": {
                    backgroundColor: "var(--color-primary03)",
                  },
                }}
              >
                เข้าสู่ระบบ
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthAdminPage;
