import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center items-center h-screen bg-black text-white">
      <SignUp />
    </div>
  );
}
