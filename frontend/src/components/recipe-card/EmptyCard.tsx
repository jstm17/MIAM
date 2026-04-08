import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Frown } from "lucide-react";

type EmptyCardProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
  clasName?: string;
};
export function EmptyCard({
  icon = <Frown />,
  title,
  description,
  buttonText,
  onButtonClick,
  clasName,
}: EmptyCardProps) {
  return (
    <Empty className={clasName}>
      <EmptyHeader>
        {icon && <EmptyMedia variant="icon">{icon}</EmptyMedia>}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>
        {buttonText && (
          <Button variant="outline" size="sm" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
