"use client";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";

export default function LoginCard() {
  return (
    <Card className="border-none shadow-xl w-full">
      <CardHeader className="pb-4">
        <h2 className="text-center text-2xl font-semibold">Welcome Back</h2>
        <p className="text-center text-sm text-gray-500">
          Please enter your details
        </p>
      </CardHeader>

      <CardContent className="space-y-6">
        <Tabs defaultValue="customer" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="customer">Customer</TabsTrigger>
            <TabsTrigger value="staff">Staff</TabsTrigger>
          </TabsList>

          <TabsContent value="customer" className="pt-4">
            <LoginForm />
          </TabsContent>

          <TabsContent value="staff" className="pt-4">
            <LoginForm isStaff={true} />
          </TabsContent>
        </Tabs>

        <Separator className="my-4" />

        <Button variant="outline" className="w-full">
          Sign in with Google
        </Button>
      </CardContent>

      <CardFooter className="flex flex-col items-center space-y-2 pt-0">
        <button className="text-sm text-blue-600 hover:underline">
          Don&apos;t have an account?
        </button>
      </CardFooter>
    </Card>
  );
}

function LoginForm({ isStaff = false }: { isStaff?: boolean }) {
  return (
    <div className="space-y-4">
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">
          Email address
        </label>
        <Input type="email" placeholder="Enter your email" />
      </div>
      <div className="space-y-1">
        <label className="text-sm font-medium text-gray-700">Password</label>
        <Input type="password" placeholder="Enter your password" />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Checkbox id="remember" />
          <label
            htmlFor="remember"
            className="text-sm font-medium text-gray-700"
          >
            Remember for 30 days
          </label>
        </div>
        <button className="text-sm text-blue-600 hover:underline">
          Forgot password?
        </button>
      </div>
      <Button variant="outline" className="w-full">
        Sign in as {isStaff ? "Staff" : "Customer"}
      </Button>
    </div>
  );
}
