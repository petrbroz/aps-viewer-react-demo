import * as React from 'react';
import { useState } from 'react';
import { createRoot } from 'react-dom/client';
import { Viewer } from './components/Viewer';

const ACCESS_TOKEN = '<enter access token>';
const MODEL_URN = '<enter model urn>';

export const App: React.FunctionComponent = () => {
    const [cameraPos, setCameraPos] = useState<{ x: number, y: number, z: number }>({ x: 0, y: 0, z: 0 });
    const [selectedIds, setSelectedIds] = useState<number[]>([]);
    const [isolatedIds, setIsolatedIds] = useState<number[]>([]);
    return (
        <div>
            <div>
                Camera Position: {cameraPos.x.toFixed(2)} {cameraPos.y.toFixed(2)} {cameraPos.z.toFixed(2)}
            </div>
            <div>
                Selected IDs: <input type="text" value={selectedIds.join(',')} onChange={ev => setSelectedIds(ev.target.value.split(',').map(e => parseInt(e)))} />
            </div>
            <div>
                Isolated IDs: <input type="text" value={isolatedIds.join(',')} readOnly />
            </div>
            <div style={{ position: 'relative', width: '800px', height: '600px' }}>
                <Viewer
                    runtime={{ env: 'AutodeskProduction2', api: 'streamingV2', accessToken: ACCESS_TOKEN }}
                    model={{ urn: MODEL_URN }}
                    extensions={['Autodesk.DocumentBrowser']}
                    selectedIds={selectedIds}
                    onCameraChange={ev => setCameraPos(ev.camera.getWorldPosition())}
                    onSelectionChange={ev => setSelectedIds(ev.ids)}
                    onIsolationChange={ev => setIsolatedIds(ev.ids)}
                />
            </div>
        </div>
    );
};

createRoot(document.getElementById('root') as HTMLElement).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);