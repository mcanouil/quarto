/*
 * CommandMenuItems.tsx
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


import React from "react";

import { v4 as uuidv4 } from 'uuid';

import { EditorMenuItem } from "editor";
import { CommandMenuItem } from "./CommandMenuItem";
import { CommandId } from "../../commands/commands";
import { MenuDivider } from "@blueprintjs/core";
import { CommandSubMenu } from "./CommandSubMenu";
import { CommandManager } from "../../commands/CommandManager";



export interface CommandMenuItemsProps {
  menu: EditorMenuItem[];
  commandManager?: CommandManager;
}

export const CommandMenuItems: React.FC<CommandMenuItemsProps> = (props) => {
  return (
    <>
      {props.menu.map(mi => editorCommandMenuItem(mi, props.commandManager))}
    </>
  )
};

function editorCommandMenuItem(mi: EditorMenuItem, commandManager?: CommandManager) {
  if (mi.separator) {
    return <MenuDivider key={uuidv4()}/>
  } else if (mi.command) {
    return <CommandMenuItem id={mi.command as CommandId} key={mi.command} text={mi.text} commandManager={commandManager}/> 
  } else if (mi.subMenu && mi.text) {
    return <CommandSubMenu text={mi.text} key={uuidv4()}>{mi.subMenu.items.map(mi => editorCommandMenuItem(mi, commandManager))}</CommandSubMenu>
  } else {
    return null;
  }
}
