import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Reply, XCircle } from "lucide-react";
import { type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Layout } from "../components/shared/Layout";

type NotFoundPageProps = {
  children?: ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  buttonLink?: string | -1;
};
export const NotFoundPage = ({
  title,
  description,
  buttonText,
  buttonLink,
}: NotFoundPageProps) => {
  const navigate = useNavigate();
  return (
    <Layout className="p-4" header>
      <Empty>
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <XCircle />
          </EmptyMedia>
          <EmptyTitle>{title || "Page non trouvée"}</EmptyTitle>
          <EmptyDescription>
            {description ||
              "Désolé, la page que vous recherchez n'existe pas ou a été déplacée."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <Button
            variant="outline"
            type="button"
            onClick={() => {
              if (buttonLink === -1) {
                navigate(-1);
              } else {
                navigate(buttonLink || "/");
              }
            }}
          >
            <Reply />
            {buttonText || "Retour à l'accueil"}
          </Button>
        </EmptyContent>
      </Empty>
    </Layout>
  );
};
