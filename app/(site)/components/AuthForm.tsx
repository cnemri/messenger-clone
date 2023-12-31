"use client";

import Input from "@/app/components/inputs/Input";
import React from "react";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { BsGithub, BsGoogle } from "react-icons/bs";
import axios from "axios";
import Button from "../../components/Button";
import AuthSocialButton from "./AuthSocialButton";
import toast from "react-hot-toast";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

type Props = {};
type variant = "LOGIN" | "REGISTER";

const AuthForm = (props: Props) => {
  const session = useSession();
  const router = useRouter();
  const [variant, setVariant] = React.useState<variant>("LOGIN");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (session?.status === "authenticated") {
      router.push("/users");
    }
  }, [session, router]);

  const toggleVariant = React.useCallback(() => {
    if (variant === "LOGIN") {
      setVariant("REGISTER");
    } else {
      setVariant("LOGIN");
    }
  }, [variant]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FieldValues>({
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FieldValues> = async (data) => {
    setIsLoading(true);
    if (variant === "REGISTER") {
      // Axios register /api/register
      await axios
        .post("/api/register", data)
        .then(() => {
          signIn("credentials", data);
          toast.success("Registered successfully.");
        })
        .catch(() => {
          toast.error("Failed to register. Try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }

    if (variant === "LOGIN") {
      // NextAuth SignIn
      await signIn("credentials", {
        ...data,
        redirect: false,
      })
        .then((callback) => {
          if (callback?.error) {
            toast.error("Failed to login. Try again later.");
          }
          if (callback?.ok) {
            toast.success("Logged in successfully.");
            router.push("/users");
          }
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  };

  const socialAction = async (action: string) => {
    setIsLoading(true);
    // NextAuth social signin
    signIn(action, {
      redirect: false,
    })
      .then((callback) => {
        if (callback?.error) {
          toast.error("Failed to login. Try again later.");
        }
        if (callback?.ok) {
          toast.success("Logged in successfully.");
        }
      })
      .finally(() => {
        setIsLoading(false);
      });
  };
  return (
    <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
      <div className="bg-white px-4 py-8 shadow sm:rounded-lg sm:px-10">
        <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
          {variant === "REGISTER" && (
            <Input
              label="Name"
              register={register}
              id="name"
              errors={errors}
              disabled={isLoading}
            />
          )}
          <Input
            label="Email"
            register={register}
            id="email"
            errors={errors}
            disabled={isLoading}
          />
          <Input
            label="Password"
            register={register}
            id="password"
            errors={errors}
            type="password"
            disabled={isLoading}
          />
          <div>
            <Button disabled={isLoading} fullWidth type="submit">
              {variant === "LOGIN" ? "Sign in" : "Register"}
            </Button>
          </div>
        </form>
        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="bg-white px-2 text-gray-500">
                Or continue with
              </span>
            </div>
          </div>
          <div className="mt-6 flex gap-2">
            <AuthSocialButton
              icon={BsGithub}
              onClick={() => socialAction("github")}
            />
            <AuthSocialButton
              icon={BsGoogle}
              onClick={() => socialAction("google")}
            />
          </div>
        </div>
        <div className="flex gap-1 justify-center text-sm mt-6 px-2 text-gray-500">
          <div>
            {variant === "LOGIN"
              ? "New to Messenger?"
              : "Already have an account?"}
          </div>
          <div onClick={toggleVariant} className="underline cursor-pointer">
            {variant === "LOGIN" ? "Create an account" : "Sign in"}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
