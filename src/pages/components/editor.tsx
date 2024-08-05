/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/restrict-plus-operands */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck
import React, { useState, useRef } from "react";
import Image from "next/image";
import Editor from "@monaco-editor/react";
import { runInNewContext } from "vm";
import Sk from "skulpt";
import Chat from "./chat";
import {
  TrashIcon,
  FolderDownloadIcon,
  PlayIcon,
  TerminalIcon,
  CodeIcon,
  CheckIcon,
} from "@heroicons/react/solid";
import { useLocalStorage } from "./useLocalStorage";

export default function CodeEditor() {
  const [value, setValue] = useLocalStorage("CODE", "console.log('Hello World')");
  const [logs, setLogs] = useLocalStorage("CONSOLE", []);
  const [language, setLanguage] = useLocalStorage("LANGUAGE", "javascript");
  const [title, setTitle] = useLocalStorage("TITLE", "Untitled Program");

  // Runner function
  function handleRunCode() {
    const sandbox = {
      console: {
        log: (message) => setLogs((prevLogs) => [...prevLogs, message]),
      },
    };

    try {
      const result = runInNewContext(value, sandbox);
      console.log(result); // Output: 8
    } catch (error) {
      console.error(error);
      setLogs((prevErrors) => [
        ...prevErrors,
        "R342WT43WTG45Error: " + error.message,
      ]);
    }
  }

  const handleExecutePython = () => {
    const outputArea = document.createElement("div");
    Sk.configure({
      output: (message) =>
        outputArea.appendChild(document.createTextNode(message)),
    });
    Sk.misceval
      .asyncToPromise(() =>
        Sk.importMainWithBody("<stdin>", false, value, true)
      )
      .then(() => {
        setLogs((prevLogs) => [...prevLogs, outputArea.innerHTML]);
      })
      .catch((error) => {
        console.error(error);
        setLogs((prevErrors) => [
          ...prevErrors,
          "R342WT43WTG45Error: " + error.toString(),
        ]);
      });
  };

  const handleEditorChange = (value) => {
    setValue(value);
  };

  const handleConsole = (log, index) => {
    return (
      <li
        key={index}
        className="relative z-10 last:bg-gpt odd:bg-gray-300 even:bg-gray-200 dark:odd:bg-gray-800 dark:even:bg-[#2a3241]"
      >
        <li
          className={`${
            (log + "").includes("R342WT43WTG45")
              ? "grid grid-cols-8  bg-red-400 px-2 text-red-800"
              : "grid grid-cols-8 px-2 text-gptDark dark:text-gptLighter "
          }`}
        >
          <span className="max-w-4 col-span-1 w-4 pr-1 text-gray-500 dark:text-gray-600">
            {index + 1}
          </span>
          <span className="col-span-7">
            {(log + "").includes("R342WT43WTG45")
              ? (log + "").replace("R342WT43WTG45", "")
              : log}
          </span>
        </li>
      </li>
    );
  };

  const editorRef = useRef(null);

  function handleEditorDidMount(editor) {
    editorRef.current = editor;
  }

  const codeHandler = () => {
    if (language === "python") {
      return handleExecutePython();
    } else if (language === "javascript") {
      return handleRunCode();
    }
  };

  const handleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob([value], { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = title + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const handleConsoleDownload = () => {
    const element = document.createElement("a");
    const file = new Blob(logs, { type: "text/plain" });
    element.href = URL.createObjectURL(file);
    element.download = title + ".txt";
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  const languageHandler = () => {
    if (language === "python") {
      return (
        <Image
          src="/images/python.png"
          className="rounded-sm "
          height={400}
          width={400}
          alt="python"
        />
      );
    } else if (language === "javascript") {
      return (
        <Image
          src="/images/javascript.png"
          className="rounded-sm "
          height={400}
          width={400}
          alt="js"
        />
      );
    }
  };

  return (
    <section className="relative flex flex-col overflow-hidden">
      <div className="grid grid-cols-5 gap-0">
        <div className="overlay shadow-4xl col-span-3  flex h-full max-h-[calc(100vh-3.6rem)] min-h-[calc(100vh-3.6rem)] w-full flex-col overflow-hidden border-r border-gray-600">
          <div className="flex w-full flex-row items-center border-b border-gray-600 bg-gray-100 py-1 px-2  text-gray-800 dark:bg-gray-800 dark:text-gray-400">
            <CodeIcon className="mr-2 h-5 w-5" />
            <input
              onChange={(e) => setTitle(e.target.value)}
              value={title}
              className="rounded-lg border border-gray-300 bg-white px-2 py-0.5 text-lg font-semibold focus:outline-none focus:ring-1 focus:ring-gpt dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
            ></input>
            <div className="ml-auto flex flex-row items-center">
              <div className="mr-3 flex items-center text-sm italic text-gray-400">
                <CheckIcon className="mr-1 h-4 w-4 text-blue-400" /> Saved
                Locally
              </div>
              <div className="relative inline-block text-gray-600">
                <select
                  value={language}
                  onChange={(event) => setLanguage(event.target.value)}
                  className="my-1 appearance-none rounded-lg border border-gray-300 bg-white bg-transparent py-0.5 pl-2 pr-8 focus:outline-none focus:ring-1 focus:ring-gpt dark:border-gray-700 dark:bg-gray-900 dark:text-gray-400"
                >
                  <option value="javascript">JavaScript</option>
                  <option value="python">Python</option>
                </select>
                <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 ">
                  <div className="mb-0.5 h-[1rem] w-[1rem]">
                    {languageHandler()}
                  </div>
                </div>
              </div>

              <button
                onClick={codeHandler}
                className="m-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-gpt dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gptDark"
              >
                <PlayIcon className="h-5 w-5" />
              </button>
              <button
                className="my-1 mr-1 flex items-center justify-center rounded-lg border border-gray-300 bg-white p-1 text-gray-900 duration-150 hover:bg-gray-100 hover:text-gpt dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-900 dark:hover:text-gptDark"
                onClick={handleDownload}
              >
                Save
              </button>
            </div>
          </div>

          <div className="grid grid-rows-6">
            <div className="row-span-3 overflow-y-scroll">
              <Editor
                height="50vh"
                defaultLanguage={language}
                defaultValue={value}
                onMount={handleEditorDidMount}
                onChange={handleEditorChange}
                theme="vs-dark"
                options={{
                  fontSize: 14,
                  scrollBeyondLastLine: false,
                  minimap: { enabled: false },
                  suggestOnTriggerCharacters: true,
                  tabCompletion: "on",
                  wordBasedSuggestions: true,
                  quickSuggestions: {
                    other: true,
                    comments: true,
                    strings: true,
                  },
                  parameterHints: {
                    enabled: true,
                  },
                  lightbulb: {
                    enabled: true,
                  },
                  codeLens: {
                    fontFamily: "Courier New",
                    fontSize: 16,
                    fontWeight: "bold",
                    color: "#f1c40f",
                    backgroundColor: "#333",
                    border: "2px solid #f1c40f",
                    borderRadius: "5px",
                    padding: "2px 5px",
                    arrowSize: 30,
                  },
                }}
              />
            </div>
            <div className="row-span-3 overflow-y-scroll border-t border-gray-600 bg-gray-100 py-1 px-1 dark:bg-gray-800">
              <div className="flex justify-between px-2 py-0.5 text-xs font-bold text-gray-400">
                <TerminalIcon className="mr-2 h-5 w-5" />
                <div className="grid grid-cols-2 gap-1">
                  <TrashIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={() => setLogs([])}
                  />
                  <FolderDownloadIcon
                    className="h-5 w-5 cursor-pointer"
                    onClick={handleConsoleDownload}
                  />
                </div>
              </div>

              <ul className="w-full list-none bg-gray-100  text-xs font-normal text-gray-800 dark:bg-gray-800 dark:text-gray-400">
                {logs.map((log, index) => handleConsole(log, index))}
              </ul>
            </div>
          </div>
        </div>

        <div className="col-span-2 flex flex-col items-center justify-between ">
          <div className="h-[calc(100vh-5.6rem)] max-h-[calc(100vh-3.6rem)] w-full bg-gray-200 dark:bg-gray-900">
            <Chat />
          </div>
        </div>
      </div>
    </section>
  );
}
