import { useEffect, useRef, useState } from "react";

export function App() {
  const [chunks, setChunks] = useState<string[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const started = useRef(false);

  useEffect(() => {
    if (started.current) {
      return;
    }
    started.current = true;

    async function consumeStream() {
      console.log("Start consuming stream");
      setIsStreaming(true);
      setChunks([]);

      try {
        console.log("Fetching stream");
        const response = await fetch("/api/consume");

        if (response.body) {
          console.log("Response body is a ReadableStream");
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
            console.log("received:", chunk.trim());
            setChunks((prev) => [...prev, chunk]);
          }
        }
      } catch (error) {
        if (error instanceof Error) {
          if (error.name !== "AbortError") {
            console.error(error);
            setErrorMessage(error.message);
          }
        } else {
          console.error(error);
          setErrorMessage("An unknown error occurred");
        }
      } finally {
        console.log("End consuming stream");
        setIsStreaming(false);
      }
    }

    consumeStream();

    return () => {
      console.log("Unmounting");
    };
  }, []);

  const containerClassName = "flex h-dvh flex-col items-center gap-4 mt-4";

  if (errorMessage) {
    return (
      <div className={containerClassName}>
        <p className="text-destructive">{errorMessage}</p>
      </div>
    );
  }

  return (
    <div className={containerClassName}>
      <h1 className="text-2xl font-bold">Console Look</h1>
      {chunks.map((chunk, index) => (
        <p key={index}>{chunk}</p>
      ))}
      {isStreaming && <p>...</p>}
    </div>
  );
}
