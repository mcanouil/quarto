/*
 * element.ts
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

import { Range } from '../range';

export type PandocTokenType =
  | "FrontMatter"
  | "BlockQuote"
  | "BulletList"
  | "CodeBlock"
  | "Div"
  | "Header"
  | "HorizontalRule"
  | "OrderedList"
  | "Para"
  | "RawBlock"
  | "Table"
  | "Code"
  | "Image"
  | "Link"
  | "Math"
  | "Note"
  | "RawInline"
  | "Span";


export const kAttrIdentifier = 0;
export const kAttrClasses = 1;
export const kAttrAttributes = 2;
export type PandocTokenAttr = [string, Array<string>, Array<[string,string]>];


export interface PandocToken {
  type: PandocTokenType;
  range: Range;
  level?: number;
  attr?: PandocTokenAttr; 
  data?: unknown;
    // FrontMatter: yaml
    // Header: text
    // Image: caption
    // Link: target
    // Math: type
    // CodeBlock: text
}

