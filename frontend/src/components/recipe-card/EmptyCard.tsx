import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

type EmptyCardProps = {
  icon?: React.ReactNode;
  title?: string;
  description?: string;
  buttonText?: string;
  onButtonClick?: () => void;
};
export function EmptyCard({
  icon,
  title,
  description,
  buttonText,
  onButtonClick,
}: EmptyCardProps) {
  return (
    <Empty>
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
