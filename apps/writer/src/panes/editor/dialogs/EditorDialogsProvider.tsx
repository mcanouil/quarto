/* eslint-disable @typescript-eslint/no-unused-vars */
/*
 * EditorDialogsProvider.tsx
 *
 * Copyright (C) 2022 by Posit Software, PBC
 *
 * Unless you have received this program directly from RStudio pursuant
 * to the terms of a commercial license agreement with RStudio, then
 * this program is licensed to you under the terms of version 3 of the
 * GNU Affero General Public License. This program is distributed WITHOUT
 * ANY EXPRESS OR IMPLIED WARRANTY, INCLUDING THOSE OF NON-INFRINGEMENT,
 * MERCHANTABILITY OR FITNESS FOR A PARTICULAR PURPOSE. Please refer to the
 * AGPL (http://www.gnu.org/licenses/agpl-3.0.txt) for more details.
 *
 */

import React, { PropsWithChildren, useState } from "react";

import { t } from '../../../i18n';

import {
  LinkProps,
  LinkEditResult,
  ImageProps,
  ListProps,
  AttrProps,
  AttrEditResult,
  InsertTableResult,
  ListCapabilities,
  RawFormatResult,
  RawFormatProps,
  LinkTargets, 
  LinkCapabilities,
  TableCapabilities,
  ImageDimensions,
  kAlertTypeInfo,
  CodeBlockProps,
  EditorDialogs,
  CalloutEditResult,
  CalloutEditProps,
  InsertCiteProps,
  EditorHTMLDialogCreateFn,
  EditorHTMLDialogValidateFn,
  InsertCiteResult,
  InsertTabsetResult,
  ImageEditResult
} from 'editor';

import { AlertDialog, AlertDialogProps } from "../../../widgets/dialog/AlertDialog";
import { defaultEditLinkProps, EditorDialogEditLink, EditorDialogEditLinkProps } from "./EditorDialogEditLink";
import { defaultEditImageProps, EditorDialogEditImage, EditorDialogEditImageProps } from "./EditorDialogEditImage";
import { defaultEditAttrProps, EditorDialogEditAttr, EditorDialogEditAttrProps } from "./EditorDialogEditAttr";
import { defaultEditListProps, EditorDialogEditList, EditorDialogEditListProps } from "./EditorDialogEditList";
import { defaultEditRawProps, EditorDialogEditRaw, EditorDialogEditRawProps } from "./EditorDialogEditRaw";
import { defaultInsertTableProps, EditorDialogInsertTable, EditorDialogInsertTableProps } from "./EditorDialogInsertTable";


interface EditorDialogsState {
  alert: AlertDialogProps;
  editLink: EditorDialogEditLinkProps;
  editImage: EditorDialogEditImageProps;
  editAttr: EditorDialogEditAttrProps;
  editList: EditorDialogEditListProps;
  editSpan: EditorDialogEditAttrProps;
  editDiv: EditorDialogEditAttrProps;
  editRaw: EditorDialogEditRawProps;
  insertTable: EditorDialogInsertTableProps;
}

export const EditorDialogsContext = React.createContext<EditorDialogs>(null!);

export const EditorDialogsProvider: React.FC<PropsWithChildren> = (props) => {

  const [state, setState] = useState<EditorDialogsState>({
    alert: defaultAlertProps(),
    editLink: defaultEditLinkProps(),
    editAttr: defaultEditAttrProps(),
    editImage: defaultEditImageProps(),
    editList: defaultEditListProps(),
    editSpan: defaultEditAttrProps(),
    editDiv: defaultEditAttrProps(),
    editRaw: defaultEditRawProps(),
    insertTable: defaultInsertTableProps(),
  });

  const editorDialogsProvider: EditorDialogs = {
    async alert(message: string, title: string, type: number): Promise<boolean> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          alert: {
            isOpen: true,
            message,
            title: title || '',
            type,
            onClosed: () => {
              setState({ ...prevState, alert: { ...state.alert, isOpen: false } });
              resolve(true);
            },
          },
        }));
      });
    },
    async yesNoMessage(_message: string, _title: string, _type: number, _yesLabel: string, _noLabel: string): Promise<boolean> {
      return false;
    },
    async editLink(link: LinkProps, targets: LinkTargets, capabilities: LinkCapabilities): Promise<LinkEditResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editLink: {
            isOpen: true,
            capabilities,
            link,
            targets,
            onClosed: (result: LinkEditResult | null) => {
              setState({ ...prevState, editLink: { ...state.editLink, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editImage(image: ImageProps, dims: ImageDimensions | null, _figure: boolean, editAttributes: boolean): Promise<ImageProps | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editImage: {
            isOpen: true,
            image,
            dims,
            editAttributes,
            onClosed: (result: ImageEditResult | null) => {
              setState({ ...prevState, editImage: { ...state.editImage, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editCodeBlock(_codeBlock: CodeBlockProps, _attributes: boolean, _languages: string[]): Promise<CodeBlockProps | null> {
      return null;
    },
    async editList(list: ListProps, capabilities: ListCapabilities): Promise<ListProps | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editList: {
            isOpen: true,
            list,
            capabilities,
            onClosed: (result: ListProps | null) => {
              setState({ ...prevState, editList: { ...state.editList, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },

    async editAttr(attr: AttrProps, _idHint?: string | undefined): Promise<AttrEditResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editAttr: {
            isOpen: true,
            attr,
            onClosed: (result: AttrEditResult | null) => {
              setState({ ...prevState, editAttr: { ...state.editAttr, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },

    async editSpan(attr: AttrProps, _idHint?: string | undefined): Promise<AttrEditResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editSpan: {
            isOpen: true,
            attr,
            removeEnabled: true,
            caption: t('edit_span_dialog_caption') as string,
            onClosed: (result: AttrEditResult | null) => {
              setState({ ...prevState, editSpan: { ...state.editSpan, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editDiv (attr: AttrProps, removeEnabled: boolean): Promise<AttrEditResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editDiv: {
            isOpen: true,
            attr,
            removeEnabled,
            caption: t('edit_div_dialog_caption') as string,
            onClosed: (result: AttrEditResult | null) => {
              setState({ ...prevState, editDiv: { ...state.editDiv, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editCallout(_props: CalloutEditProps, _removeEnabled: boolean): Promise<CalloutEditResult | null> {
      return null;
    },
    async editRawInline(raw: RawFormatProps, _outputFormats: string[]): Promise<RawFormatResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editRaw: {
            isOpen: true,
            raw,
            onClosed: (result: RawFormatResult | null) => {
              setState({ ...prevState, editRaw: { ...state.editRaw, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editRawBlock(raw: RawFormatProps, _outputFormats: string[]): Promise<RawFormatResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          editRaw: {
            isOpen: true,
            minRows: 10,
            raw,
            onClosed: (result: RawFormatResult | null) => {
              setState({ ...prevState, editRaw: { ...state.editRaw, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async editMath(_id: string): Promise<string | null> {
      return null;
    },
    async insertTable(capabilities: TableCapabilities): Promise<InsertTableResult | null> {
      return new Promise(resolve => {
        setState(prevState => ({
          ...prevState,
          insertTable: {
            isOpen: true,
            capabilities,
            onClosed: (result: InsertTableResult | null) => {
              setState({  ...prevState, insertTable: { ...state.insertTable, isOpen: false } });
              resolve(result);
            },
          },
        }));
      });
    },
    async insertTabset(): Promise<InsertTabsetResult | null> {
      return null;
    },
    async insertCite(_props: InsertCiteProps): Promise<InsertCiteResult | null> {
      return null;
    },
    async htmlDialog(_title: string, _okText: string | null, _create: EditorHTMLDialogCreateFn, _focus: VoidFunction, _validate: EditorHTMLDialogValidateFn): Promise<boolean> {
      return false;
    }
  };

  return (
    <EditorDialogsContext.Provider value={editorDialogsProvider}>
      {props.children}
      <AlertDialog {...state.alert} />
      <EditorDialogEditLink {...state.editLink} />
      <EditorDialogEditAttr {...state.editAttr} />
      <EditorDialogEditImage {...state.editImage} />
      <EditorDialogEditList {...state.editList} />
      <EditorDialogEditAttr {...state.editSpan} />
      <EditorDialogEditAttr {...state.editDiv} />
      <EditorDialogEditRaw {...state.editRaw} />
      <EditorDialogInsertTable {...state.insertTable} />
    </EditorDialogsContext.Provider> 
  );

}


function defaultAlertProps(): AlertDialogProps {
  return {
    title: '',
    message: '',
    type: kAlertTypeInfo,
    isOpen: false,
    onClosed: () => {
      /* */
    },
  };
}