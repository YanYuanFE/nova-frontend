import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Editor/Navbar';
import { ENVS } from '@/constants/config';
import { TFile, TFolder, TTab } from '@/types';
import { debounce, processFileType } from '@/utils';
import { SetStateAction, useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import monaco from 'monaco-editor';
import Editor, { BeforeMount, OnMount } from '@monaco-editor/react';
import { Loader2, FileJson } from 'lucide-react';
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ImperativePanelHandle } from 'react-resizable-panels';
import Tab from '@/components/Tab';

export default function Project() {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();
  const { id } = useParams();
  const [files, setFiles] = useState<(TFolder | TFile)[]>([]);
  const [tabs, setTabs] = useState<TTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [activeFileContent, setActiveFileContent] = useState('');
  const [deletingFolderId, setDeletingFolderId] = useState('');
  const [editorLanguage, setEditorLanguage] = useState("plaintext")

  const [editorRef, setEditorRef] = useState<monaco.editor.IStandaloneCodeEditor>();

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const generateRef = useRef<HTMLDivElement>(null);
  const generateWidgetRef = useRef<HTMLDivElement>(null);
  const previewPanelRef = useRef<ImperativePanelHandle>(null);
  const editorPanelRef = useRef<ImperativePanelHandle>(null);

  console.log(files, 'files');

  // Initialize socket connection if it doesn't exist
  if (!socketRef.current && user) {
    socketRef.current = io(`${ENVS.BACKEND_URL}?userId=${user?.id}&projectId=${id}`, {
      timeout: 2000
    });
  }

  useEffect(() => {
    socketRef.current?.connect();

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  // Socket event listener effect
  useEffect(() => {
    const onConnect = () => {};

    const onDisconnect = () => {
      //   setTerminals([])
    };

    const onLoadedEvent = (files: (TFolder | TFile)[]) => {
      setFiles(files);
    };

    const onError = (message: string) => {
      toast.error(message);
    };

    socketRef.current?.on('connect', onConnect);
    socketRef.current?.on('disconnect', onDisconnect);
    socketRef.current?.on('loaded', onLoadedEvent);
    socketRef.current?.on('error', onError);

    return () => {
      socketRef.current?.off('connect', onConnect);
      socketRef.current?.off('disconnect', onDisconnect);
      socketRef.current?.off('loaded', onLoadedEvent);
      socketRef.current?.off('error', onError);
    };
    // }, []);
  }, []);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.addKeybindingRules([
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG,
        command: "null",
      },
    ])
  }

  // Post-mount editor keybindings and actions
  const handleEditorMount: OnMount = (editor, monaco) => {
    setEditorRef(editor)
    monacoRef.current = monaco

    // editor.onDidChangeCursorPosition((e) => {
    //   const { column, lineNumber } = e.position
    //   if (lineNumber === cursorLine) return
    //   setCursorLine(lineNumber)

    //   const model = editor.getModel()
    //   const endColumn = model?.getLineContent(lineNumber).length || 0

    //   setDecorations((prev) => {
    //     return {
    //       ...prev,
    //       options: [
    //         {
    //           range: new monaco.Range(
    //             lineNumber,
    //             column,
    //             lineNumber,
    //             endColumn
    //           ),
    //           options: {
    //             afterContentClassName: "inline-decoration",
    //           },
    //         },
    //       ],
    //     }
    //   })
    // })

    // editor.onDidBlurEditorText((e) => {
    //   setDecorations((prev) => {
    //     return {
    //       ...prev,
    //       options: [],
    //     }
    //   })
    // })

    // editor.addAction({
    //   id: "generate",
    //   label: "Generate",
    //   keybindings: [monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG],
    //   precondition:
    //     "editorTextFocus && !suggestWidgetVisible && !renameInputVisible && !inSnippetMode && !quickFixWidgetVisible",
    //   run: () => {
    //     setGenerate((prev) => {
    //       return {
    //         ...prev,
    //         show: !prev.show,
    //         pref: [monaco.editor.ContentWidgetPositionPreference.BELOW],
    //       }
    //     })
    //   },
    // })
  }

  const fileCache = useRef(new Map());

  // Debounced function to get file content
  const debouncedGetFile = useCallback(
    debounce((tabId, callback) => {
      socketRef.current?.emit('getFile', tabId, callback);
    }, 300), // 300ms debounce delay, adjust as needed
    []
  );

  const selectFile = useCallback(
    (tab: TTab) => {
      if (tab.id === activeFileId) return;

      // setGenerate((prev) => ({ ...prev, show: false }));

      const exists = tabs.find((t) => t.id === tab.id);
      setTabs((prev) => {
        if (exists) {
          setActiveFileId(exists.id);
          return prev;
        }
        return [...prev, tab];
      });

      if (fileCache.current.has(tab.id)) {
        setActiveFileContent(fileCache.current.get(tab.id));
      } else {
        debouncedGetFile(tab.id, (response: SetStateAction<string>) => {
          fileCache.current.set(tab.id, response);
          setActiveFileContent(response);
        });
      }

      setEditorLanguage(processFileType(tab.name));
      setActiveFileId(tab.id);
    },
    [activeFileId, tabs, debouncedGetFile]
  );

  // Close tab and remove from tabs
  const closeTab = (id: string) => {
    const numTabs = tabs.length
    const index = tabs.findIndex((t) => t.id === id)

    console.log("closing tab", id, index)

    if (index === -1) return

    const nextId =
      activeFileId === id
        ? numTabs === 1
          ? null
          : index < numTabs - 1
          ? tabs[index + 1].id
          : tabs[index - 1].id
        : activeFileId

    setTabs((prev) => prev.filter((t) => t.id !== id))

    if (!nextId) {
      setActiveFileId("")
    } else {
      const nextTab = tabs.find((t) => t.id === nextId)
      if (nextTab) {
        selectFile(nextTab)
      }
    }
  }

  const closeTabs = (ids: string[]) => {
    const numTabs = tabs.length

    if (numTabs === 0) return

    const allIndexes = ids.map((id) => tabs.findIndex((t) => t.id === id))

    const indexes = allIndexes.filter((index) => index !== -1)
    if (indexes.length === 0) return

    console.log("closing tabs", ids, indexes)

    const activeIndex = tabs.findIndex((t) => t.id === activeFileId)

    const newTabs = tabs.filter((t) => !ids.includes(t.id))
    setTabs(newTabs)

    if (indexes.length === numTabs) {
      setActiveFileId("")
    } else {
      const nextTab =
        newTabs.length > activeIndex
          ? newTabs[activeIndex]
          : newTabs[newTabs.length - 1]
      if (nextTab) {
        selectFile(nextTab)
      }
    }
  }

  const handleRename = (id: string, name: string) => {
    // const file = files.find((file) => file.id === id)
    // if (file) {
    //   setFiles(files.map((file) => file.id === id ? { ...file, name } : file))
    // }
  };

  const handleDeleteFile = (id: string) => {
    // setFiles(files.filter((file) => file.id !== id))
  };

  const handleDeleteFolder = (id: string) => {
    // setFiles(files.filter((file) => file.id !== id))
  };

  const addNew = (name: string, type: 'file' | 'folder') => {
    // setFiles([...files, { id: uuidv4(), name, type, children: [] }])
  };


  const sandboxData = {};

  return (
    <div className="w-screen flex grow h-screen">
      <Sidebar
        sandboxData={sandboxData}
        files={files}
        selectFile={selectFile}
        handleRename={handleRename}
        handleDeleteFile={handleDeleteFile}
        handleDeleteFolder={handleDeleteFolder}
        socket={socketRef.current}
        setFiles={setFiles}
        addNew={(name, type) => addNew(name, type, setFiles, sandboxData)}
        deletingFolderId={deletingFolderId}
      />
       <ResizablePanelGroup direction="horizontal">
       <ResizablePanel className="p-2 flex flex-col" maxSize={80} minSize={30} defaultSize={60} ref={editorPanelRef}>
        <div className="h-10 w-full flex gap-2 overflow-auto tab-scroll">
          {/* File tabs */}
          {tabs.map((tab) => (
            <Tab
              key={tab.id}
              saved={tab.saved}
              selected={activeFileId === tab.id}
              onClick={(e) => {
                selectFile(tab);
              }}
              onClose={() => closeTab(tab.id)}
            >
              {tab.name}
            </Tab>
          ))}
        </div>
        {/* Monaco editor */}
        <div ref={editorContainerRef} className="grow w-full overflow-hidden rounded-md relative">
          {!activeFileId ? (
            <>
              <div className="w-full h-full flex items-center justify-center text-xl font-medium text-muted-foreground/50 select-none">
                <FileJson className="w-6 h-6 mr-3" />
                No file selected.
              </div>
            </>
          ) : (
            <Editor
              height="100%"
              language={editorLanguage}
              beforeMount={handleEditorWillMount}
              onMount={handleEditorMount}
              onChange={(value) => {
                if (value === activeFileContent) {
                  setTabs((prev) => prev.map((tab) => (tab.id === activeFileId ? { ...tab, saved: true } : tab)));
                } else {
                  setTabs((prev) => prev.map((tab) => (tab.id === activeFileId ? { ...tab, saved: false } : tab)));
                }
              }}
              options={{
                tabSize: 2,
                minimap: {
                  enabled: false
                },
                padding: {
                  bottom: 4,
                  top: 4
                },
                scrollBeyondLastLine: false,
                fixedOverflowWidgets: true,
                fontFamily: 'var(--font-geist-mono)'
              }}
              theme="vs-dark"
              value={activeFileContent}
            />
          )}
        </div>
      </ResizablePanel>
       </ResizablePanelGroup>
      
    </div>
  );
}
