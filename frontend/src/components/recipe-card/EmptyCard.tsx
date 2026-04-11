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
  className?: string;
  iconClassName?: string;
};
export function EmptyCard({
  icon = <Frown />,
  title,
  description,
  buttonText,
  onButtonClick,
  className = "",
  iconClassName = "",
}: EmptyCardProps) {
  return (
    <Empty className={className}>
      <EmptyHeader>
        {icon && (
          <EmptyMedia variant="icon" className={iconClassName}>
            {icon}
          </EmptyMedia>
        )}
        {title && <EmptyTitle>{title}</EmptyTitle>}
        {description && <EmptyDescription>{description}</EmptyDescription>}
      </EmptyHeader>
      <EmptyContent>
        {buttonText && (
          <Button variant="outline" size="lg" onClick={onButtonClick}>
            {buttonText}
          </Button>
        )}
      </EmptyContent>
    </Empty>
  );
}
