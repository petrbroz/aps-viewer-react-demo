/// import * as Autodesk from "@types/forge-viewer";

import React from 'react';
import { initializeViewerRuntime, loadModel } from './Viewer.utils';

/**
 * Properties for the Viewer component.
 */
export interface ViewerProps {
    runtime?: Autodesk.Viewing.InitializerOptions;
    extensions?: string[];
    model?: { urn: string; guid?: string; } | { url: string };
    selectedIds?: number[];
    isolatedIds?: number[];
    onCameraChange?: (ev: { viewer: Autodesk.Viewing.GuiViewer3D, camera: THREE.Camera }) => void;
    onSelectionChange?: (ev: { viewer: Autodesk.Viewing.GuiViewer3D, ids: number[] }) => void;
    onIsolationChange?: (ev: { viewer: Autodesk.Viewing.GuiViewer3D, ids: number[] }) => void;
}

/**
 * Wrapper for the Autodesk Platform Services Viewer.
 */
export class Viewer extends React.Component<ViewerProps> {
    /** HTML container hosting the viewer. */
    protected container?: HTMLDivElement | null = null;
    /** Reference to the viewer instance. */
    protected viewer: Autodesk.Viewing.GuiViewer3D | null = null;

    get api(): Autodesk.Viewing.Viewer3D | null { return this.viewer; }

    componentDidMount() {
        initializeViewerRuntime(this.props.runtime || {})
            .then(_ => {
                if (!this.container) {
                    console.warn('Viewer component was unmounted before the viewer runtime initialization was completed. This could indicate an issue in the React application.');
                    return;
                }
                this.viewer = new Autodesk.Viewing.GuiViewer3D(this.container);
                this.viewer.start();
                this.viewer.addEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
                this.viewer.addEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
                this.viewer.addEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.onViewerIsolationChange);
                this.updateViewerState({});
            })
            .catch(err => console.error(err));
    }

    componentWillUnmount() {
        if (this.viewer) {
            this.viewer.removeEventListener(Autodesk.Viewing.CAMERA_CHANGE_EVENT, this.onViewerCameraChange);
            this.viewer.removeEventListener(Autodesk.Viewing.SELECTION_CHANGED_EVENT, this.onViewerSelectionChange);
            this.viewer.removeEventListener(Autodesk.Viewing.ISOLATE_EVENT, this.onViewerIsolationChange);
            this.viewer.finish();
            this.viewer = null;
        }
        this.container = null;
    }

    componentDidUpdate(prevProps: ViewerProps) {
        this.updateViewerState(prevProps);
    }

    render() {
        return <div ref={ref => this.container = ref}></div>;
    }

    protected updateViewerState(prevProps: ViewerProps) {
        if (!this.viewer) {
            return;
        }

        const { model, extensions, selectedIds, isolatedIds } = this.props;

        // Update model
        if (model) {
            if (JSON.stringify(model) !== JSON.stringify(prevProps.model)) {
                const newProps = { ...prevProps, model };
                loadModel(this.viewer, model)
                    .then(_ => this.updateViewerState(newProps))
                    .catch(err => console.error(err));
                return; // Skip the remaining sync logic; rest will be updated when the model is loaded
            }
        } else {
            if (this.viewer.model) {
                this.viewer.unloadModel(this.viewer.model);
            }
        }

        // Update extensions
        const prevExtensions = prevProps.extensions || [];
        const currExtensions = extensions || [];
        for (const ext of prevExtensions) {
            if (!currExtensions.includes(ext)) {
                this.viewer.unloadExtension(ext);
            }
        }
        for (const ext of currExtensions) {
            if (!prevExtensions.includes(ext)) {
                this.viewer.loadExtension(ext);
            }
        }

        // Update selection
        if (selectedIds) {
            if (JSON.stringify(selectedIds) !== JSON.stringify(this.viewer.getSelection())) {
                this.viewer.select(selectedIds);
            }
        }

        // Update isolation
        if (isolatedIds) {
            if (JSON.stringify(isolatedIds) !== JSON.stringify(this.viewer.getIsolatedNodes())) {
                this.viewer.isolate(isolatedIds);
            }
        }
    }

    protected onViewerCameraChange = () => this.viewer && this.props.onCameraChange && this.props.onCameraChange({ viewer: this.viewer, camera: this.viewer.getCamera() });
    protected onViewerSelectionChange = () => this.viewer && this.props.onSelectionChange && this.props.onSelectionChange({ viewer: this.viewer, ids: this.viewer.getSelection() });
    protected onViewerIsolationChange = () => this.viewer && this.props.onIsolationChange && this.props.onIsolationChange({ viewer: this.viewer, ids: this.viewer.getIsolatedNodes() });
}