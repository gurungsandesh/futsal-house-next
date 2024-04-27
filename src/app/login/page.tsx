"use client";

import logo from "@/assets/Logo.png";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import Image from "next/image";
import { useForm } from "react-hook-form";
import { z } from "zod";
import useAuth from "@/components/AuthProvider";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

const loginschema: any = z.object({
  email: z.string().nonempty().email({ message: "Invalid email" }),
  password: z.string().nonempty({ message: "Password is requried" }),
});

export default function LoginPage() {
  const { login, loading, user } = useAuth();
  const router = useRouter();

  const loginform = useForm<z.infer<typeof loginschema>>({
    resolver: zodResolver(loginschema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof loginschema>) {
    await login(values.email, values.password);
  }

  useEffect(() => {
    if (!loading && user) {
      router.push("/dashboard");
    }
  }, [loading, router, user]);

  return (
    <div className="p-5 flex flex-col gap-5 h-screen">
      <div className=" grid place-items-center">
        <Image src={logo} alt="Logo"></Image>
      </div>

      <Form {...loginform}>
        <form onSubmit={loginform.handleSubmit(onSubmit)} method="POST">
          <div className="flex flex-col gap-5 ">
            <FormField
              control={loginform.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="email" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={loginform.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" placeholder="password" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full">
              Login
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
