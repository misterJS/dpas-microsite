import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";

type DocumentSheetProps = {
  open: boolean;
  title: string;
  description?: string;
  onOpenChange: (v: boolean) => void;
  children: React.ReactNode;
};

export function DocumentSheet({
  open,
  onOpenChange,
  title,
  description,
  children,
}: DocumentSheetProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="bottom" className="p-0 rounded-t-2xl">
        <div className="sticky top-0 z-10 bg-background">
          <div className="mx-auto mt-2 h-1.5 w-16 rounded-full bg-muted" />
          <div className="px-4 pb-3 pt-2">
            <SheetHeader className="text-left">
              <SheetTitle className="text-sm text-center font-semibold uppercase">{title}</SheetTitle>
              {description ? (
                <SheetDescription className="text-sm text-muted-foreground">
                  {description}
                </SheetDescription>
              ) : null}
            </SheetHeader>
          </div>
        </div>
        <div className="px-4 pb-6 overflow-y-auto max-h-[70vh]">{children}</div>
      </SheetContent>
    </Sheet>
  );
}
