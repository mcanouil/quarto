/*
 * Editor.tsx
 *
 * Copyright (C) 2022 by Posit Software, PBC
 *
 * Unless you have received this program directly from Posit Software pursuant
 * to the terms of a commercial license agreement with Posit Software, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

import React, { useState } from "react";
import { createRoot } from "react-dom/client";

import { Store } from 'redux';
import { Provider as StoreProvider } from 'react-redux';

import { WebviewApi } from "vscode-webview";

import { JsonRpcRequestTransport } from "core";
import { CommandManagerProvider, Commands, EditorFrame, initEditorTranslations, initializeStore, showContextMenu } from "editor-ui";
import { EditorDisplay, EditorMenuItem, EditorOperations, EditorUIContext, XRef } from "editor";

import { 
  visualEditorHostClient, 
  VisualEditorHostClient, 
  visualEditorJsonRpcRequestTransport,
  syncEditorToHost
} from "./sync";

import styles from './Editor.module.scss';


export async function createEditor(parent: HTMLElement, vscode: WebviewApi<unknown>) {

  // connection to host
  const request = visualEditorJsonRpcRequestTransport(vscode)
  const host = visualEditorHostClient(vscode, request);

  // initialize store
  const store = await initializeStore(request);
    
  // init localization
  await initEditorTranslations();
  
  // create and render editor
  const root = createRoot(parent);
  root.render(<Editor store={store} host={host} request={request}/>);

}

interface EditorProps {
  host: VisualEditorHostClient;
  request: JsonRpcRequestTransport;
  store: Store;
}

const Editor : React.FC<EditorProps> = (props) => {

  // one time init of display/context
  const [uiContext] = useState(editorUIContext());
  
  // pair editor w/ host on on init
  const onEditorInit = async (editor: EditorOperations) => {
    syncEditorToHost(editor, props.host);
  };

  return (
    <StoreProvider store={props.store}>
      <CommandManagerProvider>
        <EditorFrame
          className={styles.editorParent} 
          request={props.request}
          uiContext={uiContext}
          display={editorDisplay}
          onEditorInit={onEditorInit}
        />
      </CommandManagerProvider>
    </StoreProvider>
  );
}

function editorUIContext(): EditorUIContext {
  return {
    // check if we are the active tab
    isActiveTab(): boolean {
      return true;
    },

    // get the path to the current document
    getDocumentPath(): string | null {
      return null;
    },

    // ensure the edited document is saved on the server before proceeding
    // (note this just means that the server has a copy of it for e.g.
    // indexing xrefs, from the user's standpoint the doc is still dirty)
    async withSavedDocument(): Promise<boolean> {
      return true;
    },

    // get the default directory for resources (e.g. where relative links point to)
    getDefaultResourceDir(): string {
      return "";
    },

    // map from a filesystem path to a resource reference
    mapPathToResource(path: string): string {
      return path;
    },

    // map from a resource reference (e.g. images/foo.png) to a URL we can use in the document
    mapResourceToURL(path: string): string {
      return path;
    },

    // watch a resource for changes (returns an unsubscribe function)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    watchResource(_path: string, _notify: VoidFunction): VoidFunction {
      return () => {
        /* */
      };
    },

    // translate a string
    translateText(text: string): string {
      return text;
    },

    // are there dropped uris available?
    droppedUris(): string[] | null {
      return null;
    },

    // uris from the clipboard
    async clipboardUris(): Promise<string[] | null> {
      return null;
    },

    // image from the clipboard (returned as file path)
    async clipboardImage(): Promise<string | null> {
      return null;
    },

    // resolve image uris (make relative, copy to doc local 'images' dir, etc)
    async resolveImageUris(uris: string[]): Promise<string[]> {
      return uris;
    },

    // are we running in windows desktop mode?
    isWindowsDesktop(): boolean {
      return false;
    },
  };
}

export function editorDisplay(commands: () => Commands) : EditorDisplay {
  return {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    openURL(_url: string) {
      //
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    navigateToXRef(_file: string, _xref: XRef) {
      //
    },
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    navigateToFile(_file: string) {
      //
    },

    async showContextMenu(
      items: EditorMenuItem[],
      clientX: number,
      clientY: number
    ): Promise<boolean> {
      return showContextMenu(commands(), items, clientX, clientY);
    }
  };
}

