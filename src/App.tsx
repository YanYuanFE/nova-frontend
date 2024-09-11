import { useState } from 'react'
import viteLogo from '/vite.svg'
import './App.css'
import {ConnectButton} from "@rainbow-me/rainbowkit";

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <header className={'flex justify-between items-center p-4'}>
          <div className="flex gap-2 items-center">
              <a href="https://vitejs.dev" target="_blank">
                  <img src={viteLogo} className="logo" alt="Vite logo"/>
              </a>
              <h2 className={'text-lg font-bold'}>Dapp StartKit</h2>
          </div>

          <ConnectButton/>
      </header>
        <main className={'text-center'}>
            <h1>Vite + React</h1>
            <div className="card">
                <button onClick={() => setCount((count) => count + 1)}>
                    count is {count}
                </button>
                <p>
                    Edit <code>src/App.tsx</code> and save to test HMR
                </p>
            </div>
            <p className="read-the-docs">
                Click on the Vite and React logos to learn more
            </p>
        </main>
    </>
  )
}

export default App
