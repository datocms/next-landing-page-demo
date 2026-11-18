import { cloneElement, type ReactElement } from 'react';
import {
  type CdaStructuredTextRecord,
  StructuredText,
  type StructuredTextPropTypes,
} from 'react-datocms/structured-text';

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
 * react-datocms's StructuredText inside one Content Link group; embedded
 * blocks and inline records become boundaries, so each one opens its own
 * record. renderBlock and renderInlineRecord must return one element that
 * forwards extra props to its root, where the boundary attribute is cloned.
 */
export default function DatoStructuredText<
  BlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  LinkRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
  InlineBlockRecord extends CdaStructuredTextRecord = CdaStructuredTextRecord,
>(props: StructuredTextPropTypes<BlockRecord, LinkRecord, InlineBlockRecord>) {
  const { renderBlock, renderInlineRecord, ...rest } = props;

  return (
    <div data-datocms-content-link-group>
      <StructuredText
        {...rest}
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
      />
    </div>
  );
}
