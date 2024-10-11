import { useAuth } from '@/components/AuthProvider';
import Sidebar from '@/components/Editor/Navbar';
import { ENVS } from '@/constants/config';
import { IProject, TFile, TFolder, TTab } from '@/types';
import { debounce, processFileType, validateName } from '@/utils';
import { useCallback, useEffect, useRef, useState } from 'react';
import toast from 'react-hot-toast';
import { useParams } from 'react-router-dom';
import { Socket, io } from 'socket.io-client';
import monaco from 'monaco-editor';
import { BeforeMount, OnMount } from '@monaco-editor/react';
import { FileJson, Hammer, Rocket } from 'lucide-react';
import { ResizablePanel, ResizablePanelGroup } from '@/components/ui/resizable';
import { ImperativePanelHandle } from 'react-resizable-panels';
import Tab from '@/components/Tab';
import { CairoEditor } from '@/components/Editor/CairoEditor';
import { Button } from '../ui/button';
import { Console, ILog, LogType } from '../Console';
import { DeployCard } from './DeployCard';

export function EditorCore({ project }: { project: IProject }) {
  const socketRef = useRef<Socket | null>(null);
  const { user } = useAuth();
  const { id } = useParams();
  const [files, setFiles] = useState<(TFolder | TFile)[]>([]);
  const [tabs, setTabs] = useState<TTab[]>([]);
  const [activeFileId, setActiveFileId] = useState<string>('');
  const [activeFileContent, setActiveFileContent] = useState('');
  const [deletingFolderId, setDeletingFolderId] = useState('');
  const [editorLanguage, setEditorLanguage] = useState('plaintext');

  const [editorRef, setEditorRef] = useState<monaco.editor.IStandaloneCodeEditor>();

  const editorContainerRef = useRef<HTMLDivElement>(null);
  const monacoRef = useRef<typeof monaco | null>(null);
  const [showCompile, setShowCompile] = useState(false);
  // const generateRef = useRef<HTMLDivElement>(null);
  // const generateWidgetRef = useRef<HTMLDivElement>(null);
  // const previewPanelRef = useRef<ImperativePanelHandle>(null);
  const editorPanelRef = useRef<ImperativePanelHandle>(null);
  const [compileLoading, setCompileLoading] = useState(false);
  const [logs, setLogs] = useState<ILog[]>([]);
  const [compielData, setCompileData] = useState<any>();

  console.log(files, activeFileContent, 'files');

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
  }, []);

  const debouncedSaveData = useCallback(
    debounce((value: string | undefined, activeFileId: string | undefined) => {
      setTabs((prev) => prev.map((tab) => (tab.id === activeFileId ? { ...tab, saved: true } : tab)));
      console.log(`Saving file...${activeFileId}`);
      console.log(`Saving file...${value}`);
      socketRef.current?.emit('saveFile', activeFileId, value);
    }, 1000),
    [socketRef]
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === 's' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        debouncedSaveData(editorRef?.getValue(), activeFileId);
      }
    };
    document.addEventListener('keydown', down);

    return () => {
      document.removeEventListener('keydown', down);
    };
  }, [activeFileId, tabs, debouncedSaveData]);

  const handleEditorWillMount: BeforeMount = (monaco) => {
    monaco.editor.addKeybindingRules([
      {
        keybinding: monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyG,
        command: 'null'
      }
    ]);
  };

  // Post-mount editor keybindings and actions
  const handleEditorMount: OnMount = (editor, monaco) => {
    setEditorRef(editor);
    monacoRef.current = monaco;

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
  };

  const fileCache = useRef(new Map());

  // Debounced function to get file content
  const debouncedGetFile = useCallback(
    debounce((tabId, callback) => {
      socketRef.current?.emit('getFile', tabId, callback);
    }, 300), // 300ms debounce delay, adjust as needed
    []
  );

  const handleCompile = () => {
    setCompileLoading(true);
    socketRef.current?.emit('compileProject', (response: any) => {
      console.log(response, 'response');
      setLogs((prev) => [
        {
          type: response.success ? LogType.Info : LogType.Error,
          message: response.result
        },
        ...prev
      ]);
      if (response.files) {
        setFiles(response.files);
      }
      if(response.compiledData) {
        const { casmData, sierraData } = response.compiledData;
        setCompileData({
          casmData: casmData ? JSON.parse(casmData) : null,
          sierraData: sierraData ? JSON.parse(sierraData) : null,
        });
      }
      setCompileLoading(false);
    });
  };

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

      console.log(tab.id, 'tab.id');
      if (fileCache.current.has(tab.id)) {
        console.log('has cache', fileCache.current.get(tab.id));
        setActiveFileContent(fileCache.current.get(tab.id));
      } else {
        debouncedGetFile(tab.id, (response: string) => {
          console.log('no cache', response);
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
    const numTabs = tabs.length;
    const index = tabs.findIndex((t) => t.id === id);

    console.log('closing tab', id, index);

    if (index === -1) return;

    const nextId =
      activeFileId === id
        ? numTabs === 1
          ? null
          : index < numTabs - 1
            ? tabs[index + 1].id
            : tabs[index - 1].id
        : activeFileId;

    setTabs((prev) => prev.filter((t) => t.id !== id));

    if (!nextId) {
      setActiveFileId('');
    } else {
      const nextTab = tabs.find((t) => t.id === nextId);
      if (nextTab) {
        selectFile(nextTab);
      }
    }
  };

  const closeTabs = (ids: string[]) => {
    const numTabs = tabs.length;

    if (numTabs === 0) return;

    const allIndexes = ids.map((id) => tabs.findIndex((t) => t.id === id));

    const indexes = allIndexes.filter((index) => index !== -1);
    if (indexes.length === 0) return;

    console.log('closing tabs', ids, indexes);

    const activeIndex = tabs.findIndex((t) => t.id === activeFileId);

    const newTabs = tabs.filter((t) => !ids.includes(t.id));
    setTabs(newTabs);

    if (indexes.length === numTabs) {
      setActiveFileId('');
    } else {
      const nextTab = newTabs.length > activeIndex ? newTabs[activeIndex] : newTabs[newTabs.length - 1];
      if (nextTab) {
        selectFile(nextTab);
      }
    }
  };

  const handleRename = (id: string, newName: string, oldName: string, type: 'file' | 'folder') => {
    const valid = validateName(newName, oldName, type);
    if (!valid.status) {
      if (valid.message) toast.error('Invalid file name.');
      return false;
    }

    socketRef.current?.emit('renameFile', id, newName);
    setTabs((prev) => prev.map((tab) => (tab.id === id ? { ...tab, name: newName } : tab)));

    return true;
  };

  const handleDeleteFile = (file: TFile) => {
    socketRef.current?.emit('deleteFile', file.id, (response: (TFolder | TFile)[]) => {
      setFiles(response);
    });
    closeTab(file.id);
  };

  const handleDeleteFolder = (folder: TFolder) => {
    setDeletingFolderId(folder.id);
    console.log('deleting folder', folder.id);

    socketRef.current?.emit('getFolder', folder.id, (response: string[]) => closeTabs(response));

    socketRef.current?.emit('deleteFolder', folder.id, (response: (TFolder | TFile)[]) => {
      setFiles(response);
      setDeletingFolderId('');
    });
  };

  const addNew = (name: string, type: 'file' | 'folder') => {
    if (type === 'file') {
      setFiles((prev) => [...prev, { id: `projects/${project.id}/${name}`, name, type: 'file' }]);
    } else {
      console.log('adding folder');
      setFiles((prev) => [
        ...prev,
        {
          id: `projects/${project.id}/${name}`,
          name,
          type: 'folder',
          children: []
        }
      ]);
    }
  };

  console.log(editorLanguage, 'editorLanguage');

  return (
    <div className="w-screen flex grow h-[calc(100vh-44px)] bg-[rgb(36_38_43)]">
      <Sidebar
        project={project}
        files={files}
        selectFile={selectFile}
        handleRename={handleRename}
        handleDeleteFile={handleDeleteFile}
        handleDeleteFolder={handleDeleteFolder}
        socket={socketRef.current!}
        setFiles={setFiles}
        addNew={(name, type) => addNew(name, type)}
        deletingFolderId={deletingFolderId}
      />
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel className="flex flex-col gap-1" maxSize={80} minSize={30} defaultSize={60} ref={editorPanelRef}>
          <div className="bg-background rounded-sm py-2 space-y-2">
            <div className="w-full flex gap-2 justify-center">
              <Button loading={compileLoading} variant="outline" size={'sm'} className="gap-1" onClick={handleCompile}>
                <Hammer className="w-4 h-4 mr-2 text-red-500" />
                Compile
              </Button>
              <Button variant="outline" size={'sm'} className="gap-1" onClick={() => {
                if(!compielData?.casmData || !compielData?.sierraData) {
                  toast.error('Please compile the project first');
                  return;
                }
                setShowCompile(true);
              }}>
                <Rocket className="w-4 h-4 mr-2 text-emerald-500" />
                Deploy
              </Button>
            </div>
            <div className="px-2 w-full flex gap-2 overflow-x-auto overflow-y-hidden tab-scroll">
              {/* File tabs */}
              {tabs.map((tab) => (
                <Tab
                  key={tab.id}
                  saved={tab.saved}
                  selected={activeFileId === tab.id}
                  onClick={() => {
                    selectFile(tab);
                  }}
                  onClose={() => closeTab(tab.id)}
                >
                  {tab.name}
                </Tab>
              ))}
            </div>
          </div>
          {/* Monaco editor */}
          <div ref={editorContainerRef} className="grow w-full overflow-hidden rounded-md relative bg-background">
            {!activeFileId ? (
              <>
                <div className="flex flex-col h-full items-center justify-center">
                  <img src="https://www.cairo-lang.org/wp-content/uploads/2024/04/Cairo-logo-hero-shadow-opt.png" alt="Cairo" className="w-20" />
                  <div className="w-full flex items-center justify-center text-xl font-medium text-muted-foreground/50 select-none">
                    <FileJson className="w-6 h-6 mr-3" />
                    No file selected.
                  </div>
                </div>
              </>
            ) : (
              <CairoEditor
                className="bg-background"
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
                theme="vs-dark"
                value={activeFileContent}
              />
            )}
          </div>
          <Console logs={logs} />
        </ResizablePanel>
        {
          showCompile ? (
            <ResizablePanel defaultSize={30}>
              <DeployCard compileData={compielData}/>
            </ResizablePanel>
          ) : null
        }
      </ResizablePanelGroup>
    </div>
  );
}
