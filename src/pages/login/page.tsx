import LoginCard from "@/components/login/login-card";
import Image from "next/image";

export default function LoginPage() {
  return (
    <div className="flex min-h-screen min-w-full items-center justify-center p-0">
      <div className="grid w-full h-screen max-w-none grid-cols-1 gap-0 md:grid-cols-2">
        <div className="hidden md:flex items-center justify-center h-screen w-full bg-gray-800">
          <div className="relative h-full w-full overflow-hidden">
            <Image
              src="/p.jpg"
              alt="Login Illustration"
              fill
              className="object-cover opacity-90"
              priority
              quality={100}
            />
          </div>
        </div>

        <div className="flex items-center justify-center h-screen w-full bg-teal-100">
          <div className="w-full max-w-lg px-8">
            <div className="scale-140 transform origin-center bg-blue-100">
              <LoginCard />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
