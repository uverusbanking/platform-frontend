import { Alert, AlertDescription, AlertTitle } from "./ui/alert";
import { responseInterface } from "@/lib/resources";
import { AlertCircleIcon, CheckCircle2Icon } from "lucide-react";

interface _Props {
  // setResponse: (response: responseInterface) => void,
  response: responseInterface;
}

const DisplayRespondsMessage: React.FC<_Props> = ({
  response, // setResponse
}) => {
  return (
    <>
      {response.display && (
        <Alert
          variant={response.status ? "default" : "destructive"}
          className="my-4"
        >
          {response.status ? <CheckCircle2Icon /> : <AlertCircleIcon />}

          <AlertTitle>{response.message}</AlertTitle>

          {response.errorMsg && response.errorMsg.length ? (
            <AlertDescription>
              {/* <p>Please verify your billing information and try again.</p> */}
              <ul className="list-inside list-disc text-sm">
                {response.errorMsg?.map((error, index) => (
                  <li key={index}>{error}</li>
                ))}
              </ul>
            </AlertDescription>
          ) : (
            <></>
          )}
        </Alert>
      )}
    </>
  );
};

export default DisplayRespondsMessage;
