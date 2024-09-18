"use client";

import { validateName } from "@/utils";
import { useEffect, useRef } from "react";
import { Socket } from "socket.io-client";

export default function New({
  socket,
  type,
  stopEditing,
  addNew,
}: {
  socket: Socket;
  type: "file" | "folder";
  stopEditing: () => void;
  addNew: (name: string, type: "file" | "folder") => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);

  function createNew() {
    const name = inputRef.current?.value;

    if (name) {
      const valid = validateName(name, "", type);
      if (valid.status) {
        if (type === "file") {
          socket.emit(
            "createFile",
            name,
            ({ success }: { success: boolean }) => {
              if (success) {
                addNew(name, type);
              }
            }
          );
        } else {
          socket.emit("createFolder", name, () => {
            addNew(name, type);
          });
        }
      }
    }
    stopEditing();
  }

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="w-full flex items-center h-7 px-1 hover:bg-secondary rounded-sm cursor-pointer transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring">
      <img
        src={
          type === "file"
            ? "/icons/default_file.svg"
            : "/icons/default_folder.svg"
        }
        alt="File Icon"
        width={18}
        height={18}
        className="mr-2"
      />
      <form
        onSubmit={(e) => {
          e.preventDefault();
          createNew();
        }}
      >
        <input
          ref={inputRef}
          className={`bg-transparent transition-all focus-visible:outline-none focus-visible:ring-offset-2 focus-visible:ring-offset-background focus-visible:ring-2 focus-visible:ring-ring rounded-sm w-full`}
          onBlur={() => createNew()}
        />
      </form>
    </div>
  );
}
