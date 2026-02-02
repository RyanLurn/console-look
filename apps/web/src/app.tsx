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

    const unmountController = new AbortController();

    async function consumeStream() {
      setIsStreaming(true);
      setChunks([]);

      try {
        const response = await fetch("http://localhost:3000/consume", {
          signal: unmountController.signal,
        });

        if (!response.ok) {
          throw new Error(`[${response.status}] ${response.statusText}`);
        }

        if (response.body) {
          const reader = response.body.getReader();
          const decoder = new TextDecoder();

          while (true) {
            const { value, done } = await reader.read();
            if (done) {
              break;
            }

            const chunk = decoder.decode(value, { stream: true });
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
        setIsStreaming(false);
      }
    }

    consumeStream();

    return () => unmountController.abort();
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
