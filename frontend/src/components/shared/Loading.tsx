import { Spinner } from "../ui/spinner";
import { Layout } from "./Layout";

export const Loading = ({ className }: { className?: string }) => {
  return (
    <Layout className={`items-center justify-center p-4 ${className}`}>
      <Spinner className="size-8" />
    </Layout>
  );
};
