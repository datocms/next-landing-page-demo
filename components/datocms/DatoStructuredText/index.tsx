import { cloneElement, type ReactElement } from 'react';
import {
  type CdaStructuredTextRecord,
  StructuredText,
  type StructuredTextPropTypes,
} from 'react-datocms/structured-text';
import Highlighter from './Highlighter';

/** Makes an embedded block or inline record its own Content Link target inside the text's group */
function addBoundaryAttribute(
  result: ReactElement | null,
): ReactElement | null {
  if (!result) return null;
  return cloneElement(result, {
    'data-datocms-content-link-boundary': true,
  } as Record<string, unknown>);
}

/**
 * react-datocms's StructuredText for the whole site. The text is one Content
 * Link group (one click target for the field), embedded blocks and inline
 * records are boundaries inside it (each opens its own record), and nodes
 * render through Highlighter unless the caller passes its own `renderNode`.
 */
export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>) {
  const {
    renderBlock,
    renderInlineRecord,
    renderLinkToRecord,
    renderNode,
    ...rest
  } = props;

  return (
    <div data-datocms-content-link-group>
      <StructuredText
        {...rest}
        renderNode={renderNode ?? Highlighter}
        renderBlock={
          renderBlock
            ? (context) => addBoundaryAttribute(renderBlock(context))
            : undefined
        }
        renderInlineRecord={
          renderInlineRecord
            ? (context) => addBoundaryAttribute(renderInlineRecord(context))
            : undefined
        }
        renderLinkToRecord={renderLinkToRecord}
      />
    </div>
  );
}
