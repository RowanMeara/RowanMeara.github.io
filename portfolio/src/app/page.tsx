import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      <h1 className="text-4xl font-bold text-primary-600 dark:text-primary-400">
        Welcome to My Portfolio
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-300">
        Coming soon...
      </p>
    </div>
  );
}
