import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const AuthLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md">
        <Card className="w-full">
          <CardHeader className="flex flex-col items-center space-y-1">
            <CardTitle className="text-center text-2xl">
              Expenses Tracker
            </CardTitle>
            <CardDescription className="text-center">
              Sign in to manage your projects and receipts
            </CardDescription>
          </CardHeader>
          {children}
          <CardFooter className="text-muted-foreground flex flex-col items-center justify-center text-xs"></CardFooter>
        </Card>
      </div>
    </div>
  );
};
