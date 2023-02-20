/// import * as Autodesk from "@types/forge-viewer";

const runtime: { options: Autodesk.Viewing.InitializerOptions; ready: Promise<void> | null } = {
    options: {},
    ready: null
};

export function initializeViewerRuntime(options: Autodesk.Viewing.InitializerOptions): Promise<void> {
    if (!runtime.ready) {
        runtime.options = { ...options };
        runtime.ready = new Promise((resolve) => Autodesk.Viewing.Initializer(runtime.options as Autodesk.Viewing.InitializerOptions, resolve));
    } else {
        if (['accessToken', 'getAccessToken', 'env', 'api', 'language'].some(prop => options[prop] !== runtime.options[prop])) {
            return Promise.reject('Cannot initialize another viewer runtime with different settings.')
        }
    }
    return runtime.ready;
}

export function loadModel(viewer: Autodesk.Viewing.Viewer3D, model: { urn: string; guid?: string; } | { url: string }): Promise<Autodesk.Viewing.Model> {
    return new Promise(function (resolve, reject) {
        if ('urn' in model) {
            Autodesk.Viewing.Document.load(
                'urn:' + model.urn,
                (doc) => {
                    const view = model.guid ? doc.getRoot().findByGuid(model.guid) : doc.getRoot().getDefaultGeometry();
                    viewer.loadDocumentNode(doc, view).then(m => resolve(m));
                },
                (code, message, args) => reject({ code, message, args })
            );
        } else {
            viewer.loadModel(model.url, {}, m => resolve(m), (code, message, args) => reject({ code, message, args }));
        }
    });
}