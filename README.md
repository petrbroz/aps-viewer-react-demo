# aps-viewer-wrapper-react

Simple [React](https://reactjs.org) application with an experimental wrapper for [Autodesk Platform Services](https://aps.autodesk.com) Viewer.

## Running locally

### Prerequisites

In order to test this application you'll need two things:

- access token for accessing models in APS (only the `viewables:read` scope is needed)
- URN of a model that's been converted to the SVF2 format

> If you don't know how to get these, start by [creating an APS application](https://aps.autodesk.com/en/docs/oauth/v2/tutorials/create-app/),
> install [Visual Studio Code](https://code.visualstudio.com/), and add our [extension](https://marketplace.visualstudio.com/items?itemName=petrbroz.vscode-forge-tools)
> to it. The extension allows you to do various tasks within Autodesk Platform Services, incl. uploading models, translating them, and generating access tokens.

### Steps

- clone this repository
- install Node.js dependencies: `npm install`
- hard-code your access token and model URN in [./src/index.tsx](./src/index.tsx)
- build the React app: `npm run build`
- serve the built app locally: `npm run preview`
- open your browser and go to http://127.0.0.1:4173/

## Reusing the wrapper

If you want to use the `<Viewer />` component in your own React application, copy the following two files to your source code:

- [./src/components/Viewer.tsx](./src/components/Viewer.tsx)
- [./src/components/Viewer.utils.ts](./src/components/Viewer.utils.ts)

And don't forget to add Viewer dependencies to your markup:

```html
<link rel="stylesheet" href="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/style.css">
<script src="https://developer.api.autodesk.com/modelderivative/v2/viewers/7.*/viewer3D.js"></script>
```