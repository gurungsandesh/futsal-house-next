"use client"

import logo from "@/assets/Logo.png"
import { Button } from '@/components/ui/button'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from '@/components/ui/input'
import { zodResolver } from "@hookform/resolvers/zod"
import Image from 'next/image'
import { useForm } from "react-hook-form"
import { z } from "zod"

const loginschema = z.object({
  username: z.string().nonempty({ message: 'Username is requried' }),
  password: z.string().nonempty({ message: 'Password is requried' }),
})

export default function LoginPage() {


  const loginform = useForm<z.infer<typeof loginschema>>({
    resolver: zodResolver(loginschema),
    defaultValues: {
      username: "",
      password: ""
    }
  })

  function onSubmit(values: z.infer<typeof loginschema>) {
    console.log("form values", values)
  }

  return (

    <div className="p-5 flex flex-col gap-5 h-screen" >
      <div className=" grid place-items-center">
        <Image src={logo} alt="Logo"></Image>
      </div>

      <Form {...loginform}>
        <form onSubmit={loginform.handleSubmit(onSubmit)}>
          <div className="flex flex-col gap-5 ">
            <FormField
              control={loginform.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="username" {...field} />
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
                    <Input placeholder="password" {...field} />
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

    </div >
  )
}
