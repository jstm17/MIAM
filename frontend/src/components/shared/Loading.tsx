import { Spinner } from "../ui/spinner";
import { Layout } from "./Layout";

export const Loading = () => {
  return (
    <Layout className="items-center justify-center p-4">
      <Spinner className="size-8" />
    </Layout>
  );
};
