import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";
import axios, { AxiosError } from "axios";
import { BASE_URL } from "@/lib/constants";
import { useAppDispatch } from "@/app/hooks";
import { setAuth } from "@/features/authSlice/authSlice";

const formSchema = z.object({
  email: z.string(),
  password: z.string(),
});

export interface LogInError {
  message: string;
}

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  async function onSubmit(data: z.infer<typeof formSchema>) {
    try {
      const res = await axios.post(BASE_URL + "API/Login/Check", {
        username: data.email,
        password: data.password,
      });
      if (res.status === 200) {
        localStorage.setItem("token", res.data.accessToken);
        dispatch(
          setAuth({
            username: data.email,
            role: `${res.data.authority}`,
            roleId: `${res.data.authority_id}`,
          })
        );

        navigate("/");
        toast.success("Login Successfully");
      }
    } catch (error) {
      const axiosError = error as AxiosError<LogInError | string>;
      if (axiosError.response?.data == "Username Not Found") {
        form.setError("email", {
          message: "User not found",
          type: "validate",
        });
        form.setFocus("email");
      } else if (axiosError.response?.data == "Account is Locked") {
        form.setError("email", {
          message: "Account locked",
          type: "validate",
        });
        form.setFocus("email");
      } else if (axiosError.response?.data == "Password is Invalid") {
        form.setError("password", {
          message: "Incorrect Password",
          type: "validate",
        });
        form.setFocus("password");
      } else {
        toast.error("Uh oh! Something went wrong.");
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <Card className="w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl relative border-0">
        <div className="grid lg:grid-cols-2 min-h-[500px]">
          {/* Left side - Form */}
          <div className="p-12 flex flex-col ">
            {/* Logo */}
            <div className="mb-12 items-start">
              <img src="/oka.png" alt="l&k" className="h-12 w-auto " />
            </div>

            {/* Form */}
            <div className="space-y-8 items-center">
              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(onSubmit)}
                  className="space-y-6"
                >
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-base">
                          Email
                        </FormLabel>
                        <FormControl>
                          <Input
                            type="text"
                            placeholder="Enter your email"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-700 font-semibold text-base">
                          Password
                        </FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input
                              type={showPassword ? "text" : "password"}
                              placeholder="Enter your password"
                              {...field}
                            />
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="absolute right-2 top-1/2 -translate-y-1/2 h-10 w-10 hover:bg-gray-100/50 rounded-lg"
                              onClick={() => setShowPassword(!showPassword)}
                            >
                              {showPassword ? (
                                <EyeOff className="h-5 w-5 text-gray-500" />
                              ) : (
                                <Eye className="h-5 w-5 text-gray-500" />
                              )}
                            </Button>
                          </div>
                        </FormControl>
                        <FormMessage className="text-red-500" />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    disabled={form.formState.isSubmitting}
                    className="w-full bg-[#066dc4] hover:bg-[#0557a0]"
                  >
                    {form.formState.isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                        Login...
                      </>
                    ) : (
                      "Login"
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

          {/* Right side - Image with overlays */}
          <div className="relative overflow-hidden p-3">
            <img
              src="https://www.owlguru.com/wp-content/uploads/wpallimport/files/electrical-engineers/__(1).jpg"
              alt="Login Background"
              className="w-full h-full object-cover mr-4 rounded-3xl shadow-lg"
            />

            {/* Floating UI elements */}
            <div className="absolute top-8 left-8">
              <div className="bg-white rounded-xl p-4 shadow-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 bg-[#066dc4] rounded-full animate-pulse"></div>
                  <span className="text-sm font-medium text-gray-800">
                    24/7 Support
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
